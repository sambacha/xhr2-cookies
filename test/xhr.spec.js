"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava = require("ava");
const xml_http_request_1 = require("../xml-http-request");
const server_1 = require("./helpers/server");
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: true,
    ca: server_1.HttpsServer.sslCertificate()
});
xml_http_request_1.XMLHttpRequest.nodejsSet({
    httpsAgent: agent
});
function contextualize(getContext) {
    ava.test.beforeEach(t => {
        Object.assign(t.context, getContext());
    });
    return ava.test;
}
const test = contextualize(() => ({
    xhr: new xml_http_request_1.XMLHttpRequest()
}));
test.before((t) => __awaiter(void 0, void 0, void 0, function* () {
    yield server_1.HttpServer.serverStarted;
    yield server_1.HttpsServer.serverStarted;
    xml_http_request_1.XMLHttpRequest.nodejsSet({
        baseUrl: server_1.HttpServer.testUrl().replace('https://', 'http://')
    });
}));
test.beforeEach(t => {
    t.context.xhr = new xml_http_request_1.XMLHttpRequest();
});
test('constructor', t => {
    const xhr = t.context.xhr;
    t.is(xhr.readyState, xml_http_request_1.XMLHttpRequest.UNSENT, 'sets readyState to UNSENT');
    t.is(xhr.timeout, 0, 'sets timeout to 0');
    t.is(xhr.responseType, '', 'sets responseType to ""');
    t.is(xhr.status, 0, 'sets status to 0');
    t.is(xhr.statusText, '', 'sets statusText to ""');
});
test('#open throws SecurityError on CONNECT', t => {
    t.throws(() => t.context.xhr.open('CONNECT', `http://localhost:${server_1.HttpServer.port}/test`), xml_http_request_1.XMLHttpRequest.SecurityError);
});
test('#open with a GET for a local https request', t => {
    const xhr = t.context.xhr;
    xhr.open('GET', `https://localhost:${server_1.HttpsServer.port}/test/fixtures/hello.txt`);
    t.is(xhr.readyState, xml_http_request_1.XMLHttpRequest.OPENED, 'sets readyState to OPENED');
    t.is(xhr.status, 0, 'keeps status 0');
    t.is(xhr.statusText, '', 'keeps statusText ""');
});
test('#send on a local http GET kicks off the request', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    xhr.open('GET', `http://localhost:${server_1.HttpServer.port}/test/fixtures/hello.txt`);
    t.plan(2);
    yield new Promise((resolve, reject) => {
        xhr.onload = (event) => {
            t.is(xhr.status, 200, 'the status is 200');
            t.is(xhr.responseText, 'Hello, world!', 'the text is correct');
            resolve();
        };
        xhr.onerror = (event) => {
            reject(event);
        };
        xhr.send();
    });
}));
test('#send on a local https GET kicks off the request', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    xhr.open('GET', `https://localhost:${server_1.HttpsServer.port}/test/fixtures/hello.txt`);
    t.plan(2);
    yield new Promise((resolve, reject) => {
        xhr.onload = (event) => {
            t.is(xhr.status, 200, 'the status is 200');
            t.is(xhr.responseText, 'Hello, world!', 'the text is correct');
            resolve();
        };
        xhr.onerror = (event) => {
            reject(event);
        };
        xhr.send();
    });
}));
test('on a local relative GET it kicks off the request', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    xhr.open('GET', '../fixtures/hello.txt');
    t.plan(2);
    yield new Promise((resolve, reject) => {
        xhr.onload = (event) => {
            t.is(xhr.status, 200, 'the status is 200');
            t.is(xhr.responseText, 'Hello, world!', 'the text is correct');
            resolve();
        };
        xhr.onerror = (event) => {
            reject(event);
        };
        xhr.send();
    });
}));
test('on a local gopher GET #open + #send throws a NetworkError', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    t.throws(() => {
        xhr.open('GET', `gopher:localhost:${server_1.HttpServer.port}`);
        xhr.send();
    }, xml_http_request_1.XMLHttpRequest.NetworkError);
}));
test('readyState constants', t => {
    t.is(xml_http_request_1.XMLHttpRequest.UNSENT < xml_http_request_1.XMLHttpRequest.OPENED, true, 'UNSENT < OPENED');
    t.is(xml_http_request_1.XMLHttpRequest.OPENED < xml_http_request_1.XMLHttpRequest.HEADERS_RECEIVED, true, 'OPENED < HEADERS_RECEIVED');
    t.is(xml_http_request_1.XMLHttpRequest.HEADERS_RECEIVED < xml_http_request_1.XMLHttpRequest.LOADING, true, 'HEADERS_RECEIVED < LOADING');
    t.is(xml_http_request_1.XMLHttpRequest.LOADING < xml_http_request_1.XMLHttpRequest.DONE, true, 'LOADING < DONE');
});
test('XMLHttpRequest constants match the instance constants', t => {
    const xhr = t.context.xhr;
    t.is(xml_http_request_1.XMLHttpRequest.UNSENT, xhr.UNSENT, 'UNSENT');
    t.is(xml_http_request_1.XMLHttpRequest.OPENED, xhr.OPENED, 'OPENED');
    t.is(xml_http_request_1.XMLHttpRequest.HEADERS_RECEIVED, xhr.HEADERS_RECEIVED, 'HEADERS_RECEIVED');
    t.is(xml_http_request_1.XMLHttpRequest.LOADING, xhr.LOADING, 'LOADING');
    t.is(xml_http_request_1.XMLHttpRequest.DONE, xhr.DONE, 'DONE');
});
//# sourceMappingURL=xhr.spec.js.map