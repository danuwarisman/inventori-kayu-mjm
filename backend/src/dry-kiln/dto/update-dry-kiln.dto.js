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
exports.UpdateDryKilnDto = void 0;
var class_validator_1 = require("class-validator");
var UpdateDryKilnDto = function () {
    var _a;
    var _id_log_decorators;
    var _id_log_initializers = [];
    var _id_log_extraInitializers = [];
    var _id_plank_decorators;
    var _id_plank_initializers = [];
    var _id_plank_extraInitializers = [];
    var _sortimen_decorators;
    var _sortimen_initializers = [];
    var _sortimen_extraInitializers = [];
    var _grade_decorators;
    var _grade_initializers = [];
    var _grade_extraInitializers = [];
    var _panjang_decorators;
    var _panjang_initializers = [];
    var _panjang_extraInitializers = [];
    var _lebar_decorators;
    var _lebar_initializers = [];
    var _lebar_extraInitializers = [];
    var _tinggi_decorators;
    var _tinggi_initializers = [];
    var _tinggi_extraInitializers = [];
    var _volume_decorators;
    var _volume_initializers = [];
    var _volume_extraInitializers = [];
    var _stage_decorators;
    var _stage_initializers = [];
    var _stage_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateDryKilnDto() {
                this.id_log = __runInitializers(this, _id_log_initializers, void 0);
                this.id_plank = (__runInitializers(this, _id_log_extraInitializers), __runInitializers(this, _id_plank_initializers, void 0));
                this.sortimen = (__runInitializers(this, _id_plank_extraInitializers), __runInitializers(this, _sortimen_initializers, void 0));
                this.grade = (__runInitializers(this, _sortimen_extraInitializers), __runInitializers(this, _grade_initializers, void 0));
                this.panjang = (__runInitializers(this, _grade_extraInitializers), __runInitializers(this, _panjang_initializers, void 0));
                this.lebar = (__runInitializers(this, _panjang_extraInitializers), __runInitializers(this, _lebar_initializers, void 0));
                this.tinggi = (__runInitializers(this, _lebar_extraInitializers), __runInitializers(this, _tinggi_initializers, void 0));
                this.volume = (__runInitializers(this, _tinggi_extraInitializers), __runInitializers(this, _volume_initializers, void 0));
                this.stage = (__runInitializers(this, _volume_extraInitializers), __runInitializers(this, _stage_initializers, void 0));
                this.date = (__runInitializers(this, _stage_extraInitializers), __runInitializers(this, _date_initializers, void 0));
                __runInitializers(this, _date_extraInitializers);
            }
            return UpdateDryKilnDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_log_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _id_plank_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _sortimen_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _grade_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _panjang_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _lebar_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _tinggi_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _volume_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _stage_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _date_decorators = [(0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _id_log_decorators, { kind: "field", name: "id_log", static: false, private: false, access: { has: function (obj) { return "id_log" in obj; }, get: function (obj) { return obj.id_log; }, set: function (obj, value) { obj.id_log = value; } }, metadata: _metadata }, _id_log_initializers, _id_log_extraInitializers);
            __esDecorate(null, null, _id_plank_decorators, { kind: "field", name: "id_plank", static: false, private: false, access: { has: function (obj) { return "id_plank" in obj; }, get: function (obj) { return obj.id_plank; }, set: function (obj, value) { obj.id_plank = value; } }, metadata: _metadata }, _id_plank_initializers, _id_plank_extraInitializers);
            __esDecorate(null, null, _sortimen_decorators, { kind: "field", name: "sortimen", static: false, private: false, access: { has: function (obj) { return "sortimen" in obj; }, get: function (obj) { return obj.sortimen; }, set: function (obj, value) { obj.sortimen = value; } }, metadata: _metadata }, _sortimen_initializers, _sortimen_extraInitializers);
            __esDecorate(null, null, _grade_decorators, { kind: "field", name: "grade", static: false, private: false, access: { has: function (obj) { return "grade" in obj; }, get: function (obj) { return obj.grade; }, set: function (obj, value) { obj.grade = value; } }, metadata: _metadata }, _grade_initializers, _grade_extraInitializers);
            __esDecorate(null, null, _panjang_decorators, { kind: "field", name: "panjang", static: false, private: false, access: { has: function (obj) { return "panjang" in obj; }, get: function (obj) { return obj.panjang; }, set: function (obj, value) { obj.panjang = value; } }, metadata: _metadata }, _panjang_initializers, _panjang_extraInitializers);
            __esDecorate(null, null, _lebar_decorators, { kind: "field", name: "lebar", static: false, private: false, access: { has: function (obj) { return "lebar" in obj; }, get: function (obj) { return obj.lebar; }, set: function (obj, value) { obj.lebar = value; } }, metadata: _metadata }, _lebar_initializers, _lebar_extraInitializers);
            __esDecorate(null, null, _tinggi_decorators, { kind: "field", name: "tinggi", static: false, private: false, access: { has: function (obj) { return "tinggi" in obj; }, get: function (obj) { return obj.tinggi; }, set: function (obj, value) { obj.tinggi = value; } }, metadata: _metadata }, _tinggi_initializers, _tinggi_extraInitializers);
            __esDecorate(null, null, _volume_decorators, { kind: "field", name: "volume", static: false, private: false, access: { has: function (obj) { return "volume" in obj; }, get: function (obj) { return obj.volume; }, set: function (obj, value) { obj.volume = value; } }, metadata: _metadata }, _volume_initializers, _volume_extraInitializers);
            __esDecorate(null, null, _stage_decorators, { kind: "field", name: "stage", static: false, private: false, access: { has: function (obj) { return "stage" in obj; }, get: function (obj) { return obj.stage; }, set: function (obj, value) { obj.stage = value; } }, metadata: _metadata }, _stage_initializers, _stage_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateDryKilnDto = UpdateDryKilnDto;
