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
function contextualize(getContext) {
    ava.test.beforeEach(t => {
        Object.assign(t.context, getContext());
    });
    return ava.test;
}
const test = contextualize(() => ({
    xhr: new xml_http_request_1.XMLHttpRequest(),
    okUrl: '',
    errorUrl: '',
    errorJson: ''
}));
test.before(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server_1.HttpServer.serverStarted;
}));
test.beforeEach(t => {
    t.context.xhr = new xml_http_request_1.XMLHttpRequest();
    t.context.okUrl = `http://localhost:${server_1.HttpServer.port}/test/fixtures/hello.txt`;
    t.context.errorUrl = `http://localhost:${server_1.HttpServer.port}/_/response`;
    t.context.errorJson = JSON.stringify({
        code: 401,
        status: 'Unauthorized',
        body: JSON.stringify({ error: 'Credential error' }),
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': '28'
        }
    });
});
test('XMLHttpRequest #status is 200 for a normal request', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.open('GET', t.context.okUrl);
        let done = false;
        xhr.addEventListener('readystatechange', () => {
            if (done) {
                return;
            }
            if (xhr.readyState < xml_http_request_1.XMLHttpRequest.HEADERS_RECEIVED) {
                t.is(xhr.status, 0);
                t.is(xhr.statusText, '');
            }
            else {
                t.is(xhr.status, 200);
                t.truthy(xhr.statusText);
                t.not(xhr.statusText, '');
                if (xhr.readyState === xml_http_request_1.XMLHttpRequest.DONE) {
                    done = true;
                    resolve();
                }
            }
        });
        xhr.send();
    });
}));
test('XMLHttpRequest #status returns the server-reported status', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.open('POST', t.context.errorUrl);
        let done = false;
        xhr.addEventListener('readystatechange', () => {
            if (done) {
                return;
            }
            if (xhr.readyState < xml_http_request_1.XMLHttpRequest.HEADERS_RECEIVED) {
                t.is(xhr.status, 0);
                t.is(xhr.statusText, '');
            }
            else {
                t.is(xhr.status, 401);
                t.truthy(xhr.statusText);
                t.not(xhr.statusText, '');
                if (xhr.readyState === xml_http_request_1.XMLHttpRequest.DONE) {
                    done = true;
                    resolve();
                }
            }
        });
        xhr.send(t.context.errorJson);
    });
}));
//# sourceMappingURL=status.spec.js.map