"use client";

import React, { useEffect, useState } from "react";
import { 
    Search, 
    Settings, 
    ClipboardList, 
    Eye, 
    Download, 
    Trash2, 
    Check, 
    X, 
    Calendar,
    Loader2
} from "lucide-react";

export default function AdminInternshipPage() {
    const [activeTab, setActiveTab] = useState<"applications" | "settings">("applications");
    const [applications, setApplications] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>({
        isOpen: false,
        endDate: "",
        announcementMessage: ""
    });
    
    const [loadingApps, setLoadingApps] = useState(true);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [savingSettings, setSavingSettings] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    
    // View Details Modal State
    const [selectedApp, setSelectedApp] = useState<any>(null);

    const fetchApplications = async () => {
        try {
            setLoadingApps(true);
            const res = await fetch("/api/admin/internship/applications");
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            }
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        } finally {
            setLoadingApps(false);
        }
    };

    const fetchSettings = async () => {
        try {
            setLoadingSettings(true);
            const res = await fetch("/api/admin/internship/settings");
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    ...data,
                    endDate: data.endDate ? data.endDate.split("T")[0] : ""
                });
            }
        } catch (err) {
            console.error("Failed to fetch settings:", err);
        } finally {
            setLoadingSettings(false);
        }
    };

    useEffect(() => {
        fetchApplications();
        fetchSettings();
    }, []);

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingSettings(true);
        try {
            const res = await fetch("/api/admin/internship/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert("Settings saved successfully!");
                fetchSettings();
            } else {
                alert("Failed to save settings.");
            }
        } catch (err) {
            console.error("Save settings failed:", err);
            alert("An error occurred. Please try again.");
        } finally {
            setSavingSettings(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        if (!confirm(`Are you sure you want to change status to "${newStatus}"?`)) return;
        try {
            const res = await fetch("/api/admin/internship/applications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) {
                fetchApplications();
                if (selectedApp && selectedApp._id === id) {
                    setSelectedApp((prev: any) => ({ ...prev, status: newStatus }));
                }
            } else {
                alert("Failed to update status.");
            }
        } catch (err) {
            console.error("Update status failed:", err);
        }
    };

    const handleDeleteApp = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this application?")) return;
        try {
            const res = await fetch(`/api/admin/internship/applications?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchApplications();
                setSelectedApp(null);
            } else {
                alert("Failed to delete application.");
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleDownload = (base64Url: string, filename: string) => {
        if (base64Url && base64Url.startsWith("data:")) {
            try {
                const parts = base64Url.split(";base64,");
                const contentType = parts[0].split(":")[1];
                const raw = window.atob(parts[1]);
                const rawLength = raw.length;
                const uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i);
                }
                const blob = new Blob([uInt8Array], { type: contentType });
                const blobUrl = URL.createObjectURL(blob);
                
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = filename + ".pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            } catch (err) {
                console.error("Failed to download PDF resume:", err);
                window.open(base64Url, "_blank");
            }
        }
    };

    // Filter applications
    const filteredApps = applications.filter((app) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = 
            app.fullName.toLowerCase().includes(query) ||
            app.email.toLowerCase().includes(query) ||
            app.phoneNumber.includes(searchTerm) ||
            (app.schoolName && app.schoolName.toLowerCase().includes(query)) ||
            (app.collegeName && app.collegeName.toLowerCase().includes(query)) ||
            app.areaOfInterest.toLowerCase().includes(query);
            
        const matchesStatus = statusFilter === "All" || app.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Approved":
                return "bg-green-50 text-green-600 border border-green-200/50";
            case "Rejected":
                return "bg-rose-50 text-rose-600 border border-rose-200/50";
            case "Under Review":
                return "bg-blue-50 text-blue-600 border border-blue-200/50";
            default:
                return "bg-amber-50 text-amber-600 border border-amber-200/50";
        }
    };

    return (
        <>
            <div className="space-y-8 animate-fade-in-up font-sans text-gray-800">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Internship Management</h1>
                        <p className="text-sm text-gray-400 font-bold mt-1">Configure portal settings and manage internship submissions</p>
                    </div>

                    {/* Tabs Switcher */}
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl shrink-0 self-start">
                        <button
                            onClick={() => setActiveTab("applications")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                activeTab === "applications"
                                    ? "bg-white text-gray-900 shadow-md"
                                    : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <ClipboardList className="w-4 h-4" />
                            Applications
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                activeTab === "settings"
                                    ? "bg-white text-gray-900 shadow-md"
                                    : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <Settings className="w-4 h-4" />
                            Portal Settings
                        </button>
                    </div>
                </div>

                {/* Applications List Tab */}
                {activeTab === "applications" && (
                    <div className="space-y-6">
                        {/* Filter and Search Bar */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, school, field..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="flex gap-4 w-full md:w-auto self-stretch md:self-auto justify-end">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {/* Applications Table */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                            {loadingApps ? (
                                <div className="flex items-center justify-center py-24">
                                    <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-slate-50/50">
                                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Applicant</th>
                                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone / Email</th>
                                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Qualification</th>
                                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Field / Duration</th>
                                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sub. Date</th>
                                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                                <th className="text-right px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredApps.map((app) => (
                                                <tr key={app._id} className="hover:bg-slate-50/30 transition-colors">
                                                    <td className="px-6 py-4 text-xs font-bold text-gray-400">
                                                        #{app._id.slice(-6).toUpperCase()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-bold text-gray-900 block">{app.fullName}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-semibold text-gray-600 block">{app.phoneNumber}</span>
                                                        <span className="text-[10px] text-gray-400 font-medium block">{app.email}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-bold text-gray-800 block">
                                                            {app.educationQualification === "Others" ? app.otherQualification : app.educationQualification}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-medium truncate block max-w-[150px]">
                                                            {app.schoolName || app.collegeName || "N/A"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-bold text-gray-800 block">
                                                            {app.areaOfInterest === "Other" ? app.otherAreaOfInterest : app.areaOfInterest}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-semibold block">{app.duration}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                        {new Date(app.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => setSelectedApp(app)}
                                                                className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-4.5 h-4.5" />
                                                            </button>
                                                            
                                                            {/* Approve */}
                                                            {app.status !== "Approved" && (
                                                                <button
                                                                    onClick={() => handleUpdateStatus(app._id, "Approved")}
                                                                    className="p-2 hover:bg-green-50 text-slate-400 hover:text-green-600 rounded-xl transition-colors cursor-pointer"
                                                                    title="Approve"
                                                                >
                                                                    <Check className="w-4.5 h-4.5" />
                                                                </button>
                                                            )}

                                                            {/* Reject */}
                                                            {app.status !== "Rejected" && (
                                                                <button
                                                                    onClick={() => handleUpdateStatus(app._id, "Rejected")}
                                                                    className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                                                                    title="Reject"
                                                                >
                                                                    <X className="w-4.5 h-4.5" />
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() => handleDeleteApp(app._id)}
                                                                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4.5 h-4.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {!loadingApps && filteredApps.length === 0 && (
                                <div className="text-center py-16">
                                    <p className="text-gray-400 font-bold">No internship applications found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Portal Settings Tab */}
                {activeTab === "settings" && (
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl max-w-2xl">
                        {loadingSettings ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                            </div>
                        ) : (
                            <form onSubmit={handleSaveSettings} className="space-y-6">
                                {/* Toggle switch */}
                                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50/80 transition-all duration-300">
                                    <div>
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Internship Applications Status</h3>
                                        <p className="text-xs text-gray-400 font-bold mt-0.5">Toggle submission portal open or closed</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border transition-all ${
                                            settings.isOpen 
                                                ? 'bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-600/20' 
                                                : 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20'
                                        }`}>
                                            {settings.isOpen ? 'OPEN / ACTIVE' : 'CLOSED / INACTIVE'}
                                        </span>
                                        <label className="relative inline-flex items-center cursor-pointer select-none group">
                                            <input 
                                                type="checkbox" 
                                                checked={settings.isOpen}
                                                onChange={(e) => setSettings((prev: any) => ({ ...prev, isOpen: e.target.checked }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-20 h-11 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-600/20 rounded-full peer peer-checked:after:translate-x-9 after:content-[''] after:absolute after:top-1.5 after:left-1.5 after:bg-white after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-purple-600 shadow-inner border border-slate-400/30 transition-all duration-300 group-hover:scale-105 active:scale-95"></div>
                                        </label>
                                    </div>
                                </div>
                                
                                {/* End Date Picker */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        Application Deadline *
                                    </label>
                                    <input
                                        type="date"
                                        value={settings.endDate}
                                        onChange={(e) => setSettings((prev: any) => ({ ...prev, endDate: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-purple-600 focus:bg-white outline-none transition-all font-semibold text-gray-900"
                                    />
                                </div>

                                {/* Custom message field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-gray-600 uppercase tracking-wide">Announcement Message (Optional)</label>
                                    <textarea
                                        value={settings.announcementMessage}
                                        onChange={(e) => setSettings((prev: any) => ({ ...prev, announcementMessage: e.target.value }))}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-purple-600 focus:bg-white outline-none transition-all font-semibold text-gray-900 resize-none"
                                        placeholder="Enter details about requirements, roles, or selection announcements..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={savingSettings}
                                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-black py-4 rounded-xl shadow-lg hover:shadow-purple-300/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-sm uppercase tracking-wider"
                                >
                                    {savingSettings ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving Settings...
                                        </>
                                    ) : (
                                        "Save Settings"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 animate-scale-in">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white rounded-t-3xl">
                            <div>
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">Internship Application Details</h2>
                                <p className="text-xs text-gray-400 font-bold mt-0.5">ID: #{selectedApp._id.toUpperCase()}</p>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="p-2 hover:bg-slate-100 text-gray-400 hover:text-gray-900 rounded-xl transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
                            {/* Status Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-2xs">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Current Status:</span>
                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusStyle(selectedApp.status)}`}>
                                        {selectedApp.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Update Status:</span>
                                    <select
                                        value={selectedApp.status}
                                        onChange={(e) => handleUpdateStatus(selectedApp._id, e.target.value)}
                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none focus:border-purple-600 cursor-pointer focus:ring-2 focus:ring-purple-600/20 transition-all"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Under Review">Under Review</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            {/* Multi-Section Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Profile */}
                                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
                                    <h3 className="text-xs font-black text-purple-700 uppercase tracking-widest border-l-4 border-purple-700 pl-2 mb-2">
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Full Name</span>
                                            <span className="text-sm font-extrabold text-gray-900 block mt-0.5">{selectedApp.fullName}</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Phone Number</span>
                                            <span className="text-sm font-bold text-gray-700 block mt-0.5">{selectedApp.phoneNumber}</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Date of Birth</span>
                                            <span className="text-sm font-bold text-gray-700 block mt-0.5">
                                                {selectedApp.dob ? new Date(selectedApp.dob).toLocaleDateString("en-IN") : "N/A"}
                                            </span>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Gender</span>
                                            <span className="text-sm font-bold text-gray-700 block mt-0.5">{selectedApp.gender || "N/A"}</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs sm:col-span-2">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Email Address</span>
                                            <span className="text-sm font-bold text-gray-700 block mt-0.5">{selectedApp.email}</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs sm:col-span-2">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Address</span>
                                            <span className="text-sm font-bold text-gray-700 block mt-0.5 leading-relaxed">{selectedApp.address}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Educational Profile */}
                                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
                                    <h3 className="text-xs font-black text-purple-700 uppercase tracking-widest border-l-4 border-purple-700 pl-2 mb-2">
                                        Educational Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs sm:col-span-2">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Education Qualification</span>
                                            <span className="text-sm font-extrabold text-gray-900 block mt-0.5">
                                                {selectedApp.educationQualification === "Others" ? selectedApp.otherQualification : selectedApp.educationQualification}
                                            </span>
                                        </div>
                                        {selectedApp.schoolName && (
                                            <>
                                                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                                                    <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">School Name</span>
                                                    <span className="text-sm font-bold text-gray-700 block mt-0.5">{selectedApp.schoolName}</span>
                                                </div>
                                                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                                                    <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Board</span>
                                                    <span className="text-sm font-bold text-gray-700 block mt-0.5">{selectedApp.board === "Other" ? selectedApp.otherBoard : selectedApp.board}</span>
                                                </div>
                                            </>
                                        )}
                                        {selectedApp.collegeName && (
                                            <>
                                                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                                                    <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">College Name</span>
                                                    <span className="text-sm font-bold text-gray-700 block mt-0.5">{selectedApp.collegeName}</span>
                                                </div>
                                                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                                                    <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">University Name</span>
                                                    <span className="text-sm font-bold text-gray-700 block mt-0.5">{selectedApp.universityName}</span>
                                                </div>
                                                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                                                    <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Stream</span>
                                                    <span className="text-sm font-bold text-gray-700 block mt-0.5">{selectedApp.stream || "N/A"}</span>
                                                </div>
                                                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                                                    <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Current Sem / Year</span>
                                                    <span className="text-sm font-bold text-gray-700 block mt-0.5">{selectedApp.currentSemesterYear || "N/A"}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Family Profile */}
                                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
                                    <h3 className="text-xs font-black text-purple-700 uppercase tracking-widest border-l-4 border-purple-700 pl-2 mb-2">
                                        Family Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs sm:col-span-2">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Father's Name</span>
                                            <span className="text-sm font-extrabold text-gray-900 block mt-0.5">{selectedApp.fatherName}</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs sm:col-span-2">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Father's Occupation</span>
                                            <span className="text-sm font-bold text-gray-700 block mt-0.5">{selectedApp.fatherOccupation}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Preferences & Skills */}
                                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
                                    <h3 className="text-xs font-black text-purple-700 uppercase tracking-widest border-l-4 border-purple-700 pl-2 mb-2">
                                        Preferences & Skills
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Area of Interest</span>
                                            <span className="text-sm font-extrabold text-gray-900 block mt-0.5">
                                                {selectedApp.areaOfInterest === "Other" ? selectedApp.otherAreaOfInterest : selectedApp.areaOfInterest}
                                            </span>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Duration</span>
                                            <span className="text-sm font-bold text-gray-700 block mt-0.5">{selectedApp.duration}</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs sm:col-span-2">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Skills</span>
                                            <span className="text-sm font-bold text-gray-700 block mt-0.5">{selectedApp.skills || "None specified"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Resume Download */}
                                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2">
                                    <h3 className="text-xs font-black text-purple-700 uppercase tracking-widest border-l-4 border-purple-700 pl-2 mb-2">
                                        Documents
                                    </h3>
                                    <div className="max-w-xs">
                                        <button
                                            onClick={() => handleDownload(selectedApp.resume, `Resume_${selectedApp.fullName.replace(/\s+/g, "_")}`)}
                                            className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 hover:border-purple-600 rounded-xl text-xs font-black uppercase tracking-wider text-gray-700 hover:text-purple-700 transition-all cursor-pointer shadow-2xs group"
                                        >
                                            <span className="truncate">Download Resume PDF</span>
                                            <Download className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-purple-600 transition-colors" />
                                        </button>
                                    </div>
                                </div>

                                {/* motivation statement */}
                                {selectedApp.whyJoin && (
                                    <div className="md:col-span-2 bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-3 shadow-sm hover:shadow-md transition-all duration-300">
                                        <h3 className="text-xs font-black text-purple-700 uppercase tracking-widest border-l-4 border-purple-700 pl-2">
                                            Motivation Statement
                                        </h3>
                                        <div className="p-4 bg-white rounded-xl border border-slate-100 text-sm font-semibold text-gray-600 leading-relaxed whitespace-pre-wrap shadow-2xs">
                                            {selectedApp.whyJoin}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white rounded-b-3xl">
                            <button
                                onClick={() => handleDeleteApp(selectedApp._id)}
                                className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Application
                            </button>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
