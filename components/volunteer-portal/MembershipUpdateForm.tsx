"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { AlertTriangle, X } from 'lucide-react';

interface MembershipUpdateFormProps {
    onRenewalMonthChange: (monthIndex: number, year?: number) => void;
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const MembershipUpdateForm: React.FC<MembershipUpdateFormProps> = ({ onRenewalMonthChange }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        memberType: '',
        phoneNumber: '',
        date: '',
        membershipStatus: '',
        renewalMonth: '',
        renewalYear: String(new Date().getFullYear()),
        paymentMethod: '',
        amount: '',
    });
    const [receiptImage, setReceiptImage] = useState<string | null>(null);
    const [receiptFileName, setReceiptFileName] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [conflictData, setConflictData] = useState<{ month: string; year: string; message?: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setFormData(prev => ({
                ...prev,
                name: parsedData.name || '',
                email: parsedData.email || '',
                phoneNumber: parsedData.phoneNumber || parsedData.phone || '',
            }));
        }
    }, []);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };
        setFormData(updated);

        // Live dashboard update when month or year is selected
        if ((name === 'renewalMonth' || name === 'renewalYear') && updated.renewalMonth !== '') {
            onRenewalMonthChange(parseInt(updated.renewalMonth), parseInt(updated.renewalYear));
        }
    };

    // Convert uploaded image file to base64
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Max 5MB size check
        if (file.size > 5 * 1024 * 1024) {
            showToast('error', 'Receipt image must be under 5MB.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setReceiptFileName(file.name);

        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                setReceiptImage(ev.target.result as string); // base64 data URL
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveReceipt = () => {
        setReceiptImage(null);
        setReceiptFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Proper validation for Email, Mobile Number, and Member Type
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showToast('error', 'Please provide a valid email address.');
            return;
        }

        if (formData.memberType !== "Normal Member" && formData.memberType !== "Executive Member") {
            showToast('error', 'Please select a valid Member Type.');
            return;
        }

        const cleanPhone = formData.phoneNumber.replace(/\s+/g, "");
        if (cleanPhone.length < 8) {
            showToast('error', 'Please provide a valid phone number.');
            return;
        }

        const selectedMonthName = months[parseInt(formData.renewalMonth)];
        const selectedYearNum = Number(formData.renewalYear);

        // Pre-check for duplicate submission before uploading receipt
        try {
            const checkRes = await fetch(`/api/volunteers/membership?phoneNumber=${encodeURIComponent(formData.phoneNumber)}`);
            if (checkRes.ok) {
                const checkData = await checkRes.json();
                if (checkData.success && Array.isArray(checkData.data)) {
                    const alreadyPaid = checkData.data.some(
                        (r: any) => r.renewalMonth === selectedMonthName && Number(r.renewalYear) === selectedYearNum
                    );
                    if (alreadyPaid) {
                        setConflictData({
                            month: selectedMonthName,
                            year: String(selectedYearNum),
                            message: `You have already submitted your membership payment for ${selectedMonthName} ${selectedYearNum}.`
                        });
                        return;
                    }
                }
            }
        } catch (e) {
            console.warn("Duplicate pre-check failed, continuing with POST validation:", e);
        }

        setSubmitting(true);

        try {
            const payload: Record<string, any> = {
                name: formData.name,
                email: formData.email,
                memberType: formData.memberType,
                phoneNumber: formData.phoneNumber,
                date: formData.date,
                membershipStatus: formData.membershipStatus,
                renewalMonth: selectedMonthName, // Store as month name
                renewalYear: selectedYearNum,
                paymentMethod: formData.paymentMethod,
                amount: Number(formData.amount),
            };

            // Step 1: If receipt image selected, upload to Cloudinary first
            if (receiptImage) {
                setUploading(true);
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: receiptImage }),
                });
                const uploadData = await uploadRes.json();
                setUploading(false);

                if (!uploadRes.ok || !uploadData.success) {
                    showToast('error', uploadData.message || 'Receipt upload failed. Please try again.');
                    setSubmitting(false);
                    return;
                }

                // Use the Cloudinary secure URL instead of base64
                payload.receiptImage = uploadData.url;
            }

            // Step 2: Submit membership record with Cloudinary URL
            const res = await fetch('/api/volunteers/membership', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                showToast('success', 'Membership submitted successfully!');
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    memberType: '',
                    phoneNumber: '',
                    date: '',
                    membershipStatus: '',
                    renewalMonth: '',
                    renewalYear: String(new Date().getFullYear()),
                    paymentMethod: '',
                    amount: '',
                });
                setReceiptImage(null);
                setReceiptFileName('');
                if (fileInputRef.current) fileInputRef.current.value = '';
                onRenewalMonthChange(-1); // Reset dashboard preview
            } else if (res.status === 409 || data.conflict) {
                setConflictData({
                    month: selectedMonthName,
                    year: String(selectedYearNum),
                    message: data.message || `You have already submitted payment for ${selectedMonthName} ${selectedYearNum}.`
                });
            } else {
                showToast('error', data.message || 'Submission failed. Please try again.');
            }
        } catch {
            showToast('error', 'Network error. Please check your connection.');
        } finally {
            setUploading(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="relative bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-xl shadow-pink-600/5">

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm animate-fade-in ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                >
                    {toast.type === 'success' ? (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {toast.message}
                </div>
            )}

            <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    Update <span className="text-pink-600">Membership</span>
                </h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                    Submit your membership renewal details
                </p>
                {/* Live preview hint */}
                {formData.renewalMonth !== '' && (
                    <div className="mt-3 inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">
                            Dashboard updated → Paid up to {months[parseInt(formData.renewalMonth)]}
                        </span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Full Name — REQUIRED */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                            Full Name <span className="text-pink-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700"
                            required
                        />
                    </div>

                    {/* Email — REQUIRED */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                            Email <span className="text-pink-600">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700"
                            required
                        />
                    </div>

                    {/* Phone Number — REQUIRED */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                            Phone Number <span className="text-pink-600">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700"
                            required
                        />
                    </div>

                    {/* Member Type — REQUIRED */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                            Member Type <span className="text-pink-600">*</span>
                        </label>
                        <select
                            name="memberType"
                            value={formData.memberType}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700 appearance-none"
                            required
                        >
                            <option value="">Select Member Type</option>
                            <option value="Normal Member">Normal Member</option>
                            <option value="Executive Member">Executive Member</option>
                        </select>
                    </div>

                    {/* Payment Date — REQUIRED */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                            Payment Date <span className="text-pink-600">*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700"
                            required
                        />
                    </div>

                    {/* Membership Status — REQUIRED */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                            Membership Plan <span className="text-pink-600">*</span>
                        </label>
                        <select
                            name="membershipStatus"
                            value={formData.membershipStatus}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700 appearance-none"
                            required
                        >
                            <option value="">Select Scale</option>
                            <option value="monthly">Monthly</option>
                            <option value="half-yearly">Half Yearly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    {/* Renewal Month — REQUIRED — drives dashboard live preview */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                            Paid Up To Month <span className="text-pink-600">*</span>
                        </label>
                        <select
                            name="renewalMonth"
                            value={formData.renewalMonth}
                            onChange={handleChange}
                            className={`w-full border-2 rounded-2xl px-6 py-4 focus:outline-none transition-all font-bold text-gray-700 appearance-none ${formData.renewalMonth !== ''
                                    ? 'bg-green-50 border-green-300 focus:border-green-400'
                                    : 'bg-gray-50 border-gray-100 focus:border-pink-600/30'
                                }`}
                            required
                        >
                            <option value="">Select Month</option>
                            {months.map((month, index) => (
                                <option key={month} value={index}>{month}</option>
                            ))}
                        </select>
                        {formData.renewalMonth !== '' && (
                            <p className="text-[10px] text-green-600 font-bold ml-1 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Dashboard preview updated above ↑
                            </p>
                        )}
                    </div>

                    {/* Renewal Year — REQUIRED — drives dashboard live preview */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                            Paid Up To Year <span className="text-pink-600">*</span>
                        </label>
                        <select
                            name="renewalYear"
                            value={formData.renewalYear}
                            onChange={handleChange}
                            className={`w-full border-2 rounded-2xl px-6 py-4 focus:outline-none transition-all font-bold text-gray-700 appearance-none ${formData.renewalYear !== ''
                                    ? 'bg-green-50 border-green-300 focus:border-green-400'
                                    : 'bg-gray-50 border-gray-100 focus:border-pink-600/30'
                                }`}
                            required
                        >
                            {[2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Method — REQUIRED */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                            Payment Method <span className="text-pink-600">*</span>
                        </label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700 appearance-none"
                            required
                        >
                            <option value="">Select Method</option>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                    </div>

                    {/* Amount — REQUIRED */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                            Amount Paid (₹) <span className="text-pink-600">*</span>
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="1"
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700"
                            required
                        />
                    </div>

                    {/* Payment Receipt Upload — OPTIONAL */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            Payment Receipt
                            <span className="text-gray-300 font-bold normal-case tracking-normal text-[9px] bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
                        </label>

                        {receiptImage ? (
                            /* Preview of uploaded image */
                            <div className="relative rounded-2xl overflow-hidden border-2 border-green-200 bg-green-50 h-[112px]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={receiptImage}
                                    alt="Receipt preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={handleRemoveReceipt}
                                        className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-green-600/80 px-3 py-1 flex items-center gap-2">
                                    <svg className="w-3 h-3 text-white shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-white text-[10px] font-bold truncate">{receiptFileName}</span>
                                </div>
                            </div>
                        ) : (
                            /* Upload drop zone */
                            <div className="relative">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="screenshot-upload"
                                />
                                <label
                                    htmlFor="screenshot-upload"
                                    className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl px-6 py-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-pink-600/30 hover:bg-pink-50/10 transition-all group"
                                >
                                    <svg className="w-7 h-7 text-gray-300 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm font-bold text-gray-400 group-hover:text-pink-600 transition-colors">Click to upload receipt</span>
                                    <span className="text-[10px] text-gray-300 font-medium">PNG, JPG, WEBP · Max 5MB · Hosted on Cloudinary</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Required fields note */}
                <p className="text-[10px] text-gray-400 font-medium ml-1">
                    <span className="text-pink-600 font-black">*</span> All fields marked with an asterisk are required
                </p>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="w-full bg-pink-600 text-white rounded-2xl py-5 font-black uppercase tracking-widest shadow-xl shadow-pink-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3 cursor-pointer"
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Uploading Receipt...
                            </>
                        ) : submitting ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            'Submit Membership Update'
                        )}
                    </button>
                </div>
            </form>

            {/* Duplicate Payment Conflict Modal */}
            {conflictData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all p-6 sm:p-7 animate-in zoom-in-95 duration-200">
                        {/* Header Icon & Title */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                                    <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                                        Duplicate Payment Alert
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 mt-1">Payment Already Submitted</h3>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setConflictData(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2">
                            <p className="text-xs font-semibold text-amber-950 leading-relaxed">
                                For <span className="font-extrabold underline decoration-amber-500 decoration-2">{conflictData.month} {conflictData.year}</span>, you have already submitted your membership payment.
                            </p>
                            <p className="text-[11px] text-amber-900/80 leading-normal">
                                You cannot submit payment twice for the exact same month and year. Your payment record for this period is already verified in our system.
                            </p>
                        </div>

                        {/* Bottom Support Section: Is it any problem? + Contact Us Link */}
                        <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-3">
                            <p className="text-xs font-semibold text-slate-600">
                                Is there any problem with your payment record?
                            </p>
                            <div className="flex items-center justify-center gap-3 text-xs font-bold">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-1.5 text-pink-600 hover:text-pink-700 transition-colors py-2 px-3.5 rounded-xl bg-pink-50 hover:bg-pink-100/80 border border-pink-100 shadow-xs"
                                >
                                    <span>Contact Us Page</span> &rarr;
                                </Link>
                                <Link
                                    href="/volunteers/contact-admin"
                                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200"
                                >
                                    <span>Contact Admin</span>
                                </Link>
                            </div>
                        </div>

                        {/* Dismiss Button */}
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={() => setConflictData(null)}
                                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer active:scale-98"
                            >
                                Understood &amp; Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MembershipUpdateForm;
