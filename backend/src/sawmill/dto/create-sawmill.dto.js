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
exports.CreateSawmillDto = void 0;
var class_validator_1 = require("class-validator");
var CreateSawmillDto = function () {
    var _a;
    var _kodeSawmill_decorators;
    var _kodeSawmill_initializers = [];
    var _kodeSawmill_extraInitializers = [];
    var _idLog_decorators;
    var _idLog_initializers = [];
    var _idLog_extraInitializers = [];
    var _id_log_asal_decorators;
    var _id_log_asal_initializers = [];
    var _id_log_asal_extraInitializers = [];
    var _sortimen_decorators;
    var _sortimen_initializers = [];
    var _sortimen_extraInitializers = [];
    var _panjang_decorators;
    var _panjang_initializers = [];
    var _panjang_extraInitializers = [];
    var _diameter_decorators;
    var _diameter_initializers = [];
    var _diameter_extraInitializers = [];
    var _volume_total_decorators;
    var _volume_total_initializers = [];
    var _volume_total_extraInitializers = [];
    var _stage_decorators;
    var _stage_initializers = [];
    var _stage_extraInitializers = [];
    var _suplier_decorators;
    var _suplier_initializers = [];
    var _suplier_extraInitializers = [];
    var _harga_decorators;
    var _harga_initializers = [];
    var _harga_extraInitializers = [];
    var _tanggal_decorators;
    var _tanggal_initializers = [];
    var _tanggal_extraInitializers = [];
    var _planks_decorators;
    var _planks_initializers = [];
    var _planks_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateSawmillDto() {
                this.kodeSawmill = __runInitializers(this, _kodeSawmill_initializers, void 0);
                this.idLog = (__runInitializers(this, _kodeSawmill_extraInitializers), __runInitializers(this, _idLog_initializers, void 0));
                this.id_log_asal = (__runInitializers(this, _idLog_extraInitializers), __runInitializers(this, _id_log_asal_initializers, void 0));
                this.sortimen = (__runInitializers(this, _id_log_asal_extraInitializers), __runInitializers(this, _sortimen_initializers, void 0));
                this.panjang = (__runInitializers(this, _sortimen_extraInitializers), __runInitializers(this, _panjang_initializers, void 0));
                this.diameter = (__runInitializers(this, _panjang_extraInitializers), __runInitializers(this, _diameter_initializers, void 0));
                this.volume_total = (__runInitializers(this, _diameter_extraInitializers), __runInitializers(this, _volume_total_initializers, void 0));
                this.stage = (__runInitializers(this, _volume_total_extraInitializers), __runInitializers(this, _stage_initializers, void 0));
                this.suplier = (__runInitializers(this, _stage_extraInitializers), __runInitializers(this, _suplier_initializers, void 0));
                this.harga = (__runInitializers(this, _suplier_extraInitializers), __runInitializers(this, _harga_initializers, void 0));
                this.tanggal = (__runInitializers(this, _harga_extraInitializers), __runInitializers(this, _tanggal_initializers, void 0));
                this.planks = (__runInitializers(this, _tanggal_extraInitializers), __runInitializers(this, _planks_initializers, void 0));
                __runInitializers(this, _planks_extraInitializers);
            }
            return CreateSawmillDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _kodeSawmill_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _idLog_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _id_log_asal_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _sortimen_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _panjang_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _diameter_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _volume_total_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _stage_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _suplier_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _harga_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _tanggal_decorators = [(0, class_validator_1.IsOptional)()];
            _planks_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _kodeSawmill_decorators, { kind: "field", name: "kodeSawmill", static: false, private: false, access: { has: function (obj) { return "kodeSawmill" in obj; }, get: function (obj) { return obj.kodeSawmill; }, set: function (obj, value) { obj.kodeSawmill = value; } }, metadata: _metadata }, _kodeSawmill_initializers, _kodeSawmill_extraInitializers);
            __esDecorate(null, null, _idLog_decorators, { kind: "field", name: "idLog", static: false, private: false, access: { has: function (obj) { return "idLog" in obj; }, get: function (obj) { return obj.idLog; }, set: function (obj, value) { obj.idLog = value; } }, metadata: _metadata }, _idLog_initializers, _idLog_extraInitializers);
            __esDecorate(null, null, _id_log_asal_decorators, { kind: "field", name: "id_log_asal", static: false, private: false, access: { has: function (obj) { return "id_log_asal" in obj; }, get: function (obj) { return obj.id_log_asal; }, set: function (obj, value) { obj.id_log_asal = value; } }, metadata: _metadata }, _id_log_asal_initializers, _id_log_asal_extraInitializers);
            __esDecorate(null, null, _sortimen_decorators, { kind: "field", name: "sortimen", static: false, private: false, access: { has: function (obj) { return "sortimen" in obj; }, get: function (obj) { return obj.sortimen; }, set: function (obj, value) { obj.sortimen = value; } }, metadata: _metadata }, _sortimen_initializers, _sortimen_extraInitializers);
            __esDecorate(null, null, _panjang_decorators, { kind: "field", name: "panjang", static: false, private: false, access: { has: function (obj) { return "panjang" in obj; }, get: function (obj) { return obj.panjang; }, set: function (obj, value) { obj.panjang = value; } }, metadata: _metadata }, _panjang_initializers, _panjang_extraInitializers);
            __esDecorate(null, null, _diameter_decorators, { kind: "field", name: "diameter", static: false, private: false, access: { has: function (obj) { return "diameter" in obj; }, get: function (obj) { return obj.diameter; }, set: function (obj, value) { obj.diameter = value; } }, metadata: _metadata }, _diameter_initializers, _diameter_extraInitializers);
            __esDecorate(null, null, _volume_total_decorators, { kind: "field", name: "volume_total", static: false, private: false, access: { has: function (obj) { return "volume_total" in obj; }, get: function (obj) { return obj.volume_total; }, set: function (obj, value) { obj.volume_total = value; } }, metadata: _metadata }, _volume_total_initializers, _volume_total_extraInitializers);
            __esDecorate(null, null, _stage_decorators, { kind: "field", name: "stage", static: false, private: false, access: { has: function (obj) { return "stage" in obj; }, get: function (obj) { return obj.stage; }, set: function (obj, value) { obj.stage = value; } }, metadata: _metadata }, _stage_initializers, _stage_extraInitializers);
            __esDecorate(null, null, _suplier_decorators, { kind: "field", name: "suplier", static: false, private: false, access: { has: function (obj) { return "suplier" in obj; }, get: function (obj) { return obj.suplier; }, set: function (obj, value) { obj.suplier = value; } }, metadata: _metadata }, _suplier_initializers, _suplier_extraInitializers);
            __esDecorate(null, null, _harga_decorators, { kind: "field", name: "harga", static: false, private: false, access: { has: function (obj) { return "harga" in obj; }, get: function (obj) { return obj.harga; }, set: function (obj, value) { obj.harga = value; } }, metadata: _metadata }, _harga_initializers, _harga_extraInitializers);
            __esDecorate(null, null, _tanggal_decorators, { kind: "field", name: "tanggal", static: false, private: false, access: { has: function (obj) { return "tanggal" in obj; }, get: function (obj) { return obj.tanggal; }, set: function (obj, value) { obj.tanggal = value; } }, metadata: _metadata }, _tanggal_initializers, _tanggal_extraInitializers);
            __esDecorate(null, null, _planks_decorators, { kind: "field", name: "planks", static: false, private: false, access: { has: function (obj) { return "planks" in obj; }, get: function (obj) { return obj.planks; }, set: function (obj, value) { obj.planks = value; } }, metadata: _metadata }, _planks_initializers, _planks_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateSawmillDto = CreateSawmillDto;
