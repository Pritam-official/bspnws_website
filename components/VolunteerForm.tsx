"use client";

import React, { useState, useRef, useCallback } from 'react';
import { User, Mail, Phone, MapPin, Camera, Send, CheckCircle2, X } from 'lucide-react';
import Image from 'next/image';
import Cropper, { Point, Area } from 'react-easy-crop';

interface FormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    profilePic: File | null;
    whyJoin: string;
}

const SOCIAL_LINKS = [
    { name: 'Facebook', icon: '/social/facebook.svg', href: 'https://www.facebook.com/share/1856ZhMqPV/', color: 'hover:bg-[#1877F2]' },
    { name: 'Instagram', icon: '/social/instagram.svg', href: 'https://www.instagram.com/pyara_nutrition?igsh=MWg0N2NsZjRjM2xhcw==', color: 'hover:bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]' },
    { name: 'YouTube', icon: '/social/youtube.svg', href: 'https://youtube.com/@pyaranutrition?si=kX5A_r3lTi7eqLGU', color: 'hover:bg-[#FF0000]' },
    { name: 'Twitter', icon: '/social/x.svg', href: 'https://x.com/pyaranutrition', color: 'hover:bg-black' }
];

export default function VolunteerForm() {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        profilePic: null,
        whyJoin: ''
    });

    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showCropper, setShowCropper] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((_area: Area, pixels: Area) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const createCroppedImage = async () => {
        if (!imageToCrop || !croppedAreaPixels) return;

        try {
            const canvas = document.createElement('canvas');
            const img = new window.Image();
            img.src = imageToCrop;

            await new Promise((resolve) => { img.onload = resolve; });

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                img,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            const base64Image = canvas.toDataURL('image/jpeg');
            setPreviewUrl(base64Image);

            // Convert to File object for form data
            const response = await fetch(base64Image);
            const blob = await response.blob();
            const file = new File([blob], 'profile-pic.jpg', { type: 'image/jpeg' });
            setFormData(prev => ({ ...prev, profilePic: file }));

            setShowCropper(false);
        } catch (e) {
            console.error('Error cropping image:', e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/volunteers/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                    profilePic: previewUrl, // Sending base64 string
                    whyJoin: formData.whyJoin,
                }),
            });

            if (res.ok) {
                setIsSubmitted(true);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center animate-scale-in max-w-2xl mx-auto border border-gray-100">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">Application Submitted!</h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Thank you for your interest in joining BSPNWS. Our team will review your application and get back to you shortly.
                </p>
                <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/30 uppercase tracking-wider"
                >
                    Apply Again
                </button>
            </div>
        );
    }

    return (
        <div className="relative group/form max-w-5xl mx-auto">
            {/* Professional Highlight Border Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 rounded-[3rem] blur-xl opacity-50 group-hover/form:opacity-100 transition-opacity duration-1000"></div>

            <div className="relative bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white h-full grid grid-cols-1 lg:grid-cols-5">

                {/* Left Side - Info Panel with Animated Mesh Gradient */}
                <div className="lg:col-span-2 bg-[#1a1a1a] p-10 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden h-full">
                    <div className="absolute inset-0 z-0 opacity-40">
                        {/* Mesh gradient background effect */}
                        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,#dd7030_0%,transparent_50%)] animate-pulse" style={{ animationDuration: '8s' }}></div>
                        <div className="absolute bottom-[-20%] right-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_100%,#6b21a8_0%,transparent_50%)] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-block px-3 py-1 bg-primary/20 rounded-lg border border-primary/30 mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Volunteer Portal</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black mb-8 tracking-tighter uppercase leading-none italic">
                            Help Us <br />
                            <span className="text-primary drop-shadow-lg">Make A</span> <br />
                            Difference
                        </h2>

                        <ul className="space-y-8 mt-12">
                            {[
                                { title: 'Join Our Mission', desc: 'Contribute to life-changing programs.', icon: CheckCircle2 },
                                { title: 'Gain Skills', desc: 'Learn new talents while helping others.', icon: CheckCircle2 },
                                { title: 'Social Impact', desc: 'Be the voice for the voiceless.', icon: CheckCircle2 }
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-5 items-start group/item">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 group-hover/item:bg-primary/20 transition-all duration-300">
                                        <item.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg leading-tight uppercase tracking-tight">{item.title}</h4>
                                        <p className="text-white/50 text-sm font-medium mt-1">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative z-10 pt-16">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px bg-white/20 flex-1"></div>
                            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">Social Hub</p>
                            <div className="h-px bg-white/20 flex-1"></div>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group/soc ${social.color} hover:border-transparent`}
                                    title={social.name}
                                >
                                    <div className="relative w-5 h-5 transition-all duration-300 group-hover/soc:scale-125">
                                        <Image
                                            src={social.icon}
                                            alt={social.name}
                                            fill
                                            className={`object-contain transition-all duration-300 ${social.name === 'Instagram' ? 'group-hover/soc:brightness-0 group-hover/soc:invert' : social.name === 'Twitter' ? 'brightness-0 invert group-hover/soc:brightness-200' : ''}`}
                                        />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-3 p-10 lg:p-14 space-y-10">
                    <div className="space-y-8">
                        {/* Profile Pic Upload */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-40 h-40 rounded-[2rem] overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group/avatar cursor-pointer hover:border-primary transition-all flex items-center justify-center shadow-xl"
                                >
                                    {previewUrl ? (
                                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="text-center p-6 bg-white/50 w-full h-full flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                                                <Camera className="w-6 h-6 text-primary" />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Add Professional<br />Photo</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <Camera className="w-8 h-8 text-white" />
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest">Select & Crop</span>
                                    </div>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            {previewUrl && (
                                <button
                                    type="button"
                                    onClick={() => setShowCropper(true)}
                                    className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/30 hover:border-primary transition-all"
                                >
                                    Recrop Image
                                </button>
                            )}
                        </div>

                        {/* Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { label: 'Full Name', name: 'fullName', type: 'text', icon: User, placeholder: 'Ex. John Doe' },
                                { label: 'Email Address', name: 'email', type: 'email', icon: Mail, placeholder: 'john@example.com' },
                                { label: 'Phone Number', name: 'phoneNumber', type: 'tel', icon: Phone, placeholder: '+91 00000 00000' }
                            ].map((field, idx) => (
                                <div key={field.name} className={`space-y-3 ${idx === 2 ? 'md:col-span-2' : ''}`}>
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{field.label}</label>
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 to-secondary/0 rounded-2xl group-focus-within:from-primary/10 group-focus-within:to-secondary/10 transition-all duration-300"></div>
                                        <div className="relative flex items-center bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden focus-within:border-primary/30 focus-within:bg-white transition-all">
                                            <div className="w-14 h-14 flex items-center justify-center bg-white/50 border-r border-gray-100 group-focus-within:text-primary transition-colors">
                                                <field.icon className="w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                                            </div>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={(formData as any)[field.name]}
                                                onChange={handleInputChange}
                                                required
                                                placeholder={field.placeholder}
                                                className="flex-1 bg-transparent py-4 px-6 outline-none font-bold text-gray-900 placeholder:text-gray-300 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Address</label>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 to-secondary/0 rounded-2xl group-focus-within:from-primary/10 group-focus-within:to-secondary/10 transition-all duration-300"></div>
                                <div className="relative flex bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden focus-within:border-primary/30 focus-within:bg-white transition-all">
                                    <div className="w-14 shrink-0 flex items-center justify-center bg-white/50 border-r border-gray-100">
                                        <MapPin className="w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        placeholder="Street address, City, Pincode"
                                        className="flex-1 bg-transparent py-4 px-6 outline-none font-bold text-gray-900 placeholder:text-gray-300 text-sm resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Motivation (Optional)</label>
                            <div className="relative group">
                                <textarea
                                    name="whyJoin"
                                    value={formData.whyJoin}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Tell us why you want to become a part of BSPNWS..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 px-8 outline-none font-bold text-gray-900 placeholder:text-gray-300 text-sm focus:border-primary/30 focus:bg-white transition-all resize-none shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 relative overflow-hidden group ${isSubmitting
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:scale-[1.01] active:scale-95 shadow-2xl shadow-primary/30'
                            }`}
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Submit Application
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Image Cropper Modal */}
            {showCropper && imageToCrop && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowCropper(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-scale-in">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-black uppercase tracking-tight italic">Crop Profile Picture</h3>
                            <button onClick={() => setShowCropper(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="relative h-[400px] bg-gray-900">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={1 / 1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Zoom Level</span>
                                    <span className="text-sm font-black text-primary">{Math.round(zoom * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowCropper(false)}
                                    className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createCroppedImage}
                                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                                >
                                    Apply Crop
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
