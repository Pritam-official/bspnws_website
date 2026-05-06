"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import {
    User,
    Mail,
    Phone,
    Key,
    Eye,
    EyeOff,
    Camera,
    Save,
    Edit2,
    Shield,
    BadgeCheck,
    X,
    Loader2,
    ChevronRight
} from 'lucide-react';

interface AdminData {
    _id?: string;
    id?: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    membershipCode: string;
    profileImage?: string;
    role: string;
    joinDate?: string;
    lastActive?: string;
}

export default function AdminEditProfilePage() {
    const [adminData, setAdminData] = useState<AdminData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            const data = localStorage.getItem('admin_data');
            if (data) {
                const parsed = JSON.parse(data);
                const adminId = parsed._id || parsed.id;
                
                if (adminId) {
                    try {
                        const res = await fetch(`/api/admin/profile/${adminId}`);
                        if (res.ok) {
                            const dbData = await res.json();
                            const joinedDate = dbData.createdAt 
                                ? new Date(dbData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                : 'January 2024';
                            
                            const finalData = {
                                ...dbData,
                                name: `${dbData.firstName} ${dbData.lastName}`,
                                joinDate: joinedDate,
                                lastActive: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                            };
                            setAdminData(finalData);
                            // Sync localStorage
                            localStorage.setItem('admin_data', JSON.stringify(finalData));
                        } else {
                            setAdminData(parsed);
                        }
                    } catch (error) {
                        console.error("Failed to fetch admin profile:", error);
                        setAdminData(parsed);
                    }
                } else {
                    setAdminData(parsed);
                }
            }
        };

        fetchAdminProfile();
    }, []);

    const onCropComplete = useCallback((_: any, cap: any) => {
        setCroppedAreaPixels(cap);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadingImage(true);
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result as string);
                setUploadingImage(false);
            });
            reader.readAsDataURL(file);
        }
    };

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const img = new window.Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', (e) => reject(e));
            img.src = url;
        });

    const getCroppedImg = async (src: string, pixelCrop: any): Promise<string> => {
        const image = await createImage(src);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
        return canvas.toDataURL('image/jpeg');
    };

    const handleSaveCrop = async () => {
        if (imageSrc && croppedAreaPixels) {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            const updated = { ...adminData!, profileImage: croppedImage };
            setAdminData(updated);
            localStorage.setItem('admin_data', JSON.stringify(updated));
            setImageSrc(null);
            // Dispatch event for header to update
            window.dispatchEvent(new Event('adminDataUpdated'));
        }
    };

    const handleSave = async () => {
        if (!adminData) return;
        
        setIsSaving(true);
        const adminId = adminData._id || adminData.id;

        try {
            const res = await fetch(`/api/admin/profile/${adminId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: adminData.firstName,
                    lastName: adminData.lastName,
                    email: adminData.email,
                    phone: adminData.phone,
                    membershipCode: adminData.membershipCode
                })
            });

            if (res.ok) {
                const updatedFromDb = await res.json();
                const updated = {
                    ...adminData,
                    ...updatedFromDb,
                    name: `${adminData.firstName} ${adminData.lastName}`,
                    lastActive: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                };
                localStorage.setItem('admin_data', JSON.stringify(updated));
                setAdminData(updated);
                setIsEditing(false);
                window.dispatchEvent(new Event('adminDataUpdated'));
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save profile");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("An error occurred while saving profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reload original data
        const data = localStorage.getItem('admin_data');
        if (data) setAdminData(JSON.parse(data));
        setIsEditing(false);
    };

    if (!adminData) return (
        <div className="flex items-center justify-center h-96">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-pink-200 rounded-full animate-pulse"></div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Animated Page Header */}
            <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Profile Settings
                    </h1>
                </div>
                <p className="text-gray-500 ml-4">Manage your personal information and security settings</p>
            </div>

            {/* Crop Modal */}
            {imageSrc && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fade-in">
                    <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-semibold text-gray-900">Crop Profile Picture</h3>
                            <button onClick={() => setImageSrc(null)} className="p-1 hover:bg-gray-100 rounded-full transition">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="relative aspect-square bg-gray-900">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>
                        <div className="p-4 flex gap-3">
                            <button
                                onClick={() => setImageSrc(null)}
                                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveCrop}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                            >
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Profile Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-slide-up">
                {/* Cover Banner */}
                <div className="h-32 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -bottom-12 left-8">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-2xl bg-white p-1 shadow-xl">
                                <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100">
                                    {adminData.profileImage ? (
                                        <Image
                                            src={adminData.profileImage}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
                                            <User className="w-10 h-10 text-pink-500" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isEditing && (
                                <label className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md cursor-pointer hover:scale-110 transition-transform">
                                    <div className="bg-pink-600 rounded-full p-1.5">
                                        <Camera className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                                </label>
                            )}
                            {uploadingImage && (
                                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Edit Button */}
                    <div className="absolute top-4 right-4">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-700 font-medium hover:bg-white transition-all shadow-sm"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span className="text-sm">Edit Profile</span>
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-600 font-medium hover:bg-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl text-white font-medium hover:shadow-lg transition-all"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-16 pb-8 px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            {isEditing ? (
                                <div className="flex gap-3 items-center">
                                    <input
                                        value={adminData.firstName}
                                        onChange={(e) => setAdminData({ ...adminData, firstName: e.target.value })}
                                        className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-36 focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300"
                                        placeholder="First Name"
                                    />
                                    <input
                                        value={adminData.lastName}
                                        onChange={(e) => setAdminData({ ...adminData, lastName: e.target.value })}
                                        className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-36 focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300"
                                        placeholder="Last Name"
                                    />
                                </div>
                            ) : (
                                <h2 className="text-2xl font-bold text-gray-900">{adminData.name}</h2>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                                <BadgeCheck className="w-4 h-4 text-pink-600" />
                                <span className="text-sm text-gray-500 capitalize">{adminData.role}</span>
                                <span className="text-xs text-gray-400">• Joined {adminData.joinDate}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Last Active</p>
                                <p className="text-sm font-medium text-gray-700">{adminData.lastActive}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Security Level</p>
                                    <p className="font-semibold text-gray-900">High</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email Status</p>
                                    <p className="font-semibold text-gray-900">Verified</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Phone Status</p>
                                    <p className="font-semibold text-gray-900">Verified</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                                <User className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email Field - Fetched from localStorage */}
                            <div className="group">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</label>
                                <div className="flex items-center gap-2 mt-1 p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:border-pink-200 transition-colors">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {isEditing ? (
                                        <input
                                            value={adminData.email}
                                            onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                                            className="flex-1 text-gray-800 font-medium bg-transparent focus:outline-none"
                                            type="email"
                                        />
                                    ) : (
                                        <p className="text-gray-800 font-medium">{adminData.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Phone Field - Fetched from localStorage like email */}
                            <div className="group">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</label>
                                <div className="flex items-center gap-2 mt-1 p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:border-pink-200 transition-colors">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {isEditing ? (
                                        <input
                                            value={adminData.phone}
                                            onChange={(e) => setAdminData({ ...adminData, phone: e.target.value })}
                                            className="flex-1 text-gray-800 font-medium bg-transparent focus:outline-none"
                                            type="tel"
                                        />
                                    ) : (
                                        <p className="text-gray-800 font-medium">{adminData.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Section - Admin Security Code with Eye Toggle */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Key className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                            Security
                        </h3>
                        <div className="bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-2xl p-5 border border-gray-100">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-pink-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Admin Security Code</p>
                                        <div className="flex items-center gap-2">
                                            {isEditing ? (
                                                <input
                                                    value={adminData.membershipCode}
                                                    onChange={(e) => setAdminData({ ...adminData, membershipCode: e.target.value })}
                                                    className="text-xl font-mono font-bold tracking-wider text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:border-pink-300"
                                                    type={showCode ? "text" : "password"}
                                                />
                                            ) : (
                                                <p className="text-xl font-mono font-bold tracking-wider text-gray-900">
                                                    {showCode ? adminData.membershipCode : '••••••••••••'}
                                                </p>
                                            )}
                                            <button
                                                onClick={() => setShowCode(!showCode)}
                                                className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                                                type="button"
                                            >
                                                {showCode ? (
                                                    <EyeOff className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <Eye className="w-4 h-4 text-gray-500" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button className="flex items-center gap-1 text-sm text-pink-600 font-medium hover:gap-2 transition-all">
                                    <span>Regenerate Code</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add these styles to your global CSS or tailwind.config.js extend section
// For Tailwind CSS, add these animations:
/*
@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.4s ease-out; }
.animate-slide-up { animation: slide-up 0.5s ease-out; }
*/