"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";

export default function ScholarshipApplyPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Form fields
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
        date: new Date().toISOString().split("T")[0],
        fatherName: "",
        fatherOccupation: "",
        motherOccupation: "",
        familyAnnualIncome: "",
        studentName: "",
        schoolName: "",
        board: "",
        otherBoard: "",
        examination: "",
        obtainedMarks: "",
        whyApply: "",
    });

    const [files, setFiles] = useState<{
        incomeCertificate: { base64: string; name: string } | null;
        resultCopy: { base64: string; name: string } | null;
    }>({
        incomeCertificate: null,
        resultCopy: null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch("/api/scholarship/status");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (err) {
                console.error("Failed to fetch scholarship settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            if (name === "fullName") {
                next.studentName = value;
            }
            return next;
        });
        if (errors[name]) {
            setErrors(prev => {
                const copy = { ...prev };
                delete copy[name];
                if (name === "fullName") {
                    delete copy.studentName;
                }
                return copy;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "incomeCertificate" | "resultCopy") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
        const maxSize = 5 * 1024 * 1024; // 5 MB

        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, [fieldName]: "Only PDF, JPG, JPEG, and PNG files are allowed." }));
            return;
        }

        if (file.size > maxSize) {
            setErrors(prev => ({ ...prev, [fieldName]: "Maximum file size is 5 MB." }));
            return;
        }

        setErrors(prev => {
            const copy = { ...prev };
            delete copy[fieldName];
            return copy;
        });

        const reader = new FileReader();
        reader.onloadend = () => {
            setFiles(prev => ({
                ...prev,
                [fieldName]: {
                    base64: reader.result as string,
                    name: file.name
                }
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        const requiredFields = [
            "fullName", "phoneNumber", "address", "date", "fatherName",
            "fatherOccupation", "motherOccupation", "familyAnnualIncome",
            "studentName", "schoolName", "board", "examination", "obtainedMarks"
        ];

        requiredFields.forEach(field => {
            if (!formData[field as keyof typeof formData]) {
                newErrors[field] = "This field is required.";
            }
        });

        if (formData.board === "Other" && !formData.otherBoard) {
            newErrors.otherBoard = "Please specify the board name.";
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
        }

        if (!files.incomeCertificate) {
            newErrors.incomeCertificate = "Income certificate is required.";
        }

        if (!files.resultCopy) {
            newErrors.resultCopy = "Result copy is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstErrorField = Object.keys(newErrors)[0];
            const element = document.getElementsByName(firstErrorField)[0] || document.getElementById(firstErrorField);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                incomeCertificate: files.incomeCertificate?.base64,
                resultCopy: files.resultCopy?.base64,
            };

            const res = await fetch("/api/scholarship/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const responseData = await res.json();

            if (res.ok && responseData.success) {
                setSubmitSuccess(true);
                setFormData({
                    fullName: "",
                    phoneNumber: "",
                    email: "",
                    address: "",
                    date: new Date().toISOString().split("T")[0],
                    fatherName: "",
                    fatherOccupation: "",
                    motherOccupation: "",
                    familyAnnualIncome: "",
                    studentName: "",
                    schoolName: "",
                    board: "",
                    otherBoard: "",
                    examination: "",
                    obtainedMarks: "",
                    whyApply: "",
                });
                setFiles({
                    incomeCertificate: null,
                    resultCopy: null,
                });
            } else {
                alert(responseData.error || "Failed to submit scholarship application.");
            }
        } catch (err) {
            console.error("Submission failed:", err);
            alert("An error occurred during submission. Please check your network and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAppOpen = settings?.isOpen && (!settings?.endDate || new Date() <= new Date(settings?.endDate));

    const formattedDeadline = settings?.endDate
        ? new Date(settings.endDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
        : null;

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Loading portal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Navbar />

            <div className="pt-20 pb-16 flex-grow container mx-auto px-4 max-w-5xl">
                {!isAppOpen ? (
                    // Portal Closed UI
                    <div className="max-w-2xl mx-auto my-12 bg-slate-50 rounded-lg p-10 sm:p-16 border border-slate-200 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                            Applications Currently Closed
                        </h1>
                        <p className="text-slate-600 font-normal text-base leading-relaxed mb-8">
                            Thank you for your interest in our scholarship program. Applications are currently not being accepted. Please check back later for the next application window.
                        </p>
                        {formattedDeadline && (
                            <div className="inline-block px-5 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                                Previous window closed on {formattedDeadline}
                            </div>
                        )}
                    </div>
                ) : (
                    // Portal Open UI
                    <div className="space-y-10">
                        {/* Hero Banner */}
                        <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                            <Image
                                src="/scholarship_distribution_v3.jpg"
                                alt="Scholarship Support Program"
                                fill
                                priority
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-6 sm:p-10">
                                <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-1 sm:mb-2">
                                    Educational Scholarship Program
                                </h1>
                                <p className="text-slate-200 text-xs sm:text-sm font-semibold leading-relaxed max-w-2xl">
                                    Supporting students from underprivileged backgrounds to continue their secondary and higher education.
                                </p>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="bg-slate-50 rounded-lg p-8 border border-slate-200">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center shrink-0 mt-1">
                                    <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                                        Application Period Active
                                    </h2>
                                    <p className="text-slate-600 text-sm font-normal mb-3">
                                        Scholarship applications are now being accepted. Please complete all sections of the form below.
                                    </p>
                                    {formattedDeadline && (
                                        <p className="text-sm font-semibold text-slate-700 bg-white px-3 py-1.5 rounded border border-slate-200 inline-block">
                                            Deadline: {formattedDeadline}
                                        </p>
                                    )}
                                    {settings?.announcementMessage && (
                                        <div className="text-sm font-normal text-slate-700 mt-4 p-4 bg-white rounded border border-slate-200">
                                            {settings.announcementMessage}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Application Form */}
                        <div className="bg-white rounded-lg p-8 sm:p-10 border border-slate-200 shadow-sm">
                            <div className="mb-10 pb-8 border-b border-slate-200">
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">Scholarship Application Form</h1>
                                <p className="text-sm text-slate-600 font-normal">Complete all required fields marked with <span className="text-red-600">*</span></p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Section 1: Personal Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 pb-3 border-b border-slate-100 flex items-center gap-3">
                                        <span className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-xs font-bold">1</span>
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Full Name <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.fullName ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                placeholder="Enter full name"
                                            />
                                            {errors.fullName && <p className="text-red-600 text-xs font-medium">{errors.fullName}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Phone Number <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleTextChange}
                                                maxLength={10}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.phoneNumber ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                placeholder="10-digit number"
                                            />
                                            {errors.phoneNumber && <p className="text-red-600 text-xs font-medium">{errors.phoneNumber}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Email Address (Optional)</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleTextChange}
                                                className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-100 transition-colors"
                                                placeholder="student@example.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Application Date <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 text-sm outline-none transition-colors ${errors.date ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                            />
                                            {errors.date && <p className="text-red-600 text-xs font-medium">{errors.date}</p>}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Address <span className="text-red-600">*</span>
                                            </label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleTextChange}
                                                rows={3}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors resize-none ${errors.address ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                placeholder="Complete residential address"
                                            />
                                            {errors.address && <p className="text-red-600 text-xs font-medium">{errors.address}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Family Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 pb-3 border-b border-slate-100 flex items-center gap-3">
                                        <span className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-xs font-bold">2</span>
                                        Family Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Father's Name <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fatherName"
                                                value={formData.fatherName}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.fatherName ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                placeholder="Full name"
                                            />
                                            {errors.fatherName && <p className="text-red-600 text-xs font-medium">{errors.fatherName}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Father's Occupation <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fatherOccupation"
                                                value={formData.fatherOccupation}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.fatherOccupation ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                placeholder="E.g., Farmer, Service"
                                            />
                                            {errors.fatherOccupation && <p className="text-red-600 text-xs font-medium">{errors.fatherOccupation}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Mother's Occupation <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="motherOccupation"
                                                value={formData.motherOccupation}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.motherOccupation ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                placeholder="E.g., Housewife, Service"
                                            />
                                            {errors.motherOccupation && <p className="text-red-600 text-xs font-medium">{errors.motherOccupation}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Annual Family Income (₹) <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="familyAnnualIncome"
                                                value={formData.familyAnnualIncome}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.familyAnnualIncome ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                placeholder="Annual income"
                                            />
                                            {errors.familyAnnualIncome && <p className="text-red-600 text-xs font-medium">{errors.familyAnnualIncome}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Student Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 pb-3 border-b border-slate-100 flex items-center gap-3">
                                        <span className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-xs font-bold">3</span>
                                        Student Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                School/Institute Name <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="schoolName"
                                                value={formData.schoolName}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.schoolName ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                placeholder="Full name of institution"
                                            />
                                            {errors.schoolName && <p className="text-red-600 text-xs font-medium">{errors.schoolName}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Board <span className="text-red-600">*</span>
                                            </label>
                                            <select
                                                name="board"
                                                value={formData.board}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 appearance-none text-sm outline-none transition-colors ${errors.board ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                            >
                                                <option value="" disabled>Select Board</option>
                                                <option value="WBBSE">WBBSE</option>
                                                <option value="WBCHSE">WBCHSE</option>
                                                <option value="CBSE">CBSE</option>
                                                <option value="ICSE">ICSE</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.board && <p className="text-red-600 text-xs font-medium">{errors.board}</p>}
                                        </div>

                                        {formData.board === "Other" && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                    Specify Board <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="otherBoard"
                                                    value={formData.otherBoard}
                                                    onChange={handleTextChange}
                                                    className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.otherBoard ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                    placeholder="Board name"
                                                />
                                                {errors.otherBoard && <p className="text-red-600 text-xs font-medium">{errors.otherBoard}</p>}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Examination <span className="text-red-600">*</span>
                                            </label>
                                            <select
                                                name="examination"
                                                value={formData.examination}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 appearance-none text-sm outline-none transition-colors ${errors.examination ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                            >
                                                <option value="" disabled>Select Examination</option>
                                                <option value="Madhyamik">Madhyamik</option>
                                                <option value="Higher Secondary (HS)">Higher Secondary (HS)</option>
                                            </select>
                                            {errors.examination && <p className="text-red-600 text-xs font-medium">{errors.examination}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Obtained Marks <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="obtainedMarks"
                                                value={formData.obtainedMarks}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.obtainedMarks ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                placeholder="Total marks obtained"
                                            />
                                            {errors.obtainedMarks && <p className="text-red-600 text-xs font-medium">{errors.obtainedMarks}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Document Uploads */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 pb-3 border-b border-slate-100 flex items-center gap-3">
                                        <span className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-xs font-bold">4</span>
                                        Document Uploads
                                    </h3>
                                    <p className="text-xs text-slate-600 font-normal mb-6">Accepted formats: PDF, JPG, PNG. Maximum 5 MB per file.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Income Certificate */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Income Certificate <span className="text-red-600">*</span>
                                            </label>
                                            <div className="relative group border-2 border-dashed border-slate-300 hover:border-slate-900 rounded-lg p-8 bg-slate-50 hover:bg-white transition-colors flex flex-col items-center justify-center text-center cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept=".pdf, .jpg, .jpeg, .png"
                                                    onChange={(e) => handleFileChange(e, "incomeCertificate")}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <svg className="w-8 h-8 text-slate-400 group-hover:text-slate-900 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                                                </svg>
                                                <span className="text-sm font-semibold text-slate-900">
                                                    {files.incomeCertificate ? files.incomeCertificate.name : "Upload document"}
                                                </span>
                                                <span className="text-xs text-slate-500 font-normal mt-1">
                                                    Click or drag to select
                                                </span>
                                            </div>
                                            {errors.incomeCertificate && <p className="text-red-600 text-xs font-medium">{errors.incomeCertificate}</p>}
                                        </div>

                                        {/* Result Copy */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Result Copy <span className="text-red-600">*</span>
                                            </label>
                                            <div className="relative group border-2 border-dashed border-slate-300 hover:border-slate-900 rounded-lg p-8 bg-slate-50 hover:bg-white transition-colors flex flex-col items-center justify-center text-center cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept=".pdf, .jpg, .jpeg, .png"
                                                    onChange={(e) => handleFileChange(e, "resultCopy")}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <svg className="w-8 h-8 text-slate-400 group-hover:text-slate-900 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                                                </svg>
                                                <span className="text-sm font-semibold text-slate-900">
                                                    {files.resultCopy ? files.resultCopy.name : "Upload document"}
                                                </span>
                                                <span className="text-xs text-slate-500 font-normal mt-1">
                                                    Click or drag to select
                                                </span>
                                            </div>
                                            {errors.resultCopy && <p className="text-red-600 text-xs font-medium">{errors.resultCopy}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 5: Additional Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 pb-3 border-b border-slate-100 flex items-center gap-3">
                                        <span className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-xs font-bold">5</span>
                                        Additional Information
                                    </h3>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Why do you want to apply for this scholarship? (Optional)</label>
                                        <textarea
                                            name="whyApply"
                                            value={formData.whyApply}
                                            onChange={handleTextChange}
                                            rows={4}
                                            className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-100 transition-colors resize-none"
                                            placeholder="Describe your educational goals and financial situation..."
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Application"
                                        )}
                                    </button>
                                    <p className="text-xs text-slate-600 font-normal text-center">
                                        By submitting, you confirm that all information provided is accurate and complete.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {submitSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-10 max-w-sm w-full shadow-lg border border-slate-200 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-700">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Application Submitted</h2>
                        <p className="text-slate-600 font-normal text-sm leading-relaxed mb-8">
                            Your scholarship application has been received. Our team will review your documents and contact you shortly.
                        </p>
                        <button
                            onClick={() => setSubmitSuccess(false)}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}