(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
// Rough polyfill of https://developer.mozilla.org/en-US/docs/Web/API/AbortController
// We don't actually ever use the API being polyfilled, we always use the polyfill because
// it's a very new API right now.
var AbortController = /** @class */ (function () {
    function AbortController() {
        this.isAborted = false;
    }
    AbortController.prototype.abort = function () {
        if (!this.isAborted) {
            this.isAborted = true;
            if (this.onabort) {
                this.onabort();
            }
        }
    };
    Object.defineProperty(AbortController.prototype, "signal", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbortController.prototype, "aborted", {
        get: function () {
            return this.isAborted;
        },
        enumerable: true,
        configurable: true
    });
    return AbortController;
}());
exports.AbortController = AbortController;

},{}],2:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HttpError = /** @class */ (function (_super) {
    __extends(HttpError, _super);
    function HttpError(errorMessage, statusCode) {
        var _newTarget = this.constructor;
        var _this = this;
        var trueProto = _newTarget.prototype;
        _this = _super.call(this, errorMessage) || this;
        _this.statusCode = statusCode;
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        _this.__proto__ = trueProto;
        return _this;
    }
    return HttpError;
}(Error));
exports.HttpError = HttpError;
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError(errorMessage) {
        var _newTarget = this.constructor;
        if (errorMessage === void 0) { errorMessage = "A timeout occurred."; }
        var _this = this;
        var trueProto = _newTarget.prototype;
        _this = _super.call(this, errorMessage) || this;
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        _this.__proto__ = trueProto;
        return _this;
    }
    return TimeoutError;
}(Error));
exports.TimeoutError = TimeoutError;

},{}],3:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = require("./Errors");
var ILogger_1 = require("./ILogger");
var HttpResponse = /** @class */ (function () {
    function HttpResponse(statusCode, statusText, content) {
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.content = content;
    }
    return HttpResponse;
}());
exports.HttpResponse = HttpResponse;
var HttpClient = /** @class */ (function () {
    function HttpClient() {
    }
    HttpClient.prototype.get = function (url, options) {
        return this.send(__assign({}, options, { method: "GET", url: url }));
    };
    HttpClient.prototype.post = function (url, options) {
        return this.send(__assign({}, options, { method: "POST", url: url }));
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;
var DefaultHttpClient = /** @class */ (function (_super) {
    __extends(DefaultHttpClient, _super);
    function DefaultHttpClient(logger) {
        var _this = _super.call(this) || this;
        _this.logger = logger;
        return _this;
    }
    DefaultHttpClient.prototype.send = function (request) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(request.method, request.url, true);
            xhr.withCredentials = true;
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            if (request.headers) {
                Object.keys(request.headers)
                    .forEach(function (header) { return xhr.setRequestHeader(header, request.headers[header]); });
            }
            if (request.responseType) {
                xhr.responseType = request.responseType;
            }
            if (request.abortSignal) {
                request.abortSignal.onabort = function () {
                    xhr.abort();
                };
            }
            if (request.timeout) {
                xhr.timeout = request.timeout;
            }
            xhr.onload = function () {
                if (request.abortSignal) {
                    request.abortSignal.onabort = null;
                }
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(new HttpResponse(xhr.status, xhr.statusText, xhr.response || xhr.responseText));
                }
                else {
                    reject(new Errors_1.HttpError(xhr.statusText, xhr.status));
                }
            };
            xhr.onerror = function () {
                _this.logger.log(ILogger_1.LogLevel.Warning, "Error from HTTP request. " + xhr.status + ": " + xhr.statusText);
                reject(new Errors_1.HttpError(xhr.statusText, xhr.status));
            };
            xhr.ontimeout = function () {
                _this.logger.log(ILogger_1.LogLevel.Warning, "Timeout from HTTP request.");
                reject(new Errors_1.TimeoutError());
            };
            xhr.send(request.content || "");
        });
    };
    return DefaultHttpClient;
}(HttpClient));
exports.DefaultHttpClient = DefaultHttpClient;

},{"./Errors":2,"./ILogger":7}],4:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var HttpClient_1 = require("./HttpClient");
var ILogger_1 = require("./ILogger");
var Loggers_1 = require("./Loggers");
var Transports_1 = require("./Transports");
var Utils_1 = require("./Utils");
var HttpConnection = /** @class */ (function () {
    function HttpConnection(url, options) {
        if (options === void 0) { options = {}; }
        this.features = {};
        Utils_1.Arg.isRequired(url, "url");
        this.logger = Loggers_1.LoggerFactory.createLogger(options.logger);
        this.baseUrl = this.resolveUrl(url);
        options = options || {};
        options.accessTokenFactory = options.accessTokenFactory || (function () { return null; });
        this.httpClient = options.httpClient || new HttpClient_1.DefaultHttpClient(this.logger);
        this.connectionState = 2 /* Disconnected */;
        this.options = options;
    }
    HttpConnection.prototype.start = function (transferFormat) {
        Utils_1.Arg.isRequired(transferFormat, "transferFormat");
        Utils_1.Arg.isIn(transferFormat, Transports_1.TransferFormat, "transferFormat");
        this.logger.log(ILogger_1.LogLevel.Trace, "Starting connection with transfer format '" + Transports_1.TransferFormat[transferFormat] + "'.");
        if (this.connectionState !== 2 /* Disconnected */) {
            return Promise.reject(new Error("Cannot start a connection that is not in the 'Disconnected' state."));
        }
        this.connectionState = 0 /* Connecting */;
        this.startPromise = this.startInternal(transferFormat);
        return this.startPromise;
    };
    HttpConnection.prototype.startInternal = function (transferFormat) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var token, headers, negotiateResponse, e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        if (!(this.options.transport === Transports_1.TransportType.WebSockets)) return [3 /*break*/, 2];
                        // No need to add a connection ID in this case
                        this.url = this.baseUrl;
                        this.transport = this.constructTransport(Transports_1.TransportType.WebSockets);
                        // We should just call connect directly in this case.
                        // No fallback or negotiate in this case.
                        return [4 /*yield*/, this.transport.connect(this.url, transferFormat, this)];
                    case 1:
                        // We should just call connect directly in this case.
                        // No fallback or negotiate in this case.
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        token = this.options.accessTokenFactory();
                        headers = void 0;
                        if (token) {
                            headers = (_a = {},
                                _a["Authorization"] = "Bearer " + token,
                                _a);
                        }
                        return [4 /*yield*/, this.getNegotiationResponse(headers)];
                    case 3:
                        negotiateResponse = _b.sent();
                        // the user tries to stop the the connection when it is being started
                        if (this.connectionState === 2 /* Disconnected */) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.createTransport(this.options.transport, negotiateResponse, transferFormat, headers)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        this.transport.onreceive = this.onreceive;
                        this.transport.onclose = function (e) { return _this.stopConnection(true, e); };
                        // only change the state if we were connecting to not overwrite
                        // the state if the connection is already marked as Disconnected
                        this.changeState(0 /* Connecting */, 1 /* Connected */);
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _b.sent();
                        this.logger.log(ILogger_1.LogLevel.Error, "Failed to start the connection: " + e_1);
                        this.connectionState = 2 /* Disconnected */;
                        this.transport = null;
                        throw e_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    HttpConnection.prototype.getNegotiationResponse = function (headers) {
        return __awaiter(this, void 0, void 0, function () {
            var negotiateUrl, response, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        negotiateUrl = this.resolveNegotiateUrl(this.baseUrl);
                        this.logger.log(ILogger_1.LogLevel.Trace, "Sending negotiation request: " + negotiateUrl);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.httpClient.post(negotiateUrl, {
                                content: "",
                                headers: headers,
                            })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, JSON.parse(response.content)];
                    case 3:
                        e_2 = _a.sent();
                        this.logger.log(ILogger_1.LogLevel.Error, "Failed to complete negotiation with the server: " + e_2);
                        throw e_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    HttpConnection.prototype.updateConnectionId = function (negotiateResponse) {
        this.connectionId = negotiateResponse.connectionId;
        this.url = this.baseUrl + (this.baseUrl.indexOf("?") === -1 ? "?" : "&") + ("id=" + this.connectionId);
    };
    HttpConnection.prototype.createTransport = function (requestedTransport, negotiateResponse, requestedTransferFormat, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var transports, _i, transports_1, endpoint, transport, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.updateConnectionId(negotiateResponse);
                        if (!this.isITransport(requestedTransport)) return [3 /*break*/, 2];
                        this.logger.log(ILogger_1.LogLevel.Trace, "Connection was provided an instance of ITransport, using that directly.");
                        this.transport = requestedTransport;
                        return [4 /*yield*/, this.transport.connect(this.url, requestedTransferFormat, this)];
                    case 1:
                        _a.sent();
                        // only change the state if we were connecting to not overwrite
                        // the state if the connection is already marked as Disconnected
                        this.changeState(0 /* Connecting */, 1 /* Connected */);
                        return [2 /*return*/];
                    case 2:
                        transports = negotiateResponse.availableTransports;
                        _i = 0, transports_1 = transports;
                        _a.label = 3;
                    case 3:
                        if (!(_i < transports_1.length)) return [3 /*break*/, 9];
                        endpoint = transports_1[_i];
                        this.connectionState = 0 /* Connecting */;
                        transport = this.resolveTransport(endpoint, requestedTransport, requestedTransferFormat);
                        if (!(typeof transport === "number")) return [3 /*break*/, 8];
                        this.transport = this.constructTransport(transport);
                        if (!(negotiateResponse.connectionId === null)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getNegotiationResponse(headers)];
                    case 4:
                        negotiateResponse = _a.sent();
                        this.updateConnectionId(negotiateResponse);
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.transport.connect(this.url, requestedTransferFormat, this)];
                    case 6:
                        _a.sent();
                        this.changeState(0 /* Connecting */, 1 /* Connected */);
                        return [2 /*return*/];
                    case 7:
                        ex_1 = _a.sent();
                        this.logger.log(ILogger_1.LogLevel.Error, "Failed to start the transport '" + Transports_1.TransportType[transport] + "': " + ex_1);
                        this.connectionState = 2 /* Disconnected */;
                        negotiateResponse.connectionId = null;
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 3];
                    case 9: throw new Error("Unable to initialize any of the available transports.");
                }
            });
        });
    };
    HttpConnection.prototype.constructTransport = function (transport) {
        switch (transport) {
            case Transports_1.TransportType.WebSockets:
                return new Transports_1.WebSocketTransport(this.options.accessTokenFactory, this.logger);
            case Transports_1.TransportType.ServerSentEvents:
                return new Transports_1.ServerSentEventsTransport(this.httpClient, this.options.accessTokenFactory, this.logger);
            case Transports_1.TransportType.LongPolling:
                return new Transports_1.LongPollingTransport(this.httpClient, this.options.accessTokenFactory, this.logger);
            default:
                throw new Error("Unknown transport: " + transport + ".");
        }
    };
    HttpConnection.prototype.resolveTransport = function (endpoint, requestedTransport, requestedTransferFormat) {
        var transport = Transports_1.TransportType[endpoint.transport];
        if (transport === null || transport === undefined) {
            this.logger.log(ILogger_1.LogLevel.Trace, "Skipping transport '" + endpoint.transport + "' because it is not supported by this client.");
        }
        else {
            var transferFormats = endpoint.transferFormats.map(function (s) { return Transports_1.TransferFormat[s]; });
            if (!requestedTransport || transport === requestedTransport) {
                if (transferFormats.indexOf(requestedTransferFormat) >= 0) {
                    if ((transport === Transports_1.TransportType.WebSockets && typeof WebSocket === "undefined") ||
                        (transport === Transports_1.TransportType.ServerSentEvents && typeof EventSource === "undefined")) {
                        this.logger.log(ILogger_1.LogLevel.Trace, "Skipping transport '" + Transports_1.TransportType[transport] + "' because it is not supported in your environment.'");
                    }
                    else {
                        this.logger.log(ILogger_1.LogLevel.Trace, "Selecting transport '" + Transports_1.TransportType[transport] + "'");
                        return transport;
                    }
                }
                else {
                    this.logger.log(ILogger_1.LogLevel.Trace, "Skipping transport '" + Transports_1.TransportType[transport] + "' because it does not support the requested transfer format '" + Transports_1.TransferFormat[requestedTransferFormat] + "'.");
                }
            }
            else {
                this.logger.log(ILogger_1.LogLevel.Trace, "Skipping transport '" + Transports_1.TransportType[transport] + "' because it was disabled by the client.");
            }
        }
        return null;
    };
    HttpConnection.prototype.isITransport = function (transport) {
        return typeof (transport) === "object" && "connect" in transport;
    };
    HttpConnection.prototype.changeState = function (from, to) {
        if (this.connectionState === from) {
            this.connectionState = to;
            return true;
        }
        return false;
    };
    HttpConnection.prototype.send = function (data) {
        if (this.connectionState !== 1 /* Connected */) {
            throw new Error("Cannot send data if the connection is not in the 'Connected' State.");
        }
        return this.transport.send(data);
    };
    HttpConnection.prototype.stop = function (error) {
        return __awaiter(this, void 0, void 0, function () {
            var previousState, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        previousState = this.connectionState;
                        this.connectionState = 2 /* Disconnected */;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.startPromise];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        this.stopConnection(/*raiseClosed*/ previousState === 1 /* Connected */, error);
                        return [2 /*return*/];
                }
            });
        });
    };
    HttpConnection.prototype.stopConnection = function (raiseClosed, error) {
        if (this.transport) {
            this.transport.stop();
            this.transport = null;
        }
        if (error) {
            this.logger.log(ILogger_1.LogLevel.Error, "Connection disconnected with error '" + error + "'.");
        }
        else {
            this.logger.log(ILogger_1.LogLevel.Information, "Connection disconnected.");
        }
        this.connectionState = 2 /* Disconnected */;
        if (raiseClosed && this.onclose) {
            this.onclose(error);
        }
    };
    HttpConnection.prototype.resolveUrl = function (url) {
        // startsWith is not supported in IE
        if (url.lastIndexOf("https://", 0) === 0 || url.lastIndexOf("http://", 0) === 0) {
            return url;
        }
        if (typeof window === "undefined" || !window || !window.document) {
            throw new Error("Cannot resolve '" + url + "'.");
        }
        var parser = window.document.createElement("a");
        parser.href = url;
        var baseUrl = (!parser.protocol || parser.protocol === ":")
            ? window.document.location.protocol + "//" + (parser.host || window.document.location.host)
            : parser.protocol + "//" + parser.host;
        if (!url || url[0] !== "/") {
            url = "/" + url;
        }
        var normalizedUrl = baseUrl + url;
        this.logger.log(ILogger_1.LogLevel.Information, "Normalizing '" + url + "' to '" + normalizedUrl + "'.");
        return normalizedUrl;
    };
    HttpConnection.prototype.resolveNegotiateUrl = function (url) {
        var index = url.indexOf("?");
        var negotiateUrl = url.substring(0, index === -1 ? url.length : index);
        if (negotiateUrl[negotiateUrl.length - 1] !== "/") {
            negotiateUrl += "/";
        }
        negotiateUrl += "negotiate";
        negotiateUrl += index === -1 ? "" : url.substring(index);
        return negotiateUrl;
    };
    return HttpConnection;
}());
exports.HttpConnection = HttpConnection;

},{"./HttpClient":3,"./ILogger":7,"./Loggers":9,"./Transports":12,"./Utils":13}],5:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var HttpConnection_1 = require("./HttpConnection");
var ILogger_1 = require("./ILogger");
var JsonHubProtocol_1 = require("./JsonHubProtocol");
exports.JsonHubProtocol = JsonHubProtocol_1.JsonHubProtocol;
var Loggers_1 = require("./Loggers");
var Observable_1 = require("./Observable");
var TextMessageFormat_1 = require("./TextMessageFormat");
var DEFAULT_TIMEOUT_IN_MS = 30 * 1000;
var HubConnection = /** @class */ (function () {
    function HubConnection(urlOrConnection, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        options = options || {};
        this.timeoutInMilliseconds = options.timeoutInMilliseconds || DEFAULT_TIMEOUT_IN_MS;
        this.protocol = options.protocol || new JsonHubProtocol_1.JsonHubProtocol();
        if (typeof urlOrConnection === "string") {
            this.connection = new HttpConnection_1.HttpConnection(urlOrConnection, options);
        }
        else {
            this.connection = urlOrConnection;
        }
        this.logger = Loggers_1.LoggerFactory.createLogger(options.logger);
        this.connection.onreceive = function (data) { return _this.processIncomingData(data); };
        this.connection.onclose = function (error) { return _this.connectionClosed(error); };
        this.callbacks = {};
        this.methods = {};
        this.closedCallbacks = [];
        this.id = 0;
    }
    HubConnection.prototype.processIncomingData = function (data) {
        this.cleanupTimeout();
        if (!this.receivedHandshakeResponse) {
            data = this.processHandshakeResponse(data);
            this.receivedHandshakeResponse = true;
        }
        // Data may have all been read when processing handshake response
        if (data) {
            // Parse the messages
            var messages = this.protocol.parseMessages(data, this.logger);
            for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
                var message = messages_1[_i];
                switch (message.type) {
                    case 1 /* Invocation */:
                        this.invokeClientMethod(message);
                        break;
                    case 2 /* StreamItem */:
                    case 3 /* Completion */:
                        var callback = this.callbacks[message.invocationId];
                        if (callback != null) {
                            if (message.type === 3 /* Completion */) {
                                delete this.callbacks[message.invocationId];
                            }
                            callback(message);
                        }
                        break;
                    case 6 /* Ping */:
                        // Don't care about pings
                        break;
                    case 7 /* Close */:
                        this.logger.log(ILogger_1.LogLevel.Information, "Close message received from server.");
                        this.connection.stop(message.error ? new Error("Server returned an error on close: " + message.error) : null);
                        break;
                    default:
                        this.logger.log(ILogger_1.LogLevel.Warning, "Invalid message type: " + message.type);
                        break;
                }
            }
        }
        this.configureTimeout();
    };
    HubConnection.prototype.processHandshakeResponse = function (data) {
        var responseMessage;
        var messageData;
        var remainingData;
        try {
            if (data instanceof ArrayBuffer) {
                // Format is binary but still need to read JSON text from handshake response
                var binaryData = new Uint8Array(data);
                var separatorIndex = binaryData.indexOf(TextMessageFormat_1.TextMessageFormat.RecordSeparatorCode);
                if (separatorIndex === -1) {
                    throw new Error("Message is incomplete.");
                }
                // content before separator is handshake response
                // optional content after is additional messages
                var responseLength = separatorIndex + 1;
                messageData = String.fromCharCode.apply(null, binaryData.slice(0, responseLength));
                remainingData = (binaryData.byteLength > responseLength) ? binaryData.slice(responseLength).buffer : null;
            }
            else {
                var textData = data;
                var separatorIndex = textData.indexOf(TextMessageFormat_1.TextMessageFormat.RecordSeparator);
                if (separatorIndex === -1) {
                    throw new Error("Message is incomplete.");
                }
                // content before separator is handshake response
                // optional content after is additional messages
                var responseLength = separatorIndex + 1;
                messageData = textData.substring(0, responseLength);
                remainingData = (textData.length > responseLength) ? textData.substring(responseLength) : null;
            }
            // At this point we should have just the single handshake message
            var messages = TextMessageFormat_1.TextMessageFormat.parse(messageData);
            responseMessage = JSON.parse(messages[0]);
        }
        catch (e) {
            var message = "Error parsing handshake response: " + e;
            this.logger.log(ILogger_1.LogLevel.Error, message);
            var error = new Error(message);
            this.connection.stop(error);
            throw error;
        }
        if (responseMessage.error) {
            var message = "Server returned handshake error: " + responseMessage.error;
            this.logger.log(ILogger_1.LogLevel.Error, message);
            this.connection.stop(new Error(message));
        }
        else {
            this.logger.log(ILogger_1.LogLevel.Trace, "Server handshake complete.");
        }
        // multiple messages could have arrived with handshake
        // return additional data to be parsed as usual, or null if all parsed
        return remainingData;
    };
    HubConnection.prototype.configureTimeout = function () {
        var _this = this;
        if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
            // Set the timeout timer
            this.timeoutHandle = setTimeout(function () { return _this.serverTimeout(); }, this.timeoutInMilliseconds);
        }
    };
    HubConnection.prototype.serverTimeout = function () {
        // The server hasn't talked to us in a while. It doesn't like us anymore ... :(
        // Terminate the connection
        this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
    };
    HubConnection.prototype.invokeClientMethod = function (invocationMessage) {
        var _this = this;
        var methods = this.methods[invocationMessage.target.toLowerCase()];
        if (methods) {
            methods.forEach(function (m) { return m.apply(_this, invocationMessage.arguments); });
            if (invocationMessage.invocationId) {
                // This is not supported in v1. So we return an error to avoid blocking the server waiting for the response.
                var message = "Server requested a response, which is not supported in this version of the client.";
                this.logger.log(ILogger_1.LogLevel.Error, message);
                this.connection.stop(new Error(message));
            }
        }
        else {
            this.logger.log(ILogger_1.LogLevel.Warning, "No client method with the name '" + invocationMessage.target + "' found.");
        }
    };
    HubConnection.prototype.connectionClosed = function (error) {
        var _this = this;
        var callbacks = this.callbacks;
        this.callbacks = {};
        Object.keys(callbacks)
            .forEach(function (key) {
            var callback = callbacks[key];
            callback(undefined, error ? error : new Error("Invocation canceled due to connection being closed."));
        });
        this.cleanupTimeout();
        this.closedCallbacks.forEach(function (c) { return c.apply(_this, [error]); });
    };
    HubConnection.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log(ILogger_1.LogLevel.Trace, "Starting HubConnection.");
                        this.receivedHandshakeResponse = false;
                        return [4 /*yield*/, this.connection.start(this.protocol.transferFormat)];
                    case 1:
                        _a.sent();
                        this.logger.log(ILogger_1.LogLevel.Trace, "Sending handshake request.");
                        // Handshake request is always JSON
                        return [4 /*yield*/, this.connection.send(TextMessageFormat_1.TextMessageFormat.write(JSON.stringify({ protocol: this.protocol.name, version: this.protocol.version })))];
                    case 2:
                        // Handshake request is always JSON
                        _a.sent();
                        this.logger.log(ILogger_1.LogLevel.Information, "Using HubProtocol '" + this.protocol.name + "'.");
                        // defensively cleanup timeout in case we receive a message from the server before we finish start
                        this.cleanupTimeout();
                        this.configureTimeout();
                        return [2 /*return*/];
                }
            });
        });
    };
    HubConnection.prototype.stop = function () {
        this.logger.log(ILogger_1.LogLevel.Trace, "Stopping HubConnection.");
        this.cleanupTimeout();
        return this.connection.stop();
    };
    HubConnection.prototype.stream = function (methodName) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var invocationDescriptor = this.createStreamInvocation(methodName, args);
        var subject = new Observable_1.Subject(function () {
            var cancelInvocation = _this.createCancelInvocation(invocationDescriptor.invocationId);
            var cancelMessage = _this.protocol.writeMessage(cancelInvocation);
            delete _this.callbacks[invocationDescriptor.invocationId];
            return _this.connection.send(cancelMessage);
        });
        this.callbacks[invocationDescriptor.invocationId] = function (invocationEvent, error) {
            if (error) {
                subject.error(error);
                return;
            }
            if (invocationEvent.type === 3 /* Completion */) {
                if (invocationEvent.error) {
                    subject.error(new Error(invocationEvent.error));
                }
                else {
                    subject.complete();
                }
            }
            else {
                subject.next((invocationEvent.item));
            }
        };
        var message = this.protocol.writeMessage(invocationDescriptor);
        this.connection.send(message)
            .catch(function (e) {
            subject.error(e);
            delete _this.callbacks[invocationDescriptor.invocationId];
        });
        return subject;
    };
    HubConnection.prototype.send = function (methodName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var invocationDescriptor = this.createInvocation(methodName, args, true);
        var message = this.protocol.writeMessage(invocationDescriptor);
        return this.connection.send(message);
    };
    HubConnection.prototype.invoke = function (methodName) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var invocationDescriptor = this.createInvocation(methodName, args, false);
        var p = new Promise(function (resolve, reject) {
            _this.callbacks[invocationDescriptor.invocationId] = function (invocationEvent, error) {
                if (error) {
                    reject(error);
                    return;
                }
                if (invocationEvent.type === 3 /* Completion */) {
                    var completionMessage = invocationEvent;
                    if (completionMessage.error) {
                        reject(new Error(completionMessage.error));
                    }
                    else {
                        resolve(completionMessage.result);
                    }
                }
                else {
                    reject(new Error("Unexpected message type: " + invocationEvent.type));
                }
            };
            var message = _this.protocol.writeMessage(invocationDescriptor);
            _this.connection.send(message)
                .catch(function (e) {
                reject(e);
                delete _this.callbacks[invocationDescriptor.invocationId];
            });
        });
        return p;
    };
    HubConnection.prototype.on = function (methodName, newMethod) {
        if (!methodName || !newMethod) {
            return;
        }
        methodName = methodName.toLowerCase();
        if (!this.methods[methodName]) {
            this.methods[methodName] = [];
        }
        // Preventing adding the same handler multiple times.
        if (this.methods[methodName].indexOf(newMethod) !== -1) {
            return;
        }
        this.methods[methodName].push(newMethod);
    };
    HubConnection.prototype.off = function (methodName, method) {
        if (!methodName) {
            return;
        }
        methodName = methodName.toLowerCase();
        var handlers = this.methods[methodName];
        if (!handlers) {
            return;
        }
        if (method) {
            var removeIdx = handlers.indexOf(method);
            if (removeIdx !== -1) {
                handlers.splice(removeIdx, 1);
                if (handlers.length === 0) {
                    delete this.methods[methodName];
                }
            }
        }
        else {
            delete this.methods[methodName];
        }
    };
    HubConnection.prototype.onclose = function (callback) {
        if (callback) {
            this.closedCallbacks.push(callback);
        }
    };
    HubConnection.prototype.cleanupTimeout = function () {
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
        }
    };
    HubConnection.prototype.createInvocation = function (methodName, args, nonblocking) {
        if (nonblocking) {
            return {
                arguments: args,
                target: methodName,
                type: 1 /* Invocation */,
            };
        }
        else {
            var id = this.id;
            this.id++;
            return {
                arguments: args,
                invocationId: id.toString(),
                target: methodName,
                type: 1 /* Invocation */,
            };
        }
    };
    HubConnection.prototype.createStreamInvocation = function (methodName, args) {
        var id = this.id;
        this.id++;
        return {
            arguments: args,
            invocationId: id.toString(),
            target: methodName,
            type: 4 /* StreamInvocation */,
        };
    };
    HubConnection.prototype.createCancelInvocation = function (id) {
        return {
            invocationId: id,
            type: 5 /* CancelInvocation */,
        };
    };
    return HubConnection;
}());
exports.HubConnection = HubConnection;

},{"./HttpConnection":4,"./ILogger":7,"./JsonHubProtocol":8,"./Loggers":9,"./Observable":10,"./TextMessageFormat":11}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],7:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    LogLevel[LogLevel["Information"] = 1] = "Information";
    LogLevel[LogLevel["Warning"] = 2] = "Warning";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["None"] = 4] = "None";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));

},{}],8:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var ILogger_1 = require("./ILogger");
var Loggers_1 = require("./Loggers");
var TextMessageFormat_1 = require("./TextMessageFormat");
var Transports_1 = require("./Transports");
exports.JSON_HUB_PROTOCOL_NAME = "json";
var JsonHubProtocol = /** @class */ (function () {
    function JsonHubProtocol() {
        this.name = exports.JSON_HUB_PROTOCOL_NAME;
        this.version = 1;
        this.transferFormat = Transports_1.TransferFormat.Text;
    }
    JsonHubProtocol.prototype.parseMessages = function (input, logger) {
        if (!input) {
            return [];
        }
        if (logger === null) {
            logger = new Loggers_1.NullLogger();
        }
        // Parse the messages
        var messages = TextMessageFormat_1.TextMessageFormat.parse(input);
        var hubMessages = [];
        for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
            var message = messages_1[_i];
            var parsedMessage = JSON.parse(message);
            if (typeof parsedMessage.type !== "number") {
                throw new Error("Invalid payload.");
            }
            switch (parsedMessage.type) {
                case 1 /* Invocation */:
                    this.isInvocationMessage(parsedMessage);
                    break;
                case 2 /* StreamItem */:
                    this.isStreamItemMessage(parsedMessage);
                    break;
                case 3 /* Completion */:
                    this.isCompletionMessage(parsedMessage);
                    break;
                case 6 /* Ping */:
                    // Single value, no need to validate
                    break;
                case 7 /* Close */:
                    // All optional values, no need to validate
                    break;
                default:
                    // Future protocol changes can add message types, old clients can ignore them
                    logger.log(ILogger_1.LogLevel.Information, "Unknown message type '" + parsedMessage.type + "' ignored.");
                    continue;
            }
            hubMessages.push(parsedMessage);
        }
        return hubMessages;
    };
    JsonHubProtocol.prototype.writeMessage = function (message) {
        return TextMessageFormat_1.TextMessageFormat.write(JSON.stringify(message));
    };
    JsonHubProtocol.prototype.isInvocationMessage = function (message) {
        this.assertNotEmptyString(message.target, "Invalid payload for Invocation message.");
        if (message.invocationId !== undefined) {
            this.assertNotEmptyString(message.invocationId, "Invalid payload for Invocation message.");
        }
    };
    JsonHubProtocol.prototype.isStreamItemMessage = function (message) {
        this.assertNotEmptyString(message.invocationId, "Invalid payload for StreamItem message.");
        if (message.item === undefined) {
            throw new Error("Invalid payload for StreamItem message.");
        }
    };
    JsonHubProtocol.prototype.isCompletionMessage = function (message) {
        if (message.result && message.error) {
            throw new Error("Invalid payload for Completion message.");
        }
        if (!message.result && message.error) {
            this.assertNotEmptyString(message.error, "Invalid payload for Completion message.");
        }
        this.assertNotEmptyString(message.invocationId, "Invalid payload for Completion message.");
    };
    JsonHubProtocol.prototype.assertNotEmptyString = function (value, errorMessage) {
        if (typeof value !== "string" || value === "") {
            throw new Error(errorMessage);
        }
    };
    return JsonHubProtocol;
}());
exports.JsonHubProtocol = JsonHubProtocol;

},{"./ILogger":7,"./Loggers":9,"./TextMessageFormat":11,"./Transports":12}],9:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var ILogger_1 = require("./ILogger");
var NullLogger = /** @class */ (function () {
    function NullLogger() {
    }
    NullLogger.prototype.log = function (logLevel, message) {
    };
    return NullLogger;
}());
exports.NullLogger = NullLogger;
var ConsoleLogger = /** @class */ (function () {
    function ConsoleLogger(minimumLogLevel) {
        this.minimumLogLevel = minimumLogLevel;
    }
    ConsoleLogger.prototype.log = function (logLevel, message) {
        if (logLevel >= this.minimumLogLevel) {
            switch (logLevel) {
                case ILogger_1.LogLevel.Error:
                    console.error(ILogger_1.LogLevel[logLevel] + ": " + message);
                    break;
                case ILogger_1.LogLevel.Warning:
                    console.warn(ILogger_1.LogLevel[logLevel] + ": " + message);
                    break;
                case ILogger_1.LogLevel.Information:
                    console.info(ILogger_1.LogLevel[logLevel] + ": " + message);
                    break;
                default:
                    console.log(ILogger_1.LogLevel[logLevel] + ": " + message);
                    break;
            }
        }
    };
    return ConsoleLogger;
}());
exports.ConsoleLogger = ConsoleLogger;
var LoggerFactory = /** @class */ (function () {
    function LoggerFactory() {
    }
    LoggerFactory.createLogger = function (logging) {
        if (logging === undefined) {
            return new ConsoleLogger(ILogger_1.LogLevel.Information);
        }
        if (logging === null) {
            return new NullLogger();
        }
        if (logging.log) {
            return logging;
        }
        return new ConsoleLogger(logging);
    };
    return LoggerFactory;
}());
exports.LoggerFactory = LoggerFactory;

},{"./ILogger":7}],10:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var Subscription = /** @class */ (function () {
    function Subscription(subject, observer) {
        this.subject = subject;
        this.observer = observer;
    }
    Subscription.prototype.dispose = function () {
        var index = this.subject.observers.indexOf(this.observer);
        if (index > -1) {
            this.subject.observers.splice(index, 1);
        }
        if (this.subject.observers.length === 0) {
            this.subject.cancelCallback().catch(function (_) { });
        }
    };
    return Subscription;
}());
exports.Subscription = Subscription;
var Subject = /** @class */ (function () {
    function Subject(cancelCallback) {
        this.observers = [];
        this.cancelCallback = cancelCallback;
    }
    Subject.prototype.next = function (item) {
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer.next(item);
        }
    };
    Subject.prototype.error = function (err) {
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            if (observer.error) {
                observer.error(err);
            }
        }
    };
    Subject.prototype.complete = function () {
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            if (observer.complete) {
                observer.complete();
            }
        }
    };
    Subject.prototype.subscribe = function (observer) {
        this.observers.push(observer);
        return new Subscription(this, observer);
    };
    return Subject;
}());
exports.Subject = Subject;

},{}],11:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var TextMessageFormat = /** @class */ (function () {
    function TextMessageFormat() {
    }
    TextMessageFormat.write = function (output) {
        return "" + output + TextMessageFormat.RecordSeparator;
    };
    TextMessageFormat.parse = function (input) {
        if (input[input.length - 1] !== TextMessageFormat.RecordSeparator) {
            throw new Error("Message is incomplete.");
        }
        var messages = input.split(TextMessageFormat.RecordSeparator);
        messages.pop();
        return messages;
    };
    TextMessageFormat.RecordSeparatorCode = 0x1e;
    TextMessageFormat.RecordSeparator = String.fromCharCode(TextMessageFormat.RecordSeparatorCode);
    return TextMessageFormat;
}());
exports.TextMessageFormat = TextMessageFormat;

},{}],12:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var AbortController_1 = require("./AbortController");
var Errors_1 = require("./Errors");
var ILogger_1 = require("./ILogger");
var Utils_1 = require("./Utils");
var TransportType;
(function (TransportType) {
    TransportType[TransportType["WebSockets"] = 0] = "WebSockets";
    TransportType[TransportType["ServerSentEvents"] = 1] = "ServerSentEvents";
    TransportType[TransportType["LongPolling"] = 2] = "LongPolling";
})(TransportType = exports.TransportType || (exports.TransportType = {}));
var TransferFormat;
(function (TransferFormat) {
    TransferFormat[TransferFormat["Text"] = 1] = "Text";
    TransferFormat[TransferFormat["Binary"] = 2] = "Binary";
})(TransferFormat = exports.TransferFormat || (exports.TransferFormat = {}));
var WebSocketTransport = /** @class */ (function () {
    function WebSocketTransport(accessTokenFactory, logger) {
        this.logger = logger;
        this.accessTokenFactory = accessTokenFactory || (function () { return null; });
    }
    WebSocketTransport.prototype.connect = function (url, transferFormat, connection) {
        var _this = this;
        Utils_1.Arg.isRequired(url, "url");
        Utils_1.Arg.isRequired(transferFormat, "transferFormat");
        Utils_1.Arg.isIn(transferFormat, TransferFormat, "transferFormat");
        Utils_1.Arg.isRequired(connection, "connection");
        if (typeof (WebSocket) === "undefined") {
            throw new Error("'WebSocket' is not supported in your environment.");
        }
        this.logger.log(ILogger_1.LogLevel.Trace, "(WebSockets transport) Connecting");
        return new Promise(function (resolve, reject) {
            url = url.replace(/^http/, "ws");
            var token = _this.accessTokenFactory();
            if (token) {
                url += (url.indexOf("?") < 0 ? "?" : "&") + ("access_token=" + encodeURIComponent(token));
            }
            var webSocket = new WebSocket(url);
            if (transferFormat === TransferFormat.Binary) {
                webSocket.binaryType = "arraybuffer";
            }
            webSocket.onopen = function (event) {
                _this.logger.log(ILogger_1.LogLevel.Information, "WebSocket connected to " + url);
                _this.webSocket = webSocket;
                resolve();
            };
            webSocket.onerror = function (event) {
                reject(event.error);
            };
            webSocket.onmessage = function (message) {
                _this.logger.log(ILogger_1.LogLevel.Trace, "(WebSockets transport) data received. " + getDataDetail(message.data) + ".");
                if (_this.onreceive) {
                    _this.onreceive(message.data);
                }
            };
            webSocket.onclose = function (event) {
                // webSocket will be null if the transport did not start successfully
                if (_this.onclose && _this.webSocket) {
                    if (event.wasClean === false || event.code !== 1000) {
                        _this.onclose(new Error("Websocket closed with status code: " + event.code + " (" + event.reason + ")"));
                    }
                    else {
                        _this.onclose();
                    }
                }
            };
        });
    };
    WebSocketTransport.prototype.send = function (data) {
        if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
            this.logger.log(ILogger_1.LogLevel.Trace, "(WebSockets transport) sending data. " + getDataDetail(data) + ".");
            this.webSocket.send(data);
            return Promise.resolve();
        }
        return Promise.reject("WebSocket is not in the OPEN state");
    };
    WebSocketTransport.prototype.stop = function () {
        if (this.webSocket) {
            this.webSocket.close();
            this.webSocket = null;
        }
        return Promise.resolve();
    };
    return WebSocketTransport;
}());
exports.WebSocketTransport = WebSocketTransport;
var ServerSentEventsTransport = /** @class */ (function () {
    function ServerSentEventsTransport(httpClient, accessTokenFactory, logger) {
        this.httpClient = httpClient;
        this.accessTokenFactory = accessTokenFactory || (function () { return null; });
        this.logger = logger;
    }
    ServerSentEventsTransport.prototype.connect = function (url, transferFormat, connection) {
        var _this = this;
        Utils_1.Arg.isRequired(url, "url");
        Utils_1.Arg.isRequired(transferFormat, "transferFormat");
        Utils_1.Arg.isIn(transferFormat, TransferFormat, "transferFormat");
        Utils_1.Arg.isRequired(connection, "connection");
        if (typeof (EventSource) === "undefined") {
            throw new Error("'EventSource' is not supported in your environment.");
        }
        this.logger.log(ILogger_1.LogLevel.Trace, "(SSE transport) Connecting");
        this.url = url;
        return new Promise(function (resolve, reject) {
            if (transferFormat !== TransferFormat.Text) {
                reject(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
            }
            var token = _this.accessTokenFactory();
            if (token) {
                url += (url.indexOf("?") < 0 ? "?" : "&") + ("access_token=" + encodeURIComponent(token));
            }
            var eventSource = new EventSource(url, { withCredentials: true });
            try {
                eventSource.onmessage = function (e) {
                    if (_this.onreceive) {
                        try {
                            _this.logger.log(ILogger_1.LogLevel.Trace, "(SSE transport) data received. " + getDataDetail(e.data) + ".");
                            _this.onreceive(e.data);
                        }
                        catch (error) {
                            if (_this.onclose) {
                                _this.onclose(error);
                            }
                            return;
                        }
                    }
                };
                eventSource.onerror = function (e) {
                    reject(new Error(e.message || "Error occurred"));
                    // don't report an error if the transport did not start successfully
                    if (_this.eventSource && _this.onclose) {
                        _this.onclose(new Error(e.message || "Error occurred"));
                    }
                };
                eventSource.onopen = function () {
                    _this.logger.log(ILogger_1.LogLevel.Information, "SSE connected to " + _this.url);
                    _this.eventSource = eventSource;
                    // SSE is a text protocol
                    resolve();
                };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    };
    ServerSentEventsTransport.prototype.send = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, send(this.logger, "SSE", this.httpClient, this.url, this.accessTokenFactory, data)];
            });
        });
    };
    ServerSentEventsTransport.prototype.stop = function () {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        return Promise.resolve();
    };
    return ServerSentEventsTransport;
}());
exports.ServerSentEventsTransport = ServerSentEventsTransport;
var LongPollingTransport = /** @class */ (function () {
    function LongPollingTransport(httpClient, accessTokenFactory, logger) {
        this.httpClient = httpClient;
        this.accessTokenFactory = accessTokenFactory || (function () { return null; });
        this.logger = logger;
        this.pollAbort = new AbortController_1.AbortController();
    }
    LongPollingTransport.prototype.connect = function (url, transferFormat, connection) {
        Utils_1.Arg.isRequired(url, "url");
        Utils_1.Arg.isRequired(transferFormat, "transferFormat");
        Utils_1.Arg.isIn(transferFormat, TransferFormat, "transferFormat");
        Utils_1.Arg.isRequired(connection, "connection");
        this.url = url;
        this.logger.log(ILogger_1.LogLevel.Trace, "(LongPolling transport) Connecting");
        // Set a flag indicating we have inherent keep-alive in this transport.
        connection.features.inherentKeepAlive = true;
        if (transferFormat === TransferFormat.Binary && (typeof new XMLHttpRequest().responseType !== "string")) {
            // This will work if we fix: https://github.com/aspnet/SignalR/issues/742
            throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
        }
        this.poll(this.url, transferFormat);
        return Promise.resolve();
    };
    LongPollingTransport.prototype.poll = function (url, transferFormat) {
        return __awaiter(this, void 0, void 0, function () {
            var pollOptions, token, pollUrl, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pollOptions = {
                            abortSignal: this.pollAbort.signal,
                            headers: {},
                            timeout: 90000,
                        };
                        if (transferFormat === TransferFormat.Binary) {
                            pollOptions.responseType = "arraybuffer";
                        }
                        token = this.accessTokenFactory();
                        if (token) {
                            // tslint:disable-next-line:no-string-literal
                            pollOptions.headers["Authorization"] = "Bearer " + token;
                        }
                        _a.label = 1;
                    case 1:
                        if (!!this.pollAbort.signal.aborted) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        pollUrl = url + "&_=" + Date.now();
                        this.logger.log(ILogger_1.LogLevel.Trace, "(LongPolling transport) polling: " + pollUrl);
                        return [4 /*yield*/, this.httpClient.get(pollUrl, pollOptions)];
                    case 3:
                        response = _a.sent();
                        if (response.statusCode === 204) {
                            this.logger.log(ILogger_1.LogLevel.Information, "(LongPolling transport) Poll terminated by server");
                            // Poll terminated by server
                            if (this.onclose) {
                                this.onclose();
                            }
                            this.pollAbort.abort();
                        }
                        else if (response.statusCode !== 200) {
                            this.logger.log(ILogger_1.LogLevel.Error, "(LongPolling transport) Unexpected response code: " + response.statusCode);
                            // Unexpected status code
                            if (this.onclose) {
                                this.onclose(new Errors_1.HttpError(response.statusText, response.statusCode));
                            }
                            this.pollAbort.abort();
                        }
                        else {
                            // Process the response
                            if (response.content) {
                                this.logger.log(ILogger_1.LogLevel.Trace, "(LongPolling transport) data received. " + getDataDetail(response.content) + ".");
                                if (this.onreceive) {
                                    this.onreceive(response.content);
                                }
                            }
                            else {
                                // This is another way timeout manifest.
                                this.logger.log(ILogger_1.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                            }
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        if (e_1 instanceof Errors_1.TimeoutError) {
                            // Ignore timeouts and reissue the poll.
                            this.logger.log(ILogger_1.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                        }
                        else {
                            // Close the connection with the error as the result.
                            if (this.onclose) {
                                this.onclose(e_1);
                            }
                            this.pollAbort.abort();
                        }
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    LongPollingTransport.prototype.send = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, send(this.logger, "LongPolling", this.httpClient, this.url, this.accessTokenFactory, data)];
            });
        });
    };
    LongPollingTransport.prototype.stop = function () {
        this.pollAbort.abort();
        return Promise.resolve();
    };
    return LongPollingTransport;
}());
exports.LongPollingTransport = LongPollingTransport;
function getDataDetail(data) {
    var length = null;
    if (data instanceof ArrayBuffer) {
        length = "Binary data of length " + data.byteLength;
    }
    else if (typeof data === "string") {
        length = "String data of length " + data.length;
    }
    return length;
}
function send(logger, transportName, httpClient, url, accessTokenFactory, content) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, token, response, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    token = accessTokenFactory();
                    if (token) {
                        headers = (_a = {},
                            _a["Authorization"] = "Bearer " + accessTokenFactory(),
                            _a);
                    }
                    logger.log(ILogger_1.LogLevel.Trace, "(" + transportName + " transport) sending data. " + getDataDetail(content) + ".");
                    return [4 /*yield*/, httpClient.post(url, {
                            content: content,
                            headers: headers,
                        })];
                case 1:
                    response = _b.sent();
                    logger.log(ILogger_1.LogLevel.Trace, "(" + transportName + " transport) request complete. Response status: " + response.statusCode + ".");
                    return [2 /*return*/];
            }
        });
    });
}

},{"./AbortController":1,"./Errors":2,"./ILogger":7,"./Utils":13}],13:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var Arg = /** @class */ (function () {
    function Arg() {
    }
    Arg.isRequired = function (val, name) {
        if (val === null || val === undefined) {
            throw new Error("The '" + name + "' argument is required.");
        }
    };
    Arg.isIn = function (val, values, name) {
        // TypeScript enums have keys for **both** the name and the value of each enum member on the type itself.
        if (!(val in values)) {
            throw new Error("Unknown " + name + " value: " + val + ".");
        }
    };
    return Arg;
}());
exports.Arg = Arg;

},{}],14:[function(require,module,exports){
"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./Errors"));
__export(require("./HttpClient"));
__export(require("./HttpConnection"));
__export(require("./HubConnection"));
__export(require("./IHubProtocol"));
__export(require("./ILogger"));
__export(require("./Loggers"));
__export(require("./Transports"));
__export(require("./Observable"));

},{"./Errors":2,"./HttpClient":3,"./HttpConnection":4,"./HubConnection":5,"./IHubProtocol":6,"./ILogger":7,"./Loggers":9,"./Observable":10,"./Transports":12}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./models.ts" />
var signalR = require("@aspnet/signalr");
$(document).ready(function () {
    var canvasId = '@canvasId', drawing = false, joinedCanvas = false, _artistId, _artists = [], $canvas = $('#canvas')[0], ctx = $canvas.getContext("2d"), $joinCanvasId = $('#joinCanvasId'), $startModal = $('#startModal'), connection = new signalR.HubConnection(new signalR.HttpConnection('/hubs/drawing', { transport: signalR.TransportType.WebSockets }));
    ctx.canvas.width = document.body.clientWidth;
    ctx.canvas.height = document.body.clientHeight;
    connection.start();
    $startModal.modal('show');
    $startModal.on('hidden.bs.modal', function () {
        joinCanvas($('#shareCanvasId').text());
    });
    $('#btnJoin').click(function () {
        joinCanvas($joinCanvasId.val());
        $startModal.modal('hide');
    });
    var prevPoint;
    connection.on("NewPoint", function (point) {
        if (_artists[point.artistid].PreviousPoint != null)
            return draw(point);
        if (point.x != null) {
            _artists[point.artistid].PreviousPoint = point;
        }
        else {
            _artists[point.artistid].PreviousPoint = null;
        }
    });
    connection.on("NewArtist", function (artists) {
        console.log(artists);
        _artists = artists;
    });
    connection.on("ClearPoint", function (artistId) {
        _artists[artistId].PreviousPoint = null;
    });
    connection.on("JoinedCanvas", function (artistId, artists) {
        _artistId = artistId;
        _artists = artists;
        joinedCanvas = true;
    });
    function joinCanvas(id) {
        if (joinedCanvas)
            return; //Already joined a canvas, so leave
        connection.invoke('JoinCanvas', id);
        canvasId = id;
    }
    function draw(point) {
        var artist = _artists[point.artistid];
        ctx.beginPath();
        ctx.moveTo(artist.PreviousPoint.x, artist.PreviousPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = artist.rgb;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        _artists[point.artistid].PreviousPoint = point;
    }
    function newPoint(e) {
        if (e.touches)
            e = e.touches[0];
        if (!joinedCanvas || !drawing)
            return;
        connection.invoke('Draw', e.clientX - $canvas.offsetLeft, e.clientY - $canvas.offsetTop, canvasId, _artistId);
    }
    function toggleDrawing(shouldDraw) {
        drawing = shouldDraw;
        if (!shouldDraw)
            connection.invoke('ClearPoint', canvasId, _artistId);
        ;
    }
    $canvas.addEventListener("mousemove", newPoint.bind(null), false);
    $canvas.addEventListener("mousedown", toggleDrawing.bind(null, true), false);
    $canvas.addEventListener("mouseup", toggleDrawing.bind(null, false), false);
    $canvas.addEventListener("touchstart", toggleDrawing.bind(null, true), false);
    $canvas.addEventListener("touchend", toggleDrawing.bind(null, false), false);
    $canvas.addEventListener("touchmove", newPoint.bind(null), false);
});

},{"@aspnet/signalr":14}]},{},[15]);
