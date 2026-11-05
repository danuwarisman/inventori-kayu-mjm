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
exports.LogService = void 0;
var common_1 = require("@nestjs/common");
var LogService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LogService = _classThis = /** @class */ (function () {
        function LogService_1(prisma) {
            this.prisma = prisma;
        }
        LogService_1.prototype.mapLog = function (item) {
            var p = item.panjang ? Number(item.panjang) : 0;
            var d = item.diameter ? Number(item.diameter) : 0;
            var v = item.volumeLog ? Number(item.volumeLog) : 0;
            var h = item.harga ? Number(item.harga) : 0;
            var kode = item.kodeLog || "L-".concat(item.idLog);
            return {
                idLog: item.idLog,
                id_log: kode,
                kodeLog: kode,
                idPembelian: item.idPembelian,
                asalSortimen: item.asalSortimen,
                sortimen: item.asalSortimen,
                panjang: p,
                diameter: d,
                dimensiLog: item.dimensiLog,
                volumeLog: v,
                volume: v,
                statusLog: item.statusLog,
                stage: item.statusLog,
                suplier: item.suplier || '-',
                harga: h,
                tanggalMasuk: item.tanggalMasuk,
                tanggal_masuk: item.tanggalMasuk
                    ? new Date(item.tanggalMasuk).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
            };
        };
        LogService_1.prototype.findAll = function (sortimen, stage) {
            return __awaiter(this, void 0, void 0, function () {
                var where, logs;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = {};
                            if (sortimen && sortimen !== 'All Sortimen') {
                                where.asalSortimen = sortimen;
                            }
                            if (stage && stage !== 'All Stage') {
                                where.statusLog = stage;
                            }
                            return [4 /*yield*/, this.prisma.stokLog.findMany({
                                    where: where,
                                    orderBy: { idLog: 'desc' },
                                })];
                        case 1:
                            logs = _a.sent();
                            return [2 /*return*/, logs.map(function (log) { return _this.mapLog(log); })];
                    }
                });
            });
        };
        LogService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var log;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.stokLog.findUnique({
                                where: { idLog: id },
                            })];
                        case 1:
                            log = _a.sent();
                            if (!log) {
                                throw new common_1.NotFoundException("Log #".concat(id, " tidak ditemukan"));
                            }
                            return [2 /*return*/, this.mapLog(log)];
                    }
                });
            });
        };
        LogService_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var p, d, vol, rM, lM, sortimen, status, kode, tanggal, created, formattedKode, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            p = Number(dto.panjang) || 0;
                            d = Number(dto.diameter) || 0;
                            vol = dto.volumeLog;
                            if (vol === undefined || vol === null) {
                                rM = d / 200;
                                lM = p / 100;
                                vol = Number((Math.PI * Math.pow(rM, 2) * lM).toFixed(3));
                            }
                            sortimen = dto.asalSortimen || 'Sortimen A';
                            status = dto.statusLog || dto.stage || 'Log';
                            kode = dto.kodeLog || dto.id_log || undefined;
                            tanggal = dto.tanggalMasuk ? new Date(dto.tanggalMasuk) : new Date();
                            return [4 /*yield*/, this.prisma.stokLog.create({
                                    data: {
                                        kodeLog: kode,
                                        asalSortimen: sortimen,
                                        panjang: p,
                                        diameter: d,
                                        dimensiLog: "".concat(p, " x ").concat(d),
                                        volumeLog: vol,
                                        statusLog: status,
                                        suplier: dto.suplier || 'PT. Suplier',
                                        harga: dto.harga ? Number(dto.harga) : 0,
                                        tanggalMasuk: tanggal,
                                    },
                                })];
                        case 1:
                            created = _a.sent();
                            if (!!created.kodeLog) return [3 /*break*/, 3];
                            formattedKode = "L-".concat(new Date().getFullYear(), "-").concat(created.idLog);
                            return [4 /*yield*/, this.prisma.stokLog.update({
                                    where: { idLog: created.idLog },
                                    data: { kodeLog: formattedKode },
                                })];
                        case 2:
                            updated = _a.sent();
                            return [2 /*return*/, this.mapLog(updated)];
                        case 3: return [2 /*return*/, this.mapLog(created)];
                    }
                });
            });
        };
        LogService_1.prototype.update = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, p, d, vol, rM, lM, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.stokLog.findUnique({
                                where: { idLog: id },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Log #".concat(id, " tidak ditemukan"));
                            }
                            p = dto.panjang !== undefined ? Number(dto.panjang) : Number(existing.panjang);
                            d = dto.diameter !== undefined ? Number(dto.diameter) : Number(existing.diameter);
                            vol = dto.volumeLog;
                            if (vol === undefined && (dto.panjang !== undefined || dto.diameter !== undefined)) {
                                rM = d / 200;
                                lM = p / 100;
                                vol = Number((Math.PI * Math.pow(rM, 2) * lM).toFixed(3));
                            }
                            return [4 /*yield*/, this.prisma.stokLog.update({
                                    where: { idLog: id },
                                    data: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (dto.kodeLog || dto.id_log ? { kodeLog: dto.kodeLog || dto.id_log } : {})), (dto.asalSortimen ? { asalSortimen: dto.asalSortimen } : {})), (dto.panjang !== undefined ? { panjang: p } : {})), (dto.diameter !== undefined ? { diameter: d } : {})), (dto.panjang !== undefined || dto.diameter !== undefined ? { dimensiLog: "".concat(p, " x ").concat(d) } : {})), (vol !== undefined ? { volumeLog: vol } : {})), (dto.statusLog || dto.stage ? { statusLog: dto.statusLog || dto.stage } : {})), (dto.suplier ? { suplier: dto.suplier } : {})), (dto.harga !== undefined ? { harga: Number(dto.harga) } : {})), (dto.tanggalMasuk ? { tanggalMasuk: new Date(dto.tanggalMasuk) } : {})),
                                })];
                        case 2:
                            updated = _a.sent();
                            return [2 /*return*/, this.mapLog(updated)];
                    }
                });
            });
        };
        LogService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.stokLog.findUnique({
                                where: { idLog: id },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Log #".concat(id, " tidak ditemukan"));
                            }
                            // Also delete or cascade any related process sawmill if present
                            return [4 /*yield*/, this.prisma.plank.deleteMany({
                                    where: { idLogAsal: id },
                                })];
                        case 2:
                            // Also delete or cascade any related process sawmill if present
                            _a.sent();
                            return [4 /*yield*/, this.prisma.prosesSawmill.deleteMany({
                                    where: { idLog: id },
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.stokLog.delete({
                                    where: { idLog: id },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { success: true, message: "Log #".concat(id, " berhasil dihapus") }];
                    }
                });
            });
        };
        return LogService_1;
    }());
    __setFunctionName(_classThis, "LogService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LogService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LogService = _classThis;
}();
exports.LogService = LogService;
