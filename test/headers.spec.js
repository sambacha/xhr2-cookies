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
    xml_http_request_1.XMLHttpRequest.nodejsSet({
        baseUrl: server_1.HttpServer.testUrl().replace('https://', 'http://')
    });
}));
test.beforeEach(t => {
    t.context.xhr = new xml_http_request_1.XMLHttpRequest();
});
test('#setRequestHeader with allowed headers should send the headers', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    xhr.open('POST', `http://localhost:${server_1.HttpServer.port}/_/headers`);
    xhr.responseType = 'text';
    xhr.setRequestHeader('Authorization', 'lol');
    xhr.setRequestHeader('X-Answer', '42');
    xhr.setRequestHeader('X-Header-Name', 'value');
    yield new Promise(resolve => {
        xhr.onload = () => {
            t.regex(xhr.responseText, /^\{.*\}$/, 'response text looks like JSON');
            const headers = JSON.parse(xhr.responseText);
            t.true(headers.hasOwnProperty('authorization'), 'headers have authorization header');
            t.is(headers.authorization, 'lol', 'authorization header is correct');
            t.true(headers.hasOwnProperty('x-answer'), 'headers have x-answer header');
            t.is(headers['x-answer'], '42', 'x-answer header is correct');
            t.true(headers.hasOwnProperty('x-header-name'), 'headers have x-header-name header');
            t.is(headers['x-header-name'], 'value', 'x-header-name header is correct');
            resolve();
        };
        xhr.send('');
    });
}));
test('#setRequestHeader with a mix of allowed and forbidden headers should only send the allowed headers', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    xhr.open('POST', `http://localhost:${server_1.HttpServer.port}/_/headers`);
    xhr.responseType = 'text';
    xhr.setRequestHeader('Authorization', 'lol');
    xhr.setRequestHeader('Proxy-Authorization', 'evil:kitten');
    xhr.setRequestHeader('Sec-Breach', 'yes please');
    xhr.setRequestHeader('Host', 'www.google.com');
    xhr.setRequestHeader('Origin', 'https://www.google.com');
    xhr.setRequestHeader('X-Answer', '42');
    yield new Promise(resolve => {
        xhr.onload = () => {
            t.regex(xhr.responseText, /^\{.*\}$/, 'response text looks like JSON');
            const headers = JSON.parse(xhr.responseText);
            t.true(headers.hasOwnProperty('authorization'), 'headers have authorization header');
            t.is(headers['authorization'], 'lol', 'authorization header is correct');
            t.false(headers.hasOwnProperty('proxy-authorization'), 'headers do not have proxy-authorization header');
            t.false(headers.hasOwnProperty('sec-breach'), 'headers do not have sec-breach header');
            t.notRegex(headers['origin'] || '', /www\.google\.com/, 'header "origin" should not contain www.google.com');
            t.notRegex(headers['host'] || '', /www\.google\.com/, 'header "host" should not contain www.google.com');
            t.true(headers.hasOwnProperty('x-answer'), 'headers have x-answer header');
            t.is(headers['x-answer'], '42', 'x-answer header is correct');
            resolve();
        };
        xhr.send('');
    });
}));
test('#setRequestHeader with a mix of allowed and forbidden headers should only send the all headers when set ENABLE_UNSAFE_HEADER to false', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    xhr.open('POST', `http://localhost:${server_1.HttpServer.port}/_/headers`);
    xhr.responseType = 'text';
    xml_http_request_1.XMLHttpRequest.ENABLE_UNSAFE_HEADER = false;
    xhr.setRequestHeader('Authorization', 'lol');
    xhr.setRequestHeader('Proxy-Authorization', 'evil:kitten');
    xhr.setRequestHeader('Sec-Breach', 'yes please');
    xhr.setRequestHeader('Host', 'www.google.com');
    xhr.setRequestHeader('Origin', 'https://www.google.com');
    xhr.setRequestHeader('X-Answer', '42');
    xml_http_request_1.XMLHttpRequest.ENABLE_UNSAFE_HEADER = true;
    yield new Promise(resolve => {
        xhr.onload = () => {
            t.regex(xhr.responseText, /^\{.*\}$/, 'response text looks like JSON');
            const headers = JSON.parse(xhr.responseText);
            t.true(headers.hasOwnProperty('authorization'), 'headers have authorization header');
            t.is(headers['authorization'], 'lol', 'authorization header is correct');
            t.true(headers.hasOwnProperty('proxy-authorization'), 'headers do not have proxy-authorization header');
            t.true(headers.hasOwnProperty('sec-breach'), 'headers do not have sec-breach header');
            t.regex(headers['origin'] || '', /www\.google\.com/, 'header "origin" should contain www.google.com');
            t.regex(headers['host'] || '', /www\.google\.com/, 'header "host" should contain www.google.com');
            t.true(headers.hasOwnProperty('x-answer'), 'headers have x-answer header');
            t.is(headers['x-answer'], '42', 'x-answer header is correct');
            resolve();
        };
        xhr.send('');
    });
}));
test('#setRequestHeader with repeated headers should send all headers', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    xhr.open('POST', `http://localhost:${server_1.HttpServer.port}/_/headers`);
    xhr.responseType = 'text';
    xhr.setRequestHeader('Authorization', 'troll');
    xhr.setRequestHeader('Authorization', 'lol');
    xhr.setRequestHeader('Authorization', 'lol');
    xhr.setRequestHeader('X-Answer', '42');
    yield new Promise(resolve => {
        xhr.onload = () => {
            t.regex(xhr.responseText, /^\{.*\}$/, 'response text looks like JSON');
            const headers = JSON.parse(xhr.responseText);
            t.true(headers.hasOwnProperty('authorization'), 'headers have authorization header');
            t.is(headers['authorization'], 'troll, lol, lol', 'authorization header is correct');
            t.true(headers.hasOwnProperty('x-answer'), 'headers have x-answer header');
            t.is(headers['x-answer'], '42', 'x-answer header is correct');
            resolve();
        };
        xhr.send('');
    });
}));
test('#setRequestHeader with no headers should set the protected headers correctly', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    xhr.open('POST', `http://localhost:${server_1.HttpServer.port}/_/headers`);
    xhr.responseType = 'text';
    xhr.setRequestHeader('Authorization', 'troll');
    xhr.setRequestHeader('Authorization', 'lol');
    xhr.setRequestHeader('Authorization', 'lol');
    xhr.setRequestHeader('X-Answer', '42');
    yield new Promise(resolve => {
        xhr.onload = () => {
            t.regex(xhr.responseText, /^\{.*\}$/, 'response text looks like JSON');
            const headers = JSON.parse(xhr.responseText);
            t.true(headers.hasOwnProperty('connection'), 'headers have connection header');
            t.is(headers['connection'], 'keep-alive', 'connection header is correct');
            t.true(headers.hasOwnProperty('host'), 'headers have host header');
            t.is(headers['host'], `localhost:${server_1.HttpServer.port}`, 'host header is correct');
            t.true(headers.hasOwnProperty('user-agent'), 'headers have user-agent header');
            t.regex(headers['user-agent'], /^Mozilla\//, 'user-agent header is correct');
            resolve();
        };
        xhr.send('');
    });
}));
test('#getResponseHeader returns accessible headers, returns null for private headers, has headers on HEADERS_RECEIVED readyState', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    xhr.open('POST', `http://localhost:${server_1.HttpServer.port}/_/get-headers`);
    const headerJson = `{
		"Accept-Ranges": "bytes",
		"Content-Type": "application/xhr2; charset=utf-1337",
		"Set-Cookie": "UserID=JohnDoe; Max-Age=3600; Version=1",
		"X-Header": "one, more, value"
	}`;
    yield new Promise(resolve => {
        xhr.onloadend = () => {
            t.is(xhr.getResponseHeader('AccEPt-RANgeS'), 'bytes', 'AccEPt-RANgeS works correctly');
            t.is(xhr.getResponseHeader('content-Type'), 'application/xhr2; charset=utf-1337', 'content-Type works correctly');
            t.is(xhr.getResponseHeader('X-Header'), 'one, more, value', 'X-Header works correctly');
            t.is(xhr.getResponseHeader('set-cookie'), null, 'set-cookie works correctly');
            resolve();
        };
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== xml_http_request_1.XMLHttpRequest.HEADERS_RECEIVED) {
                return;
            }
            t.is(xhr.getResponseHeader('AccEPt-RANgeS'), 'bytes', 'AccEPt-RANgeS works correctly when HEADERS_RECEIVED ready state');
        };
        xhr.send(headerJson);
    });
}));
test('#getAllResponseHeaders contains accessible headers, does not contain private headers, has headers on HEADERS_RECEIVED readyState', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    xhr.open('POST', `http://localhost:${server_1.HttpServer.port}/_/get-headers`);
    const headerJson = `{
		"Accept-Ranges": "bytes",
		"Content-Type": "application/xhr2; charset=utf-1337",
		"Set-Cookie": "UserID=JohnDoe; Max-Age=3600; Version=1",
		"X-Header": "one, more, value"
	}`;
    yield new Promise(resolve => {
        xhr.onloadend = () => {
            const headers = xhr.getAllResponseHeaders();
            t.regex(headers, /(\A|\r\n)accept-ranges: bytes(\r\n|\Z)/mi);
            t.regex(headers, /(\A|\r\n)content-type: application\/xhr2; charset=utf-1337(\r\n|\Z)/mi);
            t.regex(headers, /(\A|\r\n)X-Header: one, more, value(\r\n|\Z)/mi);
            t.notRegex(headers, /(\A|\r\n)set-cookie:/mi);
            resolve();
        };
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== xml_http_request_1.XMLHttpRequest.HEADERS_RECEIVED) {
                return;
            }
            const headers = xhr.getAllResponseHeaders();
            t.regex(headers, /(\A|\r\n)accept-ranges: bytes(\r\n|\Z)/mi);
        };
        xhr.send(headerJson);
    });
}));
// TODO:
//   * set request header after request opened should throw InvalidStateError
//   *
//# sourceMappingURL=headers.spec.js.map