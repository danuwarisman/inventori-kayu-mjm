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
exports.SawmillService = void 0;
var common_1 = require("@nestjs/common");
var SawmillService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SawmillService = _classThis = /** @class */ (function () {
        function SawmillService_1(prisma) {
            this.prisma = prisma;
        }
        SawmillService_1.prototype.mapSawmill = function (item) {
            var log = item.stokLog;
            var kodeSawmill = item.kodeSawmill || "SWM-".concat(item.idSawmill);
            var kodeLog = (log === null || log === void 0 ? void 0 : log.kodeLog) || ((log === null || log === void 0 ? void 0 : log.idLog) ? "L-".concat(log.idLog) : 'L-0');
            var sortimen = (log === null || log === void 0 ? void 0 : log.asalSortimen) || 'Sortimen A';
            var mappedPlanks = (item.planks || []).map(function (p) { return ({
                idPlank: p.idPlank,
                id_plank: p.kodePlank || "P-".concat(p.idPlank),
                kodePlank: p.kodePlank || "P-".concat(p.idPlank),
                sortimen: sortimen,
                grade: p.gradePapan,
                gradePapan: p.gradePapan,
                tinggi: p.tinggi ? Number(p.tinggi) : 0,
                lebar: p.lebar ? Number(p.lebar) : 0,
                panjang: p.panjang ? Number(p.panjang) : 0,
                volume: p.volumePlank ? Number(p.volumePlank) : 0,
                volumePlank: p.volumePlank ? Number(p.volumePlank) : 0,
                stage: p.stage || 'Sawmill',
            }); });
            return {
                idSawmill: item.idSawmill,
                id_sawmill: kodeSawmill,
                kodeSawmill: kodeSawmill,
                idLog: item.idLog,
                id_log_asal: kodeLog,
                sortimen: sortimen,
                panjang: (log === null || log === void 0 ? void 0 : log.panjang) ? Number(log.panjang) : 0,
                diameter: (log === null || log === void 0 ? void 0 : log.diameter) ? Number(log.diameter) : 0,
                volume_total: (log === null || log === void 0 ? void 0 : log.volumeLog) ? Number(log.volumeLog) : 0,
                stage: item.statusSawmill,
                statusSawmill: item.statusSawmill,
                tanggal: item.tanggalProses
                    ? new Date(item.tanggalProses).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
                suplier: (log === null || log === void 0 ? void 0 : log.suplier) || 'PT. Suplier',
                harga: (log === null || log === void 0 ? void 0 : log.harga) ? Number(log.harga) : 0,
                planks: mappedPlanks,
            };
        };
        SawmillService_1.prototype.findAll = function (sortimen, stage) {
            return __awaiter(this, void 0, void 0, function () {
                var where, items;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = {};
                            if (stage && stage !== 'All Stage') {
                                where.statusSawmill = stage;
                            }
                            if (sortimen && sortimen !== 'All Sortimen') {
                                where.stokLog = { asalSortimen: sortimen };
                            }
                            return [4 /*yield*/, this.prisma.prosesSawmill.findMany({
                                    where: where,
                                    include: {
                                        stokLog: true,
                                        planks: {
                                            orderBy: { idPlank: 'asc' },
                                        },
                                    },
                                    orderBy: { idSawmill: 'desc' },
                                })];
                        case 1:
                            items = _a.sent();
                            return [2 /*return*/, items.map(function (i) { return _this.mapSawmill(i); })];
                    }
                });
            });
        };
        SawmillService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var item;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.prosesSawmill.findUnique({
                                where: { idSawmill: id },
                                include: {
                                    stokLog: true,
                                    planks: {
                                        orderBy: { idPlank: 'asc' },
                                    },
                                },
                            })];
                        case 1:
                            item = _a.sent();
                            if (!item) {
                                throw new common_1.NotFoundException("Sawmill #".concat(id, " tidak ditemukan"));
                            }
                            return [2 /*return*/, this.mapSawmill(item)];
                    }
                });
            });
        };
        SawmillService_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var logId, found, p, d, vol, rM, lM, newLog, status, sawmill, code, _i, _a, p, t, w, l, v;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            logId = dto.idLog;
                            if (!!logId) return [3 /*break*/, 4];
                            if (!dto.id_log_asal) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.stokLog.findFirst({
                                    where: { kodeLog: dto.id_log_asal },
                                })];
                        case 1:
                            found = _b.sent();
                            if (found) {
                                logId = found.idLog;
                            }
                            _b.label = 2;
                        case 2:
                            if (!!logId) return [3 /*break*/, 4];
                            p = Number(dto.panjang) || 200;
                            d = Number(dto.diameter) || 30;
                            vol = dto.volume_total;
                            if (!vol) {
                                rM = d / 200;
                                lM = p / 100;
                                vol = Number((Math.PI * Math.pow(rM, 2) * lM).toFixed(3));
                            }
                            return [4 /*yield*/, this.prisma.stokLog.create({
                                    data: {
                                        kodeLog: dto.id_log_asal || undefined,
                                        asalSortimen: dto.sortimen || 'Sortimen A',
                                        panjang: p,
                                        diameter: d,
                                        dimensiLog: "".concat(p, " x ").concat(d),
                                        volumeLog: vol,
                                        statusLog: 'Sawmill',
                                        suplier: dto.suplier || 'PT. Suplier',
                                        harga: dto.harga ? Number(dto.harga) : 0,
                                    },
                                })];
                        case 3:
                            newLog = _b.sent();
                            logId = newLog.idLog;
                            _b.label = 4;
                        case 4:
                            status = dto.stage || 'Sawmill';
                            return [4 /*yield*/, this.prisma.prosesSawmill.create({
                                    data: {
                                        idLog: logId,
                                        kodeSawmill: dto.kodeSawmill || undefined,
                                        statusSawmill: status,
                                        tanggalProses: dto.tanggal ? new Date(dto.tanggal) : new Date(),
                                    },
                                    include: {
                                        stokLog: true,
                                        planks: true,
                                    },
                                })];
                        case 5:
                            sawmill = _b.sent();
                            if (!!sawmill.kodeSawmill) return [3 /*break*/, 7];
                            code = "SWM-".concat(new Date().getFullYear(), "-").concat(sawmill.idSawmill);
                            return [4 /*yield*/, this.prisma.prosesSawmill.update({
                                    where: { idSawmill: sawmill.idSawmill },
                                    data: { kodeSawmill: code },
                                })];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7:
                            if (!(dto.planks && Array.isArray(dto.planks) && dto.planks.length > 0)) return [3 /*break*/, 11];
                            _i = 0, _a = dto.planks;
                            _b.label = 8;
                        case 8:
                            if (!(_i < _a.length)) return [3 /*break*/, 11];
                            p = _a[_i];
                            t = Number(p.tinggi) || 0;
                            w = Number(p.lebar) || 0;
                            l = Number(p.panjang) || 0;
                            v = Number(p.volume);
                            if (!v && t && w && l) {
                                v = Number(((t * w * l) / 1000000).toFixed(3));
                            }
                            return [4 /*yield*/, this.prisma.plank.create({
                                    data: {
                                        idSawmill: sawmill.idSawmill,
                                        idLogAsal: logId,
                                        kodePlank: p.id_plank || undefined,
                                        gradePapan: p.grade || p.gradePapan || 'Grade A',
                                        dimensiPlank: "".concat(t, " x ").concat(w, " x ").concat(l),
                                        tinggi: t,
                                        lebar: w,
                                        panjang: l,
                                        volumePlank: v || 0,
                                        stage: 'Sawmill',
                                    },
                                })];
                        case 9:
                            _b.sent();
                            _b.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 8];
                        case 11: return [2 /*return*/, this.findOne(sawmill.idSawmill)];
                    }
                });
            });
        };
        SawmillService_1.prototype.update = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.prosesSawmill.findUnique({
                                where: { idSawmill: id },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Sawmill #".concat(id, " tidak ditemukan"));
                            }
                            return [4 /*yield*/, this.prisma.prosesSawmill.update({
                                    where: { idSawmill: id },
                                    data: __assign(__assign({}, (dto.stage || dto.statusSawmill ? { statusSawmill: dto.stage || dto.statusSawmill } : {})), (dto.kodeSawmill ? { kodeSawmill: dto.kodeSawmill } : {})),
                                })];
                        case 2:
                            updated = _a.sent();
                            return [2 /*return*/, this.findOne(updated.idSawmill)];
                    }
                });
            });
        };
        SawmillService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.plank.deleteMany({
                                where: { idSawmill: id },
                            })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.prosesSawmill.delete({
                                    where: { idSawmill: id },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { success: true, message: "Sawmill #".concat(id, " berhasil dihapus") }];
                    }
                });
            });
        };
        /* ---------------- Plank Handlers ---------------- */
        SawmillService_1.prototype.addPlank = function (idSawmill, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var sawmill, t, w, l, v, plank, code, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.prosesSawmill.findUnique({
                                where: { idSawmill: idSawmill },
                            })];
                        case 1:
                            sawmill = _a.sent();
                            if (!sawmill) {
                                throw new common_1.NotFoundException("Sawmill #".concat(idSawmill, " tidak ditemukan"));
                            }
                            t = Number(dto.tinggi) || 0;
                            w = Number(dto.lebar) || 0;
                            l = Number(dto.panjang) || 0;
                            v = dto.volumePlank;
                            if (v === undefined || v === null) {
                                v = Number(((t * w * l) / 1000000).toFixed(3));
                            }
                            return [4 /*yield*/, this.prisma.plank.create({
                                    data: {
                                        idSawmill: idSawmill,
                                        idLogAsal: sawmill.idLog,
                                        kodePlank: dto.kodePlank || dto.id_plank || undefined,
                                        gradePapan: dto.gradePapan || 'Grade A',
                                        dimensiPlank: "".concat(t, " x ").concat(w, " x ").concat(l),
                                        tinggi: t,
                                        lebar: w,
                                        panjang: l,
                                        volumePlank: v,
                                        stage: dto.stage || 'Sawmill',
                                    },
                                })];
                        case 2:
                            plank = _a.sent();
                            if (!!plank.kodePlank) return [3 /*break*/, 4];
                            code = "P-".concat(new Date().getFullYear(), "-").concat(plank.idPlank);
                            return [4 /*yield*/, this.prisma.plank.update({
                                    where: { idPlank: plank.idPlank },
                                    data: { kodePlank: code },
                                })];
                        case 3:
                            updated = _a.sent();
                            return [2 /*return*/, updated];
                        case 4: return [2 /*return*/, plank];
                    }
                });
            });
        };
        SawmillService_1.prototype.updatePlank = function (idPlank, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, t, w, l, v, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.plank.findUnique({
                                where: { idPlank: idPlank },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Plank #".concat(idPlank, " tidak ditemukan"));
                            }
                            t = dto.tinggi !== undefined ? Number(dto.tinggi) : Number(existing.tinggi);
                            w = dto.lebar !== undefined ? Number(dto.lebar) : Number(existing.lebar);
                            l = dto.panjang !== undefined ? Number(dto.panjang) : Number(existing.panjang);
                            v = dto.volumePlank;
                            if (v === undefined && (dto.tinggi !== undefined || dto.lebar !== undefined || dto.panjang !== undefined)) {
                                v = Number(((t * w * l) / 1000000).toFixed(3));
                            }
                            return [4 /*yield*/, this.prisma.plank.update({
                                    where: { idPlank: idPlank },
                                    data: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (dto.kodePlank ? { kodePlank: dto.kodePlank } : {})), (dto.gradePapan ? { gradePapan: dto.gradePapan } : {})), (dto.tinggi !== undefined ? { tinggi: t } : {})), (dto.lebar !== undefined ? { lebar: w } : {})), (dto.panjang !== undefined ? { panjang: l } : {})), (dto.tinggi !== undefined || dto.lebar !== undefined || dto.panjang !== undefined
                                        ? { dimensiPlank: "".concat(t, " x ").concat(w, " x ").concat(l) }
                                        : {})), (v !== undefined ? { volumePlank: v } : {})), (dto.stage ? { stage: dto.stage } : {})),
                                })];
                        case 2:
                            updated = _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        SawmillService_1.prototype.removePlank = function (idPlank) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.plank.delete({
                                where: { idPlank: idPlank },
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { success: true, message: "Plank #".concat(idPlank, " berhasil dihapus") }];
                    }
                });
            });
        };
        SawmillService_1.prototype.findAllPlanks = function () {
            return __awaiter(this, void 0, void 0, function () {
                var planks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.plank.findMany({
                                include: {
                                    stokLog: true,
                                },
                                orderBy: { idPlank: 'desc' },
                            })];
                        case 1:
                            planks = _a.sent();
                            return [2 /*return*/, planks.map(function (p) {
                                    var _a, _b;
                                    return ({
                                        idPlank: p.idPlank,
                                        id_plank: p.kodePlank || "P-".concat(p.idPlank),
                                        kodePlank: p.kodePlank || "P-".concat(p.idPlank),
                                        idLogAsal: p.idLogAsal,
                                        id_log: ((_a = p.stokLog) === null || _a === void 0 ? void 0 : _a.kodeLog) || "L-".concat(p.idLogAsal),
                                        sortimen: ((_b = p.stokLog) === null || _b === void 0 ? void 0 : _b.asalSortimen) || 'Sortimen A',
                                        grade: p.gradePapan,
                                        tinggi: p.tinggi ? Number(p.tinggi) : 0,
                                        lebar: p.lebar ? Number(p.lebar) : 0,
                                        panjang: p.panjang ? Number(p.panjang) : 0,
                                        volume: p.volumePlank ? Number(p.volumePlank) : 0,
                                        stage: p.stage || 'Sawmill',
                                    });
                                })];
                    }
                });
            });
        };
        return SawmillService_1;
    }());
    __setFunctionName(_classThis, "SawmillService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SawmillService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SawmillService = _classThis;
}();
exports.SawmillService = SawmillService;
