"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const https = require("https");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const certificate_1 = require("./certificates/certificate");
const path = require("path");
class XhrServer {
    constructor(port = 8080, useHttps = false) {
        this.port = port;
        this.useHttps = useHttps;
        this.serverStarted = new Promise(resolve => this.setServerStarted = resolve);
        this.createApp();
    }
    testUrl() {
        return `https://localhost:${this.port}/test/html/browser_test.html`;
    }
    sslCertificate() {
        return this.useHttps ? certificate_1.certificate : null;
    }
    sslKey() {
        return this.useHttps ? certificate_1.key : null;
    }
    createApp() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use((request, response, next) => {
            response.header('Access-Control-Allow-Origin', '*');
            response.header('Access-Control-Allow-Methods', 'DELETE,GET,POST,PUT');
            response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
            next();
        });
        this.app.get('/test/fixtures/hello.txt', (request, response) => {
            const body = 'Hello, world!';
            response.header('Content-Type', 'text/plain; charset=utf-8');
            response.header('Content-Length', body.length.toString());
            response.end(body);
        });
        this.app.get('/test/fixtures/hello.json', (request, response) => {
            const body = '{"hello": "world", "answer": 42}\n';
            response.header('Content-Type', 'application/json');
            response.header('Content-Length', body.length.toString());
            response.end(body);
        });
        this.app.get('/test/html/browser_test.html', (request, response) => {
            const body = '<p>Test</p>';
            response.header('Content-Type', 'text/html');
            response.header('Content-Length', body.length.toString());
            response.end(body);
        });
        this.app.all('/_/method', (request, response) => {
            const body = request.method;
            response.header('Content-Type', 'text/plain; charset=utf-8');
            response.header('Content-Length', body.length.toString());
            response.end(body);
        });
        // Echoes the request body. Used to test send(data).
        this.app.post('/_/echo', (request, response) => {
            if (request.headers['content-type']) {
                response.header('Content-Type', request.headers['content-type']);
            }
            if (request.headers['content-length']) {
                response.header('Content-Length', request.headers['content-length']);
            }
            request.on('data', chunk => response.write(chunk));
            request.on('end', () => response.end());
        });
        // Lists the request headers. Used to test setRequestHeader().
        this.app.all('/_/headers', (request, response) => {
            const body = JSON.stringify(request.headers);
            response.header('Content-Type', 'application/json');
            response.header('Content-Length', body.length.toString());
            response.end(body);
        });
        // Sets the response headers in the request. Used to test getResponse*().
        this.app.post('/_/get-headers', (request, response) => {
            let jsonString = '';
            request.on('data', chunk => jsonString += chunk);
            request.on('end', () => {
                const headers = JSON.parse(jsonString);
                for (let name in headers) {
                    if (headers.hasOwnProperty(name)) {
                        response.header(name, headers[name]);
                    }
                }
                response.header('Content-Length', '0');
                response.end('');
            });
        });
        // Sets every response detail. Used for error testing.
        this.app.post('/_/response', (request, response) => {
            let jsonString = '';
            request.on('data', chunk => jsonString += chunk);
            request.on('end', () => {
                const json = JSON.parse(jsonString);
                response.writeHead(json.code, json.status, json.headers);
                if (json.body) {
                    response.write(json.body);
                }
                response.end();
            });
        });
        // Sends data in small chunks. Used for event testing.
        this.app.post('/_/drip', (request, response) => {
            request.connection.setNoDelay();
            let jsonString = '';
            request.on('data', chunk => jsonString += chunk);
            request.on('end', () => {
                const json = JSON.parse(jsonString);
                let sentDrips = 0;
                const drip = new Array(json.size + 1).join('.');
                response.header('Content-Type', 'text/plain');
                if (json.length) {
                    response.header('Content-Length', (json.drips * json.size).toString());
                }
                (function sendDrip() {
                    response.write(drip);
                    sentDrips++;
                    if (sentDrips >= json.drips) {
                        return response.end();
                    }
                    setTimeout(sendDrip, json.ms);
                })();
            });
        });
        // Returns a HTTP redirect. Used to test the redirection handling code.
        this.app.all('/_/redirect/:status/:next', (request, response) => {
            response.statusCode = +request.params.status;
            response.header('Location', `${request.protocol}://${request.get('host')}/_/${request.params.next}`);
            const body = '<p>This is supposed to have a redirect link</p>';
            response.header('Content-Type', 'text/html');
            response.header('Content-Length', body.length.toString());
            response.header('X-Redirect-Header', 'should not show up');
            response.end(body);
        });
        // Sets a cookie
        this.app.all('/_/set-cookie/:name/:value', (request, response) => {
            response.cookie(request.params.name, request.params.value);
            response.header('Content-Type', 'text/plain');
            response.header('Content-Length', '0');
            response.end();
        });
        // Redirects and sets a cookie.
        this.app.all('/_/redirect-cookie/:name/:value', (request, response) => {
            response.cookie(request.params.name, request.params.value);
            response.redirect(301, `${request.protocol}://${request.get('host')}/_/print-cookie/${request.params.name}`);
        });
        // Read cookie + print its value.
        this.app.get('/_/print-cookie/:name', (request, response) => {
            const cookieValue = request.cookies[request.params.name];
            response.header('Content-Type', 'text/plain');
            response.header('Content-Length', cookieValue.length.toString());
            response.end(cookieValue);
        });
        // Requested when the browser test suite completes.
        this.app.get('/_/end', (request, response) => {
            const failed = request.query.hasOwnProperty('failed') ? +request.query.failed : 1;
            const total = request.query.hasOwnProperty('total') ? +request.query.total : 0;
            const passed = total - failed;
            const exitCode = failed ? 1 : 0;
            console.log(`${passed} passed, ${failed} failed`);
            response.header('Content-Type', 'image/png');
            response.header('Content-Length', '0');
            response.end('');
            if (!process.env.hasOwnProperty('NO_EXIT')) {
                this.server.close();
                process.exit(exitCode);
            }
        });
        this.app.use(express.static(path.join(__dirname, '../../')));
        this.createServer();
    }
    createServer() {
        this.server = this.useHttps
            ? https.createServer({
                cert: this.sslCertificate(),
                key: this.sslKey()
            }, this.app)
            : http.createServer(this.app);
        this.server.on('error', (error) => {
            if (error.code !== 'EADDRINUSE') {
                return;
            }
            this.port += 2;
            this.createServer();
        });
        this.server.on('listening', () => {
            this.setServerStarted();
        });
        this.server.listen(this.port);
    }
}
exports.XhrServer = XhrServer;
const HttpServer = new XhrServer(8900, false);
exports.HttpServer = HttpServer;
const HttpsServer = new XhrServer(8901, true);
exports.HttpsServer = HttpsServer;
//# sourceMappingURL=server.js.map