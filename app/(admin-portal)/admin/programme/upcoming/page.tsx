"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const dummyUpcoming = [
    {
        id: 1,
        image: "/logo.jpg",
        title: "Annual Sports Meet 2024",
        date: "2024-05-20",
        venue: "Zilla School Ground",
        description: "Join us for the biggest sports event of the year, bringing together underprivileged children from across the district to compete, celebrate, and grow together."
    },
    {
        id: 2,
        image: "/logo.jpg",
        title: "Community Health Drive",
        date: "2024-06-08",
        venue: "Burdwan Town Hall",
        description: "A district-wide health awareness and free checkup camp in partnership with leading healthcare organizations and volunteer doctors."
    },
];

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getDaysLeft(dateStr: string) {
    const target = new Date(dateStr).getTime();
    const now = Date.now();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return null;
    if (diff === 0) return 'Today';
    if (diff === 1) return '1 day left';
    return `${diff} days left`;
}

export default function UpcomingPage() {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        venue: '',
        description: '',
        images: [] as string[],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, forceUpdate] = useState(0);

    // Re-render every minute so countdown stays fresh
    useEffect(() => {
        const t = setInterval(() => forceUpdate(n => n + 1), 60000);
        return () => clearInterval(t);
    }, []);

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
            alert('Upcoming programme added successfully!');
        }, 800);
    };

    const featured = dummyUpcoming[0] ?? null;
    const rest = dummyUpcoming.slice(1);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

                .up-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #f7f5f2;
                    padding: 40px 32px 80px;
                    color: #1a1a1a;
                }

                /* ── Header ── */
                .up-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 40px;
                    padding-bottom: 32px;
                    border-bottom: 1px solid #e5e0d8;
                }
                .up-eyebrow {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b06c40;
                    margin-bottom: 8px;
                }
                .up-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 42px;
                    font-weight: 400;
                    line-height: 1.1;
                    color: #1a1a1a;
                    margin: 0;
                }
                .up-title em { font-style: italic; color: #b06c40; }
                .up-subtitle { margin-top: 10px; font-size: 14px; color: #8a8070; }
                .up-count-badge {
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
                .up-count-badge span {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 26px; height: 26px;
                    background: #b06c40;
                    color: #fff;
                    border-radius: 50%;
                    font-size: 12px;
                    font-weight: 700;
                }

                /* ── Section label ── */
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

                /* ── Form Card ── */
                .up-form-card {
                    background: #fff;
                    border: 1px solid #e5e0d8;
                    border-radius: 20px;
                    padding: 40px;
                    margin-bottom: 32px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04);
                }
                .up-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .up-form-group { display: flex; flex-direction: column; gap: 8px; }
                .up-form-group.full { grid-column: 1 / -1; }
                .up-label {
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #8a8070;
                }
                .up-input, .up-textarea {
                    width: 100%;
                    background: #faf8f5;
                    border: 1.5px solid #ede8e1;
                    border-radius: 12px;
                    padding: 14px 18px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    color: #1a1a1a;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .up-input::placeholder, .up-textarea::placeholder { color: #bdb5a8; }
                .up-input:focus, .up-textarea:focus {
                    border-color: #b06c40;
                    box-shadow: 0 0 0 3px rgba(176,108,64,0.08);
                    background: #fff;
                }
                .up-input[type="date"] { color: #5c5146; }
                .up-textarea { resize: none; height: 120px; }
                .up-file-wrapper input[type="file"] {
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
                .up-file-wrapper input[type="file"]:hover { border-color: #b06c40; }
                .up-file-wrapper input[type="file"]::file-selector-button {
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
                .up-file-wrapper input[type="file"]::file-selector-button:hover { background: #e6ddd4; }

                .up-previews { display: flex; flex-wrap: wrap; gap: 10px; grid-column: 1 / -1; }
                .up-thumb {
                    position: relative;
                    width: 72px; height: 72px;
                    border-radius: 10px;
                    overflow: hidden;
                    border: 1.5px solid #e5e0d8;
                    flex-shrink: 0;
                }
                .up-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
                .up-thumb-remove {
                    position: absolute;
                    top: 3px; right: 3px;
                    background: rgba(255,255,255,0.92);
                    border: none; border-radius: 50%;
                    width: 18px; height: 18px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: #c0392b; padding: 0;
                }

                .up-submit {
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
                .up-submit:hover:not(:disabled) {
                    background: #b06c40;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 28px rgba(176,108,64,0.25);
                }
                .up-submit:active:not(:disabled) { transform: translateY(0); }
                .up-submit:disabled { opacity: 0.55; cursor: not-allowed; }
                .up-spinner {
                    width: 14px; height: 14px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: up-spin 0.7s linear infinite;
                }
                @keyframes up-spin { to { transform: rotate(360deg); } }

                /* ── Upcoming list card ── */
                .up-list-card {
                    background: #fff;
                    border: 1px solid #e5e0d8;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04);
                }

                /* Featured hero card */
                .up-featured {
                    display: flex;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid #ede8e1;
                    background: #faf8f5;
                    margin-bottom: 24px;
                    transition: box-shadow 0.25s, transform 0.25s;
                }
                .up-featured:hover {
                    box-shadow: 0 16px 48px rgba(0,0,0,0.1);
                    transform: translateY(-3px);
                }
                .up-featured-img {
                    position: relative;
                    width: 340px;
                    min-height: 280px;
                    flex-shrink: 0;
                    overflow: hidden;
                    background: #ede8e1;
                }
                .up-featured-img img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                    display: block;
                }
                .up-featured:hover .up-featured-img img { transform: scale(1.04); }

                /* Countdown chip */
                .up-countdown {
                    position: absolute;
                    top: 14px; left: 14px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    background: #b06c40;
                    color: #fff;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    padding: 6px 12px;
                    border-radius: 100px;
                }
                .up-featured-next-label {
                    position: absolute;
                    bottom: 14px; left: 14px;
                    background: rgba(26,26,26,0.7);
                    color: #fff;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    padding: 4px 10px;
                    border-radius: 100px;
                    backdrop-filter: blur(4px);
                }

                .up-featured-body {
                    padding: 32px 32px 28px;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    flex: 1;
                }
                .up-featured-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 12px;
                }
                .up-featured-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 26px;
                    font-weight: 400;
                    color: #1a1a1a;
                    line-height: 1.2;
                    margin: 0;
                }
                .up-feat-actions { display: flex; gap: 6px; flex-shrink: 0; }
                .up-act-btn {
                    width: 34px; height: 34px;
                    border-radius: 8px;
                    border: 1px solid #e5e0d8;
                    background: #fff;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: #8a8070;
                    transition: all 0.15s; padding: 0;
                }
                .up-act-btn:hover { color: #c0392b; border-color: #f5c6c2; background: #fff5f4; }
                .up-act-btn.edit:hover { color: #4a7ab5; border-color: #c8ddf0; background: #f0f6fd; }

                .up-meta-row {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    flex-wrap: wrap;
                }
                .up-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    font-weight: 500;
                    color: #6e6660;
                }
                .up-meta-item svg { color: #b06c40; flex-shrink: 0; }
                .up-featured-desc {
                    font-size: 14px;
                    color: #6e6660;
                    line-height: 1.7;
                    margin: 0;
                }
                .up-featured-footer {
                    margin-top: auto;
                    padding-top: 16px;
                    border-top: 1px solid #ede8e1;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .up-status-dot {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    background: #4a9e72;
                    animation: up-pulse 2s ease infinite;
                }
                @keyframes up-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.85); }
                }
                .up-status-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #4a9e72;
                    letter-spacing: 0.04em;
                }

                /* Secondary cards grid */
                .up-secondary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                }
                .up-secondary-divider {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #b0a898;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .up-secondary-divider::before, .up-secondary-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #ede8e1;
                }

                .up-card {
                    background: #faf8f5;
                    border: 1px solid #ede8e1;
                    border-radius: 14px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: box-shadow 0.22s, transform 0.22s;
                }
                .up-card:hover { box-shadow: 0 10px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }
                .up-card-img {
                    position: relative;
                    height: 160px;
                    overflow: hidden;
                    background: #ede8e1;
                }
                .up-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; display: block; }
                .up-card:hover .up-card-img img { transform: scale(1.05); }
                .up-card-countdown {
                    position: absolute;
                    top: 10px; left: 10px;
                    background: rgba(176,108,64,0.9);
                    color: #fff;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    padding: 4px 10px;
                    border-radius: 100px;
                }
                .up-card-body { padding: 18px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
                .up-card-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 17px;
                    font-weight: 400;
                    color: #1a1a1a;
                    line-height: 1.2;
                    margin: 0;
                }
                .up-card-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                .up-card-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 12px;
                    font-weight: 500;
                    color: #8a8070;
                }
                .up-card-meta-item svg { color: #b06c40; flex-shrink: 0; }
                .up-card-desc {
                    font-size: 13px;
                    color: #7a7060;
                    line-height: 1.6;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .up-card-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: auto;
                    padding-top: 12px;
                    border-top: 1px solid #ede8e1;
                }
                .up-card-actions { display: flex; gap: 5px; }
                .up-card-act {
                    width: 30px; height: 30px;
                    border-radius: 7px;
                    border: 1px solid #e5e0d8;
                    background: #fff;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: #8a8070;
                    transition: all 0.15s; padding: 0;
                }
                .up-card-act:hover { color: #c0392b; border-color: #f5c6c2; background: #fff5f4; }
                .up-card-act.edit:hover { color: #4a7ab5; border-color: #c8ddf0; background: #f0f6fd; }

                /* Empty */
                .up-empty {
                    text-align: center;
                    padding: 64px 0;
                    color: #bdb5a8;
                }
                .up-empty-icon { font-size: 40px; margin-bottom: 16px; }
                .up-empty p { font-size: 15px; font-weight: 500; }

                @media (max-width: 900px) {
                    .up-featured { flex-direction: column; }
                    .up-featured-img { width: 100%; min-height: 220px; }
                }
                @media (max-width: 768px) {
                    .up-root { padding: 24px 16px 60px; }
                    .up-header { flex-direction: column; align-items: flex-start; gap: 16px; }
                    .up-title { font-size: 32px; }
                    .up-form-grid { grid-template-columns: 1fr; }
                    .up-form-group.full { grid-column: 1; }
                }
            `}</style>

            <div className="up-root">

                {/* ── Header ── */}
                <div className="up-header">
                    <div>
                        <div className="up-eyebrow">Society Management</div>
                        <h1 className="up-title"><em>Upcoming</em> Programmes</h1>
                        <p className="up-subtitle">Plan and manage future society events and programmes</p>
                    </div>
                    <div className="up-count-badge">
                        <span>{dummyUpcoming.length}</span>
                        {dummyUpcoming.length === 1 ? 'Programme' : 'Programmes'}
                    </div>
                </div>

                {/* ── Add Form ── */}
                <div className="up-form-card">
                    <div className="section-label">Add New Upcoming Programme</div>
                    <form onSubmit={handleSubmit}>
                        <div className="up-form-grid">

                            <div className="up-form-group">
                                <label className="up-label">Programme Title *</label>
                                <input
                                    type="text" required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="up-input"
                                    placeholder="e.g. Annual Sports Meet 2026"
                                />
                            </div>

                            <div className="up-form-group">
                                <label className="up-label">Date *</label>
                                <input
                                    type="date" required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="up-input"
                                />
                            </div>

                            <div className="up-form-group">
                                <label className="up-label">Venue *</label>
                                <input
                                    type="text" required
                                    value={formData.venue}
                                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                                    className="up-input"
                                    placeholder="e.g. Zilla School Ground"
                                />
                            </div>

                            <div className="up-form-group">
                                <label className="up-label">Upload Images</label>
                                <div className="up-file-wrapper">
                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <div className="up-form-group full">
                                <label className="up-label">Description *</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="up-textarea"
                                    placeholder="Describe the programme — purpose, activities, target audience..."
                                />
                            </div>

                            {formData.images.length > 0 && (
                                <div className="up-previews">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="up-thumb">
                                            <img src={img} alt="Preview" />
                                            <button
                                                type="button"
                                                className="up-thumb-remove"
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
                                <button type="submit" disabled={isSubmitting} className="up-submit">
                                    {isSubmitting ? (
                                        <><span className="up-spinner" /> Submitting…</>
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

                {/* ── Upcoming List ── */}
                <div className="up-list-card">
                    <div className="section-label">Current Upcoming Programmes</div>

                    {dummyUpcoming.length === 0 ? (
                        <div className="up-empty">
                            <div className="up-empty-icon">📅</div>
                            <p>No upcoming programmes scheduled yet.</p>
                        </div>
                    ) : (
                        <>
                            {/* Featured — first programme */}
                            {featured && (() => {
                                const daysLeft = getDaysLeft(featured.date);
                                return (
                                    <div className="up-featured">
                                        <div className="up-featured-img">
                                            <Image src={featured.image} alt={featured.title} fill style={{ objectFit: 'cover' }} />
                                            {daysLeft && (
                                                <div className="up-countdown">
                                                    <svg width="9" height="9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {daysLeft}
                                                </div>
                                            )}
                                            <div className="up-featured-next-label">Next Programme</div>
                                        </div>

                                        <div className="up-featured-body">
                                            <div className="up-featured-header">
                                                <h3 className="up-featured-title">{featured.title}</h3>
                                                <div className="up-feat-actions">
                                                    <button className="up-act-btn edit" title="Edit">
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button className="up-act-btn" title="Delete">
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="up-meta-row">
                                                <div className="up-meta-item">
                                                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {formatDate(featured.date)}
                                                </div>
                                                <div className="up-meta-item">
                                                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {featured.venue}
                                                </div>
                                            </div>

                                            <p className="up-featured-desc">{featured.description}</p>

                                            <div className="up-featured-footer">
                                                <div className="up-status-dot" />
                                                <span className="up-status-label">Scheduled & Confirmed</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Secondary cards */}
                            {rest.length > 0 && (
                                <>
                                    <div className="up-secondary-divider">Also Upcoming</div>
                                    <div className="up-secondary-grid">
                                        {rest.map(prog => {
                                            const daysLeft = getDaysLeft(prog.date);
                                            return (
                                                <div key={prog.id} className="up-card">
                                                    <div className="up-card-img">
                                                        <Image src={prog.image} alt={prog.title} fill style={{ objectFit: 'cover' }} />
                                                        {daysLeft && <div className="up-card-countdown">{daysLeft}</div>}
                                                    </div>
                                                    <div className="up-card-body">
                                                        <h3 className="up-card-title">{prog.title}</h3>
                                                        <div className="up-card-meta">
                                                            <div className="up-card-meta-item">
                                                                <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                {formatDate(prog.date)}
                                                            </div>
                                                            <div className="up-card-meta-item">
                                                                <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                {prog.venue}
                                                            </div>
                                                        </div>
                                                        <p className="up-card-desc">{prog.description}</p>
                                                        <div className="up-card-footer">
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                <div className="up-status-dot" style={{ width: 7, height: 7 }} />
                                                                <span style={{ fontSize: 11, fontWeight: 600, color: '#4a9e72' }}>Scheduled</span>
                                                            </div>
                                                            <div className="up-card-actions">
                                                                <button className="up-card-act edit" title="Edit">
                                                                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                                <button className="up-card-act" title="Delete">
                                                                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>

            </div>
        </>
    );
}