"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava = require("ava");
const xml_http_request_1 = require("../xml-http-request");
function contextualize(getContext) {
    ava.test.beforeEach(t => {
        Object.assign(t.context, getContext());
    });
    return ava.test;
}
const test = contextualize(() => ({
    xhr: new xml_http_request_1.XMLHttpRequest(),
    customXhr: new xml_http_request_1.XMLHttpRequest()
}));
test.beforeEach(t => {
    t.context.xhr = new xml_http_request_1.XMLHttpRequest();
    t.context.customXhr = new xml_http_request_1.XMLHttpRequest();
});
test('XMLHttpRequest.nodejsSet with a httpAgent option', t => {
    const customAgent = { custom: 'httpAgent' };
    const defaultAgent = xml_http_request_1.XMLHttpRequest.prototype.nodejsHttpAgent;
    const agent = { mocking: 'httpAgent' };
    t.context.customXhr.nodejsHttpAgent = customAgent;
    xml_http_request_1.XMLHttpRequest.nodejsSet({ httpAgent: agent });
    t.is(t.context.xhr.nodejsHttpAgent, agent, 'sets the default nodejsHttpAgent');
    t.is(t.context.customXhr.nodejsHttpAgent, customAgent, 'does not interfere with custom nodejsHttpAgent settings');
    xml_http_request_1.XMLHttpRequest.nodejsSet({ httpAgent: defaultAgent });
});
test('XMLHttpRequest.nodejsSet with a httpsAgent option', t => {
    const customAgent = { custom: 'httpsAgent' };
    const defaultAgent = xml_http_request_1.XMLHttpRequest.prototype.nodejsHttpsAgent;
    const agent = { mocking: 'httpsAgent' };
    t.context.customXhr.nodejsHttpsAgent = customAgent;
    xml_http_request_1.XMLHttpRequest.nodejsSet({ httpsAgent: agent });
    t.is(t.context.xhr.nodejsHttpsAgent, agent, 'sets the default nodejsHttpsAgent');
    t.is(t.context.customXhr.nodejsHttpsAgent, customAgent, 'does not interfere with custom nodejsHttpsAgent settings');
    xml_http_request_1.XMLHttpRequest.nodejsSet({ httpsAgent: defaultAgent });
});
test('XMLHttpRequest.nodejsSet with a baseUrl option', t => {
    const customBaseUrl = 'http://custom.url/base';
    const defaultBaseUrl = xml_http_request_1.XMLHttpRequest.prototype.nodejsBaseUrl;
    const baseUrl = 'http://localhost/base';
    t.context.customXhr.nodejsBaseUrl = customBaseUrl;
    xml_http_request_1.XMLHttpRequest.nodejsSet({ baseUrl });
    t.is(t.context.xhr.nodejsBaseUrl, baseUrl, 'sets the default nodejsBaseUrl');
    t.is(t.context.customXhr.nodejsBaseUrl, customBaseUrl, 'does not interfere with custom nodejsBaseUrl settings');
    xml_http_request_1.XMLHttpRequest.nodejsSet({ baseUrl: defaultBaseUrl });
});
test('#nodejsSet with a httpAgent option', t => {
    const customAgent = { custom: 'httpAgent' };
    t.context.customXhr.nodejsSet({ httpAgent: customAgent });
    t.is(t.context.customXhr.nodejsHttpAgent, customAgent, 'sets nodejsHttpAgent on the XHR instance');
    t.not(t.context.xhr.nodejsHttpAgent, customAgent, 'does not interfere with default nodejsHttpAgent settings');
});
test('#nodejsSet with a httpsAgent option', t => {
    const customAgent = { custom: 'httpsAgent' };
    t.context.customXhr.nodejsSet({ httpsAgent: customAgent });
    t.is(t.context.customXhr.nodejsHttpsAgent, customAgent, 'sets nodejsHttpsAgent on the XHR instance');
    t.not(t.context.xhr.nodejsHttpsAgent, customAgent, 'does not interfere with default nodejsHttpsAgent settings');
});
test('base URL parsing with null baseUrl', t => {
    const xhr = t.context.xhr;
    xhr.nodejsSet({ baseUrl: null });
    const parsedUrl = xhr._parseUrl('http://www.domain.com/path');
    t.truthy(parsedUrl);
    t.true(parsedUrl.hasOwnProperty('href'));
    t.is(parsedUrl.href, 'http://www.domain.com/path');
});
test('base URL parsing with a (protocol, domain, filePath) baseUrl parses an absolute URL', t => {
    const xhr = t.context.xhr;
    xhr.nodejsSet({ baseUrl: 'https://base.url/dir/file.html' });
    const parsedUrl = xhr._parseUrl('http://www.domain.com/path');
    t.truthy(parsedUrl);
    t.true(parsedUrl.hasOwnProperty('href'));
    t.is(parsedUrl.href, 'http://www.domain.com/path');
});
test('base URL parsing with a (protocol, domain, filePath) baseUrl parses a path-relative URL', t => {
    const xhr = t.context.xhr;
    xhr.nodejsSet({ baseUrl: 'https://base.url/dir/file.html' });
    const parsedUrl = xhr._parseUrl('path/to.js');
    t.truthy(parsedUrl);
    t.true(parsedUrl.hasOwnProperty('href'));
    t.is(parsedUrl.href, 'https://base.url/dir/path/to.js');
});
test('base URL parsing with a (protocol, domain, filePath) baseUrl parses a path-relative URL with ..', t => {
    const xhr = t.context.xhr;
    xhr.nodejsSet({ baseUrl: 'https://base.url/dir/file.html' });
    const parsedUrl = xhr._parseUrl('../path/to.js');
    t.truthy(parsedUrl);
    t.true(parsedUrl.hasOwnProperty('href'));
    t.is(parsedUrl.href, 'https://base.url/path/to.js');
});
test('base URL parsing with a (protocol, domain, filePath) baseUrl parses a host-relative URL', t => {
    const xhr = t.context.xhr;
    xhr.nodejsSet({ baseUrl: 'https://base.url/dir/file.html' });
    const parsedUrl = xhr._parseUrl('/path/to.js');
    t.truthy(parsedUrl);
    t.true(parsedUrl.hasOwnProperty('href'));
    t.is(parsedUrl.href, 'https://base.url/path/to.js');
});
test('base URL parsing with a (protocol, domain, filePath) baseUrl parses a protocol-relative URL', t => {
    const xhr = t.context.xhr;
    xhr.nodejsSet({ baseUrl: 'https://base.url/dir/file.html' });
    const parsedUrl = xhr._parseUrl('//domain.com/path/to.js');
    t.truthy(parsedUrl);
    t.true(parsedUrl.hasOwnProperty('href'));
    t.is(parsedUrl.href, 'https://domain.com/path/to.js');
});
//# sourceMappingURL=nodejs-set.spec.js.map