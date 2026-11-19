"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ISamMamChild } from "@/models/SamMamChild";
import { calculateChildNutritionStatus, formatReportMonth, getNextMonthName } from "@/lib/nutritionLogic";
import NutritionLogicSettingsModal from "@/components/admin-portal/NutritionLogicSettingsModal";

export default function AdminNutritionMissionPage() {
    const [children, setChildren] = useState<ISamMamChild[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [monthFilter, setMonthFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [activeTab, setActiveTab] = useState<"sam-mam" | "pregnant" | "tb">("sam-mam");
    const [expandedChildId, setExpandedChildId] = useState<string | null>(null);

    // Modal state for Add/Edit Child Profile (Full Form)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChild, setEditingChild] = useState<ISamMamChild | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Modal state for "+ Add Another Month" (Grouped into parent data: NO pic, NO name, NO guardian, NO address)
    const [isAddMonthModalOpen, setIsAddMonthModalOpen] = useState(false);
    const [selectedChildForMonth, setSelectedChildForMonth] = useState<ISamMamChild | null>(null);
    const [submittingMonth, setSubmittingMonth] = useState(false);
    const [monthErrorMsg, setMonthErrorMsg] = useState("");
    const [monthSuccessMsg, setMonthSuccessMsg] = useState("");

    // Modal state for "⚙️ WHO Growth Logic & Standards"
    const [isLogicModalOpen, setIsLogicModalOpen] = useState(false);
    const [nutritionLogicConfig, setNutritionLogicConfig] = useState<any>(null);

    const currentDateStr = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    const currentMonthStr = formatReportMonth(currentDateStr);

    // Initial form state for Enrolling a new child / full edit
    const initialFormState = {
        name: "",
        anthropometricMeasurement: "SAM",
        sex: "Male",
        dateOfEntry: currentDateStr,
        reportMonth: currentMonthStr,
        guardianName: "",
        dateOfBirth: "",
        age: "",
        weight: "",
        height: "",
        muac: "",
        head: "",
        chest: "",
        last14DaysIllness: "None",
        ebf: "Yes (Up to 6 Months)",
        immunization: "Complete",
        remarks: "",
        address: "",
        image: "",
        baselineWeight: "",
        targetWeight: "",
        baselineMuac: "",
        targetMuac: "12.5",
        customRecoveryPercentage: "",
    };

    const [formData, setFormData] = useState(initialFormState);

    // Form state for "+ Add Another Month" (NO photo, NO name, NO guardian, NO address)
    const initialMonthFormState = {
        childId: "",
        reportMonth: "",
        dateOfEntry: currentDateStr,
        age: "",
        anthropometricMeasurement: "SAM",
        weight: "",
        height: "",
        muac: "",
        head: "",
        chest: "",
        last14DaysIllness: "None",
        ebf: "Yes",
        immunization: "Complete",
        remarks: "",
        baselineWeight: "",
        targetWeight: "",
        baselineMuac: "",
        targetMuac: "12.5",
        customRecoveryPercentage: "",
    };

    const [addMonthFormData, setAddMonthFormData] = useState(initialMonthFormState);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadImageMsg, setUploadImageMsg] = useState("");
    const [quickUploadingChildId, setQuickUploadingChildId] = useState<string | null>(null);

    useEffect(() => {
        fetchChildren();
        fetchLogicConfig();
    }, []);

    const fetchLogicConfig = async () => {
        try {
            const res = await fetch("/api/admin/nutrition-logic-config");
            const json = await res.json();
            if (json.success && json.data) {
                setNutritionLogicConfig(json.data);
            }
        } catch (error) {
            console.error("Failed to fetch nutrition logic config:", error);
        }
    };

    const fetchChildren = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/sam-mam-children");
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                setChildren(json.data);
            }
        } catch (error) {
            console.error("Failed to fetch children:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate unique available months for filter across all children & sub-months
    const availableMonths = useMemo(() => {
        const set = new Set<string>();
        children.forEach((c) => {
            if (c.reportMonth) set.add(c.reportMonth);
            if (Array.isArray(c.monthlyReports)) {
                c.monthlyReports.forEach((r: any) => {
                    if (r.reportMonth) set.add(r.reportMonth);
                });
            }
        });
        return Array.from(set);
    }, [children]);

    const handleOpenAddModal = () => {
        setEditingChild(null);
        setFormData(initialFormState);
        setErrorMsg("");
        setSuccessMsg("");
        setUploadImageMsg("");
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (child: ISamMamChild) => {
        setEditingChild(child);
        const resolvedMonth = child.reportMonth || formatReportMonth(child.dateOfEntry);
        setFormData({
            name: child.name || "",
            anthropometricMeasurement: child.anthropometricMeasurement || "SAM",
            sex: child.sex || "Male",
            dateOfEntry: child.dateOfEntry || "",
            reportMonth: resolvedMonth,
            guardianName: child.guardianName || "",
            dateOfBirth: child.dateOfBirth || "",
            age: child.age || "",
            weight: String(child.weight || ""),
            height: String(child.height || ""),
            muac: String(child.muac || ""),
            head: String(child.head || ""),
            chest: String(child.chest || ""),
            last14DaysIllness: child.last14DaysIllness || "None",
            ebf: child.ebf || "Yes",
            immunization: child.immunization || "Complete",
            remarks: child.remarks || "",
            address: child.address || "",
            image: child.image || "",
            baselineWeight: child.baselineWeight ? String(child.baselineWeight) : "",
            targetWeight: child.targetWeight ? String(child.targetWeight) : "",
            baselineMuac: child.baselineMuac ? String(child.baselineMuac) : "",
            targetMuac: child.targetMuac ? String(child.targetMuac) : "12.5",
            customRecoveryPercentage: child.customRecoveryPercentage !== undefined ? String(child.customRecoveryPercentage) : "",
        });
        setErrorMsg("");
        setSuccessMsg("");
        setUploadImageMsg("");
        setIsModalOpen(true);
    };

    // OPEN "+ Add Another Month" modal for a specific child — blank "next month" form
    const handleOpenAddMonthModal = (child: ISamMamChild) => {
        setSelectedChildForMonth(child);
        setMonthErrorMsg("");
        setMonthSuccessMsg("");

        const childMonth = child.reportMonth || formatReportMonth(child.dateOfEntry);
        const suggestedNextMonth = getNextMonthName(childMonth);

        setAddMonthFormData({
            childId: child._id || "",
            reportMonth: suggestedNextMonth,
            dateOfEntry: currentDateStr,
            age: child.age || "",
            anthropometricMeasurement: child.anthropometricMeasurement || "SAM",
            weight: String(child.weight || ""),
            height: String(child.height || ""),
            muac: String(child.muac || ""),
            head: String(child.head || ""),
            chest: String(child.chest || ""),
            last14DaysIllness: "None",
            ebf: child.ebf || "Yes",
            immunization: child.immunization || "Complete",
            remarks: "",
            baselineWeight: String(child.baselineWeight || child.weight || ""),
            targetWeight: child.targetWeight ? String(child.targetWeight) : "",
            baselineMuac: String(child.baselineMuac || child.muac || ""),
            targetMuac: child.targetMuac ? String(child.targetMuac) : "12.5",
            customRecoveryPercentage: "",
        });

        setIsAddMonthModalOpen(true);
    };

    // OPEN "Edit Month" modal for a SPECIFIC existing sub-month report — pre-fills that month's data
    const handleOpenEditMonthModal = (child: ISamMamChild, monthReport: any) => {
        setSelectedChildForMonth(child);
        setMonthErrorMsg("");
        setMonthSuccessMsg("");

        setAddMonthFormData({
            childId: child._id || "",
            reportMonth: monthReport.reportMonth || "",
            dateOfEntry: monthReport.dateOfEntry || currentDateStr,
            age: monthReport.age || child.age || "",
            anthropometricMeasurement: monthReport.anthropometricMeasurement || child.anthropometricMeasurement || "SAM",
            weight: String(monthReport.weight ?? ""),
            height: String(monthReport.height ?? ""),
            muac: String(monthReport.muac ?? ""),
            head: String(monthReport.head ?? ""),
            chest: String(monthReport.chest ?? ""),
            last14DaysIllness: monthReport.last14DaysIllness || "None",
            ebf: monthReport.ebf || child.ebf || "Yes",
            immunization: monthReport.immunization || child.immunization || "Complete",
            remarks: monthReport.remarks || "",
            baselineWeight: String(child.baselineWeight || child.weight || ""),
            targetWeight: child.targetWeight ? String(child.targetWeight) : "",
            baselineMuac: String(child.baselineMuac || child.muac || ""),
            targetMuac: child.targetMuac ? String(child.targetMuac) : "12.5",
            customRecoveryPercentage: monthReport.customRecoveryPercentage ? String(monthReport.customRecoveryPercentage) : "",
        });

        setIsAddMonthModalOpen(true);
    };

    const handleDeleteChild = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete child record: ${name} and all associated monthly data?`)) return;

        try {
            const res = await fetch(`/api/admin/sam-mam-children/${id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (json.success) {
                setChildren((prev) => prev.filter((c) => c._id !== id));
            } else {
                alert(json.message || "Failed to delete");
            }
        } catch (error) {
            alert("Error deleting child record");
        }
    };

    const handleDeleteMonth = async (childId: string, month: string) => {
        if (!confirm(`Are you sure you want to delete the monthly report for "${month}"?`)) return;

        try {
            const res = await fetch(`/api/admin/sam-mam-children/${childId}?month=${encodeURIComponent(month)}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (json.success) {
                fetchChildren();
            } else {
                alert(json.message || "Failed to delete month record");
            }
        } catch (error) {
            alert("Error deleting month record");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setUploadImageMsg("Uploading image to Cloudinary...");

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = reader.result as string;
            // Set temporary preview immediately
            setFormData((prev) => ({ ...prev, image: base64Data }));

            try {
                const res = await fetch("/api/admin/sam-mam-children/upload-image", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        image: base64Data,
                        childId: editingChild ? editingChild._id : undefined,
                    }),
                });
                const json = await res.json();
                if (json.success && json.url) {
                    setFormData((prev) => ({ ...prev, image: json.url }));
                    setUploadImageMsg("✓ Uploaded & stored in Cloudinary");
                    if (editingChild) {
                        fetchChildren();
                    }
                } else {
                    setUploadImageMsg("⚠️ Upload warning: " + (json.message || "Failed to upload"));
                }
            } catch (err: any) {
                console.error("Cloudinary upload failed:", err);
                setUploadImageMsg("⚠️ " + (err.message || "Upload network failure"));
            } finally {
                setUploadingImage(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleQuickImageUpload = (e: React.ChangeEvent<HTMLInputElement>, childId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setQuickUploadingChildId(childId);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = reader.result as string;
            try {
                const res = await fetch("/api/admin/sam-mam-children/upload-image", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        image: base64Data,
                        childId: childId,
                    }),
                });
                const json = await res.json();
                if (json.success) {
                    await fetchChildren();
                } else {
                    alert("Image upload failed: " + (json.message || "Unknown error"));
                }
            } catch (err: any) {
                console.error("Quick image upload failed:", err);
                alert("Upload failed: " + (err.message || "Network error"));
            } finally {
                setQuickUploadingChildId(null);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDateOfEntryChange = (val: string) => {
        setFormData((prev) => {
            const autoMonth = formatReportMonth(val);
            return {
                ...prev,
                dateOfEntry: val,
                reportMonth: prev.reportMonth === currentMonthStr || !prev.reportMonth ? autoMonth : prev.reportMonth,
            };
        });
    };

    const handleMonthModalDateChange = (val: string) => {
        setAddMonthFormData((prev) => {
            const autoMonth = formatReportMonth(val);
            return {
                ...prev,
                dateOfEntry: val,
                reportMonth: prev.reportMonth ? prev.reportMonth : autoMonth,
            };
        });
    };

    // Auto classify SAM / MAM based on MUAC input
    const handleMuacChange = (val: string) => {
        const num = parseFloat(val);
        let status = formData.anthropometricMeasurement;
        if (!isNaN(num)) {
            if (num < 11.5) {
                status = "SAM (Severe Acute Malnutrition)";
            } else if (num < 12.5) {
                status = "MAM (Moderate Acute Malnutrition)";
            } else {
                status = "Normal / Recovered";
            }
        }
        setFormData((prev) => ({
            ...prev,
            muac: val,
            anthropometricMeasurement: status,
        }));
    };

    const handleAddMonthMuacChange = (val: string) => {
        const num = parseFloat(val);
        let status = addMonthFormData.anthropometricMeasurement;
        if (!isNaN(num)) {
            if (num < 11.5) {
                status = "SAM (Severe Acute Malnutrition)";
            } else if (num < 12.5) {
                status = "MAM (Moderate Acute Malnutrition)";
            } else {
                status = "Normal / Recovered";
            }
        }
        setAddMonthFormData((prev) => ({
            ...prev,
            muac: val,
            anthropometricMeasurement: status,
        }));
    };

    // Submit for full Add/Edit child form (Enroll New Child)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const url = editingChild
                ? `/api/admin/sam-mam-children/${editingChild._id}`
                : "/api/admin/sam-mam-children";
            const method = editingChild ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const json = await res.json();

            if (json.success) {
                setSuccessMsg(editingChild ? "Child updated successfully!" : "Child enrolled successfully!");
                setTimeout(() => {
                    setIsModalOpen(false);
                    fetchChildren();
                }, 800);
            } else {
                setErrorMsg(json.message || "Operation failed");
            }
        } catch (err: any) {
            setErrorMsg(err.message || "Network error");
        } finally {
            setSubmitting(false);
        }
    };

    // Submit for "+ Add Another Month" form (Groups directly into parent data)
    const handleAddMonthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedChildForMonth) return;

        setSubmittingMonth(true);
        setMonthErrorMsg("");
        setMonthSuccessMsg("");

        try {
            const payload = {
                childId: selectedChildForMonth._id,
                dateOfEntry: addMonthFormData.dateOfEntry,
                reportMonth: addMonthFormData.reportMonth || formatReportMonth(addMonthFormData.dateOfEntry),
                age: addMonthFormData.age,
                anthropometricMeasurement: addMonthFormData.anthropometricMeasurement,
                weight: addMonthFormData.weight,
                height: addMonthFormData.height,
                muac: addMonthFormData.muac,
                head: addMonthFormData.head,
                chest: addMonthFormData.chest,
                last14DaysIllness: addMonthFormData.last14DaysIllness,
                ebf: addMonthFormData.ebf,
                immunization: addMonthFormData.immunization,
                remarks: addMonthFormData.remarks,
                customRecoveryPercentage: addMonthFormData.customRecoveryPercentage,
            };

            const res = await fetch("/api/admin/sam-mam-children", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (json.success) {
                setMonthSuccessMsg(`Monthly report for "${addMonthFormData.reportMonth}" added to ${selectedChildForMonth.name}'s group successfully!`);
                setTimeout(() => {
                    setIsAddMonthModalOpen(false);
                    fetchChildren();
                }, 800);
            } else {
                setMonthErrorMsg(json.message || "Failed to add monthly report");
            }
        } catch (err: any) {
            setMonthErrorMsg(err.message || "Network error");
        } finally {
            setSubmittingMonth(false);
        }
    };

    // Filtered children based on search and filters
    const filteredChildren = children.filter((child) => {
        const matchesSearch =
            child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            child.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            child.address.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesMonth = true;
        if (monthFilter !== "ALL") {
            const currentMatches = (child.reportMonth || "").toLowerCase() === monthFilter.toLowerCase();
            const anySubReportMatches = Array.isArray(child.monthlyReports) && child.monthlyReports.some(
                (r: any) => (r.reportMonth || "").toLowerCase() === monthFilter.toLowerCase()
            );
            matchesMonth = currentMatches || anySubReportMatches;
        }

        let matchesStatus = true;
        if (statusFilter === "SAM") {
            matchesStatus = child.anthropometricMeasurement.toUpperCase().includes("SAM") || child.muac < 11.5;
        } else if (statusFilter === "MAM") {
            matchesStatus = child.anthropometricMeasurement.toUpperCase().includes("MAM") || (child.muac >= 11.5 && child.muac < 12.5);
        } else if (statusFilter === "RECOVERED") {
            matchesStatus = child.anthropometricMeasurement.toLowerCase().includes("normal") || child.muac >= 12.5;
        }

        return matchesSearch && matchesMonth && matchesStatus;
    });

    // Preview score for modal form
    const previewAnalysis = calculateChildNutritionStatus({
        weight: parseFloat(formData.weight) || 0,
        height: parseFloat(formData.height) || 0,
        muac: parseFloat(formData.muac) || 0,
        head: parseFloat(formData.head) || 0,
        chest: parseFloat(formData.chest) || 0,
        sex: formData.sex,
        age: formData.age,
        anthropometricMeasurement: formData.anthropometricMeasurement,
        last14DaysIllness: formData.last14DaysIllness,
        ebf: formData.ebf,
        immunization: formData.immunization,
        baselineWeight: parseFloat(formData.baselineWeight) || undefined,
        targetWeight: parseFloat(formData.targetWeight) || undefined,
        customRecoveryPercentage: formData.customRecoveryPercentage ? parseFloat(formData.customRecoveryPercentage) : undefined,
    }, nutritionLogicConfig || undefined);

    // Preview score for "+ Add Another Month" form
    const addMonthPreviewAnalysis = calculateChildNutritionStatus({
        weight: parseFloat(addMonthFormData.weight) || 0,
        height: parseFloat(addMonthFormData.height) || 0,
        muac: parseFloat(addMonthFormData.muac) || 0,
        head: parseFloat(addMonthFormData.head) || 0,
        chest: parseFloat(addMonthFormData.chest) || 0,
        sex: selectedChildForMonth?.sex || "Male",
        age: addMonthFormData.age,
        anthropometricMeasurement: addMonthFormData.anthropometricMeasurement,
        last14DaysIllness: addMonthFormData.last14DaysIllness,
        ebf: addMonthFormData.ebf,
        immunization: addMonthFormData.immunization,
        baselineWeight: parseFloat(addMonthFormData.baselineWeight) || undefined,
        targetWeight: parseFloat(addMonthFormData.targetWeight) || undefined,
        customRecoveryPercentage: addMonthFormData.customRecoveryPercentage ? parseFloat(addMonthFormData.customRecoveryPercentage) : undefined,
    }, nutritionLogicConfig || undefined);

    return (
        <div className="pt-20 pb-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                            Admin Mission Registry
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mt-1">
                        Our Nutrition Mission Management
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Manage child beneficiaries. Use <strong>&quot;Enroll New Child&quot;</strong> to register a new child, or <strong>&quot;+ Add Month&quot;</strong> to add monthly assessments grouped under that child.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setIsLogicModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                        title="Configure WHO growth references and assessment logic"
                    >
                        <span>⚙️</span>
                        <span>WHO Growth Logic</span>
                    </button>

                    <a
                        href="/our-nutrition-mission"
                        target="_blank"
                        className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <span>View Public Page</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>

                    <button
                        onClick={handleOpenAddModal}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Enroll New Child</span>
                    </button>
                </div>
            </div>

            {/* Program Tabs */}
            <div className="flex border-b border-gray-200 gap-4 text-xs font-bold">
                <button
                    onClick={() => setActiveTab("sam-mam")}
                    className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer ${
                        activeTab === "sam-mam"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                >
                    👶 SAM / MAM Child Registry ({children.length} Children)
                </button>
                <button
                    onClick={() => setActiveTab("pregnant")}
                    className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer ${
                        activeTab === "pregnant"
                            ? "border-rose-600 text-rose-600"
                            : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                >
                    🤰 Pregnant Mother Registry (Phase 2)
                </button>
                <button
                    onClick={() => setActiveTab("tb")}
                    className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer ${
                        activeTab === "tb"
                            ? "border-teal-600 text-teal-600"
                            : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                >
                    🩺 TB Patients Registry (Phase 3)
                </button>
            </div>

            {/* TAB 1: SAM / MAM CHILD REGISTRY */}
            {activeTab === "sam-mam" && (
                <div className="space-y-6">
                    {/* Filters Toolbar with Month Filter */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        {/* Search */}
                        <div className="sm:col-span-5 relative">
                            <input
                                type="text"
                                placeholder="Search by name, guardian, address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Month Filter */}
                        <div className="sm:col-span-4">
                            <select
                                value={monthFilter}
                                onChange={(e) => setMonthFilter(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-blue-50/70 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 font-bold cursor-pointer"
                            >
                                <option value="ALL">📅 All Months</option>
                                {availableMonths.map((m) => (
                                    <option key={m} value={m}>
                                        📅 {m}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="sm:col-span-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                            >
                                <option value="ALL">All Nutrition Statuses</option>
                                <option value="SAM">SAM (Severe Malnutrition)</option>
                                <option value="MAM">MAM (Moderate Malnutrition)</option>
                                <option value="RECOVERED">Recovered / Normal</option>
                            </select>
                        </div>
                    </div>

                    {/* Children Table - Grouped by Parent Child */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
                                        <th className="py-3.5 px-4">Photo</th>
                                        <th className="py-3.5 px-4">Name</th>
                                        <th className="py-3.5 px-4">Report Month</th>
                                        <th className="py-3.5 px-4">Classification</th>
                                        <th className="py-3.5 px-4">Sex / Age</th>
                                        <th className="py-3.5 px-4">Entry Date</th>
                                        <th className="py-3.5 px-4">Guardian</th>
                                        <th className="py-3.5 px-4">Weight / Height</th>
                                        <th className="py-3.5 px-4">MUAC</th>
                                        <th className="py-3.5 px-4">Dashboard %</th>
                                        <th className="py-3.5 px-4 text-right min-w-[210px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={11} className="py-12 text-center text-gray-400">
                                                Loading children records...
                                            </td>
                                        </tr>
                                    ) : filteredChildren.length === 0 ? (
                                        <tr>
                                            <td colSpan={11} className="py-12 text-center text-gray-400">
                                                No child records found for this filter. Click &quot;Enroll New Child&quot; to add one.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredChildren.map((child) => {
                                            const resolvedMonth = formatReportMonth(child.dateOfEntry, child.reportMonth);
                                            const analysis = calculateChildNutritionStatus({
                                                weight: child.weight,
                                                height: child.height,
                                                muac: child.muac,
                                                head: child.head,
                                                chest: child.chest,
                                                sex: child.sex,
                                                age: child.age,
                                                dateOfBirth: child.dateOfBirth,
                                                dateOfEntry: child.dateOfEntry,
                                                anthropometricMeasurement: child.anthropometricMeasurement,
                                                last14DaysIllness: child.last14DaysIllness,
                                                ebf: child.ebf,
                                                immunization: child.immunization,
                                                baselineWeight: child.baselineWeight,
                                                targetWeight: child.targetWeight,
                                                customRecoveryPercentage: child.customRecoveryPercentage,
                                            }, nutritionLogicConfig || undefined);

                                            const allMonths = Array.isArray(child.monthlyReports) && child.monthlyReports.length > 0
                                                ? child.monthlyReports
                                                : [];
                                            // Latest month = what the parent row already shows
                                            const latestMonthLabel = resolvedMonth;
                                            // Sub-months = all OTHER months (not the latest one shown in parent row)
                                            const subMonths = allMonths.filter(
                                                (r: any) => r.reportMonth?.toLowerCase() !== latestMonthLabel.toLowerCase()
                                            );
                                            const hasSubMonths = subMonths.length > 0;
                                            const isExpanded = expandedChildId === child._id;

                                            return (
                                                <React.Fragment key={child._id}>
                                                    {/* ══════════ PARENT ROW (Latest Month Data) ══════════ */}
                                                    <tr className={`hover:bg-blue-50/40 transition-colors ${isExpanded ? "bg-blue-50/30 border-l-4 border-l-blue-400" : ""}`}>
                                                        {/* Photo + Expand Toggle */}
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-2">
                                                                {hasSubMonths && (
                                                                    <button
                                                                        onClick={() => setExpandedChildId(isExpanded ? null : child._id!)}
                                                                        className={`w-5 h-5 flex items-center justify-center rounded transition-all cursor-pointer flex-shrink-0 ${isExpanded ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-blue-100 hover:text-blue-700"}`}
                                                                        title={isExpanded ? "Collapse monthly history" : "Expand monthly history"}
                                                                    >
                                                                        <span className="text-[9px] font-black leading-none">{isExpanded ? "▼" : "▶"}</span>
                                                                    </button>
                                                                )}
                                                                {!hasSubMonths && <div className="w-5 flex-shrink-0" />}
                                                                <label
                                                                    className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 cursor-pointer group"
                                                                    title="Click to select & upload child photo to Cloudinary"
                                                                >
                                                                    {child.image ? (
                                                                        <Image src={child.image} alt={child.name} fill className="object-cover group-hover:opacity-75 transition-opacity" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xs group-hover:bg-blue-200">
                                                                            {child.name.charAt(0)}
                                                                        </div>
                                                                    )}
                                                                    {quickUploadingChildId === child._id ? (
                                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                                                                            📷
                                                                        </div>
                                                                    )}
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        disabled={quickUploadingChildId === child._id}
                                                                        className="hidden"
                                                                        onChange={(e) => handleQuickImageUpload(e, child._id!)}
                                                                    />
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">
                                                            <div className="flex items-center gap-1.5">
                                                                <span>{child.name}</span>
                                                                {hasSubMonths && (
                                                                    <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[9px] font-black border border-blue-200">
                                                                        {allMonths.length}M
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {hasSubMonths && (
                                                                <button
                                                                    onClick={() => setExpandedChildId(isExpanded ? null : child._id!)}
                                                                    className="text-[9px] text-blue-500 hover:text-blue-700 font-semibold mt-0.5 cursor-pointer flex items-center gap-0.5"
                                                                >
                                                                    {isExpanded ? "▲ Hide previous months" : `▼ View ${subMonths.length} more month${subMonths.length > 1 ? "s" : ""}`}
                                                                </button>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 whitespace-nowrap">
                                                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-bold text-[11px] inline-flex items-center gap-1">
                                                                <span>📅</span>
                                                                <span>{resolvedMonth}</span>
                                                            </span>
                                                            <div className="text-[9px] text-gray-400 mt-0.5 font-medium">Latest entry</div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${analysis.stageColor.bg} ${analysis.stageColor.text} ${analysis.stageColor.border}`}>
                                                                {child.anthropometricMeasurement}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 whitespace-nowrap">
                                                            {child.sex} • {child.age}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                                                            {child.dateOfEntry}
                                                        </td>
                                                        <td className="py-3 px-4 whitespace-nowrap">
                                                            {child.guardianName}
                                                        </td>
                                                        <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">
                                                            {child.weight} kg / {child.height} cm
                                                        </td>
                                                        <td className="py-3 px-4 whitespace-nowrap">
                                                            <span className={`font-bold ${analysis.muacStatus.color}`}>
                                                                {child.muac} cm
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-12 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                                    <div
                                                                        className="h-2 rounded-full"
                                                                        style={{
                                                                            width: `${analysis.percentage}%`,
                                                                            backgroundColor: analysis.stageColor.accent,
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                                <span className="font-bold text-gray-900 text-[11px]">
                                                                    {analysis.percentage}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {/* + ADD ANOTHER MONTH BUTTON (GROUPS INTO PARENT DATA) */}
                                                                <button
                                                                    onClick={() => handleOpenAddMonthModal(child)}
                                                                    className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                                                    title={`+ Add another month report for ${child.name}`}
                                                                >
                                                                    <span className="text-sm font-black leading-none">+</span>
                                                                    <span>Add Month</span>
                                                                </button>

                                                                {/* Edit */}
                                                                <button
                                                                    onClick={() => handleOpenEditModal(child)}
                                                                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                                                    title="Edit Child Profile"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>

                                                                {/* Delete */}
                                                                <button
                                                                    onClick={() => handleDeleteChild(child._id!, child.name)}
                                                                    className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                                                    title="Delete Child Profile"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                     {/* ══════ EXPANDABLE SUB-ROWS: OLDER MONTHS ══════ */}
                                                     {isExpanded && hasSubMonths && subMonths.map((r: any, idx: number) => {
                                                         const monthAnalysis = calculateChildNutritionStatus({
                                                             weight: r.weight,
                                                             height: r.height,
                                                             muac: r.muac,
                                                             head: r.head || child.head,
                                                             chest: r.chest || child.chest,
                                                             sex: child.sex,
                                                             age: r.age || child.age,
                                                             dateOfBirth: child.dateOfBirth,
                                                             dateOfEntry: r.dateOfEntry,
                                                             anthropometricMeasurement: r.anthropometricMeasurement,
                                                             last14DaysIllness: r.last14DaysIllness,
                                                             ebf: r.ebf,
                                                             immunization: r.immunization,
                                                             baselineWeight: child.baselineWeight,
                                                             targetWeight: child.targetWeight,
                                                             customRecoveryPercentage: r.customRecoveryPercentage,
                                                         }, nutritionLogicConfig || undefined);
                                                         const isLastSub = idx === subMonths.length - 1;
                                                         return (
                                                             <tr
                                                                 key={`sub-${child._id}-${idx}`}
                                                                 className={`bg-blue-50/20 hover:bg-blue-50/50 transition-colors ${isLastSub ? "border-b-2 border-blue-300" : ""}`}
                                                             >
                                                                 <td className="py-2.5 px-4">
                                                                     <div className="flex items-center gap-1.5 pl-7">
                                                                         <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                     </div>
                                                                 </td>
                                                                 <td className="py-2.5 px-4">
                                                                     <span className="text-[10px] text-blue-500 font-semibold italic">subentry of {child.name}</span>
                                                                 </td>
                                                                 <td className="py-2.5 px-4 whitespace-nowrap">
                                                                     <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] inline-flex items-center gap-1">
                                                                         <span>&#128197;</span>
                                                                         <span>{r.reportMonth}</span>
                                                                     </span>
                                                                     <div className="text-[9px] text-gray-400 mt-0.5">Previous entry</div>
                                                                 </td>
                                                                 <td className="py-2.5 px-4">
                                                                     <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${monthAnalysis.stageColor.bg} ${monthAnalysis.stageColor.text} ${monthAnalysis.stageColor.border}`}>
                                                                         {r.anthropometricMeasurement}
                                                                     </span>
                                                                 </td>
                                                                 <td className="py-2.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                                                                     {child.sex} - {r.age}
                                                                 </td>
                                                                 <td className="py-2.5 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                                                                     {r.dateOfEntry}
                                                                 </td>
                                                                 <td className="py-2.5 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                                                                     {child.guardianName}
                                                                 </td>
                                                                 <td className="py-2.5 px-4 font-semibold text-gray-700 text-[11px] whitespace-nowrap">
                                                                     {r.weight} kg / {r.height} cm
                                                                 </td>
                                                                 <td className="py-2.5 px-4 whitespace-nowrap">
                                                                     <span className={`font-bold text-[11px] ${monthAnalysis.muacStatus.color}`}>
                                                                         {r.muac} cm
                                                                     </span>
                                                                 </td>
                                                                 <td className="py-2.5 px-4">
                                                                     <div className="flex items-center gap-1.5">
                                                                         <div className="w-10 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                                             <div
                                                                                 className="h-1.5 rounded-full"
                                                                                 style={{ width: `${monthAnalysis.percentage}%`, backgroundColor: monthAnalysis.stageColor.accent }}
                                                                             />
                                                                         </div>
                                                                         <span className="font-bold text-gray-700 text-[10px]">{monthAnalysis.percentage}%</span>
                                                                     </div>
                                                                 </td>
                                                                 <td className="py-2.5 px-4 text-right">
                                                                     <div className="flex items-center justify-end gap-1.5">
                                                                         {/* Edit sub-month — pre-fills THAT month's existing data */}
                                                                         <button
                                                                             onClick={() => handleOpenEditMonthModal(child, r)}
                                                                             className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                                                             title={`Edit ${r.reportMonth} report for ${child.name}`}
                                                                         >
                                                                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                             </svg>
                                                                         </button>
                                                                         {/* Delete sub-month */}
                                                                         <button
                                                                             onClick={() => handleDeleteMonth(child._id!, r.reportMonth)}
                                                                             className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                                                             title={`Delete ${r.reportMonth} entry`}
                                                                         >
                                                                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                             </svg>
                                                                         </button>
                                                                     </div>
                                                                 </td>
                                                             </tr>
                                                         );
                                                     })}
                                                 </React.Fragment>
                                             );
                                         })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: PREGNANT MOTHER PREVIEW */}
            {activeTab === "pregnant" && (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center max-w-xl mx-auto space-y-4">
                    <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-2xl">
                        🤰
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Pregnant Mother Registry (Phase 2)</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        The registration schema and antenatal weight tracker for pregnant mothers are scheduled for Phase 2 implementation.
                    </p>
                </div>
            )}

            {/* TAB 3: TB PATIENT PREVIEW */}
            {activeTab === "tb" && (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center max-w-xl mx-auto space-y-4">
                    <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-2xl">
                        🩺
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">TB Patient Registry (Phase 3)</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        The TB patient nutritional support tracking module with protein basket logs will be connected in Phase 3.
                    </p>
                </div>
            )}

            {/* ======================================================== */}
            {/* MODAL 1: "+ ADD ANOTHER MONTH" FOR A SPECIFIC CHILD      */}
            {/* NO PHOTO, NO NAME, NO GUARDIAN NAME, NO ADDRESS FIELDS    */}
            {/* (GROUPS DIRECTLY INTO PARENT CHILD DATA)                  */}
            {/* ======================================================== */}
            {isAddMonthModalOpen && selectedChildForMonth && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 relative">
                        
                        {/* Close button */}
                        <button
                            onClick={() => setIsAddMonthModalOpen(false)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            ✕
                        </button>

                        <div className="pb-4 border-b border-gray-100">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {selectedChildForMonth.monthlyReports?.some((r: any) => r.reportMonth === addMonthFormData.reportMonth)
                                    ? "Edit Existing Monthly Report"
                                    : "Monthly Follow-Up Assessment (Grouped Under Parent)"}
                            </span>
                            <h2 className="text-xl font-black text-gray-900 mt-0.5">
                                {selectedChildForMonth.monthlyReports?.some((r: any) => r.reportMonth === addMonthFormData.reportMonth)
                                    ? `✏️ Edit ${addMonthFormData.reportMonth} Data for: ${selectedChildForMonth.name}`
                                    : `+ Add Month Data for: ${selectedChildForMonth.name}`}
                            </h2>
                        </div>

                        {monthErrorMsg && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                                {monthErrorMsg}
                            </div>
                        )}

                        {monthSuccessMsg && (
                            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl">
                                {monthSuccessMsg}
                            </div>
                        )}

                        {/* CHILD IDENTITY SUMMARY (READ-ONLY CONTEXT CARD) */}
                        <div className="mt-4 bg-gradient-to-r from-slate-900 to-blue-950 p-4 rounded-2xl text-white flex items-center gap-4 shadow-sm">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/10 border border-white/20 shrink-0">
                                {selectedChildForMonth.image ? (
                                    <Image src={selectedChildForMonth.image} alt={selectedChildForMonth.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-blue-300 font-bold text-lg">
                                        {selectedChildForMonth.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-base text-white truncate">
                                        {selectedChildForMonth.name}
                                    </h3>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 font-semibold">
                                        {selectedChildForMonth.sex}
                                    </span>
                                </div>
                                <p className="text-xs text-blue-200 truncate mt-0.5">
                                    Guardian: <span className="text-white font-semibold">{selectedChildForMonth.guardianName}</span> • 📍 {selectedChildForMonth.address}
                                </p>
                                <p className="text-[11px] text-gray-300 mt-1">
                                    Baseline Record: <span className="text-emerald-300 font-bold">{selectedChildForMonth.baselineWeight || selectedChildForMonth.weight} kg</span> • MUAC <span className="text-amber-300 font-bold">{selectedChildForMonth.baselineMuac || selectedChildForMonth.muac} cm</span> ({selectedChildForMonth.reportMonth || selectedChildForMonth.dateOfEntry})
                                </p>
                            </div>
                        </div>

                        {/* LIVE PREVIEW BANNER FOR THE NEW MONTH */}
                        <div className="mt-4 bg-gradient-to-r from-emerald-900 to-teal-950 p-3.5 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
                            <div>
                                <span className="text-emerald-300 font-bold uppercase text-[10px] block">
                                    Live Recovery Logic for Month: {addMonthFormData.reportMonth || "Upcoming Month"}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-lg font-black">{addMonthPreviewAnalysis.percentage}% Recovery</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${addMonthPreviewAnalysis.stageColor.bg} ${addMonthPreviewAnalysis.stageColor.text}`}>
                                        Stage: {addMonthPreviewAnalysis.stage}
                                    </span>
                                </div>
                            </div>
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${addMonthPreviewAnalysis.muacStatus.badgeColor}`}>
                                MUAC: {addMonthPreviewAnalysis.muacStatus.label}
                            </span>
                        </div>

                        {/* FORM: NO PIC, NO NAME, NO GUARDIAN, NO ADDRESS */}
                        <form onSubmit={handleAddMonthSubmit} className="mt-5 space-y-5">
                            
                            {/* Section 1: Month & Clinical Assessment Date */}
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2.5">
                                    1. Reporting Month & Assessment Date
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* REPORT MONTH */}
                                    <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
                                        <label className="block text-[11px] font-black text-emerald-900 mb-1">
                                            📅 REPORT MONTH <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            list="add-months-list"
                                            value={addMonthFormData.reportMonth}
                                            onChange={(e) => setAddMonthFormData({ ...addMonthFormData, reportMonth: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-black text-emerald-900"
                                            placeholder="e.g. December 2026"
                                        />
                                        <datalist id="add-months-list">
                                            <option value="January 2026" />
                                            <option value="February 2026" />
                                            <option value="March 2026" />
                                            <option value="April 2026" />
                                            <option value="May 2026" />
                                            <option value="June 2026" />
                                            <option value="July 2026" />
                                            <option value="August 2026" />
                                            <option value="September 2026" />
                                            <option value="October 2026" />
                                            <option value="November 2026" />
                                            <option value="December 2026" />
                                            <option value="January 2027" />
                                            <option value="February 2027" />
                                        </datalist>
                                        <span className="text-[10px] text-emerald-700 mt-1 block">
                                            Month being reported for {selectedChildForMonth.name}
                                        </span>
                                    </div>

                                    {/* Date of Entry */}
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                            Assessment Date (M/D/Y) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={addMonthFormData.dateOfEntry}
                                            onChange={(e) => handleMonthModalDateChange(e.target.value)}
                                            className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            placeholder="MM/DD/YYYY"
                                        />
                                        <span className="text-[10px] text-gray-500 mt-1 block">
                                            Date of measurement
                                        </span>
                                    </div>

                                    {/* Updated AGE */}
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                            Child AGE for this Month <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={addMonthFormData.age}
                                            onChange={(e) => setAddMonthFormData({ ...addMonthFormData, age: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            placeholder="e.g. 1 Year 9 Months"
                                        />
                                        <span className="text-[10px] text-gray-500 mt-1 block">
                                            Updated age milestone
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Updated Anthropometric Measurements */}
                            <div className="pt-3 border-t border-gray-100">
                                <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2.5">
                                    2. Anthropometric Measurements for {addMonthFormData.reportMonth || "this Month"}
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-blue-800 mb-1">
                                            WEIGHT (Kg) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={addMonthFormData.weight}
                                            onChange={(e) => setAddMonthFormData({ ...addMonthFormData, weight: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-blue-50/50 border border-blue-200 rounded-xl font-bold"
                                            placeholder="e.g. 8.2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-blue-800 mb-1">
                                            HEIGHT (cm) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={addMonthFormData.height}
                                            onChange={(e) => setAddMonthFormData({ ...addMonthFormData, height: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-blue-50/50 border border-blue-200 rounded-xl font-bold"
                                            placeholder="e.g. 77.0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-amber-800 mb-1">
                                            MUAC (cm) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={addMonthFormData.muac}
                                            onChange={(e) => handleAddMonthMuacChange(e.target.value)}
                                            className="w-full px-3 py-2 text-xs bg-amber-50/50 border border-amber-200 rounded-xl font-bold"
                                            placeholder="e.g. 11.8"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            Head (cm) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={addMonthFormData.head}
                                            onChange={(e) => setAddMonthFormData({ ...addMonthFormData, head: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-bold"
                                            placeholder="e.g. 45.5"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            Chest (cm) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={addMonthFormData.chest}
                                            onChange={(e) => setAddMonthFormData({ ...addMonthFormData, chest: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-bold"
                                            placeholder="e.g. 47.0"
                                        />
                                    </div>

                                    {/* Anthropometric Classification */}
                                    <div className="col-span-2 sm:col-span-5">
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            Anthropometric Classification for this Month *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={addMonthFormData.anthropometricMeasurement}
                                            onChange={(e) => setAddMonthFormData({ ...addMonthFormData, anthropometricMeasurement: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-bold text-blue-700"
                                            placeholder="e.g. SAM, MAM, SAM to MAM, Normal / Recovered"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Health, Feeding, Remarks */}
                            <div className="pt-3 border-t border-gray-100">
                                <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2.5">
                                    3. Health Symptoms, Feeding & Progress Observations
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            Last 14 days Illness *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={addMonthFormData.last14DaysIllness}
                                            onChange={(e) => setAddMonthFormData({ ...addMonthFormData, last14DaysIllness: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                                            placeholder="e.g. None, Mild Fever"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            EBF (Exclusive Breastfeeding) *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={addMonthFormData.ebf}
                                            onChange={(e) => setAddMonthFormData({ ...addMonthFormData, ebf: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                                            placeholder="e.g. Yes, Up to 6 Months"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            Immunization *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={addMonthFormData.immunization}
                                            onChange={(e) => setAddMonthFormData({ ...addMonthFormData, immunization: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                                            placeholder="Complete, Partial, Pending"
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            REMARKS (Progress Notes for this Month)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={addMonthFormData.remarks}
                                            onChange={(e) => setAddMonthFormData({ ...addMonthFormData, remarks: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                                            placeholder="Dietary intake, weight gain observation, appetite status..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Submit Footer */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddMonthModalOpen(false)}
                                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingMonth}
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                    {selectedChildForMonth.monthlyReports?.some((r: any) => r.reportMonth === addMonthFormData.reportMonth) ? (
                                        <>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span>{submittingMonth ? "Updating..." : `Update ${addMonthFormData.reportMonth} Report`}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-sm font-black">+</span>
                                            <span>{submittingMonth ? "Saving..." : `Save ${addMonthFormData.reportMonth || "Monthly"} Report to ${selectedChildForMonth.name}'s Group`}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* MODAL 2: FULL ENROLL NEW CHILD / EDIT CHILD FORM         */}
            {/* INCLUDES PHOTO, NAME, GUARDIAN, ADDRESS, ALL 17 FIELDS    */}
            {/* ======================================================== */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 relative">
                        
                        {/* Close button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            ✕
                        </button>

                        <div className="pb-4 border-b border-gray-100">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                                {editingChild ? "Edit Assessment Record" : "New Beneficiary Registration"}
                            </span>
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingChild ? `Update ${editingChild.name}'s Profile` : "Enroll New Child Beneficiary"}
                            </h2>
                        </div>

                        {errorMsg && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                                {errorMsg}
                            </div>
                        )}

                        {successMsg && (
                            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl">
                                {successMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            
                            {/* LIVE PREVIEW BANNER */}
                            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-4 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-md">
                                <div>
                                    <span className="text-blue-300 font-bold uppercase text-[10px] block">
                                        Real-Time Dashboard Logic Live Preview • Month: {formData.reportMonth || currentMonthStr}
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xl font-black">{previewAnalysis.percentage}% Recovery</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${previewAnalysis.stageColor.bg} ${previewAnalysis.stageColor.text}`}>
                                            Stage: {previewAnalysis.stage}
                                        </span>
                                    </div>
                                </div>
                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${previewAnalysis.muacStatus.badgeColor}`}>
                                    MUAC: {previewAnalysis.muacStatus.label}
                                </span>
                            </div>

                            {/* Section 1: Month Selection, Child Photo & Basic Identity */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
                                    <span>1. Month of Report & Identification</span>
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                    
                                    {/* REPORT MONTH */}
                                    <div className="sm:col-span-6 bg-blue-50/70 p-3 rounded-2xl border border-blue-200">
                                        <label className="block text-[11px] font-black text-blue-900 mb-1 flex items-center justify-between">
                                            <span>📅 INITIAL REPORT MONTH <span className="text-red-500">*</span></span>
                                            <span className="text-[10px] text-blue-600 font-normal">Enrollment Month</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            list="admin-months-list"
                                            value={formData.reportMonth}
                                            onChange={(e) => setFormData({ ...formData, reportMonth: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-black text-blue-900"
                                            placeholder="e.g. February 2026"
                                        />
                                        <datalist id="admin-months-list">
                                            <option value="January 2026" />
                                            <option value="February 2026" />
                                            <option value="March 2026" />
                                            <option value="April 2026" />
                                            <option value="May 2026" />
                                            <option value="June 2026" />
                                            <option value="July 2026" />
                                            <option value="August 2026" />
                                            <option value="September 2026" />
                                            <option value="October 2026" />
                                            <option value="November 2026" />
                                            <option value="December 2026" />
                                            <option value="October 2025" />
                                            <option value="November 2025" />
                                            <option value="December 2025" />
                                        </datalist>
                                        <span className="text-[10px] text-blue-700 mt-1 block">
                                            Choose or type the reporting month (e.g. February 2026)
                                        </span>
                                    </div>

                                    {/* Date of Entry */}
                                    <div className="sm:col-span-6 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                            Date of entry (M/D/Y) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.dateOfEntry}
                                            onChange={(e) => handleDateOfEntryChange(e.target.value)}
                                            className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                            placeholder="MM/DD/YYYY"
                                        />
                                        <span className="text-[10px] text-gray-500 mt-1 block">
                                            Clinical checkup / registration date
                                        </span>
                                    </div>

                                    {/* Photo upload */}
                                    <div className="sm:col-span-4">
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center justify-between">
                                            <span>Child Photo</span>
                                            {uploadingImage && (
                                                <span className="text-[10px] text-blue-600 font-semibold animate-pulse flex items-center gap-1">
                                                    <span className="inline-block w-2.5 h-2.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                                                    Uploading to Cloudinary...
                                                </span>
                                            )}
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                                {formData.image ? (
                                                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                        No img
                                                    </div>
                                                )}
                                                {uploadingImage && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={uploadingImage}
                                                    onChange={handleImageUpload}
                                                    className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50"
                                                />
                                                {uploadImageMsg && (
                                                    <p className={`text-[10px] mt-1 font-semibold ${uploadImageMsg.includes("✓") ? "text-emerald-600" : uploadImageMsg.includes("⚠️") ? "text-amber-600" : "text-blue-600"}`}>
                                                        {uploadImageMsg}
                                                    </p>
                                                )}
                                                <input
                                                    type="text"
                                                    placeholder="Or enter direct image / Cloudinary URL"
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    className="mt-1 w-full px-2 py-1 text-[11px] bg-gray-50 border border-gray-200 rounded-lg truncate"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* NAME */}
                                    <div className="sm:col-span-4">
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            NAME <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                                            placeholder="Child's Full Name"
                                        />
                                    </div>

                                    {/* Sex */}
                                    <div className="sm:col-span-4">
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            Sex <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.sex}
                                            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* GUARDIAN NAME */}
                                    <div className="sm:col-span-4">
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            GUARDIAN NAME <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.guardianName}
                                            onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                                            placeholder="Parent / Guardian Name"
                                        />
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="sm:col-span-4">
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                                        />
                                    </div>

                                    {/* AGE */}
                                    <div className="sm:col-span-4">
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            AGE <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                                            placeholder="e.g. 1 Year 6 Months"
                                        />
                                    </div>

                                    {/* Anthropometric Measurement */}
                                    <div className="sm:col-span-12">
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            Anthropometric Measurement <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.anthropometricMeasurement}
                                            onChange={(e) => setFormData({ ...formData, anthropometricMeasurement: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white font-semibold text-blue-700"
                                            placeholder="e.g. SAM, MAM, SAM to MAM, Normal / Recovered"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Clinical Anthropometry (WEIGHT, HEIGHT, MUAC, Head, Chest) */}
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-3">
                                    2. Anthropometric Measurements
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-blue-800 mb-1">
                                            WEIGHT (Kg) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-blue-50/50 border border-blue-200 rounded-xl font-bold"
                                            placeholder="e.g. 7.5"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-blue-800 mb-1">
                                            HEIGHT (cm) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={formData.height}
                                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-blue-50/50 border border-blue-200 rounded-xl font-bold"
                                            placeholder="e.g. 76.0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-amber-800 mb-1">
                                            MUAC (cm) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={formData.muac}
                                            onChange={(e) => handleMuacChange(e.target.value)}
                                            className="w-full px-3 py-2 text-xs bg-amber-50/50 border border-amber-200 rounded-xl font-bold"
                                            placeholder="e.g. 11.2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            Head (cm) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={formData.head}
                                            onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-bold"
                                            placeholder="e.g. 45.0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            Chest (cm) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={formData.chest}
                                            onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-bold"
                                            placeholder="e.g. 46.5"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Health Status, EBF, Immunization, Remarks, Address */}
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-3">
                                    3. Health, Clinical Assessment & Address
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            Last 14 days Illness *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.last14DaysIllness}
                                            onChange={(e) => setFormData({ ...formData, last14DaysIllness: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                                            placeholder="e.g. None, Fever, Diarrhoea"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            EBF (Exclusive Breastfeeding) *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.ebf}
                                            onChange={(e) => setFormData({ ...formData, ebf: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                                            placeholder="e.g. Yes, Up to 6 Months, No"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            Immunization *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.immunization}
                                            onChange={(e) => setFormData({ ...formData, immunization: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                                            placeholder="Complete, Partial, Pending"
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            REMARKS
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={formData.remarks}
                                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                                            placeholder="Clinical notes, therapeutic food protocol, observations..."
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                            ADDRESS *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                                            placeholder="Village, Gram Panchayat, Block, District"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Future Logic & Dashboard Adjustment (Optional) */}
                            <div className="pt-4 border-t border-gray-100 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                                    ⚙️ Dashboard Logic Tuning (Optional)
                                </h3>
                                <p className="text-[11px] text-gray-500 mb-3">
                                    Set initial baseline or custom recovery score if you wish to override dynamic algorithm calculation.
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-600 mb-1">Baseline Weight (kg)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.baselineWeight}
                                            onChange={(e) => setFormData({ ...formData, baselineWeight: e.target.value })}
                                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                            placeholder="At entry"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-600 mb-1">Target Weight (kg)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.targetWeight}
                                            onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                            placeholder="Target"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-600 mb-1">Manual Override %</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.customRecoveryPercentage}
                                            onChange={(e) => setFormData({ ...formData, customRecoveryPercentage: e.target.value })}
                                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                            placeholder="e.g. 75"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Submit Footer */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || uploadingImage}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                                >
                                    {uploadingImage ? "Uploading Photo..." : submitting ? "Saving..." : editingChild ? "Update Child Profile" : "Enroll Beneficiary"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* WHO Growth Logic Settings Modal */}
            <NutritionLogicSettingsModal
                isOpen={isLogicModalOpen}
                onClose={() => setIsLogicModalOpen(false)}
                onSaved={() => {
                    fetchChildren();
                    fetchLogicConfig();
                }}
            />

        </div>
    );
}
