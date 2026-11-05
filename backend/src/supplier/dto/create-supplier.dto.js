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
exports.CreateSupplierDto = void 0;
var class_validator_1 = require("class-validator");
var CreateSupplierDto = function () {
    var _a;
    var _namaSupplier_decorators;
    var _namaSupplier_initializers = [];
    var _namaSupplier_extraInitializers = [];
    var _alamatSupplier_decorators;
    var _alamatSupplier_initializers = [];
    var _alamatSupplier_extraInitializers = [];
    var _kontakSupplier_decorators;
    var _kontakSupplier_initializers = [];
    var _kontakSupplier_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateSupplierDto() {
                this.namaSupplier = __runInitializers(this, _namaSupplier_initializers, void 0);
                this.alamatSupplier = (__runInitializers(this, _namaSupplier_extraInitializers), __runInitializers(this, _alamatSupplier_initializers, void 0));
                this.kontakSupplier = (__runInitializers(this, _alamatSupplier_extraInitializers), __runInitializers(this, _kontakSupplier_initializers, void 0));
                __runInitializers(this, _kontakSupplier_extraInitializers);
            }
            return CreateSupplierDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _namaSupplier_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(100)];
            _alamatSupplier_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _kontakSupplier_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(15)];
            __esDecorate(null, null, _namaSupplier_decorators, { kind: "field", name: "namaSupplier", static: false, private: false, access: { has: function (obj) { return "namaSupplier" in obj; }, get: function (obj) { return obj.namaSupplier; }, set: function (obj, value) { obj.namaSupplier = value; } }, metadata: _metadata }, _namaSupplier_initializers, _namaSupplier_extraInitializers);
            __esDecorate(null, null, _alamatSupplier_decorators, { kind: "field", name: "alamatSupplier", static: false, private: false, access: { has: function (obj) { return "alamatSupplier" in obj; }, get: function (obj) { return obj.alamatSupplier; }, set: function (obj, value) { obj.alamatSupplier = value; } }, metadata: _metadata }, _alamatSupplier_initializers, _alamatSupplier_extraInitializers);
            __esDecorate(null, null, _kontakSupplier_decorators, { kind: "field", name: "kontakSupplier", static: false, private: false, access: { has: function (obj) { return "kontakSupplier" in obj; }, get: function (obj) { return obj.kontakSupplier; }, set: function (obj, value) { obj.kontakSupplier = value; } }, metadata: _metadata }, _kontakSupplier_initializers, _kontakSupplier_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateSupplierDto = CreateSupplierDto;
