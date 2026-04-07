"use client";

import React, { useState } from 'react';

interface MembershipUpdateFormProps {
    onRenewalMonthChange: (monthIndex: number) => void;
}

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

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'renewalMonth') {
            onRenewalMonthChange(parseInt(value));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Membership update request submitted!');
        window.location.reload();
    };

    return (
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-xl shadow-pink-600/5">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Update <span className="text-pink-600">Membership</span></h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Submit your membership renewal details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
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

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
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

                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700"
                            required
                        />
                    </div>

                    {/* Membership Status */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Membership Status</label>
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

                    {/* Renewal Month */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Renewal Month (Paid Up To)</label>
                        <select
                            name="renewalMonth"
                            value={formData.renewalMonth}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700 appearance-none"
                            required
                        >
                            <option value="">Select Month</option>
                            {months.map((month, index) => (
                                <option key={month} value={index}>{month}</option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
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

                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount Paid (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700"
                            required
                        />
                    </div>

                    {/* Screenshot Upload */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Screenshot</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="screenshot-upload"
                            />
                            <label
                                htmlFor="screenshot-upload"
                                className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl px-6 py-4 flex items-center justify-center gap-2 cursor-pointer hover:border-pink-600/30 hover:bg-pink-50/10 transition-all group"
                            >
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm font-bold text-gray-500 group-hover:text-pink-600">Upload Receipt</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-pink-600 text-white rounded-2xl py-5 font-black uppercase tracking-widest shadow-xl shadow-pink-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Submit Membership Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MembershipUpdateForm;
