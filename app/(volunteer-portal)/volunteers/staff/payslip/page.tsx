"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, DollarSign, Calendar, FileText, CheckCircle, ArrowDownToLine, Eye, X } from 'lucide-react';
import VolunteerSidebar from '@/components/volunteer-portal/VolunteerSidebar';
import VolunteerHeader from '@/components/volunteer-portal/VolunteerHeader';

export default function StaffPayslipPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Payslips history and modal view
    const [payslips, setPayslips] = useState<any[]>([]);
    const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

    const numberToWords = (num: number): string => {
        const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const numToWords = (n: number): string => {
            if (n < 20) return a[n];
            if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
            if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + numToWords(n % 100) : '');
            if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + numToWords(n % 1000) : '');
            if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + numToWords(n % 100000) : '');
            return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + numToWords(n % 10000000) : '');
        };

        const integerPart = Math.floor(num);
        const words = numToWords(integerPart);
        return words ? words + ' Rupees' : '';
    };

    useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            if (parsed.role !== 'staff') {
                router.push('/volunteers/dashboard');
                return;
            }
            setUserData(parsed);
            fetchPayslipHistory(parsed.email);
        } else {
            router.push('/login/volunteer');
            return;
        }
        setLoading(false);
    }, []);

    const fetchPayslipHistory = async (email: string) => {
        try {
            const res = await fetch(`/api/staff/payslip?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setPayslips(data);
            }
        } catch (error) {
            console.error('Failed to fetch payslips:', error);
        }
    };

    // Helper to print or download a detailed HTML-based payslip
    const handleDownloadPayslip = (payslip: any) => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const logoUrl = origin + '/logo.jpg';
        const sealUrl = origin + '/society-seal.jpg';
        const signatureUrl = origin + '/society-signature.jpg';

        const docWindow = window.open('', '_blank');
        if (!docWindow) return;

        docWindow.document.write(`
            <html>
                <head>
                    <title>Payslip_${payslip.month.replace(/\s+/g, '_')}</title>
                    <style>
                        body {
                            font-family: 'Outfit', 'Inter', sans-serif;
                            color: #1e293b;
                            margin: 0;
                            padding: 0;
                            background: #ffffff;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .container {
                            max-width: 800px;
                            margin: 0 auto;
                            border: 1px solid #cbd5e1;
                            padding: 25px;
                            border-radius: 12px;
                            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                            background-color: #fff;
                            box-sizing: border-box;
                        }
                        .society-header {
                            display: flex;
                            align-items: center;
                            border-bottom: 3px double #1e3a8a;
                            padding-bottom: 12px;
                            margin-bottom: 15px;
                            gap: 20px;
                        }
                        .logo-col {
                            flex: 0 0 90px;
                            text-align: center;
                        }
                        .logo-img {
                            width: 85px;
                            height: 85px;
                            object-fit: contain;
                            border-radius: 50%;
                        }
                        .text-col {
                            flex: 1;
                            text-align: center;
                        }
                        .society-name {
                            margin: 0 0 4px 0;
                            font-size: 18px;
                            font-weight: 800;
                            color: #1e3a8a;
                            letter-spacing: 0.2px;
                        }
                        .reg-no, .niti-id, .tax-id, .office-address, .contact-info {
                            margin: 2px 0;
                            font-size: 11px;
                            color: #334155;
                            font-weight: 500;
                            line-height: 1.3;
                        }
                        .reg-no {
                            font-weight: 700;
                        }
                        .payslip-title-block {
                            text-align: center;
                            margin-bottom: 15px;
                        }
                        .payslip-title {
                            font-size: 16px;
                            font-weight: 800;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            color: #0f172a;
                            margin: 0;
                        }
                        .payslip-period {
                            font-size: 12px;
                            font-weight: 700;
                            color: #64748b;
                            margin-top: 2px;
                        }
                        .details-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 15px;
                        }
                        .details-table td {
                            padding: 6px 10px;
                            font-size: 12px;
                            border: 1px solid #e2e8f0;
                        }
                        .details-table td.lbl {
                            font-weight: 700;
                            color: #475569;
                            background-color: #f8fafc;
                            width: 20%;
                        }
                        .details-table td.val {
                            color: #0f172a;
                            font-weight: 600;
                            width: 30%;
                        }
                        .status-paid {
                            color: #16a34a !important;
                            font-weight: 800 !important;
                        }
                        .salary-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 15px;
                        }
                        .salary-table th, .salary-table td {
                            border: 1px solid #94a3b8;
                            padding: 8px 12px;
                            font-size: 12px;
                        }
                        .salary-table th {
                            background-color: #f1f5f9;
                            font-weight: 800;
                            color: #1e293b;
                            text-transform: uppercase;
                            font-size: 11px;
                            letter-spacing: 0.5px;
                            text-align: left;
                        }
                        .salary-table td.text-right, .salary-table th.text-right {
                            text-align: right;
                        }
                        .text-green {
                            color: #16a34a;
                            font-weight: 700;
                        }
                        .text-red {
                            color: #dc2626;
                            font-weight: 700;
                        }
                        .font-bold {
                            font-weight: 700;
                        }
                        .total-row td {
                            background-color: #f8fafc;
                            font-weight: 700;
                        }
                        .net-pay-row td {
                            background-color: #e0f2fe;
                            font-size: 14px;
                            font-weight: 900;
                            color: #0369a1;
                            border-top: 2px solid #0284c7;
                            border-bottom: 2px solid #0284c7;
                        }
                        .net-pay-lbl {
                            text-transform: uppercase;
                        }
                        .words-row {
                            font-style: italic;
                            background-color: #fff;
                            color: #475569;
                            font-size: 11px;
                        }
                        .bottom-section {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            margin-top: 10px;
                        }
                        .payment-mode {
                            font-size: 11px;
                            color: #475569;
                            font-weight: 600;
                        }
                        .payment-mode span {
                            font-weight: 700;
                            margin-right: 10px;
                        }
                        .payment-mode label {
                            margin-right: 12px;
                            display: inline-flex;
                            align-items: center;
                            gap: 4px;
                        }
                        .signatures-container {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-end;
                            margin-top: 25px;
                        }
                        .seal-box {
                            text-align: center;
                            width: 150px;
                        }
                        .seal-img {
                            height: 75px;
                            object-fit: contain;
                            margin-bottom: 4px;
                        }
                        .sig-box {
                            text-align: center;
                            width: 200px;
                        }
                        .sig-img {
                            height: 45px;
                            object-fit: contain;
                            margin-bottom: 4px;
                        }
                        .sig-line {
                            border-top: 1px dashed #94a3b8;
                            margin-top: 4px;
                            margin-bottom: 4px;
                        }
                        .sig-label {
                            font-size: 10px;
                            font-weight: 800;
                            color: #475569;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            margin: 0;
                        }
                        .sig-name {
                            font-size: 10px;
                            font-weight: 600;
                            color: #64748b;
                            margin: 2px 0 0 0;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 10px;
                            color: #94a3b8;
                            border-top: 1px solid #e2e8f0;
                            padding-top: 8px;
                            font-weight: 600;
                        }

                        @media print {
                            body {
                                margin: 0;
                                padding: 0;
                                background: #ffffff;
                            }
                            .container {
                                border: none !important;
                                box-shadow: none !important;
                                padding: 0 !important;
                                margin: 0 !important;
                                max-width: 100% !important;
                            }
                            @page {
                                size: A4 portrait;
                                margin: 8mm 12mm;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="society-header">
                            <div class="logo-col">
                                <img src="${logoUrl}" alt="Logo" class="logo-img" />
                            </div>
                            <div class="text-col">
                                <h2 class="society-name">BURDWAN SADAR PYARA NUTRITION WELFARE SOCIETY</h2>
                                <p class="reg-no">Registration No. &ndash; S0028375 of 2022-2023</p>
                                <p class="niti-id">NITI AAYOG Registration: WB/2023/0347627</p>
                                <p class="tax-id">80G Registration Id: AAKAB0383N24KL02</p>
                                <p class="office-address">Registered Office: 3 No. Shankari Pukur, PO: Sripally, Dist.: Purba Bardhaman, Pin: 713103</p>
                                <p class="contact-info">Phone: 7866022053 &nbsp;|&nbsp; Mail: bspnws@gmail.com</p>
                            </div>
                        </div>

                        <div class="payslip-title-block">
                            <h2 class="payslip-title">Salary Slip</h2>
                            <p class="payslip-period">For the Month of ${payslip.month}</p>
                        </div>

                        <table class="details-table">
                            <tr>
                                <td class="lbl">Employee Name:</td>
                                <td class="val">${payslip.fullName}</td>
                                <td class="lbl">Designation:</td>
                                <td class="val">Staff Member</td>
                            </tr>
                            <tr>
                                <td class="lbl">Email / ID:</td>
                                <td class="val">${payslip.email}</td>
                                <td class="lbl">Status:</td>
                                <td class="val status-paid">${payslip.status}</td>
                            </tr>
                            <tr>
                                <td class="lbl">Issue Date:</td>
                                <td class="val">${new Date(payslip.createdAt).toLocaleDateString()}</td>
                                <td class="lbl">Currency:</td>
                                <td class="val">INR (₹)</td>
                            </tr>
                        </table>

                        <table class="salary-table">
                            <thead>
                                <tr>
                                    <th>Earnings</th>
                                    <th class="text-right">Amount (₹)</th>
                                    <th>Deductions</th>
                                    <th class="text-right">Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Basic Salary</td>
                                    <td class="text-right">₹${payslip.basicSalary.toFixed(2)}</td>
                                    <td>Deductions / Taxes</td>
                                    <td class="text-right text-red">₹${payslip.deduction.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td class="text-green">Allowances / Bonus</td>
                                    <td class="text-right text-green">+₹${payslip.allowance.toFixed(2)}</td>
                                    <td></td>
                                    <td class="text-right"></td>
                                </tr>
                                <tr>
                                    <td style="height: 20px;"></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr class="total-row">
                                    <td class="font-bold">Total Earnings (Gross)</td>
                                    <td class="text-right font-bold">₹${(payslip.basicSalary + payslip.allowance).toFixed(2)}</td>
                                    <td class="font-bold">Total Deductions</td>
                                    <td class="text-right font-bold text-red">₹${payslip.deduction.toFixed(2)}</td>
                                </tr>
                                <tr class="net-pay-row">
                                    <td colspan="2" class="net-pay-lbl">Net Salary Payable:</td>
                                    <td colspan="2" class="net-pay-val text-right">₹${payslip.netSalary.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colspan="4" class="words-row">
                                        <strong>Rupees in Words:</strong> ${numberToWords(payslip.netSalary)} Only
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="bottom-section">
                            <div class="payment-mode">
                                <span>Salary Paid by:</span>
                                <label><input type="checkbox" ${payslip.paymentMethod === 'Cash' || !payslip.paymentMethod ? 'checked' : ''} disabled /> Cash</label>
                                <label><input type="checkbox" ${payslip.paymentMethod === 'Cheque' ? 'checked' : ''} disabled /> Cheque</label>
                                <label><input type="checkbox" ${payslip.paymentMethod === 'Bank Transfer' ? 'checked' : ''} disabled /> Bank Transfer</label>
                            </div>
                        </div>

                        <div class="signatures-container">
                            <div class="seal-box">
                                <img src="${sealUrl}" alt="Official Seal" class="seal-img" />
                                <p class="sig-label">OFFICIAL SEAL</p>
                            </div>
                            <div class="sig-box">
                                <img src="${signatureUrl}" alt="Authorized Signature" class="sig-img" />
                                <p class="sig-line"></p>
                                <p class="sig-label">AUTHORIZED SIGNATURE</p>
                                <p class="sig-name">Pralay Majumdar (Secretary)</p>
                            </div>
                        </div>

                        <div class="footer">
                            <p>Confidential salary document issued by Burdwan Sadar Pyara Nutrition Welfare Society.</p>
                            <p>© ${new Date().getFullYear()} BSPNWS. All rights reserved.</p>
                        </div>
                    </div>
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        docWindow.document.close();
    };

    if (loading || !userData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <VolunteerSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 relative pb-20 overflow-y-auto">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/5 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Header */}
                <VolunteerHeader userData={userData} setIsMobileMenuOpen={setIsMobileMenuOpen} title="Salary Payslips" />

                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-10 animate-fade-in pb-24 lg:pb-8">
                    {/* Welcome Title */}
                    <div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">
                            Salary <span className="text-pink-600">Payslips</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                            Monthly payment reports and details
                        </p>
                    </div>

                    {/* Payslip Grids */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {payslips.map((payslip) => (
                            <div key={payslip._id} className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/30 flex flex-col justify-between min-h-[220px] hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-black text-gray-900 block leading-tight">{payslip.month}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">Salary Statement</span>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${payslip.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                        }`}>
                                        {payslip.status}
                                    </span>
                                </div>

                                <div className="my-6 flex items-baseline gap-1">
                                    <span className="text-sm text-gray-400 font-black">₹</span>
                                    <span className="text-3xl font-black text-gray-900 font-mono tracking-tight">
                                        {payslip.netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Net Paid</span>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setSelectedPayslip(payslip)}
                                        className="flex-1 py-3 bg-gray-50 hover:bg-pink-50 text-gray-600 hover:text-pink-600 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 border border-gray-100/50"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleDownloadPayslip(payslip)}
                                        className="py-3 px-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-pink-600/10 hover:shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                                    >
                                        <ArrowDownToLine className="w-4 h-4" />
                                        Print
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {payslips.length === 0 && (
                        <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-12 rounded-[2.5rem] text-center shadow-xl shadow-gray-200/20">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">No payslips have been issued to you yet.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Detailed Statement Modal */}
            {selectedPayslip && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-[2.5rem] border border-white/40 shadow-2xl w-full max-w-2xl overflow-hidden relative p-8 md:p-10 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedPayslip(null)}
                            className="absolute top-6 right-6 p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-pink-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Modal Header - Professional Society Banner */}
                        <div className="border-b-2 border-double border-blue-900 pb-6 mb-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                            <div className="w-20 h-20 relative shrink-0">
                                <img
                                    src="/logo.jpg"
                                    alt="Logo"
                                    className="w-full h-full object-contain rounded-full"
                                />
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <h2 className="text-base md:text-lg font-extrabold text-blue-900 leading-tight">BURDWAN SADAR PYARA NUTRITION WELFARE SOCIETY</h2>
                                <p className="text-xs font-bold text-gray-700">Registration No. – S0028375 of 2022-2023</p>
                                <p className="text-[10px] font-semibold text-gray-600">NITI AAYOG Registration: WB/2023/0347627</p>
                                <p className="text-[10px] font-semibold text-gray-600">80G Registration Id: AAKAB0383N24KL02</p>
                                <p className="text-[10px] font-semibold text-gray-600">Registered Office: 3 No. Shankari Pukur, PO: Sripally, Dist.: Purba Bardhaman, Pin: 713103</p>
                                <p className="text-[10px] font-semibold text-gray-600">Phone: 7866022053 &nbsp;|&nbsp; Mail: bspnws@gmail.com</p>
                            </div>
                        </div>
                        <div className="text-center mb-4">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Salary Slip</h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedPayslip.month}</p>
                        </div>

                        {/* Salary Details breakdown */}
                        <div className="space-y-4">
                            {/* Employee Details Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-200 text-[11px]">
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-200 bg-gray-50 px-2.5 py-1.5 font-bold text-gray-600 w-1/4">Employee Name:</td>
                                            <td className="border border-gray-200 px-2.5 py-1.5 text-gray-800 font-semibold w-1/4">{selectedPayslip.fullName}</td>
                                            <td className="border border-gray-200 bg-gray-50 px-2.5 py-1.5 font-bold text-gray-600 w-1/4">Designation:</td>
                                            <td className="border border-gray-200 px-2.5 py-1.5 text-gray-800 font-semibold w-1/4">Staff Member</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 bg-gray-50 px-2.5 py-1.5 font-bold text-gray-600">Email / ID:</td>
                                            <td className="border border-gray-200 px-2.5 py-1.5 text-gray-800 font-semibold break-all">{selectedPayslip.email}</td>
                                            <td className="border border-gray-200 bg-gray-50 px-2.5 py-1.5 font-bold text-gray-600">Status:</td>
                                            <td className="border border-gray-200 px-2.5 py-1.5 text-green-600 font-extrabold">{selectedPayslip.status}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 bg-gray-50 px-2.5 py-1.5 font-bold text-gray-600">Issue Date:</td>
                                            <td className="border border-gray-200 px-2.5 py-1.5 text-gray-800 font-semibold">{new Date(selectedPayslip.createdAt).toLocaleDateString()}</td>
                                            <td className="border border-gray-200 bg-gray-50 px-2.5 py-1.5 font-bold text-gray-600">Currency:</td>
                                            <td className="border border-gray-200 px-2.5 py-1.5 text-gray-800 font-semibold">INR (₹)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Salary Table (Earnings vs Deductions) */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="border border-slate-300 px-2.5 py-1.5 text-left font-bold text-slate-700 uppercase">Earnings</th>
                                            <th className="border border-slate-300 px-2.5 py-1.5 text-right font-bold text-slate-700 uppercase w-24">Amount (₹)</th>
                                            <th className="border border-slate-300 px-2.5 py-1.5 text-left font-bold text-slate-700 uppercase">Deductions</th>
                                            <th className="border border-slate-300 px-2.5 py-1.5 text-right font-bold text-slate-700 uppercase w-24">Amount (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-slate-300 px-2.5 py-1.5 text-gray-700 font-medium">Basic Salary</td>
                                            <td className="border border-slate-300 px-2.5 py-1.5 text-right text-gray-800 font-semibold">₹{selectedPayslip.basicSalary.toFixed(2)}</td>
                                            <td className="border border-slate-300 px-2.5 py-1.5 text-gray-700 font-medium">Deductions</td>
                                            <td className="border border-slate-300 px-2.5 py-1.5 text-right text-red-600 font-semibold">₹{selectedPayslip.deduction.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-slate-300 px-2.5 py-1.5 text-green-600 font-medium">Allowances / Bonus</td>
                                            <td className="border border-slate-300 px-2.5 py-1.5 text-right text-green-600 font-semibold">+₹{selectedPayslip.allowance.toFixed(2)}</td>
                                            <td className="border border-slate-300 px-2.5 py-1.5"></td>
                                            <td className="border border-slate-300 px-2.5 py-1.5 text-right"></td>
                                        </tr>
                                        <tr>
                                            <td className="border border-slate-300 px-2.5 py-1.5 h-6"></td>
                                            <td className="border border-slate-300 px-2.5 py-1.5"></td>
                                            <td className="border border-slate-300 px-2.5 py-1.5"></td>
                                            <td className="border border-slate-300 px-2.5 py-1.5"></td>
                                        </tr>
                                        <tr className="bg-slate-50 font-bold">
                                            <td className="border border-slate-300 px-2.5 py-1.5 text-slate-700">Total Earnings</td>
                                            <td className="border border-slate-300 px-2.5 py-1.5 text-right text-slate-800">₹{(selectedPayslip.basicSalary + selectedPayslip.allowance).toFixed(2)}</td>
                                            <td className="border border-slate-300 px-2.5 py-1.5 text-slate-700">Total Deductions</td>
                                            <td className="border border-slate-300 px-2.5 py-1.5 text-right text-red-600">₹{selectedPayslip.deduction.toFixed(2)}</td>
                                        </tr>
                                        <tr className="bg-sky-50 font-black text-sky-900">
                                            <td colSpan={2} className="border border-slate-300 px-2.5 py-2 uppercase tracking-wider text-[10px]">Net Salary Payable:</td>
                                            <td colSpan={2} className="border border-slate-300 px-2.5 py-2 text-right text-xs">₹{selectedPayslip.netSalary.toFixed(2)}</td>
                                        </tr>
                                        <tr className="bg-white">
                                            <td colSpan={4} className="border border-slate-300 px-2.5 py-1.5 italic text-gray-500 font-medium text-[10px]">
                                                <strong>Rupees in Words:</strong> {numberToWords(selectedPayslip.netSalary)} Only
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-semibold text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                <span>Salary Paid by:</span>
                                <div className="flex gap-3">
                                    <label className="flex items-center gap-1 cursor-not-allowed">
                                        <input
                                            type="checkbox"
                                            checked={selectedPayslip.paymentMethod === 'Cash' || !selectedPayslip.paymentMethod}
                                            disabled
                                            className="rounded text-pink-600 focus:ring-pink-500 w-3 h-3"
                                        />
                                        Cash
                                    </label>
                                    <label className="flex items-center gap-1 cursor-not-allowed">
                                        <input
                                            type="checkbox"
                                            checked={selectedPayslip.paymentMethod === 'Cheque'}
                                            disabled
                                            className="rounded text-pink-600 focus:ring-pink-500 w-3 h-3"
                                        />
                                        Cheque
                                    </label>
                                    <label className="flex items-center gap-1 cursor-not-allowed">
                                        <input
                                            type="checkbox"
                                            checked={selectedPayslip.paymentMethod === 'Bank Transfer'}
                                            disabled
                                            className="rounded text-pink-600 focus:ring-pink-500 w-3 h-3"
                                        />
                                        Bank Transfer
                                    </label>
                                </div>
                            </div>

                            {/* Seal & Signature inside Modal */}
                            <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-4">
                                <div className="text-center w-32">
                                    <img
                                        src="/society-seal.jpg"
                                        alt="Official Seal"
                                        className="w-14 h-14 object-contain mx-auto"
                                    />
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mt-1">Official Seal</span>
                                </div>
                                <div className="text-center w-40">
                                    <img
                                        src="/society-signature.jpg"
                                        alt="Authorized Signature"
                                        className="h-7 object-contain mx-auto"
                                    />
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mt-1 border-t border-dashed border-gray-200 pt-1 px-2">Authorized Signature</span>
                                    <span className="text-[8px] font-bold text-gray-500 block mt-0.5">Pralay Majumdar (Secretory)</span>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => handleDownloadPayslip(selectedPayslip)}
                                    className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-pink-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <ArrowDownToLine className="w-4 h-4" />
                                    Print Statement
                                </button>
                                <button
                                    onClick={() => setSelectedPayslip(null)}
                                    className="px-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-black text-xs uppercase tracking-widest rounded-2xl transition-all border border-gray-100"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
