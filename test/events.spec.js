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
    dripUrl: `http://localhost:${server_1.HttpServer.port}/_/drip`,
    dripJson: { drips: 3, size: 1000, ms: 50, length: true },
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
test('level 2 events for a successful fetch with Content-Length set', (t) => __awaiter(void 0, void 0, void 0, function* () {
    let endFired = false;
    let intermediateProgressFired = false;
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        ['loadstart', 'progress', 'load', 'loadend', 'error', 'abort'].forEach(addCheckedEvent);
        xhr.addEventListener('loadend', () => {
            endFired = true;
            resolve();
        });
        xhr.addEventListener('error', () => resolve());
        xhr.open('POST', t.context.dripUrl);
        xhr.send(JSON.stringify(t.context.dripJson));
    });
    t.true(intermediateProgressFired, 'at least one intermediate progress event was fired');
    function addCheckedEvent(eventType) {
        xhr.addEventListener(eventType, event => {
            t.is(event.type, eventType, `event type is ${eventType}`);
            t.is(event.target, xhr, 'event has correct target');
            t.false(endFired, 'end is not fired');
            t.false(event.bubbles, 'event does not bubble');
            t.false(event.cancelable, 'event is not cancelable');
            switch (eventType) {
                case 'loadstart':
                    t.is(event.loaded, 0, 'on loadstart loaded = 0');
                    t.false(event.lengthComputable, 'on loadstart length is not computable');
                    t.is(event.total, 0, 'on loadstart event total is 0');
                    break;
                case 'load':
                case 'loadend':
                    t.is(event.loaded, 3000, 'on load/loadend loaded = 3000');
                    t.true(event.lengthComputable, 'on load/loadend length is computable');
                    t.is(event.total, 3000, 'on load/loadend event total is 0');
                    break;
                case 'progress':
                    t.true(event.loaded >= 0, 'on progress: loaded >= 0');
                    t.true(event.loaded <= 3000, 'on progress: loaded <= 3000');
                    if (event.lengthComputable) {
                        t.is(event.total, 3000, 'on progress event when length is computable total is 3000');
                    }
                    else {
                        t.is(event.total, 0, 'on progress event when length is not computable total is 0');
                    }
                    if (event.loaded > 0 && event.loaded < 3000) {
                        intermediateProgressFired = true;
                    }
                    break;
            }
        });
    }
}));
test('level 2 events for a successful fetch without Content-Length set', (t) => __awaiter(void 0, void 0, void 0, function* () {
    let endFired = false;
    let intermediateProgressFired = false;
    const xhr = t.context.xhr;
    t.context.dripJson = Object.assign(Object.assign({}, t.context.dripJson), { length: false });
    yield new Promise(resolve => {
        ['loadstart', 'progress', 'load', 'loadend', 'error', 'abort'].forEach(addCheckedEvent);
        xhr.addEventListener('loadend', () => {
            endFired = true;
            resolve();
        });
        xhr.open('POST', t.context.dripUrl);
        xhr.send(JSON.stringify(t.context.dripJson));
    });
    t.true(intermediateProgressFired, 'at least one intermediate progress event was fired');
    function addCheckedEvent(eventType) {
        xhr.addEventListener(eventType, event => {
            t.is(event.type, eventType, `event type is ${eventType}`);
            t.is(event.target, xhr, 'event has correct target');
            t.false(endFired, 'end is not fired');
            t.false(event.bubbles, 'event does not bubble');
            t.false(event.cancelable, 'event is not cancelable');
            t.false(event.lengthComputable, 'length is not computable');
            t.is(event.total, 0, 'when length is not computable total is 0');
            switch (eventType) {
                case 'loadstart':
                    t.is(event.loaded, 0, 'on loadstart loaded = 0');
                    break;
                case 'load':
                case 'loadend':
                    t.is(event.loaded, 3000, 'on load/loadend loaded = 3000');
                    break;
                case 'progress':
                    t.true(event.loaded >= 0, 'on progress: loaded >= 0');
                    t.true(event.loaded <= 3000, 'on progress: loaded <= 3000');
                    if (event.loaded > 0 && event.loaded < 3000) {
                        intermediateProgressFired = true;
                    }
                    break;
            }
        });
    }
}));
test('level 2 events for a network error due to bad DNS', (t) => __awaiter(void 0, void 0, void 0, function* () {
    let errorFired = false;
    const xhr = t.context.xhr;
    yield new Promise(resolve => {
        ['loadstart', 'progress', 'load', 'loadend', 'error', 'abort'].forEach(addCheckedEvent);
        xhr.addEventListener('loadend', () => resolve());
        xhr.open('GET', 'https://broken.to.cause.an.xhrnetworkerror.com.a.com');
        xhr.send();
    });
    t.true(errorFired, 'an error event was fired');
    function addCheckedEvent(eventType) {
        xhr.addEventListener(eventType, () => {
            switch (eventType) {
                case 'load':
                case 'progress':
                    t.fail();
                    break;
                case 'error':
                    errorFired = true;
                    break;
            }
        });
    }
}));
test('readystatechange for a successful fetch with Content-Length set', (t) => __awaiter(void 0, void 0, void 0, function* () {
    let doneFired = false;
    const xhr = t.context.xhr;
    const states = [];
    yield new Promise(resolve => {
        xhr.addEventListener('readystatechange', event => {
            t.is(event.type, 'readystatechange', 'event type is correct');
            t.false(doneFired, 'no readystatechange events after DONE');
            t.is(event.target, xhr, 'event has correct target');
            t.false(event.bubbles, 'event does not bubble');
            t.false(event.cancelable, 'event is not cancelable');
            states.push(event.target.readyState);
            if (event.target.readyState === xml_http_request_1.XMLHttpRequest.DONE) {
                doneFired = true;
                resolve();
            }
        });
        xhr.open('POST', t.context.dripUrl);
        xhr.send(JSON.stringify(t.context.dripJson));
    });
    t.deepEqual(states, [
        xml_http_request_1.XMLHttpRequest.OPENED,
        xml_http_request_1.XMLHttpRequest.HEADERS_RECEIVED,
        xml_http_request_1.XMLHttpRequest.LOADING,
        xml_http_request_1.XMLHttpRequest.DONE
    ], 'right order of ready states');
}));
test('readystatechange for a successful fetch without Content-Length set', (t) => __awaiter(void 0, void 0, void 0, function* () {
    let doneFired = false;
    const xhr = t.context.xhr;
    const states = [];
    t.context.dripJson = Object.assign(Object.assign({}, t.context.dripJson), { length: false });
    yield new Promise(resolve => {
        xhr.addEventListener('readystatechange', event => {
            t.is(event.type, 'readystatechange', 'event type is correct');
            t.false(doneFired, 'no readystatechange events after DONE');
            t.is(event.target, xhr, 'event has correct target');
            t.false(event.bubbles, 'event does not bubble');
            t.false(event.cancelable, 'event is not cancelable');
            t.false(event.lengthComputable, 'length is not computable');
            t.is(event.total, 0, 'when length is not computable total is 0');
            states.push(event.target.readyState);
            if (event.target.readyState === xml_http_request_1.XMLHttpRequest.DONE) {
                doneFired = true;
                resolve();
            }
        });
        xhr.open('POST', t.context.dripUrl);
        xhr.send(JSON.stringify(t.context.dripJson));
    });
    t.deepEqual(states, [
        xml_http_request_1.XMLHttpRequest.OPENED,
        xml_http_request_1.XMLHttpRequest.HEADERS_RECEIVED,
        xml_http_request_1.XMLHttpRequest.LOADING,
        xml_http_request_1.XMLHttpRequest.DONE
    ], 'right order of ready states');
}));
test('readystatechange for a network error due to bad DNS', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = t.context.xhr;
    const states = [];
    yield new Promise(resolve => {
        xhr.addEventListener('readystatechange', event => {
            t.is(event.type, 'readystatechange', 'event type is correct');
            t.is(event.target, xhr, 'event has correct target');
            t.false(event.bubbles, 'event does not bubble');
            t.false(event.cancelable, 'event is not cancelable');
            states.push(event.target.readyState);
            if (event.target.readyState === xml_http_request_1.XMLHttpRequest.DONE) {
                resolve();
            }
        });
        xhr.open('GET', 'https://broken.to.cause.an.xhrnetworkerror.com.a.com');
        xhr.send();
    });
    t.deepEqual(states, [
        xml_http_request_1.XMLHttpRequest.OPENED,
        xml_http_request_1.XMLHttpRequest.DONE
    ], 'right order of ready states');
}));
//# sourceMappingURL=events.spec.js.map