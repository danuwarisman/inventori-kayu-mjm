"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SawmillController = void 0;
var common_1 = require("@nestjs/common");
var SawmillController = function () {
    var _classDecorators = [(0, common_1.Controller)('sawmill')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _findAllPlanks_decorators;
    var _findOne_decorators;
    var _create_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _addPlank_decorators;
    var _updatePlank_decorators;
    var _removePlank_decorators;
    var SawmillController = _classThis = /** @class */ (function () {
        function SawmillController_1(sawmillService) {
            this.sawmillService = (__runInitializers(this, _instanceExtraInitializers), sawmillService);
        }
        SawmillController_1.prototype.findAll = function (sortimen, stage) {
            return this.sawmillService.findAll(sortimen, stage);
        };
        SawmillController_1.prototype.findAllPlanks = function () {
            return this.sawmillService.findAllPlanks();
        };
        SawmillController_1.prototype.findOne = function (id) {
            return this.sawmillService.findOne(id);
        };
        SawmillController_1.prototype.create = function (dto) {
            return this.sawmillService.create(dto);
        };
        SawmillController_1.prototype.update = function (id, dto) {
            return this.sawmillService.update(id, dto);
        };
        SawmillController_1.prototype.remove = function (id) {
            return this.sawmillService.remove(id);
        };
        SawmillController_1.prototype.addPlank = function (id, dto) {
            return this.sawmillService.addPlank(id, dto);
        };
        SawmillController_1.prototype.updatePlank = function (idPlank, dto) {
            return this.sawmillService.updatePlank(idPlank, dto);
        };
        SawmillController_1.prototype.removePlank = function (idPlank) {
            return this.sawmillService.removePlank(idPlank);
        };
        return SawmillController_1;
    }());
    __setFunctionName(_classThis, "SawmillController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, common_1.Get)()];
        _findAllPlanks_decorators = [(0, common_1.Get)('planks')];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _create_decorators = [(0, common_1.Post)()];
        _update_decorators = [(0, common_1.Patch)(':id')];
        _remove_decorators = [(0, common_1.Delete)(':id')];
        _addPlank_decorators = [(0, common_1.Post)(':id/plank')];
        _updatePlank_decorators = [(0, common_1.Patch)('plank/:idPlank')];
        _removePlank_decorators = [(0, common_1.Delete)('plank/:idPlank')];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllPlanks_decorators, { kind: "method", name: "findAllPlanks", static: false, private: false, access: { has: function (obj) { return "findAllPlanks" in obj; }, get: function (obj) { return obj.findAllPlanks; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addPlank_decorators, { kind: "method", name: "addPlank", static: false, private: false, access: { has: function (obj) { return "addPlank" in obj; }, get: function (obj) { return obj.addPlank; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updatePlank_decorators, { kind: "method", name: "updatePlank", static: false, private: false, access: { has: function (obj) { return "updatePlank" in obj; }, get: function (obj) { return obj.updatePlank; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removePlank_decorators, { kind: "method", name: "removePlank", static: false, private: false, access: { has: function (obj) { return "removePlank" in obj; }, get: function (obj) { return obj.removePlank; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SawmillController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SawmillController = _classThis;
}();
exports.SawmillController = SawmillController;
