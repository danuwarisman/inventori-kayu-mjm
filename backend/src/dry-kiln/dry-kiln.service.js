"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DryKilnService = void 0;
var common_1 = require("@nestjs/common");
var DryKilnService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DryKilnService = _classThis = /** @class */ (function () {
        function DryKilnService_1(prisma) {
            this.prisma = prisma;
        }
        DryKilnService_1.prototype.mapDryKiln = function (item) {
            var p = item.panjang ? Number(item.panjang) : 0;
            var w = item.lebar ? Number(item.lebar) : 0;
            var t = item.tinggi ? Number(item.tinggi) : 0;
            var v = item.volume ? Number(item.volume) : 0;
            var kodeLog = item.kodeLog || 'L-0';
            var kodePlank = item.kodePlank || "P-".concat(item.idOven);
            return {
                idOven: item.idOven,
                id_log: kodeLog,
                id_plank: kodePlank,
                kodeOven: item.kodeOven,
                sortimen: item.sortimen || 'Sortimen A',
                panjang: p,
                lebar: w,
                tinggi: t,
                volume: v,
                grade: item.grade || 'Grade A',
                stage: item.stage || item.statusPengeringan || 'in-drykiln',
                statusPengeringan: item.statusPengeringan || item.stage || 'in-drykiln',
                date: item.tanggalMasuk
                    ? new Date(item.tanggalMasuk).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
                tanggalMasuk: item.tanggalMasuk,
                tanggalKeluar: item.tanggalKeluar,
            };
        };
        DryKilnService_1.prototype.findAll = function (sortimen, stage, date) {
            return __awaiter(this, void 0, void 0, function () {
                var where, items, mapped;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = {};
                            if (sortimen && sortimen !== 'All Sortimen') {
                                where.sortimen = sortimen;
                            }
                            if (stage) {
                                where.stage = stage;
                            }
                            return [4 /*yield*/, this.prisma.dryKiln.findMany({
                                    where: where,
                                    orderBy: { idOven: 'desc' },
                                })];
                        case 1:
                            items = _a.sent();
                            mapped = items.map(function (i) { return _this.mapDryKiln(i); });
                            if (date) {
                                return [2 /*return*/, mapped.filter(function (i) { return i.date === date; })];
                            }
                            return [2 /*return*/, mapped];
                    }
                });
            });
        };
        DryKilnService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var item;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.dryKiln.findUnique({
                                where: { idOven: id },
                            })];
                        case 1:
                            item = _a.sent();
                            if (!item) {
                                throw new common_1.NotFoundException("Dry Kiln entry #".concat(id, " tidak ditemukan"));
                            }
                            return [2 /*return*/, this.mapDryKiln(item)];
                    }
                });
            });
        };
        DryKilnService_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var p, w, t, v, stage, entryDate, created, code, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            p = Number(dto.panjang) || 0;
                            w = Number(dto.lebar) || 0;
                            t = Number(dto.tinggi) || 0;
                            v = dto.volume;
                            if (v === undefined || v === null) {
                                v = Number(((t * w * p) / 1000000).toFixed(3));
                            }
                            stage = dto.stage || 'in-drykiln';
                            entryDate = dto.date || dto.tanggalMasuk ? new Date(dto.date || dto.tanggalMasuk) : new Date();
                            return [4 /*yield*/, this.prisma.dryKiln.create({
                                    data: {
                                        kodeLog: dto.kodeLog || dto.id_log || 'L-0',
                                        kodePlank: dto.kodePlank || dto.id_plank || undefined,
                                        sortimen: dto.sortimen || 'Sortimen A',
                                        grade: dto.grade || 'Grade A',
                                        panjang: p,
                                        lebar: w,
                                        tinggi: t,
                                        volume: v,
                                        statusPengeringan: stage,
                                        stage: stage,
                                        tanggalMasuk: entryDate,
                                    },
                                })];
                        case 1:
                            created = _a.sent();
                            if (!!created.kodePlank) return [3 /*break*/, 3];
                            code = "P-".concat(new Date().getFullYear(), "-").concat(created.idOven);
                            return [4 /*yield*/, this.prisma.dryKiln.update({
                                    where: { idOven: created.idOven },
                                    data: { kodePlank: code },
                                })];
                        case 2:
                            updated = _a.sent();
                            return [2 /*return*/, this.mapDryKiln(updated)];
                        case 3: return [2 /*return*/, this.mapDryKiln(created)];
                    }
                });
            });
        };
        DryKilnService_1.prototype.update = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, p, w, t, v, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.dryKiln.findUnique({
                                where: { idOven: id },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Dry Kiln entry #".concat(id, " tidak ditemukan"));
                            }
                            p = dto.panjang !== undefined ? Number(dto.panjang) : Number(existing.panjang);
                            w = dto.lebar !== undefined ? Number(dto.lebar) : Number(existing.lebar);
                            t = dto.tinggi !== undefined ? Number(dto.tinggi) : Number(existing.tinggi);
                            v = dto.volume;
                            if (v === undefined && (dto.panjang !== undefined || dto.lebar !== undefined || dto.tinggi !== undefined)) {
                                v = Number(((t * w * p) / 1000000).toFixed(3));
                            }
                            return [4 /*yield*/, this.prisma.dryKiln.update({
                                    where: { idOven: id },
                                    data: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (dto.id_log ? { kodeLog: dto.id_log } : {})), (dto.id_plank ? { kodePlank: dto.id_plank } : {})), (dto.sortimen ? { sortimen: dto.sortimen } : {})), (dto.grade ? { grade: dto.grade } : {})), (dto.panjang !== undefined ? { panjang: p } : {})), (dto.lebar !== undefined ? { lebar: w } : {})), (dto.tinggi !== undefined ? { tinggi: t } : {})), (v !== undefined ? { volume: v } : {})), (dto.stage ? { stage: dto.stage, statusPengeringan: dto.stage } : {})), (dto.date ? { tanggalMasuk: new Date(dto.date) } : {})),
                                })];
                        case 2:
                            updated = _a.sent();
                            return [2 /*return*/, this.mapDryKiln(updated)];
                    }
                });
            });
        };
        DryKilnService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.dryKiln.delete({
                                where: { idOven: id },
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { success: true, message: "Dry Kiln #".concat(id, " berhasil dihapus") }];
                    }
                });
            });
        };
        return DryKilnService_1;
    }());
    __setFunctionName(_classThis, "DryKilnService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DryKilnService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DryKilnService = _classThis;
}();
exports.DryKilnService = DryKilnService;
