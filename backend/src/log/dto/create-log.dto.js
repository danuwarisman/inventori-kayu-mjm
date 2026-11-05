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
exports.CreateLogDto = void 0;
var class_validator_1 = require("class-validator");
var CreateLogDto = function () {
    var _a;
    var _kodeLog_decorators;
    var _kodeLog_initializers = [];
    var _kodeLog_extraInitializers = [];
    var _id_log_decorators;
    var _id_log_initializers = [];
    var _id_log_extraInitializers = [];
    var _asalSortimen_decorators;
    var _asalSortimen_initializers = [];
    var _asalSortimen_extraInitializers = [];
    var _panjang_decorators;
    var _panjang_initializers = [];
    var _panjang_extraInitializers = [];
    var _diameter_decorators;
    var _diameter_initializers = [];
    var _diameter_extraInitializers = [];
    var _volumeLog_decorators;
    var _volumeLog_initializers = [];
    var _volumeLog_extraInitializers = [];
    var _statusLog_decorators;
    var _statusLog_initializers = [];
    var _statusLog_extraInitializers = [];
    var _stage_decorators;
    var _stage_initializers = [];
    var _stage_extraInitializers = [];
    var _suplier_decorators;
    var _suplier_initializers = [];
    var _suplier_extraInitializers = [];
    var _harga_decorators;
    var _harga_initializers = [];
    var _harga_extraInitializers = [];
    var _tanggalMasuk_decorators;
    var _tanggalMasuk_initializers = [];
    var _tanggalMasuk_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateLogDto() {
                this.kodeLog = __runInitializers(this, _kodeLog_initializers, void 0);
                this.id_log = (__runInitializers(this, _kodeLog_extraInitializers), __runInitializers(this, _id_log_initializers, void 0));
                this.asalSortimen = (__runInitializers(this, _id_log_extraInitializers), __runInitializers(this, _asalSortimen_initializers, void 0));
                this.panjang = (__runInitializers(this, _asalSortimen_extraInitializers), __runInitializers(this, _panjang_initializers, void 0));
                this.diameter = (__runInitializers(this, _panjang_extraInitializers), __runInitializers(this, _diameter_initializers, void 0));
                this.volumeLog = (__runInitializers(this, _diameter_extraInitializers), __runInitializers(this, _volumeLog_initializers, void 0));
                this.statusLog = (__runInitializers(this, _volumeLog_extraInitializers), __runInitializers(this, _statusLog_initializers, void 0));
                this.stage = (__runInitializers(this, _statusLog_extraInitializers), __runInitializers(this, _stage_initializers, void 0));
                this.suplier = (__runInitializers(this, _stage_extraInitializers), __runInitializers(this, _suplier_initializers, void 0));
                this.harga = (__runInitializers(this, _suplier_extraInitializers), __runInitializers(this, _harga_initializers, void 0));
                this.tanggalMasuk = (__runInitializers(this, _harga_extraInitializers), __runInitializers(this, _tanggalMasuk_initializers, void 0));
                __runInitializers(this, _tanggalMasuk_extraInitializers);
            }
            return CreateLogDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _kodeLog_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _id_log_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _asalSortimen_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _panjang_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _diameter_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _volumeLog_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _statusLog_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _stage_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _suplier_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _harga_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _tanggalMasuk_decorators = [(0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _kodeLog_decorators, { kind: "field", name: "kodeLog", static: false, private: false, access: { has: function (obj) { return "kodeLog" in obj; }, get: function (obj) { return obj.kodeLog; }, set: function (obj, value) { obj.kodeLog = value; } }, metadata: _metadata }, _kodeLog_initializers, _kodeLog_extraInitializers);
            __esDecorate(null, null, _id_log_decorators, { kind: "field", name: "id_log", static: false, private: false, access: { has: function (obj) { return "id_log" in obj; }, get: function (obj) { return obj.id_log; }, set: function (obj, value) { obj.id_log = value; } }, metadata: _metadata }, _id_log_initializers, _id_log_extraInitializers);
            __esDecorate(null, null, _asalSortimen_decorators, { kind: "field", name: "asalSortimen", static: false, private: false, access: { has: function (obj) { return "asalSortimen" in obj; }, get: function (obj) { return obj.asalSortimen; }, set: function (obj, value) { obj.asalSortimen = value; } }, metadata: _metadata }, _asalSortimen_initializers, _asalSortimen_extraInitializers);
            __esDecorate(null, null, _panjang_decorators, { kind: "field", name: "panjang", static: false, private: false, access: { has: function (obj) { return "panjang" in obj; }, get: function (obj) { return obj.panjang; }, set: function (obj, value) { obj.panjang = value; } }, metadata: _metadata }, _panjang_initializers, _panjang_extraInitializers);
            __esDecorate(null, null, _diameter_decorators, { kind: "field", name: "diameter", static: false, private: false, access: { has: function (obj) { return "diameter" in obj; }, get: function (obj) { return obj.diameter; }, set: function (obj, value) { obj.diameter = value; } }, metadata: _metadata }, _diameter_initializers, _diameter_extraInitializers);
            __esDecorate(null, null, _volumeLog_decorators, { kind: "field", name: "volumeLog", static: false, private: false, access: { has: function (obj) { return "volumeLog" in obj; }, get: function (obj) { return obj.volumeLog; }, set: function (obj, value) { obj.volumeLog = value; } }, metadata: _metadata }, _volumeLog_initializers, _volumeLog_extraInitializers);
            __esDecorate(null, null, _statusLog_decorators, { kind: "field", name: "statusLog", static: false, private: false, access: { has: function (obj) { return "statusLog" in obj; }, get: function (obj) { return obj.statusLog; }, set: function (obj, value) { obj.statusLog = value; } }, metadata: _metadata }, _statusLog_initializers, _statusLog_extraInitializers);
            __esDecorate(null, null, _stage_decorators, { kind: "field", name: "stage", static: false, private: false, access: { has: function (obj) { return "stage" in obj; }, get: function (obj) { return obj.stage; }, set: function (obj, value) { obj.stage = value; } }, metadata: _metadata }, _stage_initializers, _stage_extraInitializers);
            __esDecorate(null, null, _suplier_decorators, { kind: "field", name: "suplier", static: false, private: false, access: { has: function (obj) { return "suplier" in obj; }, get: function (obj) { return obj.suplier; }, set: function (obj, value) { obj.suplier = value; } }, metadata: _metadata }, _suplier_initializers, _suplier_extraInitializers);
            __esDecorate(null, null, _harga_decorators, { kind: "field", name: "harga", static: false, private: false, access: { has: function (obj) { return "harga" in obj; }, get: function (obj) { return obj.harga; }, set: function (obj, value) { obj.harga = value; } }, metadata: _metadata }, _harga_initializers, _harga_extraInitializers);
            __esDecorate(null, null, _tanggalMasuk_decorators, { kind: "field", name: "tanggalMasuk", static: false, private: false, access: { has: function (obj) { return "tanggalMasuk" in obj; }, get: function (obj) { return obj.tanggalMasuk; }, set: function (obj, value) { obj.tanggalMasuk = value; } }, metadata: _metadata }, _tanggalMasuk_initializers, _tanggalMasuk_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateLogDto = CreateLogDto;
