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
const png_1 = require("./helpers/png");
function contextualize(getContext) {
    ava.test.beforeEach(t => {
        Object.assign(t.context, getContext());
    });
    return ava.test;
}
const test = contextualize(() => ({
    xhr: new xml_http_request_1.XMLHttpRequest(),
    jsonUrl: '',
    jsonString: '',
    imageUrl: ''
}));
test.before(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server_1.HttpServer.serverStarted;
}));
test.beforeEach(t => {
    t.context.xhr = new xml_http_request_1.XMLHttpRequest();
    t.context.jsonUrl = `http://localhost:${server_1.HttpServer.port}/test/fixtures/hello.json`;
    t.context.jsonString = '{"hello": "world", "answer": 42}\n';
    t.context.imageUrl = `http://localhost:${server_1.HttpServer.port}/test/fixtures/hello.png`;
});
test('XMLHttpRequest #responseType text reads a JSON file into a String', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.addEventListener('load', () => {
            t.is(xhr.response, t.context.jsonString);
            t.is(xhr.responseText, t.context.jsonString);
            resolve();
        });
        xhr.open('GET', t.context.jsonUrl);
        xhr.responseType = 'text';
        xhr.send();
    });
}));
test('XMLHttpRequest #responseType json reads a JSON file into a parsed JSON object', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState !== xml_http_request_1.XMLHttpRequest.DONE) {
                return;
            }
            t.deepEqual(xhr.response, { hello: 'world', answer: 42 });
            resolve();
        });
        xhr.open('GET', t.context.jsonUrl);
        xhr.responseType = 'json';
        xhr.send();
    });
}));
test('XMLHttpRequest #responseType json produces null when reading a non-JSON file', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.addEventListener('loadend', () => {
            t.is(xhr.response, null);
            resolve();
        });
        xhr.open('GET', `http://localhost:${server_1.HttpServer.port}/test/fixtures/hello.txt`);
        xhr.responseType = 'json';
        xhr.send();
    });
}));
test('XMLHttpRequest #responseType arraybuffer reads a JSON file into an ArrayBuffer', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.addEventListener('loadend', () => {
            t.true(xhr.response instanceof ArrayBuffer);
            if (!(xhr.response instanceof ArrayBuffer)) {
                return;
            }
            const view = new Uint8Array(xhr.response);
            const response = Array.from(view).map(viewElement => String.fromCharCode(viewElement)).join('');
            t.is(response, t.context.jsonString);
            resolve();
        });
        xhr.open('GET', t.context.jsonUrl);
        xhr.responseType = 'arraybuffer';
        xhr.send();
    });
}));
test('XMLHttpRequest #responseType arraybuffer reads a binary file into an ArrayBuffer', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.addEventListener('loadend', () => {
            t.true(xhr.response instanceof ArrayBuffer);
            if (!(xhr.response instanceof ArrayBuffer)) {
                return;
            }
            t.deepEqual(xhr.response, png_1.PNGArrayBuffer);
            resolve();
        });
        xhr.open('GET', t.context.imageUrl);
        xhr.responseType = 'arraybuffer';
        xhr.send();
    });
}));
test('XMLHttpRequest #responseType buffer reads a JSON file into a node.js Buffer', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.addEventListener('loadend', () => {
            t.true(xhr.response instanceof Buffer);
            if (!(xhr.response instanceof Buffer)) {
                return;
            }
            const response = Array.from(xhr.response).map(viewElement => String.fromCharCode(viewElement)).join('');
            t.is(response, t.context.jsonString);
            resolve();
        });
        xhr.open('GET', t.context.jsonUrl);
        xhr.responseType = 'buffer';
        xhr.send();
    });
}));
test('XMLHttpRequest #responseType buffer reads a binary file into a node.js Buffer', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        xhr.addEventListener('loadend', () => {
            t.true(xhr.response instanceof Buffer);
            if (!(xhr.response instanceof Buffer)) {
                return;
            }
            t.deepEqual(xhr.response, png_1.PNGBuffer);
            resolve();
        });
        xhr.open('GET', t.context.imageUrl);
        xhr.responseType = 'buffer';
        xhr.send();
    });
}));
//# sourceMappingURL=response-type.spec.js.map