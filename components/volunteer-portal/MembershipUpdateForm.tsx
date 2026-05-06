"use client";

import React, { useState, useRef } from 'react';

interface MembershipUpdateFormProps {
    onRenewalMonthChange: (monthIndex: number) => void;
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const MembershipUpdateForm: React.FC<MembershipUpdateFormProps> = ({ onRenewalMonthChange }) => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        date: '',
        membershipStatus: '',
        renewalMonth: '',
        paymentMethod: '',
        amount: '',
    });
    const [receiptImage, setReceiptImage] = useState<string | null>(null);
    const [receiptFileName, setReceiptFileName] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setFormData(prev => ({
                ...prev,
                name: parsedData.name || '',
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
        setFormData(prev => ({ ...prev, [name]: value }));

        // Live dashboard update when month is selected
        if (name === 'renewalMonth' && value !== '') {
            onRenewalMonthChange(parseInt(value));
        }
    };

    // Convert uploaded image file to base64
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Max 2MB size check
        if (file.size > 2 * 1024 * 1024) {
            showToast('error', 'Receipt image must be under 2MB.');
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
        setSubmitting(true);

        try {
            const payload: Record<string, any> = {
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                date: formData.date,
                membershipStatus: formData.membershipStatus,
                renewalMonth: months[parseInt(formData.renewalMonth)], // Store as month name
                paymentMethod: formData.paymentMethod,
                amount: Number(formData.amount),
            };

            // Only include receipt if uploaded
            if (receiptImage) {
                payload.receiptImage = receiptImage;
            }

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
                    phoneNumber: '',
                    date: '',
                    membershipStatus: '',
                    renewalMonth: '',
                    paymentMethod: '',
                    amount: '',
                });
                setReceiptImage(null);
                setReceiptFileName('');
                if (fileInputRef.current) fileInputRef.current.value = '';
                onRenewalMonthChange(-1); // Reset dashboard preview
            } else {
                showToast('error', data.message || 'Submission failed. Please try again.');
            }
        } catch {
            showToast('error', 'Network error. Please check your connection.');
        } finally {
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
                                    <span className="text-[10px] text-gray-300 font-medium">PNG, JPG, WEBP · Max 2MB</span>
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
                        disabled={submitting}
                        className="w-full bg-pink-600 text-white rounded-2xl py-5 font-black uppercase tracking-widest shadow-xl shadow-pink-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
                    >
                        {submitting ? (
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
        </div>
    );
};

export default MembershipUpdateForm;
