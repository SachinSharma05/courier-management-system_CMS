"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DtdcBulkAdapter = void 0;
const common_1 = require("@nestjs/common");
const node_fetch_1 = __importDefault(require("node-fetch"));
const fetch_cookie_1 = __importDefault(require("fetch-cookie"));
const tough_cookie_1 = require("tough-cookie");
const jar = new tough_cookie_1.CookieJar();
const cookieFetch = (0, fetch_cookie_1.default)(node_fetch_1.default, jar);
let DtdcBulkAdapter = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DtdcBulkAdapter = _classThis = class {
        constructor() {
            this.AUTH_URL = "https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCnTrk/getTrackDetails";
            this.PUBLIC_URL = "https://www.dtdc.com/wp-json/custom/v1/domestic/track-multi";
            this.TRACK_URL = "https://www.dtdc.com/wp-json/custom/v1/domestic/track";
        }
        /* ----------------------------------
           AUTH TRACK (BATCH)
        ---------------------------------- */
        async trackAuthBatch(params) {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 25000);
            console.log("token, customerCode", params.token, params.customerCode);
            const res = await (0, node_fetch_1.default)(this.AUTH_URL, {
                method: "POST",
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    "X-Access-Token": params.token,
                },
                body: JSON.stringify({
                    trkType: "cnno",
                    strcnno: params.awbs.join(","),
                    addtnlDtl: "Y",
                    customerCode: params.customerCode,
                }),
            });
            // DTDC AUTH returns 200 / 206 for batch
            if (![200, 206].includes(res.status)) {
                throw new Error(`DTDC AUTH failed: ${res.status}`);
            }
            // 🔴 READ BODY ONLY ONCE
            const text = await res.text();
            console.log("Auth API raw response:", text);
            if (!text) {
                throw new Error("DTDC AUTH empty response");
            }
            let json;
            try {
                json = JSON.parse(text);
            }
            catch (e) {
                throw new Error("DTDC AUTH invalid JSON");
            }
            return json;
        }
        /* ----------------------------------
           PUBLIC TRACK (BATCH)
        ---------------------------------- */
        async trackPublicBatch(awbs) {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 30000);
            const res = await cookieFetch(this.PUBLIC_URL, {
                method: "POST",
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
                    "Origin": "https://www.dtdc.com",
                    "Referer": "https://www.dtdc.com/track-shipment/",
                    "Accept-Encoding": "gzip, deflate, br",
                },
                body: JSON.stringify({
                    trackType: "cnno",
                    trackNos: awbs, // MUST be array
                }),
            });
            const text = await res.text();
            // DTDC sometimes returns HTML (WAF / captcha)
            if (!text || text.startsWith("<")) {
                return { headers: [] };
            }
            let json;
            try {
                json = JSON.parse(text);
            }
            catch {
                return { headers: [] };
            }
            // DTDC ALWAYS lies with HTTP 200
            if (!json || json.statusCode !== 200) {
                return { headers: [] };
            }
            // Normalize null → []
            if (!Array.isArray(json.headers)) {
                json.headers = [];
            }
            return json;
        }
        /* ----------------------------------
         PUBLIC TRACK (SINGLE AWB – TIMELINE)
        ---------------------------------- */
        async trackPublicSingle(awb) {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 25000);
            const res = await cookieFetch(this.TRACK_URL, {
                method: "POST",
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
                    "Origin": "https://www.dtdc.com",
                    "Referer": "https://www.dtdc.com/track-shipment/",
                },
                body: JSON.stringify({
                    trackType: "cnno",
                    trackNumber: awb, // 🔴 SINGLE ONLY
                }),
            });
            const text = await res.text();
            // WAF / captcha / invalid
            if (!text || text.startsWith("<")) {
                return null;
            }
            let json;
            try {
                json = JSON.parse(text);
            }
            catch {
                return null;
            }
            // Public single-track success contract
            if (json?.statusCode !== 200 || !json?.header) {
                return null;
            }
            return json;
        }
    };
    __setFunctionName(_classThis, "DtdcBulkAdapter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DtdcBulkAdapter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DtdcBulkAdapter = _classThis;
})();
exports.DtdcBulkAdapter = DtdcBulkAdapter;
