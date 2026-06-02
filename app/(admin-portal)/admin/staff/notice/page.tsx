"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Calendar, FileText, Download, Trash2, Edit3, Send, Plus, X, ToggleLeft, ToggleRight, Eye, Link2, Info } from 'lucide-react';

interface Notice {
    _id: string;
    title: string;
    file: string; // Google Drive Link
    message?: string; // maps to description
    fileType: 'PDF' | 'Image' | 'None';
    date: string;
    targetAudience?: 'all' | 'volunteer' | 'staff';
    status: 'draft' | 'published';
    createdAt: string;
}

export default function StaffNoticePage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({ 
        title: '',
        message: '',
        file: '', // Google Drive Link
        fileType: 'None' as 'PDF' | 'Image' | 'None',
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        targetAudience: 'staff' as 'all' | 'volunteer' | 'staff', // default to staff
        status: 'published' as 'draft' | 'published'
    });

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const res = await fetch('/api/admin/notices');
            const data = await res.json();
            if (Array.isArray(data)) {
                // Filter notices targeted specifically to 'staff' (or optionally show 'all' as well, but 'staff' is specific to Staff Notices)
                // Let's filter for targetAudience === 'staff' to make this page highly focused
                const staffOnlyNotices = data.filter((notice: Notice) => notice.targetAudience === 'staff');
                setNotices(staffOnlyNotices);
            }
        } catch (error) {
            console.error("Failed to fetch staff notices:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (notice: Notice) => {
        setEditingId(notice._id);
        setFormData({
            title: notice.title || '',
            message: notice.message || '',
            file: notice.file || '',
            fileType: notice.fileType || 'None',
            date: notice.date || new Date().toISOString().split('T')[0],
            targetAudience: notice.targetAudience || 'staff',
            status: notice.status || 'published'
        });
        // Scroll smoothly to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ 
            title: '', 
            message: '',
            file: '', 
            fileType: 'None', 
            date: new Date().toISOString().split('T')[0],
            targetAudience: 'staff',
            status: 'published'
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) {
            alert('Please provide a title');
            return;
        }

        setIsSubmitting(true);
        try {
            const method = editingId ? 'PUT' : 'POST';
            const bodyData = editingId ? { id: editingId, ...formData } : formData;

            const res = await fetch('/api/admin/notices', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData),
            });

            if (res.ok) {
                resetForm();
                setEditingId(null);
                fetchNotices();
                alert(editingId ? 'Staff notice updated successfully!' : 'Staff notice broadcasted successfully!');
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to save staff notice:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePublishStatus = async (notice: Notice) => {
        const newStatus = notice.status === 'published' ? 'draft' : 'published';
        try {
            const res = await fetch('/api/admin/notices', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: notice._id, 
                    status: newStatus
                }),
            });
            if (res.ok) {
                fetchNotices();
            } else {
                alert('Failed to update publish status');
            }
        } catch (error) {
            console.error("Failed to toggle publish status:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notice?')) return;
        try {
            const res = await fetch(`/api/admin/notices?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchNotices();
                alert('Staff notice deleted successfully!');
                if (editingId === id) {
                    handleCancelEdit();
                }
            } else {
                alert('Failed to delete notice');
            }
        } catch (error) {
            console.error("Failed to delete notice:", error);
        }
    };

    const getGradient = (type: string) => {
        if (type === 'PDF') return 'from-pink-500 to-rose-600';
        if (type === 'Image') return 'from-emerald-500 to-green-600';
        return 'from-gray-400 to-gray-500';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                    Staff Notice <span className="text-pink-600">Management</span>
                </h1>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">
                    Create, edit, publish, and delete notices specifically for staff members
                </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 mb-8 shadow-xl shadow-gray-100/40">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white">
                            {editingId ? <Edit3 className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
                        </div>
                        {editingId ? 'Edit Staff Notice' : 'Broadcast New Staff Notice'}
                    </span>
                    {editingId && (
                        <button 
                            type="button" 
                            onClick={handleCancelEdit}
                            className="text-xs font-black text-gray-400 hover:text-pink-600 uppercase tracking-widest flex items-center gap-1 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl transition-all"
                        >
                            <X className="w-3.5 h-3.5" /> Cancel Edit
                        </button>
                    )}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notice Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter notice title"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attachment URL (Optional - Google Drive / Web Link)</label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={formData.file}
                                    onChange={(e) => setFormData(prev => ({ 
                                        ...prev, 
                                        file: e.target.value,
                                        fileType: prev.fileType === 'None' && e.target.value ? 'PDF' : prev.fileType
                                    }))}
                                    placeholder="https://drive.google.com/file/d/..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Link2 className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                        <div className="space-y-1.5 lg:col-span-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description / Detailed Message (Optional)</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                placeholder="Enter details..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all resize-none h-24"
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attachment Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['None', 'PDF', 'Image'] as const).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, fileType: type }))}
                                        className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                                            formData.fileType === type 
                                            ? 'bg-pink-50 border-pink-500 text-pink-600 shadow-sm' 
                                            : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Audience & Status</label>
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    value={formData.targetAudience}
                                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value as any }))}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-700 h-[48px]"
                                >
                                    <option value="staff">Staff Only</option>
                                    <option value="all">All Users</option>
                                </select>

                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-700 h-[48px]"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft (Private)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Publish Date *</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                required
                            />
                        </div>
                        <div className="flex items-end justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full lg:w-auto px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? 'Saving...' : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        {editingId ? 'Save Changes' : 'Broadcast Staff Notice'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xl shadow-gray-100/40">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center text-[#111827]">
                    <h2 className="text-sm font-black uppercase tracking-widest">Staff Bulletins</h2>
                    {!loading && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notices.length} Announcements</span>}
                </div>
                <div className="divide-y divide-gray-50">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-pink-600" /> Loading notices...
                        </div>
                    ) : notices.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No active staff notices found.</div>
                    ) : (
                        notices.map((notice) => (
                            <div key={notice._id} className="flex flex-col md:flex-row md:items-center justify-between px-6 py-5 gap-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                    <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${getGradient(notice.fileType)} flex items-center justify-center text-white shadow-sm`}>
                                        {notice.fileType === 'PDF' ? (
                                            <FileText className="w-5 h-5" />
                                        ) : notice.fileType === 'Image' ? (
                                            <FileText className="w-5 h-5" />
                                        ) : (
                                            <Info className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-bold text-gray-900 truncate">{notice.title}</p>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                                notice.status === 'published' 
                                                ? 'bg-green-50 text-green-600 border border-green-100' 
                                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                                            }`}>
                                                {notice.status}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{notice.message || "No detailed message"}</p>
                                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                                                {notice.date}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-300">•</span>
                                            <span className={`text-[10px] font-black uppercase ${
                                                notice.fileType === 'None' ? 'text-gray-400' : notice.fileType === 'PDF' ? 'text-red-500' : 'text-blue-500'
                                            }`}>
                                                {notice.fileType === 'None' ? 'NO ATTACHMENT' : `${notice.fileType} LINK`}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-300">•</span>
                                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-wider">
                                                To: {notice.targetAudience || 'staff'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                                    <button
                                        onClick={() => togglePublishStatus(notice)}
                                        className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                                            notice.status === 'published' 
                                            ? 'text-green-600 hover:bg-green-50' 
                                            : 'text-gray-400 hover:bg-gray-100'
                                        }`}
                                        title={notice.status === 'published' ? "Switch to Draft" : "Publish Now"}
                                    >
                                        {notice.status === 'published' ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                                    </button>

                                    {notice.file && (
                                        <a 
                                            href={notice.file} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors" 
                                            title="View Attachment"
                                        >
                                            <Eye className="w-4.5 h-4.5" />
                                        </a>
                                    )}

                                    <button 
                                        onClick={() => handleEdit(notice)}
                                        className="p-2 hover:bg-pink-50 rounded-lg text-gray-400 hover:text-pink-600 transition-colors" 
                                        title="Edit"
                                    >
                                        <Edit3 className="w-4.5 h-4.5" />
                                    </button>

                                    <button 
                                        onClick={() => handleDelete(notice._id)}
                                        className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-650 transition-colors" 
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
