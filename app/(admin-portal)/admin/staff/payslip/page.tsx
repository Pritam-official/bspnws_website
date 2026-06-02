"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, Search, DollarSign, Plus, Trash2, Calendar, FileText, User } from 'lucide-react';

export default function StaffPayslipAdminPage() {
    const [staffList, setStaffList] = useState<any[]>([]);
    const [payslips, setPayslips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form states
    const [selectedStaffEmail, setSelectedStaffEmail] = useState('');
    const [month, setMonth] = useState('');
    const [basicSalary, setBasicSalary] = useState('');
    const [allowance, setAllowance] = useState('');
    const [deduction, setDeduction] = useState('');
    const [status, setStatus] = useState('Paid');
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    const fetchData = async () => {
        try {
            // Fetch all volunteers and filter for staff role
            const staffRes = await fetch('/api/admin/volunteers');
            const staffData = await staffRes.json();
            if (Array.isArray(staffData)) {
                setStaffList(staffData.filter(v => v.role === 'staff'));
            }

            // Fetch payslips
            const payRes = await fetch('/api/admin/staff/payslip');
            const payData = await payRes.json();
            if (Array.isArray(payData)) {
                setPayslips(payData);
            }
        } catch (error) {
            console.error('Failed to fetch payslip data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreatePayslip = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStaffEmail || !month || !basicSalary) {
            alert('Please fill out all required fields.');
            return;
        }

        const selectedStaff = staffList.find(s => s.email === selectedStaffEmail);
        if (!selectedStaff) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/staff/payslip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: selectedStaff.email,
                    fullName: selectedStaff.fullName,
                    month,
                    basicSalary: Number(basicSalary),
                    allowance: Number(allowance || 0),
                    deduction: Number(deduction || 0),
                    status,
                    paymentMethod,
                    pdfData: ''
                }),
            });

            if (res.ok) {
                alert('Payslip generated successfully!');
                // Reset form
                setSelectedStaffEmail('');
                setMonth('');
                setBasicSalary('');
                setAllowance('');
                setDeduction('');
                setPaymentMethod('Cash');
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to generate payslip');
            }
        } catch (error) {
            console.error('Generate payslip error:', error);
            alert('An error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePayslip = async (id: string) => {
        if (!confirm('Are you sure you want to delete this payslip?')) return;

        try {
            const res = await fetch(`/api/admin/staff/payslip?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                alert('Payslip deleted successfully.');
                fetchData();
            }
        } catch (error) {
            console.error('Delete payslip error:', error);
        }
    };

    const filtered = payslips.filter(p =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.month.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const netSalary = (Number(basicSalary || 0) + Number(allowance || 0) - Number(deduction || 0)).toFixed(2);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                    Payslip <span className="text-rose-600">Management</span>
                </h1>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">
                    Generate and manage monthly payment statements for staff members
                </p>
            </div>

            {/* Form to generate new payslip */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
                        <Plus className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Generate New Payslip</h2>
                </div>

                <form onSubmit={handleCreatePayslip} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Select Staff Member *</label>
                            <select
                                value={selectedStaffEmail}
                                onChange={(e) => setSelectedStaffEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-gray-700"
                                required
                            >
                                <option value="">-- Choose Staff --</option>
                                {staffList.map(s => (
                                    <option key={s._id} value={s.email}>
                                        {s.fullName} ({s.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Month & Year *</label>
                            <input
                                type="text"
                                placeholder="e.g. June 2026"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-gray-700"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Payment Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-gray-700"
                            >
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Salary Paid By</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-gray-700"
                            >
                                <option value="Cash">Cash</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Basic Salary (₹) *</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={basicSalary}
                                onChange={(e) => setBasicSalary(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-gray-700"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Allowances (₹)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={allowance}
                                onChange={(e) => setAllowance(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-gray-700"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Deductions (₹)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={deduction}
                                onChange={(e) => setDeduction(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-gray-700"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest text-rose-600">Net Calculated Salary (₹)</label>
                            <div className="w-full bg-rose-50/50 border border-rose-100 text-rose-700 rounded-xl px-4 py-3 text-sm font-black flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4 text-rose-500" />
                                {netSalary}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-rose-600/10 active:scale-95 flex items-center gap-2"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                            Generate Payslip
                        </button>
                    </div>
                </form>
            </div>

            {/* List of generated payslips */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Payslip History</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filter history..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all w-full sm:w-72 shadow-sm"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Staff Member</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Month</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Basic</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Allowances</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Deductions</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Salary</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="text-right px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p) => {
                                    const staffMember = staffList.find(s => s.email === p.email);
                                    const avatar = staffMember?.profilePic || '/logo.jpg';
                                    return (
                                        <tr key={p._id} className="border-b border-gray-50 hover:bg-rose-50/10 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm shrink-0">
                                                        <img 
                                                            src={avatar} 
                                                            alt={p.fullName} 
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = '/logo.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-bold text-gray-900 block">{p.fullName}</span>
                                                        <span className="text-xs text-gray-400 font-semibold">{p.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-bold">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-rose-500" />
                                                    {p.month}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-bold">₹{p.basicSalary.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-bold text-green-600">+₹{p.allowance.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-bold text-red-600">-₹{p.deduction.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-black">₹{p.netSalary.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                    p.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                                }`}>
                                                    {p.status}
                                                </span>
                                                {p.paymentMethod && (
                                                    <span className="text-[9px] text-gray-400 block mt-1 font-bold uppercase tracking-wider">
                                                        via {p.paymentMethod}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        onClick={() => handleDeletePayslip(p._id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors group"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">No payslips generated yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
