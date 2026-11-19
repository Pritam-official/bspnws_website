"use client";

import React, { useState, useEffect } from "react";
import {
    DEFAULT_BOYS_REFERENCE,
    DEFAULT_GIRLS_REFERENCE,
    DEFAULT_MUAC_CUTOFFS,
    DEFAULT_PARAMETER_WEIGHTS,
    DEFAULT_STAGE_THRESHOLDS,
    IGrowthMilestone,
} from "@/lib/nutritionLogicTypes";

interface NutritionLogicSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved?: () => void;
}

export default function NutritionLogicSettingsModal({
    isOpen,
    onClose,
    onSaved,
}: NutritionLogicSettingsModalProps) {
    const [activeTab, setActiveTab] = useState<"height" | "weight" | "head" | "chest" | "muac-weights">("height");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Editable logic states
    const [boysRef, setBoysRef] = useState<IGrowthMilestone[]>(DEFAULT_BOYS_REFERENCE);
    const [girlsRef, setGirlsRef] = useState<IGrowthMilestone[]>(DEFAULT_GIRLS_REFERENCE);
    const [muacCutoffs, setMuacCutoffs] = useState(DEFAULT_MUAC_CUTOFFS);
    const [paramWeights, setParamWeights] = useState(DEFAULT_PARAMETER_WEIGHTS);
    const [stageThresholds, setStageThresholds] = useState(DEFAULT_STAGE_THRESHOLDS);

    useEffect(() => {
        if (isOpen) {
            fetchConfig();
        }
    }, [isOpen]);

    const fetchConfig = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch("/api/admin/nutrition-logic-config");
            const json = await res.json();
            if (json.success && json.data) {
                if (json.data.boysReference) setBoysRef(json.data.boysReference);
                if (json.data.girlsReference) setGirlsRef(json.data.girlsReference);
                if (json.data.muacCutoffs) setMuacCutoffs(json.data.muacCutoffs);
                if (json.data.parameterWeights) setParamWeights(json.data.parameterWeights);
                if (json.data.stageThresholds) setStageThresholds(json.data.stageThresholds);
            }
        } catch (error: any) {
            console.error("Failed to fetch logic config:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        // Validate total weights = 100%
        const totalWeight =
            Number(paramWeights.weightWeight) +
            Number(paramWeights.muacWeight) +
            Number(paramWeights.heightWeight) +
            Number(paramWeights.headWeight) +
            Number(paramWeights.chestWeight);

        if (totalWeight !== 100) {
            setMessage({
                type: "error",
                text: `Parameter weights must sum to exactly 100%. Current sum: ${totalWeight}%`,
            });
            setSaving(false);
            return;
        }

        try {
            const res = await fetch("/api/admin/nutrition-logic-config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    boysReference: boysRef,
                    girlsReference: girlsRef,
                    muacCutoffs,
                    parameterWeights: paramWeights,
                    stageThresholds,
                }),
            });
            const json = await res.json();
            if (json.success) {
                setMessage({ type: "success", text: "WHO Growth Logic & standards updated successfully!" });
                if (onSaved) onSaved();
                setTimeout(() => {
                    setMessage(null);
                    onClose();
                }, 1000);
            } else {
                setMessage({ type: "error", text: json.message || "Failed to update logic" });
            }
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Network error" });
        } finally {
            setSaving(false);
        }
    };

    const handleResetDefaults = async () => {
        if (!confirm("Are you sure you want to reset all growth logic to standard WHO reference values?")) return;
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/admin/nutrition-logic-config", { method: "DELETE" });
            const json = await res.json();
            if (json.success) {
                setBoysRef(DEFAULT_BOYS_REFERENCE);
                setGirlsRef(DEFAULT_GIRLS_REFERENCE);
                setMuacCutoffs(DEFAULT_MUAC_CUTOFFS);
                setParamWeights(DEFAULT_PARAMETER_WEIGHTS);
                setStageThresholds(DEFAULT_STAGE_THRESHOLDS);
                setMessage({ type: "success", text: "Reset to default WHO standards successfully!" });
                if (onSaved) onSaved();
            } else {
                setMessage({ type: "error", text: json.message || "Failed to reset" });
            }
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Network error" });
        } finally {
            setSaving(false);
        }
    };

    const updateBoysField = (index: number, field: keyof IGrowthMilestone, val: number) => {
        setBoysRef((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: val };
            return copy;
        });
    };

    const updateGirlsField = (index: number, field: keyof IGrowthMilestone, val: number) => {
        setGirlsRef((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: val };
            return copy;
        });
    };

    if (!isOpen) return null;

    const totalWeightSum =
        Number(paramWeights.weightWeight || 0) +
        Number(paramWeights.muacWeight || 0) +
        Number(paramWeights.heightWeight || 0) +
        Number(paramWeights.headWeight || 0) +
        Number(paramWeights.chestWeight || 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
                
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white flex items-center justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-xs uppercase font-bold tracking-widest text-blue-300">
                                Dynamic Growth Engine Settings
                            </span>
                        </div>
                        <h3 className="text-xl font-black mt-1 flex items-center gap-2">
                            <span>⚙️ WHO Child Growth Reference &amp; Assessment Logic</span>
                        </h3>
                        <p className="text-xs text-blue-200/80 mt-1">
                            Configure standard growth reference tables and evaluation weights. Month-wise dashboards recalculate automatically based on this logic.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-xl font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Status Message */}
                {message && (
                    <div
                        className={`mx-6 mt-4 p-3 rounded-xl text-xs font-bold border flex items-center justify-between ${
                            message.type === "success"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-red-50 text-red-800 border-red-200"
                        }`}
                    >
                        <span>{message.text}</span>
                        <button onClick={() => setMessage(null)} className="cursor-pointer font-black text-sm">✕</button>
                    </div>
                )}

                {/* 5 Clean Logic Tabs */}
                <div className="px-6 pt-4 border-b border-gray-100 flex items-center gap-2 overflow-x-auto shrink-0 bg-slate-50/70">
                    <button
                        onClick={() => setActiveTab("height")}
                        className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-b-2 ${
                            activeTab === "height"
                                ? "bg-white text-blue-900 border-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900 border-transparent hover:bg-white/50"
                        }`}
                    >
                        <span>📏</span>
                        <span>1. Height (cm)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("weight")}
                        className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-b-2 ${
                            activeTab === "weight"
                                ? "bg-white text-blue-900 border-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900 border-transparent hover:bg-white/50"
                        }`}
                    >
                        <span>⚖️</span>
                        <span>2. Weight (kg)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("head")}
                        className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-b-2 ${
                            activeTab === "head"
                                ? "bg-white text-blue-900 border-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900 border-transparent hover:bg-white/50"
                        }`}
                    >
                        <span>🧠</span>
                        <span>3. Head Circumference (cm)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("chest")}
                        className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-b-2 ${
                            activeTab === "chest"
                                ? "bg-white text-blue-900 border-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900 border-transparent hover:bg-white/50"
                        }`}
                    >
                        <span>🫁</span>
                        <span>4. Chest Circumference (cm)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("muac-weights")}
                        className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-b-2 ${
                            activeTab === "muac-weights"
                                ? "bg-white text-blue-900 border-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900 border-transparent hover:bg-white/50"
                        }`}
                    >
                        <span>📐</span>
                        <span>5. MUAC &amp; Scoring Weights</span>
                    </button>
                </div>

                {/* Tab Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loading ? (
                        <div className="py-20 text-center text-gray-400 text-sm font-semibold">
                            Loading current growth reference configuration...
                        </div>
                    ) : (
                        <>
                            {/* TAB 1: HEIGHT STANDARDS */}
                            {activeTab === "height" && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                                                <span>📏 WHO Standard Reference: Height for Age (cm)</span>
                                            </h4>
                                            <p className="text-xs text-blue-800/80 mt-1">
                                                Children’s height is compared against the median WHO benchmark. Deficits below 90% indicate stunted growth. Admin can adjust milestone values below.
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-blue-200 text-blue-900 whitespace-nowrap">
                                            Birth to 5 Years
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Boys Height Table */}
                                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                                            <div className="bg-blue-900 text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                                                <span>👦 Boys – Height Reference (cm)</span>
                                                <span className="text-[10px] text-blue-200">WHO 50th Percentile</span>
                                            </div>
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px]">
                                                        <th className="py-2.5 px-4">Age Milestone</th>
                                                        <th className="py-2.5 px-4">Age (Months)</th>
                                                        <th className="py-2.5 px-4 text-right">Standard Height (cm)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 font-medium">
                                                    {boysRef.map((m, idx) => (
                                                        <tr key={idx} className="hover:bg-blue-50/40">
                                                            <td className="py-2.5 px-4 font-bold text-gray-800">{m.ageLabel}</td>
                                                            <td className="py-2.5 px-4 text-gray-500">{m.ageMonths} mo</td>
                                                            <td className="py-2.5 px-4 text-right">
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    value={m.height}
                                                                    onChange={(e) => updateBoysField(idx, "height", parseFloat(e.target.value) || 0)}
                                                                    className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-right font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Girls Height Table */}
                                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                                            <div className="bg-rose-900 text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                                                <span>👧 Girls – Height Reference (cm)</span>
                                                <span className="text-[10px] text-rose-200">WHO 50th Percentile</span>
                                            </div>
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px]">
                                                        <th className="py-2.5 px-4">Age Milestone</th>
                                                        <th className="py-2.5 px-4">Age (Months)</th>
                                                        <th className="py-2.5 px-4 text-right">Standard Height (cm)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 font-medium">
                                                    {girlsRef.map((m, idx) => (
                                                        <tr key={idx} className="hover:bg-rose-50/40">
                                                            <td className="py-2.5 px-4 font-bold text-gray-800">{m.ageLabel}</td>
                                                            <td className="py-2.5 px-4 text-gray-500">{m.ageMonths} mo</td>
                                                            <td className="py-2.5 px-4 text-right">
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    value={m.height}
                                                                    onChange={(e) => updateGirlsField(idx, "height", parseFloat(e.target.value) || 0)}
                                                                    className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-right font-bold text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: WEIGHT STANDARDS */}
                            {activeTab === "weight" && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                                                <span>⚖️ WHO Standard Reference: Weight for Age (kg)</span>
                                            </h4>
                                            <p className="text-xs text-emerald-800/80 mt-1">
                                                Weight progress is tracked continuously against WHO median standards. Weight deficit below 75% indicates acute wasting.
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 whitespace-nowrap">
                                            Birth to 5 Years
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Boys Weight Table */}
                                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                                            <div className="bg-blue-900 text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                                                <span>👦 Boys – Weight Reference (kg)</span>
                                                <span className="text-[10px] text-blue-200">WHO 50th Percentile</span>
                                            </div>
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px]">
                                                        <th className="py-2.5 px-4">Age Milestone</th>
                                                        <th className="py-2.5 px-4">Age (Months)</th>
                                                        <th className="py-2.5 px-4 text-right">Standard Weight (kg)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 font-medium">
                                                    {boysRef.map((m, idx) => (
                                                        <tr key={idx} className="hover:bg-blue-50/40">
                                                            <td className="py-2.5 px-4 font-bold text-gray-800">{m.ageLabel}</td>
                                                            <td className="py-2.5 px-4 text-gray-500">{m.ageMonths} mo</td>
                                                            <td className="py-2.5 px-4 text-right">
                                                                <input
                                                                    type="number"
                                                                    step="0.05"
                                                                    value={m.weight}
                                                                    onChange={(e) => updateBoysField(idx, "weight", parseFloat(e.target.value) || 0)}
                                                                    className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-right font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Girls Weight Table */}
                                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                                            <div className="bg-rose-900 text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                                                <span>👧 Girls – Weight Reference (kg)</span>
                                                <span className="text-[10px] text-rose-200">WHO 50th Percentile</span>
                                            </div>
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px]">
                                                        <th className="py-2.5 px-4">Age Milestone</th>
                                                        <th className="py-2.5 px-4">Age (Months)</th>
                                                        <th className="py-2.5 px-4 text-right">Standard Weight (kg)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 font-medium">
                                                    {girlsRef.map((m, idx) => (
                                                        <tr key={idx} className="hover:bg-rose-50/40">
                                                            <td className="py-2.5 px-4 font-bold text-gray-800">{m.ageLabel}</td>
                                                            <td className="py-2.5 px-4 text-gray-500">{m.ageMonths} mo</td>
                                                            <td className="py-2.5 px-4 text-right">
                                                                <input
                                                                    type="number"
                                                                    step="0.05"
                                                                    value={m.weight}
                                                                    onChange={(e) => updateGirlsField(idx, "weight", parseFloat(e.target.value) || 0)}
                                                                    className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-right font-bold text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: HEAD CIRCUMFERENCE */}
                            {activeTab === "head" && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-sm text-indigo-950 flex items-center gap-2">
                                                <span>🧠 WHO Standard Reference: Head Circumference (cm)</span>
                                            </h4>
                                            <p className="text-xs text-indigo-800/80 mt-1">
                                                Reflects brain development and cranium growth. Significant deficit indicates chronic micro-nutrient deficiencies.
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-indigo-200 text-indigo-900 whitespace-nowrap">
                                            Birth to 5 Years
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Boys Head Table */}
                                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                                            <div className="bg-blue-900 text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                                                <span>👦 Boys – Head Circumference (cm)</span>
                                                <span className="text-[10px] text-blue-200">WHO 50th Percentile</span>
                                            </div>
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px]">
                                                        <th className="py-2.5 px-4">Age Milestone</th>
                                                        <th className="py-2.5 px-4">Age (Months)</th>
                                                        <th className="py-2.5 px-4 text-right">Standard Head (cm)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 font-medium">
                                                    {boysRef.map((m, idx) => (
                                                        <tr key={idx} className="hover:bg-blue-50/40">
                                                            <td className="py-2.5 px-4 font-bold text-gray-800">{m.ageLabel}</td>
                                                            <td className="py-2.5 px-4 text-gray-500">{m.ageMonths} mo</td>
                                                            <td className="py-2.5 px-4 text-right">
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    value={m.headCircumference}
                                                                    onChange={(e) => updateBoysField(idx, "headCircumference", parseFloat(e.target.value) || 0)}
                                                                    className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-right font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Girls Head Table */}
                                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                                            <div className="bg-rose-900 text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                                                <span>👧 Girls – Head Circumference (cm)</span>
                                                <span className="text-[10px] text-rose-200">WHO 50th Percentile</span>
                                            </div>
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px]">
                                                        <th className="py-2.5 px-4">Age Milestone</th>
                                                        <th className="py-2.5 px-4">Age (Months)</th>
                                                        <th className="py-2.5 px-4 text-right">Standard Head (cm)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 font-medium">
                                                    {girlsRef.map((m, idx) => (
                                                        <tr key={idx} className="hover:bg-rose-50/40">
                                                            <td className="py-2.5 px-4 font-bold text-gray-800">{m.ageLabel}</td>
                                                            <td className="py-2.5 px-4 text-gray-500">{m.ageMonths} mo</td>
                                                            <td className="py-2.5 px-4 text-right">
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    value={m.headCircumference}
                                                                    onChange={(e) => updateGirlsField(idx, "headCircumference", parseFloat(e.target.value) || 0)}
                                                                    className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-right font-bold text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: CHEST CIRCUMFERENCE */}
                            {activeTab === "chest" && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-sm text-teal-950 flex items-center gap-2">
                                                <span>🫁 Clinical Reference: Chest Circumference (cm)</span>
                                            </h4>
                                            <p className="text-xs text-teal-800/80 mt-1">
                                                At birth, head circumference is 1–2 cm larger than chest circumference. By 1–2 years, chest circumference catches up and exceeds head circumference.
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-teal-200 text-teal-900 whitespace-nowrap">
                                            Birth to 5 Years
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Boys Chest Table */}
                                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                                            <div className="bg-blue-900 text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                                                <span>👦 Boys – Chest Circumference (cm)</span>
                                                <span className="text-[10px] text-blue-200">Clinical Reference Norm</span>
                                            </div>
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px]">
                                                        <th className="py-2.5 px-4">Age Milestone</th>
                                                        <th className="py-2.5 px-4">Age (Months)</th>
                                                        <th className="py-2.5 px-4 text-right">Standard Chest (cm)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 font-medium">
                                                    {boysRef.map((m, idx) => (
                                                        <tr key={idx} className="hover:bg-blue-50/40">
                                                            <td className="py-2.5 px-4 font-bold text-gray-800">{m.ageLabel}</td>
                                                            <td className="py-2.5 px-4 text-gray-500">{m.ageMonths} mo</td>
                                                            <td className="py-2.5 px-4 text-right">
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    value={m.chestCircumference}
                                                                    onChange={(e) => updateBoysField(idx, "chestCircumference", parseFloat(e.target.value) || 0)}
                                                                    className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-right font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Girls Chest Table */}
                                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                                            <div className="bg-rose-900 text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                                                <span>👧 Girls – Chest Circumference (cm)</span>
                                                <span className="text-[10px] text-rose-200">Clinical Reference Norm</span>
                                            </div>
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px]">
                                                        <th className="py-2.5 px-4">Age Milestone</th>
                                                        <th className="py-2.5 px-4">Age (Months)</th>
                                                        <th className="py-2.5 px-4 text-right">Standard Chest (cm)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 font-medium">
                                                    {girlsRef.map((m, idx) => (
                                                        <tr key={idx} className="hover:bg-rose-50/40">
                                                            <td className="py-2.5 px-4 font-bold text-gray-800">{m.ageLabel}</td>
                                                            <td className="py-2.5 px-4 text-gray-500">{m.ageMonths} mo</td>
                                                            <td className="py-2.5 px-4 text-right">
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    value={m.chestCircumference}
                                                                    onChange={(e) => updateGirlsField(idx, "chestCircumference", parseFloat(e.target.value) || 0)}
                                                                    className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-right font-bold text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: MUAC CUTOFFS & SCORING WEIGHTS */}
                            {activeTab === "muac-weights" && (
                                <div className="space-y-6 animate-fadeIn">
                                    {/* MUAC Cutoff Section */}
                                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                                    <span>📐 WHO MUAC Clinical Cutoffs (6 to 59 Months)</span>
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Mid-Upper Arm Circumference boundaries for acute malnutrition triage
                                                </p>
                                            </div>
                                            <span className="text-[10px] bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold">
                                                WHO Protocol
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="p-3.5 bg-red-50 rounded-xl border border-red-200">
                                                <span className="text-[10px] uppercase font-bold text-red-700 block">SAM (Severe Malnutrition)</span>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                    <span className="text-xs font-bold text-red-900">Below</span>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={muacCutoffs.samBelow}
                                                        onChange={(e) => setMuacCutoffs((prev) => ({ ...prev, samBelow: parseFloat(e.target.value) || 11.5 }))}
                                                        className="w-20 px-2 py-1 bg-white border border-red-300 rounded-lg text-center font-bold text-red-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                    <span className="text-xs font-bold text-red-900">cm</span>
                                                </div>
                                                <span className="text-[10px] text-red-600 mt-1 block">Immediate therapeutic feeding</span>
                                            </div>

                                            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                                                <span className="text-[10px] uppercase font-bold text-amber-700 block">MAM (Moderate Malnutrition)</span>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                    <span className="text-xs font-bold text-amber-900">{muacCutoffs.samBelow} to</span>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={muacCutoffs.mamBelow}
                                                        onChange={(e) => setMuacCutoffs((prev) => ({ ...prev, mamBelow: parseFloat(e.target.value) || 12.5 }))}
                                                        className="w-20 px-2 py-1 bg-white border border-amber-300 rounded-lg text-center font-bold text-amber-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                    />
                                                    <span className="text-xs font-bold text-amber-900">cm</span>
                                                </div>
                                                <span className="text-[10px] text-amber-700 mt-1 block">Supplementary nutrition support</span>
                                            </div>

                                            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                                                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Healthy / No Malnutrition</span>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                    <span className="text-xs font-bold text-emerald-900">Equal or Above</span>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={muacCutoffs.healthyAbove}
                                                        onChange={(e) => setMuacCutoffs((prev) => ({ ...prev, healthyAbove: parseFloat(e.target.value) || 12.5 }))}
                                                        className="w-20 px-2 py-1 bg-white border border-emerald-300 rounded-lg text-center font-bold text-emerald-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    />
                                                    <span className="text-xs font-bold text-emerald-900">cm</span>
                                                </div>
                                                <span className="text-[10px] text-emerald-600 mt-1 block">Normal nutritional threshold</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Parameter Scoring Weights (%) */}
                                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                                    <span>⚖️ Parameter Weightage for Live Dashboard % Calculation</span>
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Assign the relative contribution of each parameter toward the 100% composite recovery score.
                                                </p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-black border ${
                                                totalWeightSum === 100
                                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                                    : "bg-red-100 text-red-800 border-red-300 animate-pulse"
                                            }`}>
                                                Total Sum: {totalWeightSum}% {totalWeightSum === 100 ? "✓" : "(Must be 100%)"}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                                            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Weight Contribution</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <input
                                                        type="number"
                                                        value={paramWeights.weightWeight}
                                                        onChange={(e) => setParamWeights((p) => ({ ...p, weightWeight: parseInt(e.target.value) || 0 }))}
                                                        className="w-16 px-2 py-1 bg-white border border-gray-300 rounded-lg text-center font-black text-gray-900 text-sm"
                                                    />
                                                    <span className="font-bold text-gray-500">%</span>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 block">MUAC Contribution</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <input
                                                        type="number"
                                                        value={paramWeights.muacWeight}
                                                        onChange={(e) => setParamWeights((p) => ({ ...p, muacWeight: parseInt(e.target.value) || 0 }))}
                                                        className="w-16 px-2 py-1 bg-white border border-gray-300 rounded-lg text-center font-black text-gray-900 text-sm"
                                                    />
                                                    <span className="font-bold text-gray-500">%</span>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Height Contribution</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <input
                                                        type="number"
                                                        value={paramWeights.heightWeight}
                                                        onChange={(e) => setParamWeights((p) => ({ ...p, heightWeight: parseInt(e.target.value) || 0 }))}
                                                        className="w-16 px-2 py-1 bg-white border border-gray-300 rounded-lg text-center font-black text-gray-900 text-sm"
                                                    />
                                                    <span className="font-bold text-gray-500">%</span>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Head Circumference</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <input
                                                        type="number"
                                                        value={paramWeights.headWeight}
                                                        onChange={(e) => setParamWeights((p) => ({ ...p, headWeight: parseInt(e.target.value) || 0 }))}
                                                        className="w-16 px-2 py-1 bg-white border border-gray-300 rounded-lg text-center font-black text-gray-900 text-sm"
                                                    />
                                                    <span className="font-bold text-gray-500">%</span>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Chest Circumference</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <input
                                                        type="number"
                                                        value={paramWeights.chestWeight}
                                                        onChange={(e) => setParamWeights((p) => ({ ...p, chestWeight: parseInt(e.target.value) || 0 }))}
                                                        className="w-16 px-2 py-1 bg-white border border-gray-300 rounded-lg text-center font-black text-gray-900 text-sm"
                                                    />
                                                    <span className="font-bold text-gray-500">%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <button
                        onClick={handleResetDefaults}
                        disabled={saving}
                        className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                        <span>🔄</span>
                        <span>Reset to WHO Defaults</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving || totalWeightSum !== 100}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                            <span>💾</span>
                            <span>{saving ? "Saving Logic..." : "Save & Apply Logic"}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
