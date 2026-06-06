"use client";

import React, { useState, useEffect } from 'react';

interface OverviewVideo {
    _id: string;
    title: string;
    videoUrl: string;
    publicId: string;
    createdAt: string;
}

export default function ProjectOverviewPage() {
    const [videos, setVideos] = useState<OverviewVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        video: ''
    });
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await fetch('/api/admin/project-overview');
            const data = await res.json();
            if (Array.isArray(data)) {
                setVideos(data);
            }
        } catch (error) {
            console.error("Failed to fetch overview videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);

            // Limit video file size to 60MB for upload performance and stability
            if (file.size > 60 * 1024 * 1024) {
                alert("File size exceeds 60MB. Please select a smaller video file.");
                e.target.value = "";
                setFileName("");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, video: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.video) {
            alert("Please select a video file");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/project-overview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ video: '' });
                setFileName('');
                // Reset file input element visually
                const fileInput = document.getElementById('video-upload-input') as HTMLInputElement;
                if (fileInput) fileInput.value = '';

                fetchVideos();
                alert('Project overview video uploaded and saved successfully!');
            } else {
                const error = await res.json();
                alert(`Error: ${error.error || 'Failed to upload video'}`);
            }
        } catch (error) {
            console.error("Failed to upload overview video:", error);
            alert("An error occurred during video upload. Please check network/file size and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project overview video? It will be removed from the website and Cloudinary.")) return;
        try {
            const res = await fetch(`/api/admin/project-overview?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchVideos();
                alert("Video deleted successfully!");
            } else {
                const data = await res.json();
                alert(`Error: ${data.error || 'Failed to delete video'}`);
            }
        } catch (error) {
            console.error("Failed to delete video:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

                .overview-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #f7f5f2;
                    padding: 40px 32px 80px;
                    color: #1a1a1a;
                }

                /* ── Page Header ── */
                .page-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 48px;
                    padding-bottom: 32px;
                    border-bottom: 1px solid #e5e0d8;
                }
                .page-eyebrow {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b06c40;
                    margin-bottom: 8px;
                }
                .page-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 42px;
                    font-weight: 400;
                    line-height: 1.1;
                    color: #1a1a1a;
                    margin: 0;
                }
                .page-title em {
                    font-style: italic;
                    color: #b06c40;
                }
                .page-subtitle {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #8a8070;
                    font-weight: 400;
                }
                .video-count-badge {
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
                }
                .video-count-badge span {
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
                .form-card {
                    background: #ffffff;
                    border: 1px solid #e5e0d8;
                    border-radius: 20px;
                    padding: 40px;
                    margin-bottom: 40px;
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

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group.full {
                    grid-column: 1 / -1;
                }
                .form-label {
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #8a8070;
                }
                .form-input {
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
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                }
                .form-input:focus {
                    border-color: #b06c40;
                    box-shadow: 0 0 0 3px rgba(176,108,64,0.08);
                    background: #fff;
                }
                .file-input-wrapper {
                    position: relative;
                }
                .file-input-wrapper input[type="file"] {
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
                .file-input-wrapper input[type="file"]:hover {
                    border-color: #b06c40;
                }
                .file-input-wrapper input[type="file"]::file-selector-button {
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
                .file-input-wrapper input[type="file"]::file-selector-button:hover {
                    background: #e6ddd4;
                }
                .file-info {
                    font-size: 11px;
                    color: #8a8070;
                    margin-top: 4px;
                    font-weight: 500;
                }

                /* Submit Button */
                .submit-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
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
                    width: fit-content;
                }
                .submit-btn:hover:not(:disabled) {
                    background: #b06c40;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 28px rgba(176,108,64,0.25);
                }
                .submit-btn:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }
                .spinner {
                    width: 14px;
                    height: 14px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* ── Videos Grid ── */
                .videos-card {
                    background: #ffffff;
                    border: 1px solid #e5e0d8;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04);
                }
                .videos-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 24px;
                    margin-top: 8px;
                }
                .empty-state {
                    text-align: center;
                    padding: 64px 0;
                    color: #bdb5a8;
                }
                .empty-icon {
                    font-size: 40px;
                    margin-bottom: 16px;
                }
                .empty-state p {
                    font-size: 15px;
                    font-weight: 500;
                }

                /* Video Card */
                .vid-card {
                    background: #faf8f5;
                    border: 1px solid #ede8e1;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: box-shadow 0.25s, transform 0.25s;
                    display: flex;
                    flex-direction: column;
                }
                .vid-card:hover {
                    box-shadow: 0 12px 40px rgba(0,0,0,0.08);
                    transform: translateY(-3px);
                }
                .vid-player-wrapper {
                    position: relative;
                    aspect-ratio: 16 / 9;
                    width: 100%;
                    background: #000;
                    flex-shrink: 0;
                }
                .vid-player-wrapper video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .vid-body {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    flex: 1;
                }
                .vid-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 12px;
                }
                .vid-name {
                    font-family: 'DM Serif Display', serif;
                    font-size: 18px;
                    font-weight: 400;
                    color: #1a1a1a;
                    line-height: 1.25;
                    margin: 0;
                }
                .action-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 34px;
                    height: 34px;
                    border-radius: 8px;
                    border: 1px solid #e5e0d8;
                    background: #fff;
                    cursor: pointer;
                    color: #8a8070;
                    transition: all 0.15s;
                    padding: 0;
                    flex-shrink: 0;
                }
                .action-btn:hover {
                    color: #c0392b;
                    border-color: #f5c6c2;
                    background: #fff5f4;
                }
                .vid-date {
                    font-size: 11px;
                    font-weight: 500;
                    color: #8a8070;
                    margin-top: auto;
                    border-top: 1px solid #ede8e1;
                    padding-top: 10px;
                }

                @media (max-width: 768px) {
                    .overview-root { padding: 24px 16px 60px; }
                    .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
                    .form-grid { grid-template-columns: 1fr; }
                    .page-title { font-size: 32px; }
                }
            `}</style>

            <div className="overview-root">
                {/* ── Page Header ── */}
                <div className="page-header">
                    <div>
                        <div className="page-eyebrow">Society Management</div>
                        <h1 className="page-title">Project <em>Overview Videos</em></h1>
                        <p className="page-subtitle">Manage loop-playing promotional videos for Home and Projects pages</p>
                    </div>
                    {!loading && (
                        <div className="video-count-badge">
                            <span>{videos.length}</span>
                            {videos.length === 1 ? 'Video' : 'Videos'}
                        </div>
                    )}
                </div>

                {/* ── Add New Video Form ── */}
                <div className="form-card">
                    <div className="section-label">Upload New Video</div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group full">
                                <label className="form-label">Upload Video File *</label>
                                <div className="file-input-wrapper">
                                    <input
                                        id="video-upload-input"
                                        type="file"
                                        required
                                        accept="video/*"
                                        onChange={handleVideoChange}
                                    />
                                </div>
                                <div className="file-info">
                                    {fileName ? `Selected: ${fileName}` : "MP4, WebM, MOV · Max 60MB · Uploads directly to Cloudinary"}
                                </div>
                            </div>

                            <div className="full" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                                <button type="submit" disabled={isSubmitting} className="submit-btn">
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner" />
                                            Uploading and Processing… (This may take a minute)
                                        </>
                                    ) : (
                                        <>
                                            <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Upload Video
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* ── All Overview Videos ── */}
                <div className="videos-card">
                    <div className="section-label">All Overview Videos</div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-10 h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🎥</div>
                            <p>No overview videos uploaded yet.</p>
                        </div>
                    ) : (
                        <div className="videos-grid">
                            {videos.map((video, index) => (
                                <div key={video._id} className="vid-card">
                                    <div className="vid-player-wrapper">
                                        <video
                                            src={video.videoUrl}
                                            controls
                                            muted
                                            autoPlay
                                            loop
                                            playsInline
                                        />
                                    </div>

                                    <div className="vid-body">
                                        <div className="vid-header">
                                            <h3 className="vid-name">Overview Video #{videos.length - index}</h3>
                                            <button
                                                type="button"
                                                className="action-btn"
                                                title="Delete Video"
                                                onClick={() => handleDelete(video._id)}
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    <line x1="10" y1="11" x2="10" y2="17" />
                                                    <line x1="14" y1="11" x2="14" y2="17" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="vid-date">
                                            Uploaded on: {new Date(video.createdAt).toLocaleDateString()}
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
