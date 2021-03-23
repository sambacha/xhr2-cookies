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
    xhr: new xml_http_request_1.XMLHttpRequest()
}));
test.before(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server_1.HttpServer.serverStarted;
}));
test.beforeEach(t => {
    t.context.xhr = new xml_http_request_1.XMLHttpRequest();
});
test('XMLHttpRequest when redirected issues a GET for the next location', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.open('POST', `http://localhost:${server_1.HttpServer.port}/_/redirect/302/method`);
        xhr.onload = () => {
            t.regex(xhr.responseText, /GET/i);
            resolve();
        };
        xhr.onerror = () => {
            t.fail();
            resolve();
        };
        xhr.send('This should be dropped during the redirect');
    });
}));
test('XMLHttpRequest when redirected does not return the redirect headers', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.open('GET', `http://localhost:${server_1.HttpServer.port}/_/redirect/302/method`);
        xhr.onload = () => {
            t.is(xhr.getResponseHeader('Content-Type'), 'text/plain; charset=utf-8');
            t.falsy(xhr.getResponseHeader('X-Redirect-Header'));
            resolve();
        };
        xhr.onerror = () => {
            t.fail();
            resolve();
        };
        xhr.send();
    });
}));
test('XMLHttpRequest when redirected persists custom request headers across redirects', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.open('GET', `http://localhost:${server_1.HttpServer.port}/_/redirect/302/headers`);
        xhr.setRequestHeader('X-Redirect-Test', 'should be preserved');
        xhr.onload = () => {
            t.regex(xhr.responseText, /^\{.*\}$/);
            const headers = JSON.parse(xhr.responseText);
            t.is(headers.connection, 'keep-alive');
            t.true(headers.hasOwnProperty('host'));
            t.is(headers.host, `localhost:${server_1.HttpServer.port}`);
            t.true(headers.hasOwnProperty('x-redirect-test'));
            t.is(headers['x-redirect-test'], 'should be preserved');
            resolve();
        };
        xhr.onerror = () => {
            t.fail();
            resolve();
        };
        xhr.send();
    });
}));
test('XMLHttpRequest when redirected drops content-related headers across redirects', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.open('GET', `http://localhost:${server_1.HttpServer.port}/_/redirect/302/headers`);
        xhr.setRequestHeader('X-Redirect-Test', 'should be preserved');
        xhr.onload = () => {
            t.regex(xhr.responseText, /^\{.*\}$/);
            const headers = JSON.parse(xhr.responseText);
            t.is(headers.connection, 'keep-alive');
            t.true(headers.hasOwnProperty('host'));
            t.is(headers.host, `localhost:${server_1.HttpServer.port}`);
            t.true(headers.hasOwnProperty('x-redirect-test'));
            t.is(headers['x-redirect-test'], 'should be preserved');
            t.false(headers.hasOwnProperty('content-type'));
            t.false(headers.hasOwnProperty('content-length'));
            resolve();
        };
        xhr.onerror = () => {
            t.fail();
            resolve();
        };
        xhr.send();
    });
}));
test('XMLHttpRequest when redirected provides the final responseURL', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.open('GET', `http://localhost:${server_1.HttpServer.port}/_/redirect/302/method`);
        xhr.setRequestHeader('X-Redirect-Test', 'should be preserved');
        xhr.onload = () => {
            t.is(xhr.responseUrl, `http://localhost:${server_1.HttpServer.port}/_/method`);
            resolve();
        };
        xhr.onerror = () => {
            t.fail();
            resolve();
        };
        xhr.send();
    });
}));
//# sourceMappingURL=redirect.spec.js.map