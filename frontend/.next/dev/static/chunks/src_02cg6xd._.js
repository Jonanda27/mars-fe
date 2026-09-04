(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/tenant/permohonan/buat/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BuatPermohonanPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$rentalService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/rentalService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$assetService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/assetService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$airportService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/airportService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$aircraftService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/aircraftService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.mjs [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function BuatPermohonanPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fetchingAirports, setFetchingAirports] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [airports, setAirports] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [fetchingAssets, setFetchingAssets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [allAvailableAssets, setAllAvailableAssets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [availableAssets, setAvailableAssets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tenantAircrafts, setTenantAircrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [fetchingAircrafts, setFetchingAircrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedAirportId, setSelectedAirportId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        asset_id: '',
        start_date: '',
        end_date: '',
        purpose: ''
    });
    const [specificNeeds, setSpecificNeeds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        aircraft_ids: [],
        kebutuhan_ruang_pendukung: ''
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BuatPermohonanPage.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$airportService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["airportService"].getAll().then({
                "BuatPermohonanPage.useEffect": (data)=>{
                    setAirports(data.data || data); // Just in case it returns {data: [...]} or directly the array
                    setFetchingAirports(false);
                }
            }["BuatPermohonanPage.useEffect"]).catch({
                "BuatPermohonanPage.useEffect": (err)=>{
                    console.error(err);
                    setFetchingAirports(false);
                }
            }["BuatPermohonanPage.useEffect"]);
            // Ambil daftar aset yang Available
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$assetService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assetService"].getAssets().then({
                "BuatPermohonanPage.useEffect": (data)=>{
                    const available = data.filter({
                        "BuatPermohonanPage.useEffect.available": (a)=>a.status === 'Available' || a.status === 'Tersedia'
                    }["BuatPermohonanPage.useEffect.available"]);
                    setAllAvailableAssets(available);
                    setAvailableAssets(available);
                    setFetchingAssets(false);
                }
            }["BuatPermohonanPage.useEffect"]).catch({
                "BuatPermohonanPage.useEffect": (err)=>{
                    console.error(err);
                    setFetchingAssets(false);
                }
            }["BuatPermohonanPage.useEffect"]);
            // Ambil pesawat dan filter yang sedang digunakan di permohonan aktif/kontrak
            Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$aircraftService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aircraftService"].getTenantAircrafts(),
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$rentalService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rentalService"].getTenantApplications() // we need to ensure this function exists in rentalService
            ]).then({
                "BuatPermohonanPage.useEffect": ([aircrafts, applications])=>{
                    // Cari ID pesawat yang sudah ada di permohonan yang aktif (bukan Rejected/Terminated)
                    const usedAircraftIds = new Set();
                    applications.forEach({
                        "BuatPermohonanPage.useEffect": (app)=>{
                            // Anggap status yang mem-block pesawat adalah selain Rejected, Terminated, Expired
                            if (app.status !== 'Rejected' && app.status !== 'Terminated' && app.status !== 'Expired') {
                                // Atau jika sudah jadi kontrak, cek status kontrak
                                if (app.contracts && [
                                    'Terminated',
                                    'Expired',
                                    'Rejected'
                                ].includes(app.contracts.status)) {
                                    return;
                                }
                                const spec = app.specific_needs;
                                if (spec && Array.isArray(spec.aircraft_ids)) {
                                    spec.aircraft_ids.forEach({
                                        "BuatPermohonanPage.useEffect": (id)=>usedAircraftIds.add(id.toString())
                                    }["BuatPermohonanPage.useEffect"]);
                                } else if (spec && spec.aircraft_id) {
                                    usedAircraftIds.add(spec.aircraft_id.toString());
                                }
                            }
                        }
                    }["BuatPermohonanPage.useEffect"]);
                    const availableAircrafts = aircrafts.filter({
                        "BuatPermohonanPage.useEffect.availableAircrafts": (a)=>!usedAircraftIds.has(a.id.toString())
                    }["BuatPermohonanPage.useEffect.availableAircrafts"]);
                    setTenantAircrafts(availableAircrafts);
                    setFetchingAircrafts(false);
                }
            }["BuatPermohonanPage.useEffect"]).catch({
                "BuatPermohonanPage.useEffect": (err)=>{
                    console.error(err);
                    setFetchingAircrafts(false);
                }
            }["BuatPermohonanPage.useEffect"]);
        }
    }["BuatPermohonanPage.useEffect"], []);
    const handleAirportChange = (e)=>{
        const airportId = e.target.value;
        setSelectedAirportId(airportId);
        setFormData((prev)=>({
                ...prev,
                asset_id: ''
            })); // reset asset selection
        if (airportId) {
            const filtered = allAvailableAssets.filter((a)=>a.airport_id?.toString() === airportId);
            setAvailableAssets(filtered);
        } else {
            setAvailableAssets(allAvailableAssets);
        }
    };
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleNeedsChange = (e)=>{
        const { name, value } = e.target;
        setSpecificNeeds((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                specific_needs: specificNeeds
            };
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$rentalService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rentalService"].createApplication(payload);
            router.push('/tenant/permohonan');
        } catch (error) {
            alert('Gagal mengajukan permohonan: ' + error.message);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 bg-[#ecf0f5] min-h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex justify-between items-end mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-[24px] font-normal text-[#333] flex items-center",
                    children: "Buat Permohonan Sewa Baru"
                }, void 0, false, {
                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border-t-[3px] border-[#00a65a] shadow-sm rounded-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[16px] text-[#444] font-bold flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                        className: "w-5 h-5 mr-2 text-[#00a65a]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                        lineNumber: 145,
                                        columnNumber: 13
                                    }, this),
                                    " Formulir Pengajuan"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/tenant/permohonan",
                                className: "bg-[#f4f4f4] text-[#444] border border-[#d2d6de] px-3 py-1.5 text-[12px] hover:bg-[#e0e0e0] transition-colors flex items-center rounded-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "w-4 h-4 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this),
                                    " Kembali"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-bold text-[#333] mb-4 pb-2 border-b border-[#f4f4f4]",
                                                children: "Pemilihan Aset & Periode"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 156,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-[13px] font-bold text-[#333] mb-1",
                                                        children: [
                                                            "Pilih Bandara ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 159,
                                                                columnNumber: 95
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 159,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        required: true,
                                                        value: selectedAirportId,
                                                        onChange: handleAirportChange,
                                                        className: "w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "-- Semua Bandara --"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 161,
                                                                columnNumber: 19
                                                            }, this),
                                                            fetchingAirports ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                disabled: true,
                                                                children: "Memuat daftar bandara..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 163,
                                                                columnNumber: 21
                                                            }, this) : airports.map((airport)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: airport.id,
                                                                    children: [
                                                                        airport.nama_bandara,
                                                                        " (",
                                                                        airport.kode_bandara,
                                                                        ")"
                                                                    ]
                                                                }, airport.id, true, {
                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                    lineNumber: 166,
                                                                    columnNumber: 23
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 160,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 158,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-[13px] font-bold text-[#333] mb-1",
                                                        children: [
                                                            "Objek Aset Utama yang Diminati ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 175,
                                                                columnNumber: 112
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 175,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[11px] text-[#777] mb-2",
                                                        children: "Pilih aset yang statusnya sedang tersedia saat ini. (Penetapan akhir akan diputuskan oleh Admin)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 176,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        required: true,
                                                        name: "asset_id",
                                                        value: formData.asset_id,
                                                        onChange: handleChange,
                                                        disabled: !selectedAirportId && availableAssets.length > 0,
                                                        className: "w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white disabled:bg-gray-100 disabled:text-gray-500",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "-- Pilih Aset --"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 178,
                                                                columnNumber: 19
                                                            }, this),
                                                            fetchingAssets ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                disabled: true,
                                                                children: "Memuat daftar aset..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 180,
                                                                columnNumber: 21
                                                            }, this) : availableAssets.length === 0 && selectedAirportId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                disabled: true,
                                                                children: "Tidak ada aset tersedia di bandara ini"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 183,
                                                                columnNumber: 23
                                                            }, this) : availableAssets.map((asset)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: asset.id,
                                                                    children: [
                                                                        asset.kode_aset,
                                                                        " - ",
                                                                        asset.nama_aset,
                                                                        " (",
                                                                        asset.jenis_aset,
                                                                        ") - ",
                                                                        asset.luas,
                                                                        " ",
                                                                        asset.satuan
                                                                    ]
                                                                }, asset.id, true, {
                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                    lineNumber: 186,
                                                                    columnNumber: 25
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 17
                                                    }, this),
                                                    formData.asset_id && (()=>{
                                                        const selectedAsset = availableAssets.find((a)=>a.id.toString() === formData.asset_id);
                                                        if (!selectedAsset) return null;
                                                        const isHangar = selectedAsset.jenis_aset === 'Hanggar';
                                                        const spec = selectedAsset.spesifikasi_detail || {};
                                                        const airport = selectedAsset.airports;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-4 border border-[#00a65a] rounded-sm bg-[#f9fffb] overflow-hidden",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bg-[#00a65a] text-white px-3 py-2 text-xs font-bold uppercase tracking-wider",
                                                                    children: "Rincian Objek Sewa"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                    lineNumber: 205,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "p-4 text-sm text-[#444]",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                            className: "font-bold text-[#00a65a] mb-2 border-b border-green-200 pb-1",
                                                                                            children: "Data Bandara"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 211,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                    children: "Nama:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 212,
                                                                                                    columnNumber: 32
                                                                                                }, this),
                                                                                                " ",
                                                                                                airport?.nama_bandara || '-'
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 212,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                    children: "Kode:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 213,
                                                                                                    columnNumber: 32
                                                                                                }, this),
                                                                                                " ",
                                                                                                airport?.kode_bandara || '-'
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 213,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                    children: "Lokasi:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 214,
                                                                                                    columnNumber: 32
                                                                                                }, this),
                                                                                                " ",
                                                                                                airport?.lokasi || '-'
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 214,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                    lineNumber: 210,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                            className: "font-bold text-[#00a65a] mb-2 border-b border-green-200 pb-1",
                                                                                            children: "Data Aset Utama"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 217,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                    children: "Nama Aset:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 218,
                                                                                                    columnNumber: 32
                                                                                                }, this),
                                                                                                " ",
                                                                                                selectedAsset.nama_aset
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 218,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                    children: "Dimensi:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 219,
                                                                                                    columnNumber: 32
                                                                                                }, this),
                                                                                                " ",
                                                                                                selectedAsset.luas,
                                                                                                " ",
                                                                                                selectedAsset.satuan
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 219,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                    children: "Kapasitas:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 220,
                                                                                                    columnNumber: 32
                                                                                                }, this),
                                                                                                " ",
                                                                                                selectedAsset.kapasitas || '-'
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 220,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                    lineNumber: 216,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                            lineNumber: 209,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        isHangar && spec && Object.keys(spec).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-4 pt-3 border-t border-green-100",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                    className: "font-bold text-[#00a65a] mb-2",
                                                                                    children: "Spesifikasi Detail Hanggar"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                    lineNumber: 226,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "grid grid-cols-2 text-xs gap-y-2 gap-x-4 bg-white p-3 border border-green-50 rounded",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: "Tinggi Bangunan:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 228,
                                                                                                    columnNumber: 36
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 228,
                                                                                                    columnNumber: 92
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: spec.tinggi_bangunan || '-'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 228,
                                                                                                    columnNumber: 126
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 228,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: "Pintu Hanggar:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 229,
                                                                                                    columnNumber: 36
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 229,
                                                                                                    columnNumber: 90
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: spec.pintu_hanggar || '-'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 229,
                                                                                                    columnNumber: 124
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 229,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: "Listrik:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 230,
                                                                                                    columnNumber: 36
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 230,
                                                                                                    columnNumber: 84
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: spec.fasilitas_listrik || '-'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 230,
                                                                                                    columnNumber: 118
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 230,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: "Air:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 231,
                                                                                                    columnNumber: 36
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 231,
                                                                                                    columnNumber: 80
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: spec.fasilitas_air || '-'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 231,
                                                                                                    columnNumber: 114
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 231,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: "Fire Safety:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 232,
                                                                                                    columnNumber: 36
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 232,
                                                                                                    columnNumber: 88
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: spec.fire_safety || '-'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 232,
                                                                                                    columnNumber: 122
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 232,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: "Koneksi Apron:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 233,
                                                                                                    columnNumber: 36
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 233,
                                                                                                    columnNumber: 90
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: spec.apron_connection || '-'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 233,
                                                                                                    columnNumber: 124
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 233,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "col-span-2",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: "Office & Toilet:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 234,
                                                                                                    columnNumber: 59
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 234,
                                                                                                    columnNumber: 115
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: [
                                                                                                        spec.office || '-',
                                                                                                        ", ",
                                                                                                        spec.toilet || '-'
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 234,
                                                                                                    columnNumber: 149
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 234,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                    lineNumber: 227,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                            lineNumber: 225,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                    lineNumber: 208,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                            lineNumber: 204,
                                                            columnNumber: 21
                                                        }, this);
                                                    })()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 174,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-[13px] font-bold text-[#333] mb-2",
                                                        children: [
                                                            "Periode Rencana Sewa ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 245,
                                                                columnNumber: 102
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 245,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-end gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-[11px] text-[#777] mb-1",
                                                                        children: "Tanggal Mulai"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 248,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        required: true,
                                                                        type: "date",
                                                                        name: "start_date",
                                                                        value: formData.start_date,
                                                                        onChange: handleChange,
                                                                        className: "w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] transition-colors"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 249,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 247,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[#999] font-medium text-[14px] mb-2",
                                                                children: "s/d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 251,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-[11px] text-[#777] mb-1",
                                                                        children: "Tanggal Selesai"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 253,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        required: true,
                                                                        type: "date",
                                                                        name: "end_date",
                                                                        value: formData.end_date,
                                                                        onChange: handleChange,
                                                                        className: "w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] transition-colors"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 254,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 252,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-24",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-[11px] text-[#777] mb-1 text-center",
                                                                        children: "Durasi"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 257,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    (()=>{
                                                                        if (formData.start_date && formData.end_date) {
                                                                            const start = new Date(formData.start_date);
                                                                            const end = new Date(formData.end_date);
                                                                            if (end >= start) {
                                                                                const diffTime = end.getTime() - start.getTime();
                                                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                                                const nights = diffDays === 0 ? 1 : diffDays;
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-full bg-[#f4f4f4] border border-[#d2d6de] px-3 py-2 text-[14px] font-bold text-[#333] text-center h-[38px] flex items-center justify-center",
                                                                                    children: [
                                                                                        nights,
                                                                                        " Malam"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                    lineNumber: 267,
                                                                                    columnNumber: 29
                                                                                }, this);
                                                                            }
                                                                        }
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-full bg-[#f4f4f4] border border-[#d2d6de] px-3 py-2 text-[14px] font-medium text-[#999] text-center h-[38px] flex items-center justify-center",
                                                                            children: "-"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                            lineNumber: 274,
                                                                            columnNumber: 25
                                                                        }, this);
                                                                    })()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 256,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 246,
                                                        columnNumber: 17
                                                    }, this),
                                                    formData.start_date && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 text-red-500 text-[11px] font-bold",
                                                        children: "Tanggal selesai tidak boleh mendahului tanggal mulai."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 282,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 244,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-bold text-[#333] mb-4 pb-2 border-b border-[#f4f4f4]",
                                                children: "Rincian Kebutuhan Spesifik (Opsional)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 290,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-[13px] font-bold text-[#333] mb-2",
                                                        children: "Pilih Armada Pesawat"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 293,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border border-[#d2d6de] rounded-sm max-h-[200px] overflow-y-auto bg-white p-2",
                                                        children: fetchingAircrafts ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-gray-500 p-2",
                                                            children: "Memuat armada pesawat..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                            lineNumber: 296,
                                                            columnNumber: 21
                                                        }, this) : tenantAircrafts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-gray-500 p-2",
                                                            children: "Tidak ada armada pesawat tersedia yang belum terkait kontrak."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                            lineNumber: 298,
                                                            columnNumber: 21
                                                        }, this) : tenantAircrafts.map((aircraft)=>{
                                                            const isSelected = specificNeeds.aircraft_ids.includes(aircraft.id.toString());
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "flex items-center p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        className: "mr-3 w-4 h-4 text-[#00a65a] rounded focus:ring-[#00a65a]",
                                                                        checked: isSelected,
                                                                        onChange: (e)=>{
                                                                            if (e.target.checked) {
                                                                                setSpecificNeeds((prev)=>({
                                                                                        ...prev,
                                                                                        aircraft_ids: [
                                                                                            ...prev.aircraft_ids,
                                                                                            aircraft.id.toString()
                                                                                        ]
                                                                                    }));
                                                                            } else {
                                                                                setSpecificNeeds((prev)=>({
                                                                                        ...prev,
                                                                                        aircraft_ids: prev.aircraft_ids.filter((id)=>id !== aircraft.id.toString())
                                                                                    }));
                                                                            }
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 304,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "font-bold text-[#333] text-[13px]",
                                                                                children: aircraft.registration_number
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                lineNumber: 317,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-[11px] text-[#777]",
                                                                                children: [
                                                                                    aircraft.aircraft_type,
                                                                                    " - MTOW: ",
                                                                                    aircraft.mtow || '-',
                                                                                    " Kg"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                lineNumber: 318,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 316,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, aircraft.id, true, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 303,
                                                                columnNumber: 25
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 294,
                                                        columnNumber: 17
                                                    }, this),
                                                    specificNeeds.aircraft_ids.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 text-[11px] text-[#00a65a] font-bold bg-[#e8f5e9] p-2 rounded",
                                                        children: [
                                                            specificNeeds.aircraft_ids.length,
                                                            " armada dipilih. Tarif akan diakumulasikan."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 326,
                                                        columnNumber: 20
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 292,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-[13px] font-bold text-[#333] mb-1",
                                                        children: "Kebutuhan Ruang Pendukung Khusus"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        name: "kebutuhan_ruang_pendukung",
                                                        value: specificNeeds.kebutuhan_ruang_pendukung,
                                                        onChange: handleNeedsChange,
                                                        rows: 3,
                                                        className: "w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]",
                                                        placeholder: "Misal: Membutuhkan apron connection luas, ruang office, atau daya listrik besar..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 332,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                        lineNumber: 289,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8 flex justify-end gap-3 pt-4 border-t border-[#f4f4f4]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "bg-[#00a65a] text-white px-5 py-2 text-[14px] font-bold hover:bg-[#008d4c] transition-colors rounded-sm flex items-center shadow-sm disabled:opacity-70",
                                    children: [
                                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            className: "w-4 h-4 animate-spin mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                            lineNumber: 343,
                                            columnNumber: 26
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                            className: "w-4 h-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                            lineNumber: 343,
                                            columnNumber: 78
                                        }, this),
                                        "Kirim Permohonan"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                    lineNumber: 342,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_s(BuatPermohonanPage, "f0V1yBubIE7fiMLH6sxg5M4QevU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = BuatPermohonanPage;
var _c;
__turbopack_context__.k.register(_c, "BuatPermohonanPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/aircraftService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aircraftService",
    ()=>aircraftService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
;
const aircraftService = {
    getTenantAircrafts: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/aircrafts/tenant');
        return response.data.data;
    },
    getMasterTypes: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/aircrafts/types/master');
        return response.data.data;
    },
    createTenantAircraft: async (data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/aircrafts/tenant', data);
        return response.data.data;
    },
    updateTenantAircraft: async (id, data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/aircrafts/tenant/${id}`, data);
        return response.data.data;
    },
    deleteTenantAircraft: async (id)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/aircrafts/tenant/${id}`);
    },
    getAllAircrafts: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/aircrafts');
        return response.data.data;
    },
    getAircraftById: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/aircrafts/${id}`);
        return response.data.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/airportService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "airportService",
    ()=>airportService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
;
const airportService = {
    getAll: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/airports');
        return response.data;
    },
    getById: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/airports/${id}`);
        return response.data;
    },
    create: async (data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/airports', data);
        return response.data;
    },
    update: async (id, data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/airports/${id}`, data);
        return response.data;
    },
    delete: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/airports/${id}`);
        return response.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/assetService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assetService",
    ()=>assetService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
;
const assetService = {
    getAssets: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/assets');
        return response.data.data;
    },
    getAssetById: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/assets/${id}`);
        return response.data.data;
    },
    createAsset: async (data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/assets', data);
        return response.data.data;
    },
    updateAsset: async (id, data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/assets/${id}`, data);
        return response.data.data;
    },
    deleteAsset: async (id)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/assets/${id}`);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/rentalService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "rentalService",
    ()=>rentalService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
;
const rentalService = {
    createApplication: async (data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/rentals', data);
        return response.data.data;
    },
    getTenantApplications: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/rentals/tenant');
        return response.data.data;
    },
    getAllApplications: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/rentals/admin');
        return response.data.data;
    },
    getApplicationById: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/rentals/${id}`);
        return response.data.data;
    },
    updateApplicationStatus: async (id, status, asset_id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/rentals/${id}/status`, {
            status,
            asset_id
        });
        return response.data.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_02cg6xd._.js.map