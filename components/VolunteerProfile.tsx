import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';

interface VolunteerData {
    name: string;
    email: string;
    phone: string;
    address: string;
    membershipCode: string;
    profileImage?: string;
}

export default function VolunteerProfile() {
    const [userData, setUserData] = useState<VolunteerData | null>(null);
    const [showCode, setShowCode] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Image Cropping States
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const storedData = localStorage.getItem('volunteer_data');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                const userId = parsed.id || parsed._id;

                if (userId) {
                    try {
                        const response = await fetch(`/api/user/profile/${userId}`);
                        if (response.ok) {
                            const dbData = await response.json();
                            // Map DB fields to component state
                            const updatedData = {
                                name: `${dbData.firstName} ${dbData.lastName}`,
                                email: dbData.email,
                                phone: dbData.phone,
                                address: dbData.address || parsed.address || "Address not provided",
                                membershipCode: dbData.membershipCode,
                                profileImage: dbData.profilePic || parsed.profileImage || "/logo.jpg"
                            };
                            setUserData(updatedData);

                            // Sync back to localStorage to update other UI components (header, sidebar)
                            localStorage.setItem('volunteer_data', JSON.stringify({
                                ...parsed,
                                ...updatedData,
                            }));
                            return;
                        }
                    } catch (error) {
                        console.error("Error fetching volunteer profile:", error);
                    }
                }

                // Fallback to localStorage if fetch fails or ID is missing
                if (!parsed.email && parsed.gmail) parsed.email = parsed.gmail;
                if (!parsed.address) parsed.address = "123 Volunteer Way, Heart City, 56789";
                setUserData(parsed);
            } else {
                // Fallback for demo/unauthenticated view
                setUserData({
                    name: "John Doe",
                    email: "john.doe@gmail.com",
                    phone: "+91 9876543210",
                    address: "123 Volunteer Way, Heart City, 56789",
                    membershipCode: "VO-2024-001",
                    profileImage: "/logo.jpg"
                });
            }
        };

        fetchUserData();
    }, []);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result as string));
            reader.readAsDataURL(file);
        }
    };

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new window.Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return '';

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return canvas.toDataURL('image/jpeg');
    };

    const handleSaveCrop = async () => {
        if (imageSrc && croppedAreaPixels) {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            const updatedData = { ...userData!, profileImage: croppedImage };

            const storedData = localStorage.getItem('volunteer_data');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                const userId = parsed.id || parsed._id;
                if (userId) {
                    try {
                        await fetch(`/api/user/profile/${userId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ profilePic: croppedImage })
                        });
                    } catch (error) {
                        console.error("Error saving cropped image:", error);
                    }
                }
            }

            setUserData(updatedData);
            localStorage.setItem('volunteer_data', JSON.stringify(updatedData));
            setImageSrc(null);
        }
    };

    const handleSaveProfile = async () => {
        if (userData) {
            const storedData = localStorage.getItem('volunteer_data');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                const userId = parsed.id || parsed._id;

                if (userId) {
                    try {
                        const [firstName, ...lastNames] = userData.name.split(' ');
                        const lastName = lastNames.join(' ');

                        const response = await fetch(`/api/user/profile/${userId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                firstName,
                                lastName,
                                phone: userData.phone,
                                address: userData.address
                            })
                        });

                        if (!response.ok) {
                            throw new Error("Failed to save to database");
                        }
                    } catch (error) {
                        console.error("Error saving profile:", error);
                        alert("Could not save changes to database. Local data updated.");
                    }
                }
            }

            localStorage.setItem('volunteer_data', JSON.stringify(userData));
            setIsEditing(false);
            window.location.reload();
        }
    };

    if (!userData) return <div className="animate-pulse h-64 bg-white/20 rounded-3xl"></div>;

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            {/* Crop Overlay */}
            {imageSrc && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-4">
                    <div className="relative w-full max-w-xl aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl mb-6">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="flex gap-4 w-full max-w-xl">
                        <button
                            onClick={() => setImageSrc(null)}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveCrop}
                            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-pink-600/20 transition-all"
                        >
                            Crop & Save
                        </button>
                    </div>
                </div>
            )}

            {/* Decorative Background */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all duration-700"></div>

            <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                {/* Profile Image Section */}
                <div className="relative group/image shrink-0 mx-auto md:mx-0">
                    <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative transition-transform duration-500 group-hover/image:scale-105">
                        <Image
                            src={userData.profileImage || '/logo.jpg'}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                    {isEditing && (
                        <label className="absolute -bottom-2 -right-2 bg-pink-600 text-white p-3 rounded-xl cursor-pointer shadow-lg hover:bg-pink-700 transition-all transform hover:scale-110 active:scale-95 animate-bounce">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    )}
                </div>

                {/* Details Section */}
                <div className="flex-1 w-full space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={userData.name}
                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    className="text-3xl font-black text-gray-900 leading-tight bg-white/50 border border-pink-600/20 rounded-lg px-2 py-1 focus:outline-none animate-pulse-subtle w-full"
                                />
                            ) : (
                                <h2 className="text-3xl font-black text-gray-900 leading-tight">{userData.name}</h2>
                            )}
                            <p className="text-pink-600 font-bold tracking-wider text-sm uppercase mt-1">Active Volunteer</p>
                        </div>
                        <button
                            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                            className={`p-3 rounded-2xl transition-all shadow-lg flex items-center gap-2 group/edit ${isEditing
                                ? 'bg-pink-600 text-white shadow-pink-600/30'
                                : 'bg-white text-gray-400 hover:text-pink-600 border border-gray-100'
                                }`}
                        >
                            {isEditing ? (
                                <span className="text-xs font-black uppercase tracking-widest px-2">Save Changes</span>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/50 border border-white/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group/field">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                <svg className="w-3 h-3 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" /></svg>
                                Email Address
                            </p>
                            <p className="text-gray-800 font-bold truncate">{userData.email}</p>
                        </div>

                        <div className="bg-white/50 border border-white/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group/field">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                <svg className="w-3 h-3 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2" /></svg>
                                Phone Number
                            </p>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={userData.phone}
                                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                    className="text-gray-800 font-bold w-full bg-white/50 border border-pink-600/20 rounded-lg px-2 py-1 focus:outline-none animate-pulse-subtle"
                                />
                            ) : (
                                <p className="text-gray-800 font-bold">{userData.phone}</p>
                            )}
                        </div>

                        <div className="bg-white/50 border border-white/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group/field md:col-span-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                <svg className="w-3 h-3 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" /></svg>
                                Residential Address
                            </p>
                            {isEditing ? (
                                <textarea
                                    value={userData.address}
                                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                    className="text-gray-800 font-bold w-full bg-white/50 border border-pink-600/20 rounded-lg px-2 py-1 focus:outline-none h-20 resize-none animate-pulse-subtle"
                                    autoFocus
                                />
                            ) : (
                                <p className="text-gray-800 font-bold leading-relaxed">{userData.address}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-pink-600/5 border border-pink-200 p-6 rounded-3xl flex items-center justify-between group/code transition-all hover:bg-pink-600/10">
                        <div>
                            <p className="text-[10px] font-black text-pink-600/60 uppercase tracking-widest mb-1.5">Membership Security Code</p>
                            <p className="text-2xl font-mono font-black text-pink-600 tracking-tighter">
                                {showCode ? userData.membershipCode : '••••••••••••'}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCode(!showCode)}
                            className="p-3 text-pink-600 bg-white hover:bg-pink-600 hover:text-white rounded-2xl shadow-sm transition-all border border-pink-100"
                        >
                            {showCode ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
