/// <reference types="node" />
import { ProgressEvent } from './progress-event';
import { InvalidStateError, NetworkError, SecurityError, SyntaxError } from './errors';
import { ProgressEventListener, XMLHttpRequestEventTarget } from './xml-http-request-event-target';
import { XMLHttpRequestUpload } from './xml-http-request-upload';
import { Url } from 'url';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
export interface XMLHttpRequestOptions {
    anon?: boolean;
}
export interface XHRUrl extends Url {
    method?: string;
}
export declare class XMLHttpRequest extends XMLHttpRequestEventTarget {
    static ProgressEvent: typeof ProgressEvent;
    static InvalidStateError: typeof InvalidStateError;
    static NetworkError: typeof NetworkError;
    static SecurityError: typeof SecurityError;
    static SyntaxError: typeof SyntaxError;
    static XMLHttpRequestUpload: typeof XMLHttpRequestUpload;
    static UNSENT: number;
    static OPENED: number;
    static HEADERS_RECEIVED: number;
    static LOADING: number;
    static DONE: number;
    static REFUSE_UNSAFE_HEADER: boolean;
    static cookieJar: any;
    UNSENT: number;
    OPENED: number;
    HEADERS_RECEIVED: number;
    LOADING: number;
    DONE: number;
    onreadystatechange: ProgressEventListener | null;
    readyState: number;
    response: string | ArrayBuffer | Buffer | object | null;
    responseText: string;
    responseType: string;
    status: number;
    statusText: string;
    timeout: number;
    upload: XMLHttpRequestUpload;
    responseUrl: string;
    withCredentials: boolean;
    nodejsHttpAgent: HttpsAgent;
    nodejsHttpsAgent: HttpsAgent;
    nodejsBaseUrl: string | null;
    private _anonymous;
    private _method;
    private _url;
    private _sync;
    private _headers;
    private _loweredHeaders;
    private _mimeOverride;
    private _request;
    private _response;
    private _responseParts;
    private _responseHeaders;
    private _aborting;
    private _error;
    private _loadedBytes;
    private _totalBytes;
    private _lengthComputable;
    private _restrictedMethods;
    private _restrictedHeaders;
    private _privateHeaders;
    private _userAgent;
    constructor(options?: XMLHttpRequestOptions);
    open(method: string, url: string, async?: boolean, user?: string, password?: string): void;
    setRequestHeader(name: string, value: any): void;
    send(data?: string | Buffer | ArrayBuffer | ArrayBufferView): void;
    abort(): void;
    getResponseHeader(name: string): string;
    getAllResponseHeaders(): string;
    overrideMimeType(mimeType: string): void;
    nodejsSet(options: {
        httpAgent?: HttpAgent;
        httpsAgent?: HttpsAgent;
        baseUrl?: string;
    }): void;
    static nodejsSet(options: {
        httpAgent?: HttpAgent;
        httpsAgent?: HttpsAgent;
        baseUrl?: string;
    }): void;
    private _setReadyState;
    private _sendFile;
    private _sendHttp;
    private _sendHxxpRequest;
    private _finalizeHeaders;
    private _onHttpResponse;
    private _onHttpResponseData;
    private _onHttpResponseEnd;
    private _onHttpResponseClose;
    private _onHttpTimeout;
    private _onHttpRequestError;
    private _dispatchProgress;
    private _setError;
    private _parseUrl;
    private _parseResponseHeaders;
    private _parseResponse;
    private _parseResponseEncoding;
}
