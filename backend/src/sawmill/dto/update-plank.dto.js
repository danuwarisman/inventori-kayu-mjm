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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlankDto = void 0;
var class_validator_1 = require("class-validator");
var UpdatePlankDto = function () {
    var _a;
    var _kodePlank_decorators;
    var _kodePlank_initializers = [];
    var _kodePlank_extraInitializers = [];
    var _gradePapan_decorators;
    var _gradePapan_initializers = [];
    var _gradePapan_extraInitializers = [];
    var _tinggi_decorators;
    var _tinggi_initializers = [];
    var _tinggi_extraInitializers = [];
    var _lebar_decorators;
    var _lebar_initializers = [];
    var _lebar_extraInitializers = [];
    var _panjang_decorators;
    var _panjang_initializers = [];
    var _panjang_extraInitializers = [];
    var _volumePlank_decorators;
    var _volumePlank_initializers = [];
    var _volumePlank_extraInitializers = [];
    var _stage_decorators;
    var _stage_initializers = [];
    var _stage_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdatePlankDto() {
                this.kodePlank = __runInitializers(this, _kodePlank_initializers, void 0);
                this.gradePapan = (__runInitializers(this, _kodePlank_extraInitializers), __runInitializers(this, _gradePapan_initializers, void 0));
                this.tinggi = (__runInitializers(this, _gradePapan_extraInitializers), __runInitializers(this, _tinggi_initializers, void 0));
                this.lebar = (__runInitializers(this, _tinggi_extraInitializers), __runInitializers(this, _lebar_initializers, void 0));
                this.panjang = (__runInitializers(this, _lebar_extraInitializers), __runInitializers(this, _panjang_initializers, void 0));
                this.volumePlank = (__runInitializers(this, _panjang_extraInitializers), __runInitializers(this, _volumePlank_initializers, void 0));
                this.stage = (__runInitializers(this, _volumePlank_extraInitializers), __runInitializers(this, _stage_initializers, void 0));
                __runInitializers(this, _stage_extraInitializers);
            }
            return UpdatePlankDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _kodePlank_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _gradePapan_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _tinggi_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _lebar_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _panjang_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _volumePlank_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _stage_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _kodePlank_decorators, { kind: "field", name: "kodePlank", static: false, private: false, access: { has: function (obj) { return "kodePlank" in obj; }, get: function (obj) { return obj.kodePlank; }, set: function (obj, value) { obj.kodePlank = value; } }, metadata: _metadata }, _kodePlank_initializers, _kodePlank_extraInitializers);
            __esDecorate(null, null, _gradePapan_decorators, { kind: "field", name: "gradePapan", static: false, private: false, access: { has: function (obj) { return "gradePapan" in obj; }, get: function (obj) { return obj.gradePapan; }, set: function (obj, value) { obj.gradePapan = value; } }, metadata: _metadata }, _gradePapan_initializers, _gradePapan_extraInitializers);
            __esDecorate(null, null, _tinggi_decorators, { kind: "field", name: "tinggi", static: false, private: false, access: { has: function (obj) { return "tinggi" in obj; }, get: function (obj) { return obj.tinggi; }, set: function (obj, value) { obj.tinggi = value; } }, metadata: _metadata }, _tinggi_initializers, _tinggi_extraInitializers);
            __esDecorate(null, null, _lebar_decorators, { kind: "field", name: "lebar", static: false, private: false, access: { has: function (obj) { return "lebar" in obj; }, get: function (obj) { return obj.lebar; }, set: function (obj, value) { obj.lebar = value; } }, metadata: _metadata }, _lebar_initializers, _lebar_extraInitializers);
            __esDecorate(null, null, _panjang_decorators, { kind: "field", name: "panjang", static: false, private: false, access: { has: function (obj) { return "panjang" in obj; }, get: function (obj) { return obj.panjang; }, set: function (obj, value) { obj.panjang = value; } }, metadata: _metadata }, _panjang_initializers, _panjang_extraInitializers);
            __esDecorate(null, null, _volumePlank_decorators, { kind: "field", name: "volumePlank", static: false, private: false, access: { has: function (obj) { return "volumePlank" in obj; }, get: function (obj) { return obj.volumePlank; }, set: function (obj, value) { obj.volumePlank = value; } }, metadata: _metadata }, _volumePlank_initializers, _volumePlank_extraInitializers);
            __esDecorate(null, null, _stage_decorators, { kind: "field", name: "stage", static: false, private: false, access: { has: function (obj) { return "stage" in obj; }, get: function (obj) { return obj.stage; }, set: function (obj, value) { obj.stage = value; } }, metadata: _metadata }, _stage_initializers, _stage_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdatePlankDto = UpdatePlankDto;
