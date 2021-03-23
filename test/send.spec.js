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
    xhr: new xml_http_request_1.XMLHttpRequest()
}));
test.before(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server_1.HttpServer.serverStarted;
}));
test.beforeEach(t => {
    t.context.xhr = new xml_http_request_1.XMLHttpRequest();
    t.context.xhr.open('POST', `http://localhost:${server_1.HttpServer.port}/_/echo`);
});
test('XMLHttpRequest #send works with ASCII DOMStrings', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    t.plan(2);
    yield new Promise(resolve => {
        xhr.onload = () => {
            t.regex(xhr.getResponseHeader('content-type'), /^text\/plain(;\s?charset=UTF-8)?$/);
            t.is(xhr.responseText, 'Hello world!');
            resolve();
        };
        xhr.onerror = () => { t.fail(); return resolve(); };
        xhr.send('Hello world!');
    });
}));
test('XMLHttpRequest #send works with UTF-8 DOMStrings', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    t.plan(2);
    yield new Promise(resolve => {
        xhr.onload = () => {
            t.regex(xhr.getResponseHeader('content-type'), /^text\/plain(;\s?charset=UTF-8)?$/);
            t.is(xhr.responseText, '世界你好!');
            resolve();
        };
        xhr.send('世界你好!');
    });
}));
test('XMLHttpRequest #send works with ArrayBufferViews', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    t.plan(2);
    yield new Promise(resolve => {
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
            t.is(xhr.getResponseHeader('content-type'), null);
            if (!(xhr.response instanceof ArrayBuffer)) {
                t.fail();
                return resolve();
            }
            t.deepEqual(new Uint8Array(xhr.response), png_1.PNGUint8Array);
            resolve();
        };
        xhr.onerror = () => { t.fail(); return resolve(); };
        xhr.send(png_1.PNGUint8Array);
    });
}));
test('XMLHttpRequest #send works with ArrayBufferViews with set index and length', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    t.plan(2);
    const arrayBufferView10 = new Uint8Array(png_1.PNGArrayBuffer, 10, 42);
    yield new Promise(resolve => {
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
            t.is(xhr.getResponseHeader('content-type'), null);
            if (!(xhr.response instanceof ArrayBuffer)) {
                t.fail();
                return resolve();
            }
            t.deepEqual(new Uint8Array(xhr.response), arrayBufferView10);
            resolve();
        };
        xhr.onerror = () => { t.fail(); return resolve(); };
        xhr.send(arrayBufferView10);
    });
}));
test('XMLHttpRequest #send works with ArrayBuffers', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    t.plan(2);
    yield new Promise(resolve => {
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
            t.is(xhr.getResponseHeader('content-type'), null);
            if (!(xhr.response instanceof ArrayBuffer)) {
                t.fail();
                return resolve();
            }
            t.deepEqual(xhr.response, png_1.PNGArrayBuffer);
            resolve();
        };
        xhr.onerror = () => { t.fail(); return resolve(); };
        xhr.send(png_1.PNGArrayBuffer);
    });
}));
test('XMLHttpRequest #send works with node.js Buffers', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    const buffer = new Buffer(png_1.PNGUint8Array.length);
    for (let i = 0; i < png_1.PNGUint8Array.length; i++) {
        buffer.writeUInt8(png_1.PNGUint8Array[i], i);
    }
    t.plan(2);
    yield new Promise(resolve => {
        xhr.responseType = 'buffer';
        xhr.onload = () => {
            t.is(xhr.getResponseHeader('content-type'), null);
            if (!(xhr.response instanceof Buffer)) {
                t.fail();
                return resolve();
            }
            t.deepEqual(new Uint8Array(xhr.response), png_1.PNGUint8Array);
            resolve();
        };
        xhr.onerror = () => { t.fail(); return resolve(); };
        xhr.send(png_1.PNGArrayBuffer);
    });
}));
test('XMLHttpRequest #send sets POST headers correctly when given null data', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    xhr.open('POST', `http://localhost:${server_1.HttpServer.port}/_/headers`);
    yield new Promise(resolve => {
        xhr.responseType = 'text';
        xhr.onload = () => {
            t.regex(xhr.responseText, /^\{.*\}$/);
            const headers = JSON.parse(xhr.responseText);
            t.true(headers.hasOwnProperty('content-length'));
            t.is(headers['content-length'], '0');
            t.false(headers.hasOwnProperty('content-type'));
            resolve();
        };
        xhr.onerror = () => { t.fail(); return resolve(); };
        xhr.send();
    });
}));
//# sourceMappingURL=send.spec.js.map