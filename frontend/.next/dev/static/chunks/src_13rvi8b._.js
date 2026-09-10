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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$aircraftService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/aircraftService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$contractService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/contractService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.mjs [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useAuthStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
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
;
;
;
function BuatPermohonanPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fetchingAssets, setFetchingAssets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [allAvailableAssets, setAllAvailableAssets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [availableAssets, setAvailableAssets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tenantAircrafts, setTenantAircrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [fetchingAircrafts, setFetchingAircrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [checkingContract, setCheckingContract] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [hasActiveContract, setHasActiveContract] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeContractId, setActiveContractId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Hangar Capacity State
    const [assetCapacity, setAssetCapacity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [fetchingCapacity, setFetchingCapacity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        application_type: 'Sewa Baru Hanggar',
        asset_id: '',
        start_date: '',
        end_date: '',
        purpose: ''
    });
    const [officialLetter, setOfficialLetter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [specificNeeds, setSpecificNeeds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        aircraft_ids: [],
        kebutuhan_ruang_pendukung: ''
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BuatPermohonanPage.useEffect": ()=>{
            // Check if tenant has an active contract
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$contractService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contractService"].getTenantContracts().then({
                "BuatPermohonanPage.useEffect": (contracts)=>{
                    const active = contracts.find({
                        "BuatPermohonanPage.useEffect.active": (c)=>c.status === 'Active'
                    }["BuatPermohonanPage.useEffect.active"]);
                    if (active && active.id !== undefined) {
                        setHasActiveContract(true);
                        setActiveContractId(active.id);
                    } else {
                        setHasActiveContract(false);
                    }
                    setCheckingContract(false);
                }
            }["BuatPermohonanPage.useEffect"]).catch({
                "BuatPermohonanPage.useEffect": (err)=>{
                    console.error("Error checking contracts:", err);
                    setCheckingContract(false);
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
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$rentalService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rentalService"].getTenantApplications()
            ]).then({
                "BuatPermohonanPage.useEffect": ([aircrafts, applications])=>{
                    // Cari ID pesawat yang sudah ada di permohonan yang aktif (bukan Rejected/Terminated)
                    const usedAircraftIds = new Set();
                    applications.forEach({
                        "BuatPermohonanPage.useEffect": (app)=>{
                            if (app.status !== 'Rejected' && app.status !== 'Terminated' && app.status !== 'Expired') {
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
    const handleChange = async (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
        // Fetch capacity if asset is changed
        if (name === 'asset_id' && value) {
            setFetchingCapacity(true);
            try {
                const capacity = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$assetService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assetService"].getAssetCapacity(parseInt(value));
                setAssetCapacity(capacity);
            } catch (err) {
                console.error('Failed to fetch capacity', err);
                setAssetCapacity(null);
            } finally{
                setFetchingCapacity(false);
            }
        } else if (name === 'asset_id' && !value) {
            setAssetCapacity(null);
        }
    };
    const handleNeedsChange = (e)=>{
        const { name, value } = e.target;
        setSpecificNeeds((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    // Calculate required area based on selected aircrafts
    const calculateRequiredArea = ()=>{
        let area = 0;
        specificNeeds.aircraft_ids.forEach((idStr)=>{
            const aircraft = tenantAircrafts.find((a)=>a.id.toString() === idStr);
            if (aircraft && aircraft.aircraft_types && aircraft.aircraft_types.luas_efektif_m2) {
                area += parseFloat(aircraft.aircraft_types.luas_efektif_m2.toString());
            }
        });
        return area;
    };
    const requiredArea = calculateRequiredArea();
    const isOverCapacity = assetCapacity?.isHangar && requiredArea > assetCapacity.remainingArea;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (isOverCapacity) return;
        if (!officialLetter) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Harap unggah Surat Permohonan Resmi.");
            return;
        }
        setLoading(true);
        try {
            const payload = new FormData();
            payload.append('application_type', formData.application_type);
            payload.append('asset_id', formData.asset_id);
            payload.append('start_date', formData.start_date);
            payload.append('end_date', formData.end_date);
            payload.append('purpose', formData.purpose);
            payload.append('specific_needs', JSON.stringify(specificNeeds));
            payload.append('official_letter', officialLetter);
            // rentalService in frontend uses api.post, but we need to send FormData.
            // So we'll use api directly here to ensure Content-Type is correct
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/rentals', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Permohonan berhasil diajukan dan menunggu persetujuan.');
            router.push('/tenant/permohonan');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Gagal mengajukan permohonan: ' + error.message);
        } finally{
            setLoading(false);
        }
    };
    if (checkingContract) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-[400px]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "w-8 h-8 animate-spin text-[#3c8dbc]"
            }, void 0, false, {
                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                lineNumber: 185,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
            lineNumber: 184,
            columnNumber: 7
        }, this);
    }
    if (!hasActiveContract) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-3xl mx-auto py-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border-t-4 border-yellow-500 shadow-md p-8 text-center rounded",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "w-16 h-16 text-yellow-500 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-gray-800 mb-2",
                        children: "Kontrak Payung Diperlukan"
                    }, void 0, false, {
                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 mb-6",
                        children: "Anda belum memiliki Kontrak Pemanfaatan Aset (Kontrak Payung) yang berstatus Aktif. Sesuai prosedur operasional, Anda diwajibkan memiliki Kontrak Payung 1 Tahun sebelum dapat mengajukan permohonan jadwal kedatangan sewa."
                    }, void 0, false, {
                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                        lineNumber: 196,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center gap-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/tenant",
                            className: "px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300 transition-colors",
                            children: "Kembali ke Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                            lineNumber: 201,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                        lineNumber: 200,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                lineNumber: 193,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
            lineNumber: 192,
            columnNumber: 7
        }, this);
    }
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
                    lineNumber: 216,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                lineNumber: 215,
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
                                        lineNumber: 224,
                                        columnNumber: 13
                                    }, this),
                                    " Formulir Pengajuan"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                lineNumber: 223,
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
                                        lineNumber: 227,
                                        columnNumber: 13
                                    }, this),
                                    " Kembali"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                        lineNumber: 222,
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
                                                lineNumber: 235,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-[13px] font-bold text-[#333] mb-1",
                                                        children: [
                                                            "Tipe Layanan Permohonan ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 238,
                                                                columnNumber: 105
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        required: true,
                                                        name: "application_type",
                                                        value: formData.application_type,
                                                        onChange: handleChange,
                                                        className: "w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "Sewa Baru Hanggar",
                                                                children: "Sewa Baru Hanggar"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 240,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "Sewa Baru Ruang",
                                                                children: "Sewa Baru Ruang"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 241,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "Perpanjangan Sewa Hanggar",
                                                                children: "Perpanjangan Sewa Hanggar"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 242,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "Perpanjangan Sewa Ruang",
                                                                children: "Perpanjangan Sewa Ruang"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 243,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 239,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 237,
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
                                                                lineNumber: 248,
                                                                columnNumber: 112
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 248,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[11px] text-[#777] mb-2",
                                                        children: "Pilih aset yang statusnya sedang tersedia saat ini. (Penetapan akhir akan diputuskan oleh Admin)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 249,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        required: true,
                                                        name: "asset_id",
                                                        value: formData.asset_id,
                                                        onChange: handleChange,
                                                        disabled: fetchingAssets,
                                                        className: "w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white disabled:bg-gray-100 disabled:text-gray-500",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "-- Pilih Aset --"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 251,
                                                                columnNumber: 19
                                                            }, this),
                                                            fetchingAssets ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                disabled: true,
                                                                children: "Memuat daftar aset..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 253,
                                                                columnNumber: 21
                                                            }, this) : availableAssets.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                disabled: true,
                                                                children: "Tidak ada aset tersedia"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 256,
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
                                                                    lineNumber: 259,
                                                                    columnNumber: 25
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 250,
                                                        columnNumber: 17
                                                    }, this),
                                                    fetchingCapacity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 text-sm text-gray-500 flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                className: "w-4 h-4 mr-2 animate-spin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 268,
                                                                columnNumber: 100
                                                            }, this),
                                                            " Mengecek kapasitas..."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 268,
                                                        columnNumber: 38
                                                    }, this),
                                                    assetCapacity?.isHangar && !fetchingCapacity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `mt-3 p-3 border rounded-sm ${isOverCapacity ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-center mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[13px] font-bold text-gray-700",
                                                                        children: "Kapasitas Hanggar:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 272,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `text-[13px] font-bold ${isOverCapacity ? 'text-red-600' : 'text-blue-600'}`,
                                                                        children: [
                                                                            "Sisa: ",
                                                                            Math.max(0, assetCapacity.remainingArea - requiredArea),
                                                                            " m²"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 273,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 271,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-full bg-gray-200 rounded-full h-2.5 mb-1",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `h-2.5 rounded-full ${isOverCapacity ? 'bg-red-600' : 'bg-blue-600'}`,
                                                                    style: {
                                                                        width: `${Math.min(100, (assetCapacity.usedArea + requiredArea) / assetCapacity.totalArea * 100)}%`
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                    lineNumber: 278,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 277,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[11px] text-gray-500 flex justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "Terpakai: ",
                                                                            assetCapacity.usedArea + requiredArea,
                                                                            " m²"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 281,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "Total: ",
                                                                            assetCapacity.totalArea,
                                                                            " m²"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 282,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 280,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 270,
                                                        columnNumber: 19
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
                                                                    lineNumber: 298,
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
                                                                                            lineNumber: 304,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                    children: "Nama:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 305,
                                                                                                    columnNumber: 32
                                                                                                }, this),
                                                                                                " ",
                                                                                                airport?.nama_bandara || '-'
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 305,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                    children: "Kode:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 306,
                                                                                                    columnNumber: 32
                                                                                                }, this),
                                                                                                " ",
                                                                                                airport?.kode_bandara || '-'
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 306,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                    children: "Lokasi:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 307,
                                                                                                    columnNumber: 32
                                                                                                }, this),
                                                                                                " ",
                                                                                                airport?.lokasi || '-'
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 307,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                    lineNumber: 303,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                            className: "font-bold text-[#00a65a] mb-2 border-b border-green-200 pb-1",
                                                                                            children: "Data Aset Utama"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 310,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                    children: "Nama Aset:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 311,
                                                                                                    columnNumber: 32
                                                                                                }, this),
                                                                                                " ",
                                                                                                selectedAsset.nama_aset
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 311,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        !isHangar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                    children: "Dimensi:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 312,
                                                                                                    columnNumber: 46
                                                                                                }, this),
                                                                                                " ",
                                                                                                selectedAsset.luas,
                                                                                                " ",
                                                                                                selectedAsset.satuan
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 312,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                    children: "Kapasitas:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 313,
                                                                                                    columnNumber: 32
                                                                                                }, this),
                                                                                                " ",
                                                                                                selectedAsset.kapasitas || '-'
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 313,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                    lineNumber: 309,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                            lineNumber: 302,
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
                                                                                    lineNumber: 319,
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
                                                                                                    lineNumber: 321,
                                                                                                    columnNumber: 36
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 321,
                                                                                                    columnNumber: 92
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: spec.tinggi_bangunan || '-'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 321,
                                                                                                    columnNumber: 126
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 321,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: "Pintu Hanggar:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 322,
                                                                                                    columnNumber: 36
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 322,
                                                                                                    columnNumber: 90
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: spec.pintu_hanggar || '-'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 322,
                                                                                                    columnNumber: 124
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 322,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: "Listrik:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 323,
                                                                                                    columnNumber: 36
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 323,
                                                                                                    columnNumber: 84
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: spec.fasilitas_listrik || '-'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 323,
                                                                                                    columnNumber: 118
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 323,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: "Air:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 324,
                                                                                                    columnNumber: 36
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 324,
                                                                                                    columnNumber: 80
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: spec.fasilitas_air || '-'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 324,
                                                                                                    columnNumber: 114
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 324,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: "Fire Safety:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 325,
                                                                                                    columnNumber: 36
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 325,
                                                                                                    columnNumber: 88
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: spec.fire_safety || '-'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 325,
                                                                                                    columnNumber: 122
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 325,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: "Koneksi Apron:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 326,
                                                                                                    columnNumber: 36
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 326,
                                                                                                    columnNumber: 90
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-medium",
                                                                                                    children: spec.apron_connection || '-'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 326,
                                                                                                    columnNumber: 124
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 326,
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
                                                                                                    lineNumber: 327,
                                                                                                    columnNumber: 59
                                                                                                }, this),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                                                    className: "hidden sm:block"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                    lineNumber: 327,
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
                                                                                                    lineNumber: 327,
                                                                                                    columnNumber: 149
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                            lineNumber: 327,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                    lineNumber: 320,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                            lineNumber: 318,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                    lineNumber: 301,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                            lineNumber: 297,
                                                            columnNumber: 21
                                                        }, this);
                                                    })()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 247,
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
                                                                lineNumber: 338,
                                                                columnNumber: 102
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 338,
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
                                                                        lineNumber: 341,
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
                                                                        lineNumber: 342,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 340,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[#999] font-medium text-[14px] mb-2",
                                                                children: "s/d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 344,
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
                                                                        lineNumber: 346,
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
                                                                        lineNumber: 347,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 345,
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
                                                                        lineNumber: 350,
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
                                                                                    lineNumber: 360,
                                                                                    columnNumber: 29
                                                                                }, this);
                                                                            }
                                                                        }
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-full bg-[#f4f4f4] border border-[#d2d6de] px-3 py-2 text-[14px] font-medium text-[#999] text-center h-[38px] flex items-center justify-center",
                                                                            children: "-"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                            lineNumber: 367,
                                                                            columnNumber: 25
                                                                        }, this);
                                                                    })()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 349,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 339,
                                                        columnNumber: 17
                                                    }, this),
                                                    formData.start_date && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 text-red-500 text-[11px] font-bold",
                                                        children: "Tanggal selesai tidak boleh mendahului tanggal mulai."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 375,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 337,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-[13px] font-bold text-[#333] mb-2",
                                                        children: "Tujuan Penggunaan (Purpose)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 382,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        name: "purpose",
                                                        value: formData.purpose,
                                                        onChange: handleChange,
                                                        rows: 2,
                                                        className: "w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]",
                                                        placeholder: "Misal: Operasional penerbangan perintis..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 383,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 381,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4 bg-orange-50 p-4 border-l-4 border-orange-500 rounded-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-[13px] font-bold text-orange-800 mb-1",
                                                        children: [
                                                            "Surat Permohonan Resmi ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 387,
                                                                columnNumber: 108
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 387,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[11px] text-orange-700 mb-3",
                                                        children: "Sesuai prosedur, permohonan harus melampirkan Surat Resmi yang menggunakan Kop Perusahaan, Tanda Tangan, dan Stempel."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 388,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "file",
                                                        accept: ".pdf",
                                                        required: true,
                                                        onChange: (e)=>{
                                                            const file = e.target.files ? e.target.files[0] : null;
                                                            if (file && file.size > 5 * 1024 * 1024) {
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Ukuran file maksimal 5MB');
                                                                e.target.value = '';
                                                                setOfficialLetter(null);
                                                                return;
                                                            }
                                                            setOfficialLetter(file);
                                                        },
                                                        className: "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 389,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] text-gray-500 mt-1",
                                                        children: "Format wajib: PDF (Maks 5MB)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 386,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                        lineNumber: 234,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            user?.jenis_tenant === 'Maskapai' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "font-bold text-[#333] mb-4 pb-2 border-b border-[#f4f4f4]",
                                                        children: "Rincian Kebutuhan Spesifik (Opsional)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 412,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-[13px] font-bold text-[#333] mb-2",
                                                                children: "Pilih Armada Pesawat"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 415,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto p-1",
                                                                children: fetchingAircrafts ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-gray-500 col-span-2",
                                                                    children: "Memuat armada pesawat..."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                    lineNumber: 418,
                                                                    columnNumber: 23
                                                                }, this) : tenantAircrafts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-gray-500 col-span-2",
                                                                    children: "Tidak ada armada pesawat tersedia yang belum terkait kontrak."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                    lineNumber: 420,
                                                                    columnNumber: 23
                                                                }, this) : tenantAircrafts.map((aircraft)=>{
                                                                    const isSelected = specificNeeds.aircraft_ids.includes(aircraft.id.toString());
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: `flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'border-[#00a65a] bg-[#00a65a]/10 shadow-sm' : 'border-gray-200 bg-white hover:border-[#00a65a]/50 hover:bg-gray-50'}`,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                className: "sr-only",
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
                                                                                lineNumber: 433,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: `mt-0.5 p-1.5 rounded-md mr-3 flex-shrink-0 ${isSelected ? 'bg-[#00a65a] text-white' : 'bg-gray-100 text-gray-500'}`,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                    xmlns: "http://www.w3.org/2000/svg",
                                                                                    width: "18",
                                                                                    height: "18",
                                                                                    viewBox: "0 0 24 24",
                                                                                    fill: "none",
                                                                                    stroke: "currentColor",
                                                                                    strokeWidth: "2",
                                                                                    strokeLinecap: "round",
                                                                                    strokeLinejoin: "round",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                        d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6c-.1.4 0 .9.4 1.1l7.3 4.2-2.9 2.9-3.7-.7c-.4-.1-.9.2-1.1.6l-.6 1.8c-.1.4.1.8.4 1l4.2 1.4 1.4 4.2c.2.3.6.5 1 .4l1.8-.6c.4-.2.7-.7.6-1.1l-.7-3.7 2.9-2.9 4.2 7.3c.2.4.7.5 1.1.4l3.6-1.2c.5-.2.8-.6.7-1.1z"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                        lineNumber: 446,
                                                                                        columnNumber: 209
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                    lineNumber: 446,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                lineNumber: 445,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex-1 min-w-0",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: `font-bold text-[14px] leading-tight truncate ${isSelected ? 'text-[#00a65a]' : 'text-gray-800'}`,
                                                                                        children: aircraft.registration_number
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                        lineNumber: 449,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-[11px] text-gray-500 mt-1 line-clamp-2",
                                                                                        children: aircraft.aircraft_types?.jenis_pesawat
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                        lineNumber: 452,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "flex items-center gap-2 mt-1.5 text-[10px] font-semibold",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200",
                                                                                                children: [
                                                                                                    "MTOW: ",
                                                                                                    aircraft.mtow || '-',
                                                                                                    " Kg"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                lineNumber: 456,
                                                                                                columnNumber: 33
                                                                                            }, this),
                                                                                            aircraft.aircraft_types?.luas_efektif_m2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100",
                                                                                                children: [
                                                                                                    "Luas: ",
                                                                                                    aircraft.aircraft_types.luas_efektif_m2,
                                                                                                    " m²"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                                lineNumber: 460,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                        lineNumber: 455,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                lineNumber: 448,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "ml-2 text-[#00a65a]",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                    xmlns: "http://www.w3.org/2000/svg",
                                                                                    width: "20",
                                                                                    height: "20",
                                                                                    viewBox: "0 0 24 24",
                                                                                    fill: "none",
                                                                                    stroke: "currentColor",
                                                                                    strokeWidth: "3",
                                                                                    strokeLinecap: "round",
                                                                                    strokeLinejoin: "round",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                                        points: "20 6 9 17 4 12"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                        lineNumber: 470,
                                                                                        columnNumber: 211
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                    lineNumber: 470,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                                lineNumber: 469,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, aircraft.id, true, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 425,
                                                                        columnNumber: 27
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 416,
                                                                columnNumber: 19
                                                            }, this),
                                                            specificNeeds.aircraft_ids.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-2 text-[11px] text-[#00a65a] font-bold bg-[#e8f5e9] p-2 rounded flex justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            specificNeeds.aircraft_ids.length,
                                                                            " armada dipilih. Tarif akan diakumulasikan."
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 480,
                                                                        columnNumber: 24
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "Luas dibutuhkan: ",
                                                                            requiredArea,
                                                                            " m²"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 481,
                                                                        columnNumber: 24
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 479,
                                                                columnNumber: 22
                                                            }, this),
                                                            isOverCapacity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-2 text-[11px] text-red-600 font-bold bg-red-50 border border-red-200 p-2 rounded flex items-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                                        className: "w-4 h-4 mr-1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                        lineNumber: 486,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    " Kapasitas hanggar tidak mencukupi untuk jumlah pesawat yang dipilih!"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                                lineNumber: 485,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                        lineNumber: 414,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 411,
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
                                                        lineNumber: 494,
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
                                                        lineNumber: 495,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                                lineNumber: 493,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                        lineNumber: 409,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8 flex justify-end gap-3 pt-4 border-t border-[#f4f4f4]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading || isOverCapacity,
                                    className: `px-5 py-2 text-[14px] font-bold transition-colors rounded-sm flex items-center shadow-sm disabled:opacity-70 ${isOverCapacity ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#00a65a] text-white hover:bg-[#008d4c]'}`,
                                    children: [
                                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            className: "w-4 h-4 animate-spin mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                            lineNumber: 504,
                                            columnNumber: 26
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                            className: "w-4 h-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                            lineNumber: 504,
                                            columnNumber: 78
                                        }, this),
                                        "Kirim Permohonan"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                    lineNumber: 503,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                                lineNumber: 502,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/tenant/permohonan/buat/page.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
_s(BuatPermohonanPage, "vjeR7B+iH0Krp4sa18TB6kqsZlU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
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
    getAssetCapacity: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/assets/${id}/capacity`);
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
"[project]/src/services/contractService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "contractService",
    ()=>contractService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
;
const contractService = {
    getContracts: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/contracts');
        return response.data.data;
    },
    getContractById: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/contracts/${id}`);
        return response.data.data;
    },
    updateContractStatusByTenant: async (id, payload)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/contracts/tenant/${id}/status`, payload);
        return response.data.data;
    },
    terminateContract: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/contracts/${id}/terminate`);
        return response.data.data;
    },
    updateContract: async (id, payload)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/contracts/${id}`, payload);
        return response.data.data;
    },
    // Tenant methods
    getTenantContracts: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/contracts/tenant');
        return response.data.data;
    },
    getTenantContractById: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/contracts/tenant/${id}`);
        return response.data.data;
    },
    updateTenantContractStatus: async (id, payload)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/contracts/tenant/${id}/status`, payload);
        return response.data.data;
    },
    extendContract: async (id, newEndDate)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/contracts/tenant/${id}/extend`, {
            new_end_date: newEndDate
        });
        return response.data;
    },
    uploadSignature: async (id, formData)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/contracts/tenant/${id}/upload-signature`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    verifyContract: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/contracts/${id}/verify`);
        return response.data;
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
    },
    approveKadis: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/rentals/${id}/approve-kadis`);
        return response.data.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_13rvi8b._.js.map