"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const dummyRecentlyHeld = [
    {
        id: 1,
        image: "/logo.jpg",
        title: "Tree Plantation 2024",
        date: "2024-03-15",
        venue: "Burdwan University Campus",
        description: "Successfully planted 500+ saplings with the help of student volunteers across three zones of the campus."
    },
    {
        id: 2,
        image: "/logo.jpg",
        title: "Health Camp Q1",
        date: "2024-02-10",
        venue: "Sadar Hospital Ground",
        description: "Free health checkup and medicine distribution for 200+ local residents in collaboration with district health officials."
    },
    {
        id: 3,
        image: "/logo.jpg",
        title: "Annual Cultural Fest",
        date: "2024-01-22",
        venue: "Town Hall Auditorium",
        description: "A vibrant celebration of art, music, and culture attended by over 800 participants from across the district."
    },
];

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function RecentlyHeldPage() {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        venue: '',
        description: '',
        images: [] as string[],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const promises = files.map(file => new Promise<string>((resolve) => {
                const r = new FileReader();
                r.onloadend = () => resolve(r.result as string);
                r.readAsDataURL(file);
            }));
            const base64 = await Promise.all(promises);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...base64] }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setFormData({ title: '', date: '', venue: '', description: '', images: [] });
            alert('Programme added successfully!');
        }, 800);
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
                .rhp-input[type="date"] { color: #5c5146; }
                .rhp-textarea { resize: none; height: 120px; }
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
                .rhp-thumb-remove {
                    position: absolute;
                    top: 3px; right: 3px;
                    background: rgba(255,255,255,0.92);
                    border: none;
                    border-radius: 50%;
                    width: 18px; height: 18px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    color: #c0392b;
                    padding: 0;
                }

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
                .prog-no-image {
                    width: 100%; height: 100%;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    color: #c4bcb0; gap: 8px;
                }
                .prog-no-image span { font-size: 12px; font-weight: 500; letter-spacing: 0.05em; }

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
                .prog-footer {
                    margin-top: auto;
                    padding-top: 14px;
                    border-top: 1px solid #ede8e1;
                }
                .prog-add-image-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    background: #f9ede3;
                    border: 1.5px dashed #d4b89a;
                    border-radius: 10px;
                    padding: 10px 0;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #b06c40;
                    cursor: pointer;
                    transition: background 0.15s, border-color 0.15s;
                }
                .prog-add-image-btn:hover { background: #f0ddd0; border-color: #c09070; }

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
                        <h1 className="rhp-title">Recently <em>Held</em> Programmes</h1>
                        <p className="rhp-subtitle">Manage and view all completed society programmes</p>
                    </div>
                    <div className="rhp-count-badge">
                        <span>{dummyRecentlyHeld.length}</span>
                        {dummyRecentlyHeld.length === 1 ? 'Programme' : 'Programmes'}
                    </div>
                </div>

                {/* ── Add Form ── */}
                <div className="rhp-form-card">
                    <div className="section-label">Add New Programme</div>
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
                                    placeholder="e.g. Tree Plantation Drive 2026"
                                />
                            </div>

                            <div className="rhp-form-group">
                                <label className="rhp-label">Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="rhp-input"
                                />
                            </div>

                            <div className="rhp-form-group">
                                <label className="rhp-label">Venue *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.venue}
                                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                                    className="rhp-input"
                                    placeholder="e.g. Burdwan University Campus"
                                />
                            </div>

                            <div className="rhp-form-group">
                                <label className="rhp-label">Upload Images</label>
                                <div className="rhp-file-wrapper">
                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <div className="rhp-form-group full">
                                <label className="rhp-label">Description *</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="rhp-textarea"
                                    placeholder="Describe the programme — outcomes, participation, highlights..."
                                />
                            </div>

                            {formData.images.length > 0 && (
                                <div className="rhp-previews">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="rhp-thumb">
                                            <img src={img} alt="Preview" />
                                            <button
                                                type="button"
                                                className="rhp-thumb-remove"
                                                onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                                            >
                                                <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ gridColumn: '1 / -1' }}>
                                <button type="submit" disabled={isSubmitting} className="rhp-submit">
                                    {isSubmitting ? (
                                        <><span className="rhp-spinner" /> Submitting…</>
                                    ) : (
                                        <>
                                            <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Submit Programme
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    </form>
                </div>

                {/* ── All Programmes ── */}
                <div className="rhp-list-card">
                    <div className="section-label">All Programmes</div>

                    {dummyRecentlyHeld.length === 0 ? (
                        <div className="rhp-empty">
                            <div className="rhp-empty-icon">🗂️</div>
                            <p>No programmes have been added yet.</p>
                        </div>
                    ) : (
                        <div className="rhp-grid">
                            {dummyRecentlyHeld.map(prog => (
                                <div key={prog.id} className="prog-card">

                                    {/* Image */}
                                    <div className="prog-image">
                                        <Image src={prog.image} alt={prog.title} fill style={{ objectFit: 'cover' }} />
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
                                                <button className="prog-action-btn edit" title="Edit">
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button className="prog-action-btn" title="Delete">
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
                                            {prog.venue}
                                        </div>

                                        <p className="prog-desc">{prog.description}</p>

                                        <div className="prog-footer">
                                            <button className="prog-add-image-btn">
                                                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add Images to this Event
                                            </button>
                                        </div>
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