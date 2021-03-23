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
test('XMLHttpRequest #responseURL provides the URL of the response', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.open('GET', `http://localhost:${server_1.HttpServer.port}/_/method`);
        xhr.onload = () => {
            t.is(xhr.responseUrl, `http://localhost:${server_1.HttpServer.port}/_/method`);
            resolve();
        };
        xhr.send();
    });
}));
test('XMLHttpRequest #responseURL ignores the hash fragment', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.open('GET', `http://localhost:${server_1.HttpServer.port}/_/method#foo`);
        xhr.onload = () => {
            t.is(xhr.responseUrl, `http://localhost:${server_1.HttpServer.port}/_/method`);
            resolve();
        };
        xhr.send();
    });
}));
//# sourceMappingURL=response-url.spec.js.map