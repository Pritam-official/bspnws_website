"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Programme {
    _id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    date: string;
    location: string;
    image?: string;
    type: "recently-held" | "upcoming";
}

function formatDate(dateStr: string) {
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

export default function UpcomingAdminPage() {
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        shortDescription: '',
        fullDescription: '',
        image: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        fetchProgrammes();
    }, []);

    const fetchProgrammes = async () => {
        try {
            const res = await fetch('/api/admin/programmes?type=upcoming');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProgrammes(data);
            }
        } catch (error) {
            console.error("Failed to fetch upcoming programmes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { title, date, location, shortDescription, fullDescription } = formData;
        if (!title || !date || !location || !shortDescription || !fullDescription) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const method = editId ? 'PUT' : 'POST';
            const url = editId ? `/api/admin/programmes/${editId}` : '/api/admin/programmes';

            const payload = {
                ...formData,
                type: 'upcoming'
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert(editId ? 'Programme updated successfully!' : 'Programme scheduled successfully!');
                setFormData({ title: '', date: '', location: '', shortDescription: '', fullDescription: '', image: '' });
                setEditId(null);
                fetchProgrammes();
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.error || 'Failed to submit'}`);
            }
        } catch (error) {
            console.error("Failed to submit programme:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (prog: Programme) => {
        setEditId(prog._id);
        setFormData({
            title: prog.title,
            date: prog.date,
            location: prog.location,
            shortDescription: prog.shortDescription,
            fullDescription: prog.fullDescription,
            image: prog.image || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this programme?")) return;

        try {
            const res = await fetch(`/api/admin/programmes/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchProgrammes();
                alert("Programme deleted successfully!");
            } else {
                alert("Failed to delete programme");
            }
        } catch (error) {
            console.error("Failed to delete programme:", error);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

                .rhp-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #f7f5f2;
                    padding: 40px 32px 80px;
                    color: #1a1a1a;
                }

                /* ── Header ── */
                .rhp-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 40px;
                    padding-bottom: 32px;
                    border-bottom: 1px solid #e5e0d8;
                }
                .rhp-eyebrow {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b06c40;
                    margin-bottom: 8px;
                }
                .rhp-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 42px;
                    font-weight: 400;
                    line-height: 1.1;
                    color: #1a1a1a;
                    margin: 0;
                }
                .rhp-title em {
                    font-style: italic;
                    color: #b06c40;
                }
                .rhp-subtitle {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #8a8070;
                }
                .rhp-count-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #fff;
                    border: 1px solid #e5e0d8;
                    border-radius: 100px;
                    padding: 10px 20px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #5c5146;
                    flex-shrink: 0;
                }
                .rhp-count-badge span {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 26px;
                    height: 26px;
                    background: #b06c40;
                    color: #fff;
                    border-radius: 50%;
                    font-size: 12px;
                    font-weight: 700;
                }

                /* ── Form Card ── */
                .rhp-form-card {
                    background: #fff;
                    border: 1px solid #e5e0d8;
                    border-radius: 20px;
                    padding: 40px;
                    margin-bottom: 32px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04);
                }
                .section-label {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: #b06c40;
                    margin-bottom: 28px;
                }
                .section-label::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #ede8e1;
                }
                .rhp-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .rhp-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .rhp-form-group.full { grid-column: 1 / -1; }
                .rhp-label {
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #8a8070;
                }
                .rhp-input, .rhp-textarea {
                    width: 100%;
                    background: #faf8f5;
                    border: 1.5px solid #ede8e1;
                    border-radius: 12px;
                    padding: 14px 18px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    font-weight: 400;
                    color: #1a1a1a;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .rhp-input::placeholder, .rhp-textarea::placeholder { color: #bdb5a8; }
                .rhp-input:focus, .rhp-textarea:focus {
                    border-color: #b06c40;
                    box-shadow: 0 0 0 3px rgba(176,108,64,0.08);
                    background: #fff;
                }
                .rhp-textarea { resize: none; }
                .rhp-file-wrapper input[type="file"] {
                    width: 100%;
                    background: #faf8f5;
                    border: 1.5px dashed #d4cdc4;
                    border-radius: 12px;
                    padding: 12px 18px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    color: #8a8070;
                    outline: none;
                    cursor: pointer;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }
                .rhp-file-wrapper input[type="file"]:hover { border-color: #b06c40; }
                .rhp-file-wrapper input[type="file"]::file-selector-button {
                    background: #f0ece6;
                    border: none;
                    border-radius: 8px;
                    padding: 6px 14px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 12px;
                    font-weight: 600;
                    color: #7a5c3c;
                    cursor: pointer;
                    margin-right: 12px;
                    transition: background 0.2s;
                }
                .rhp-file-wrapper input[type="file"]::file-selector-button:hover { background: #e6ddd4; }

                /* Image Previews */
                .rhp-previews {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    grid-column: 1 / -1;
                }
                .rhp-thumb {
                    position: relative;
                    width: 72px;
                    height: 72px;
                    border-radius: 10px;
                    overflow: hidden;
                    border: 1.5px solid #e5e0d8;
                    flex-shrink: 0;
                }
                .rhp-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

                /* Submit */
                .rhp-submit {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: #1a1a1a;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    padding: 16px 32px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 20px rgba(26,26,26,0.15);
                }
                .rhp-submit:hover:not(:disabled) {
                    background: #b06c40;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 28px rgba(176,108,64,0.25);
                }
                .rhp-submit:active:not(:disabled) { transform: translateY(0); }
                .rhp-submit:disabled { opacity: 0.55; cursor: not-allowed; }
                .rhp-spinner {
                    width: 14px; height: 14px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: rhp-spin 0.7s linear infinite;
                }
                @keyframes rhp-spin { to { transform: rotate(360deg); } }

                /* ── Grid ── */
                .rhp-list-card {
                    background: #fff;
                    border: 1px solid #e5e0d8;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04);
                }
                .rhp-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                    margin-top: 8px;
                }

                /* Programme Card */
                .prog-card {
                    background: #faf8f5;
                    border: 1px solid #ede8e1;
                    border-radius: 16px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: box-shadow 0.25s, transform 0.25s;
                }
                .prog-card:hover {
                    box-shadow: 0 12px 40px rgba(0,0,0,0.09);
                    transform: translateY(-3px);
                }
                .prog-image {
                    position: relative;
                    height: 200px;
                    width: 100%;
                    overflow: hidden;
                    background: #ede8e1;
                    flex-shrink: 0;
                }
                .prog-image img {
                    width: 100%; height: 100%; object-fit: cover;
                    transition: transform 0.4s ease;
                    display: block;
                }
                .prog-card:hover .prog-image img { transform: scale(1.05); }

                /* Date badge on image */
                .prog-date-overlay {
                    position: absolute;
                    bottom: 12px; left: 12px;
                    background: rgba(26,26,26,0.75);
                    color: #fff;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    padding: 5px 12px;
                    border-radius: 100px;
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .prog-body {
                    padding: 22px 22px 18px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    flex: 1;
                }
                .prog-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 10px;
                }
                .prog-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 19px;
                    font-weight: 400;
                    color: #1a1a1a;
                    line-height: 1.2;
                    margin: 0;
                }
                .prog-actions {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    flex-shrink: 0;
                }
                .prog-action-btn {
                    width: 32px; height: 32px;
                    border-radius: 8px;
                    border: 1px solid #e5e0d8;
                    background: #fff;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    color: #8a8070;
                    transition: all 0.15s;
                    padding: 0;
                }
                .prog-action-btn:hover { color: #c0392b; border-color: #f5c6c2; background: #fff5f4; }
                .prog-action-btn.edit:hover { color: #4a7ab5; border-color: #c8ddf0; background: #f0f6fd; }

                .prog-venue {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    color: #8a8070;
                }
                .prog-desc {
                    font-size: 13.5px;
                    color: #6e6660;
                    line-height: 1.65;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Empty */
                .rhp-empty {
                    text-align: center;
                    padding: 64px 0;
                    color: #bdb5a8;
                }
                .rhp-empty-icon { font-size: 40px; margin-bottom: 16px; }
                .rhp-empty p { font-size: 15px; font-weight: 500; }

                @media (max-width: 768px) {
                    .rhp-root { padding: 24px 16px 60px; }
                    .rhp-header { flex-direction: column; align-items: flex-start; gap: 16px; }
                    .rhp-title { font-size: 32px; }
                    .rhp-form-grid { grid-template-columns: 1fr; }
                    .rhp-form-group.full { grid-column: 1; }
                }
            `}</style>

            <div className="rhp-root">

                {/* ── Header ── */}
                <div className="rhp-header">
                    <div>
                        <div className="rhp-eyebrow">Society Management</div>
                        <h1 className="rhp-title">Upcoming <em>Scheduled</em> Programmes</h1>
                        <p className="rhp-subtitle">Manage and schedule all future society programmes</p>
                    </div>
                    <div className="rhp-count-badge">
                        <span>{programmes.length}</span>
                        {programmes.length === 1 ? 'Programme' : 'Programmes'}
                    </div>
                </div>

                {/* ── Add/Edit Form ── */}
                <div className="rhp-form-card">
                    <div className="section-label">{editId ? 'Edit Scheduled Programme' : 'Schedule New Programme'}</div>
                    <form onSubmit={handleSubmit}>
                        <div className="rhp-form-grid">

                            <div className="rhp-form-group">
                                <label className="rhp-label">Programme Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="rhp-input"
                                    placeholder="e.g. Health Checkup Camp Q3"
                                />
                            </div>

                            <div className="rhp-form-group">
                                <label className="rhp-label">Scheduled Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="rhp-input"
                                />
                            </div>

                            <div className="rhp-form-group">
                                <label className="rhp-label">Venue/Location *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="rhp-input"
                                    placeholder="e.g. Sripally Community Centre"
                                />
                            </div>

                            <div className="rhp-form-group">
                                <label className="rhp-label">Upload Featured Cover (Cloudinary Auto-Upload)</label>
                                <div className="rhp-file-wrapper">
                                    <input type="file" accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <div className="rhp-form-group full">
                                <label className="rhp-label">Short Description * (For listings preview)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.shortDescription}
                                    onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                                    className="rhp-input"
                                    placeholder="Brief single-sentence overview of the upcoming event"
                                />
                            </div>

                            <div className="rhp-form-group full">
                                <label className="rhp-label">Full Description * (Supports paragraphs)</label>
                                <textarea
                                    required
                                    value={formData.fullDescription}
                                    onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                                    className="rhp-textarea"
                                    placeholder="Describe the planned details — timelines, distribution targets, volunteer requirements..."
                                />
                            </div>

                            {formData.image && (
                                <div className="rhp-previews">
                                    <span className="rhp-label block w-full">Cover Preview</span>
                                    <div className="rhp-thumb">
                                        <img src={formData.image} alt="Preview" />
                                    </div>
                                </div>
                            )}

                            <div style={{ gridColumn: '1 / -1' }} className="flex gap-4">
                                <button type="submit" disabled={isSubmitting} className="rhp-submit">
                                    {isSubmitting ? (
                                        <><span className="rhp-spinner" /> Submitting…</>
                                    ) : (
                                        <>
                                            <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            {editId ? 'Update Programme' : 'Schedule Programme'}
                                        </>
                                    )}
                                </button>
                                {editId && (
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setEditId(null);
                                            setFormData({ title: '', date: '', location: '', shortDescription: '', fullDescription: '', image: '' });
                                        }}
                                        className="bg-gray-100 text-gray-600 border border-gray-200 rounded-xl px-6 py-3 font-semibold uppercase tracking-wider hover:bg-gray-200 transition-all text-xs"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>

                        </div>
                    </form>
                </div>

                {/* ── All Programmes ── */}
                <div className="rhp-list-card">
                    <div className="section-label">All Upcoming Programmes</div>

                    {loading ? (
                        <div className="text-center py-12">
                            <span className="text-sm font-bold text-pink-500 animate-pulse">Loading programmes...</span>
                        </div>
                    ) : programmes.length === 0 ? (
                        <div className="rhp-empty">
                            <div className="rhp-empty-icon">🗂️</div>
                            <p>No programmes scheduled yet.</p>
                        </div>
                    ) : (
                        <div className="rhp-grid">
                            {programmes.map(prog => (
                                <div key={prog._id} className="prog-card">

                                    {/* Image */}
                                    <div className="prog-image bg-slate-200">
                                        {prog.image ? (
                                            <img src={prog.image} alt={prog.title} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <span>📸 No Image</span>
                                            </div>
                                        )}
                                        <div className="prog-date-overlay">
                                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDate(prog.date)}
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="prog-body">
                                        <div className="prog-header">
                                            <h3 className="prog-title">{prog.title}</h3>
                                            <div className="prog-actions">
                                                <button onClick={() => handleEdit(prog)} className="prog-action-btn edit" title="Edit">
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleDelete(prog._id)} className="prog-action-btn" title="Delete">
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="prog-venue">
                                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {prog.location}
                                        </div>

                                        <p className="prog-desc">{prog.shortDescription}</p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </>
    );
}