"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Project {
    _id: string;
    name: string;
    description: string;
    images: string[];
    pdf?: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        images: [] as string[],
        pdf: ''
    });
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/projects');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProjects(data);
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const base64Promises = files.map(file => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            });
            const base64Images = await Promise.all(base64Promises);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...base64Images] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.description) {
            alert("Please fill all required fields");
            return;
        }
        setIsSubmitting(true);
        try {
            const url = editingProjectId 
                ? `/api/admin/projects/${editingProjectId}`
                : '/api/admin/projects';
            const method = editingProjectId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setFormData({ name: '', description: '', images: [], pdf: '' });
                setEditingProjectId(null);
                fetchProjects();
                alert(editingProjectId ? 'Project updated successfully!' : 'Project added successfully!');
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to save project:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProjectId(project._id);
        setFormData({
            name: project.name,
            description: project.description,
            images: project.images || [],
            pdf: project.pdf || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProjectId(null);
        setFormData({ name: '', description: '', images: [], pdf: '' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchProjects();
                alert("Project deleted successfully!");
            } else {
                alert("Failed to delete project");
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

                .projects-root {
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
                .page-header-left {}
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
                .project-count-badge {
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
                .project-count-badge span {
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
                .form-input, .form-textarea {
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
                .form-input::placeholder, .form-textarea::placeholder {
                    color: #bdb5a8;
                }
                .form-input:focus, .form-textarea:focus {
                    border-color: #b06c40;
                    box-shadow: 0 0 0 3px rgba(176,108,64,0.08);
                    background: #fff;
                }
                .form-textarea {
                    resize: none;
                    height: 120px;
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
                .link-status {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #5a9e6a;
                    margin-top: 4px;
                }

                /* Image Previews */
                .image-previews {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    grid-column: 1 / -1;
                    margin-top: -4px;
                }
                .preview-thumb {
                    position: relative;
                    width: 72px;
                    height: 72px;
                    border-radius: 10px;
                    overflow: hidden;
                    border: 1.5px solid #e5e0d8;
                    flex-shrink: 0;
                }
                .preview-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .preview-remove {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    background: rgba(255,255,255,0.9);
                    border: none;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #c0392b;
                    padding: 0;
                    transition: background 0.15s;
                }
                .preview-remove:hover {
                    background: #fff;
                }

                /* Submit Button */
                .submit-btn {
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
                .submit-btn:hover:not(:disabled) {
                    background: #b06c40;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 28px rgba(176,108,64,0.25);
                }
                .submit-btn:active:not(:disabled) {
                    transform: translateY(0);
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

                /* ── Projects Grid ── */
                .projects-card {
                    background: #ffffff;
                    border: 1px solid #e5e0d8;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04);
                }
                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

                /* Project Card */
                .proj-card {
                    background: #faf8f5;
                    border: 1px solid #ede8e1;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: box-shadow 0.25s, transform 0.25s;
                    display: flex;
                    flex-direction: column;
                }
                .proj-card:hover {
                    box-shadow: 0 12px 40px rgba(0,0,0,0.1);
                    transform: translateY(-3px);
                }
                .proj-image {
                    position: relative;
                    height: 200px;
                    width: 100%;
                    overflow: hidden;
                    background: #ede8e1;
                    flex-shrink: 0;
                }
                .proj-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.4s ease;
                }
                .proj-card:hover .proj-image img {
                    transform: scale(1.04);
                }
                .no-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #c4bcb0;
                    gap: 8px;
                }
                .no-image svg {
                    opacity: 0.4;
                }
                .no-image span {
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: 0.05em;
                }
                .image-count-pill {
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    background: rgba(26,26,26,0.7);
                    color: #fff;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    padding: 4px 10px;
                    border-radius: 100px;
                    backdrop-filter: blur(4px);
                }

                .proj-body {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    flex: 1;
                }
                .proj-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 12px;
                }
                .proj-name {
                    font-family: 'DM Serif Display', serif;
                    font-size: 20px;
                    font-weight: 400;
                    color: #1a1a1a;
                    line-height: 1.2;
                    margin: 0;
                }
                .proj-actions {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-shrink: 0;
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
                }
                .action-btn:hover {
                    color: #c0392b;
                    border-color: #f5c6c2;
                    background: #fff5f4;
                }
                .action-btn.edit-btn:hover {
                    color: #b06c40;
                    border-color: #e6ddd4;
                    background: #faf8f5;
                }
                .action-btn.doc-btn {
                    color: #4a7ab5;
                    border-color: #c8ddf0;
                    background: #f0f6fd;
                    cursor: default;
                }

                .proj-desc {
                    font-size: 13.5px;
                    font-weight: 400;
                    color: #6e6660;
                    line-height: 1.65;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .proj-footer {
                    margin-top: auto;
                    padding-top: 12px;
                    border-top: 1px solid #ede8e1;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .doc-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #4a7ab5;
                    letter-spacing: 0.04em;
                }

                /* Loading skeleton */
                .loading-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                    margin-top: 8px;
                }
                .skeleton {
                    background: #ede8e1;
                    border-radius: 16px;
                    height: 300px;
                    animation: shimmer 1.5s infinite;
                    background: linear-gradient(90deg, #ede8e1 25%, #e5dfd6 50%, #ede8e1 75%);
                    background-size: 200% 100%;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                @media (max-width: 768px) {
                    .projects-root { padding: 24px 16px 60px; }
                    .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
                    .form-grid { grid-template-columns: 1fr; }
                    .form-group.full { grid-column: 1; }
                    .page-title { font-size: 32px; }
                }
            `}</style>

            <div className="projects-root">

                {/* ── Page Header ── */}
                <div className="page-header">
                    <div className="page-header-left">
                        <div className="page-eyebrow">Society Management</div>
                        <h1 className="page-title">Our <em>Projects</em></h1>
                        <p className="page-subtitle">Manage and track all ongoing society projects</p>
                    </div>
                    {!loading && (
                        <div className="project-count-badge">
                            <span>{projects.length}</span>
                            {projects.length === 1 ? 'Project' : 'Projects'}
                        </div>
                    )}
                </div>

                {/* ── Add New Project ── */}
                <div className="form-card">
                    <div className="section-label">{editingProjectId ? 'Edit Project' : 'Add New Project'}</div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Project Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="form-input"
                                    placeholder="e.g. Community Garden Initiative"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Upload Images</label>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Document Link (Google Drive)</label>
                                <input
                                    type="url"
                                    value={formData.pdf}
                                    onChange={(e) => setFormData({ ...formData, pdf: e.target.value })}
                                    className="form-input"
                                    placeholder="https://drive.google.com/..."
                                />
                                {formData.pdf && formData.pdf.startsWith('http') && (
                                    <div className="link-status">
                                        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Link added
                                    </div>
                                )}
                            </div>

                            <div className="form-group full">
                                <label className="form-label">Description *</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="form-textarea"
                                    placeholder="Briefly describe the project goals, scope, and current status..."
                                />
                            </div>

                            {formData.images.length > 0 && (
                                <div className="image-previews">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="preview-thumb">
                                            <img src={img} alt="Preview" />
                                            <button
                                                type="button"
                                                className="preview-remove"
                                                onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                            >
                                                <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="full" style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px' }}>
                                <button type="submit" disabled={isSubmitting} className="submit-btn">
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner" />
                                            {editingProjectId ? 'Updating…' : 'Submitting…'}
                                        </>
                                    ) : (
                                        <>
                                            <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            {editingProjectId ? 'Update Project' : 'Submit Project'}
                                        </>
                                    )}
                                </button>
                                {editingProjectId && (
                                    <button 
                                        type="button" 
                                        onClick={handleCancelEdit}
                                        className="submit-btn"
                                        style={{ background: '#f0ece6', color: '#7a5c3c', boxShadow: 'none' }}
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* ── All Projects ── */}
                <div className="projects-card">
                    <div className="section-label">All Projects</div>

                    {loading ? (
                        <div className="loading-grid">
                            {[1, 2, 3].map(i => <div key={i} className="skeleton" />)}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📁</div>
                            <p>No projects have been added yet.</p>
                        </div>
                    ) : (
                        <div className="projects-grid">
                            {projects.map(project => (
                                <div key={project._id} className="proj-card">
                                    <div className="proj-image">
                                        {project.images && project.images.length > 0 ? (
                                            <>
                                                <Image
                                                    src={project.images[0]}
                                                    alt={project.name}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                                {project.images.length > 1 && (
                                                    <div className="image-count-pill">
                                                        +{project.images.length - 1} more
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="no-image">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <rect x="3" y="3" width="18" height="18" rx="3" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <path d="M21 15l-5-5L5 21" />
                                                </svg>
                                                <span>No Image</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="proj-body">
                                        <div className="proj-header">
                                            <h3 className="proj-name">{project.name}</h3>
                                            <div className="proj-actions">
                                                {project.pdf && (
                                                    <a
                                                        href={project.pdf}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="action-btn doc-btn"
                                                        title="Open Document"
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                                            <polyline points="14 2 14 8 20 8" />
                                                            <line x1="16" y1="13" x2="8" y2="13" />
                                                            <line x1="16" y1="17" x2="8" y2="17" />
                                                            <polyline points="10 9 9 9 8 9" />
                                                        </svg>
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(project)}
                                                    className="action-btn edit-btn"
                                                    title="Edit project"
                                                >
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project._id)}
                                                    className="action-btn"
                                                    title="Delete project"
                                                >
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                                        <path d="M10 11v6M14 11v6" />
                                                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <p className="proj-desc">{project.description}</p>

                                        {project.pdf && (
                                            <div className="proj-footer">
                                                <div className="doc-tag">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                                    </svg>
                                                    Document attached
                                                </div>
                                            </div>
                                        )}
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