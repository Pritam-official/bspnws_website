"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";

export default function InternshipApplyPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [declarationChecked, setDeclarationChecked] = useState(false);

    // Form fields
    const [formData, setFormData] = useState({
        fullName: "",
        dob: "",
        gender: "",
        phoneNumber: "",
        email: "",
        address: "",
        fatherName: "",
        fatherOccupation: "",
        educationQualification: "",
        otherQualification: "",
        schoolName: "",
        board: "",
        otherBoard: "",
        collegeName: "",
        universityName: "",
        currentSemesterYear: "",
        stream: "",
        areaOfInterest: "",
        otherAreaOfInterest: "",
        duration: "",
        skills: "",
        otherSkills: "",
        whyJoin: "",
    });

    const [files, setFiles] = useState<{
        resume: { base64: string; name: string } | null;
    }>({
        resume: null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch("/api/internship/status");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (err) {
                console.error("Failed to fetch internship settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => {
                const copy = { ...prev };
                delete copy[name];
                return copy;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setErrors(prev => ({ ...prev, resume: "Only PDF files are allowed." }));
            return;
        }

        const minPdfSize = 50 * 1024; // 50 KB
        const maxPdfSize = 200 * 1024; // 200 KB
        if (file.size < minPdfSize || file.size > maxPdfSize) {
            setErrors(prev => ({ ...prev, resume: `PDF size must be between 50 KB and 200 KB. (Your file: ${(file.size / 1024).toFixed(1)} KB)` }));
            return;
        }

        setErrors(prev => {
            const copy = { ...prev };
            delete copy.resume;
            return copy;
        });

        const reader = new FileReader();
        reader.onloadend = () => {
            setFiles({
                resume: {
                    base64: reader.result as string,
                    name: file.name
                }
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        // Required field validation
        const requiredFields = [
            "fullName", "dob", "gender", "phoneNumber", "email", "address",
            "fatherName", "fatherOccupation", "educationQualification",
            "areaOfInterest", "duration"
        ];

        requiredFields.forEach(field => {
            if (!formData[field as keyof typeof formData]) {
                newErrors[field] = "This field is required.";
            }
        });

        // Gmail validation
        const emailStr = formData.email.trim().toLowerCase();
        if (formData.email && !emailStr.endsWith("@gmail.com")) {
            newErrors.email = "Email must be a valid Gmail account (ending in @gmail.com).";
        }

        // Phone number validation: exactly 10 digits
        const phoneRegex = /^[0-9]{10}$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
        }

        // Qualification specific logic
        const qual = formData.educationQualification;
        if (qual === "Others" && !formData.otherQualification) {
            newErrors.otherQualification = "Please specify your qualification.";
        }

        if (qual === "10th Pass" || qual === "12th Pass") {
            if (!formData.schoolName) newErrors.schoolName = "School name is required.";
            if (!formData.board) newErrors.board = "Board selection is required.";
            if (formData.board === "Other" && !formData.otherBoard) {
                newErrors.otherBoard = "Please enter the board name.";
            }
        }

        if (qual === "Graduate" || qual === "Post Graduate") {
            if (!formData.collegeName) newErrors.collegeName = "College name is required.";
            if (!formData.universityName) newErrors.universityName = "University name is required.";
            if (!formData.stream) newErrors.stream = "Stream is required.";
        }

        // Area of Interest specific logic
        if (formData.areaOfInterest === "Other" && !formData.otherAreaOfInterest) {
            newErrors.otherAreaOfInterest = "Please specify your area of interest.";
        }

        // Skills specific logic
        if (formData.skills === "Other" && !formData.otherSkills) {
            newErrors.otherSkills = "Please specify your skills.";
        }

        // Resume validation
        if (!files.resume) {
            newErrors.resume = "Resume/CV is required.";
        }

        // Declaration check
        if (!declarationChecked) {
            newErrors.declaration = "You must accept the declaration to submit.";
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
                email: emailStr,
                skills: formData.skills === "Other" ? `Other: ${formData.otherSkills}` : formData.skills,
                resume: files.resume?.base64,
            };

            const res = await fetch("/api/internship/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const responseData = await res.json();

            if (res.ok && responseData.success) {
                setSubmitSuccess(true);
                setFormData({
                    fullName: "",
                    dob: "",
                    gender: "",
                    phoneNumber: "",
                    email: "",
                    address: "",
                    fatherName: "",
                    fatherOccupation: "",
                    educationQualification: "",
                    otherQualification: "",
                    schoolName: "",
                    board: "",
                    otherBoard: "",
                    collegeName: "",
                    universityName: "",
                    currentSemesterYear: "",
                    stream: "",
                    areaOfInterest: "",
                    otherAreaOfInterest: "",
                    duration: "",
                    skills: "",
                    otherSkills: "",
                    whyJoin: "",
                });
                setFiles({
                    resume: null
                });
                setDeclarationChecked(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                alert(responseData.error || "Failed to submit internship application.");
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
            <div className="min-h-screen bg-white flex items-center justify-center font-sans">
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                            Internship Applications Closed
                        </h1>
                        <p className="text-slate-600 font-normal text-base leading-relaxed mb-8">
                            Thank you for your interest in our internship program. Applications are currently not being accepted. Please check back later for the next application window.
                        </p>
                        {formattedDeadline && (
                            <div className="inline-block px-5 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                                Previous window closed on {formattedDeadline}
                            </div>
                        )}
                    </div>
                ) : submitSuccess ? (
                    // Success View
                    <div className="max-w-xl mx-auto my-12 bg-white rounded-lg p-10 sm:p-16 border border-slate-200 shadow-md text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-700">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                            Application Submitted
                        </h1>
                        <p className="text-slate-600 font-normal text-sm leading-relaxed mb-8">
                            Thank you for applying for our Internship program. Your application has been received and our team will review your documents shortly.
                        </p>
                        <button
                            onClick={() => setSubmitSuccess(false)}
                            className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors text-sm"
                        >
                            Back to Portal
                        </button>
                    </div>
                ) : (
                    // Portal Open UI
                    <div className="space-y-10">
                        {/* Hero Banner */}
                        <div className="relative h-56 sm:h-72 w-full rounded-lg overflow-hidden shadow-md border border-slate-200">
                            <Image
                                src="/internship_banner.jpg"
                                alt="Internship Program Banner"
                                fill
                                priority
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent flex flex-col justify-end p-8 sm:p-10">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight mb-2">
                                    Professional Internship Program
                                </h1>
                                <p className="text-slate-100 text-sm font-normal leading-relaxed max-w-2xl">
                                    Gain practical experience while contributing to meaningful social impact initiatives, nutrition management, and community welfare programs.
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
                                        Internship applications are now being accepted. Please complete all sections of the form below.
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
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">Internship Application Form</h1>
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
                                                placeholder="Enter full name"
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.fullName ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                            />
                                            {errors.fullName && <p className="text-red-600 text-xs font-medium">{errors.fullName}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Date of Birth <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 text-sm outline-none transition-colors ${errors.dob ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                            />
                                            {errors.dob && <p className="text-red-600 text-xs font-medium">{errors.dob}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Gender <span className="text-red-600">*</span>
                                            </label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 appearance-none text-sm outline-none transition-colors ${errors.gender ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                            >
                                                <option value="" disabled>Select gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.gender && <p className="text-red-600 text-xs font-medium">{errors.gender}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Phone Number <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                maxLength={10}
                                                value={formData.phoneNumber}
                                                onChange={handleTextChange}
                                                placeholder="10-digit number"
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.phoneNumber ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                            />
                                            {errors.phoneNumber && <p className="text-red-600 text-xs font-medium">{errors.phoneNumber}</p>}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Email Address (Gmail Only) <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleTextChange}
                                                placeholder="yourname@gmail.com"
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                            />
                                            {errors.email && <p className="text-red-600 text-xs font-medium">{errors.email}</p>}
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
                                                placeholder="Complete permanent address"
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors resize-none ${errors.address ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
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
                                                placeholder="Father's full name"
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.fatherName ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
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
                                                placeholder="E.g., Service, Business, Farmer"
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.fatherOccupation ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                            />
                                            {errors.fatherOccupation && <p className="text-red-600 text-xs font-medium">{errors.fatherOccupation}</p>}
                                        </div>

                                    </div>
                                </div>

                                {/* Section 3: Educational Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 pb-3 border-b border-slate-100 flex items-center gap-3">
                                        <span className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-xs font-bold">3</span>
                                        Educational Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Education Qualification <span className="text-red-600">*</span>
                                            </label>
                                            <select
                                                name="educationQualification"
                                                value={formData.educationQualification}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 appearance-none text-sm outline-none transition-colors ${errors.educationQualification ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                            >
                                                <option value="" disabled>Select Qualification</option>
                                                <option value="10th Pass">10th Pass</option>
                                                <option value="12th Pass">12th Pass</option>
                                                <option value="Graduate">Graduate</option>
                                                <option value="Post Graduate">Post Graduate</option>
                                                <option value="Others">Others</option>
                                            </select>
                                            {errors.educationQualification && <p className="text-red-600 text-xs font-medium">{errors.educationQualification}</p>}
                                        </div>

                                        {formData.educationQualification === "Others" && (
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                    Specify Qualification <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="otherQualification"
                                                    value={formData.otherQualification}
                                                    onChange={handleTextChange}
                                                    placeholder="Specify qualification detail"
                                                    className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.otherQualification ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                />
                                                {errors.otherQualification && <p className="text-red-600 text-xs font-medium">{errors.otherQualification}</p>}
                                            </div>
                                        )}

                                        {/* For 10th and 12th Students */}
                                        {(formData.educationQualification === "10th Pass" || formData.educationQualification === "12th Pass") && (
                                            <>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                        School Name <span className="text-red-600">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="schoolName"
                                                        value={formData.schoolName}
                                                        onChange={handleTextChange}
                                                        placeholder="School name"
                                                        className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.schoolName ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
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
                                                    <div className="space-y-2 md:col-span-2">
                                                        <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                            Enter Board Name <span className="text-red-600">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="otherBoard"
                                                            value={formData.otherBoard}
                                                            onChange={handleTextChange}
                                                            placeholder="Specify Board Name"
                                                            className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.otherBoard ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                        />
                                                        {errors.otherBoard && <p className="text-red-600 text-xs font-medium">{errors.otherBoard}</p>}
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* For Graduate / Post Graduate Students */}
                                        {(formData.educationQualification === "Graduate" || formData.educationQualification === "Post Graduate") && (
                                            <>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                        College Name <span className="text-red-600">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="collegeName"
                                                        value={formData.collegeName}
                                                        onChange={handleTextChange}
                                                        placeholder="College/Institute Name"
                                                        className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.collegeName ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                    />
                                                    {errors.collegeName && <p className="text-red-600 text-xs font-medium">{errors.collegeName}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                        University Name <span className="text-red-600">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="universityName"
                                                        value={formData.universityName}
                                                        onChange={handleTextChange}
                                                        placeholder="University Name"
                                                        className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.universityName ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                    />
                                                    {errors.universityName && <p className="text-red-600 text-xs font-medium">{errors.universityName}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                        Stream <span className="text-red-600">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="stream"
                                                        value={formData.stream}
                                                        onChange={handleTextChange}
                                                        placeholder="E.g., Science, Arts, B.Tech, BCA"
                                                        className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.stream ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                    />
                                                    {errors.stream && <p className="text-red-600 text-xs font-medium">{errors.stream}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                                                        Current Semester / Year (Optional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="currentSemesterYear"
                                                        value={formData.currentSemesterYear}
                                                        onChange={handleTextChange}
                                                        placeholder="E.g., 1st Year, 2nd Year, Final Year"
                                                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-100 transition-colors"
                                                    />
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </div>

                                {/* Section 4: Preferences */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 pb-3 border-b border-slate-100 flex items-center gap-3">
                                        <span className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-xs font-bold">4</span>
                                        Internship Preferences
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Area of Interest <span className="text-red-600">*</span>
                                            </label>
                                            <select
                                                name="areaOfInterest"
                                                value={formData.areaOfInterest}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 appearance-none text-sm outline-none transition-colors ${errors.areaOfInterest ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                            >
                                                <option value="" disabled>Select Area of Interest</option>
                                                <option value="Social Work">Social Work</option>
                                                <option value="Nutrition Program">Nutrition Program</option>
                                                <option value="Child Welfare">Child Welfare</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.areaOfInterest && <p className="text-red-600 text-xs font-medium">{errors.areaOfInterest}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                Internship Duration <span className="text-red-600">*</span>
                                            </label>
                                            <select
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleTextChange}
                                                className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 appearance-none text-sm outline-none transition-colors ${errors.duration ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                            >
                                                <option value="" disabled>Select Duration</option>
                                                <option value="1 Month">1 Month</option>
                                                <option value="2 Months">2 Months</option>
                                                <option value="3 Months">3 Months</option>
                                                <option value="4 Months">4 Months</option>
                                                <option value="5 Months">5 Months</option>
                                                <option value="6 Months">6 Months</option>
                                                <option value="9 Months">9 Months</option>
                                                <option value="12 Months (1 Year)">12 Months (1 Year)</option>
                                            </select>
                                            {errors.duration && <p className="text-red-600 text-xs font-medium">{errors.duration}</p>}
                                        </div>

                                        {formData.areaOfInterest === "Other" && (
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                    Specify Area of Interest <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="otherAreaOfInterest"
                                                    value={formData.otherAreaOfInterest}
                                                    onChange={handleTextChange}
                                                    placeholder="Specify Area of Interest"
                                                    className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.otherAreaOfInterest ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                />
                                                {errors.otherAreaOfInterest && <p className="text-red-600 text-xs font-medium">{errors.otherAreaOfInterest}</p>}
                                            </div>
                                        )}

                                    </div>
                                </div>

                                {/* Section 5: Additional Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 pb-3 border-b border-slate-100 flex items-center gap-3">
                                        <span className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-xs font-bold">5</span>
                                        Additional Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                                                Skills (Optional)
                                            </label>
                                            <select
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleTextChange}
                                                className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 font-normal text-slate-900 appearance-none text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-100 transition-colors"
                                            >
                                                <option value="">Select Primary Skill (Optional)</option>
                                                <option value="MS Office">MS Office</option>
                                                <option value="Canva">Canva</option>
                                                <option value="Graphic Design">Graphic Design</option>
                                                <option value="Communication">Communication</option>
                                                <option value="Programming">Programming</option>
                                                <option value="Social Media Management">Social Media Management</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        {formData.skills === "Other" && (
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                                    Specify Skills <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="otherSkills"
                                                    value={formData.otherSkills}
                                                    onChange={handleTextChange}
                                                    placeholder="Specify your skills"
                                                    className={`w-full px-4 py-2.5 rounded-lg bg-white border font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-colors ${errors.otherSkills ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-100'}`}
                                                />
                                                {errors.otherSkills && <p className="text-red-600 text-xs font-medium">{errors.otherSkills}</p>}
                                            </div>
                                        )}

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                                                Why Do You Want To Join This Internship? (Optional)
                                            </label>
                                            <textarea
                                                name="whyJoin"
                                                value={formData.whyJoin}
                                                onChange={handleTextChange}
                                                rows={4}
                                                placeholder="Explain your motivation to join this program"
                                                className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 font-normal text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-100 transition-colors resize-none"
                                            />
                                        </div>

                                    </div>
                                </div>

                                {/* Section 6: Document Upload */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 pb-3 border-b border-slate-100 flex items-center gap-3">
                                        <span className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-xs font-bold">6</span>
                                        Document Upload
                                    </h3>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                                            Resume / CV Upload <span className="text-red-600">*</span>
                                        </label>

                                        <div className="relative group border-2 border-dashed border-slate-300 hover:border-slate-900 rounded-lg p-8 bg-slate-50 hover:bg-white transition-colors flex flex-col items-center justify-center text-center cursor-pointer">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <svg className="w-8 h-8 text-slate-400 group-hover:text-slate-900 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span className="text-sm font-semibold text-slate-900">
                                                {files.resume ? files.resume.name : "Upload Resume PDF"}
                                            </span>
                                            <span className="text-xs text-slate-500 font-normal mt-1">
                                                Accepted format: PDF only. File size: 50 KB to 200 KB
                                            </span>
                                        </div>
                                        {errors.resume && <p className="text-red-600 text-xs font-medium">{errors.resume}</p>}
                                    </div>
                                </div>

                                {/* Section 7: Declaration Checkbox */}
                                <div className="pt-4 border-t border-slate-200 space-y-4">
                                    <label className="flex items-start gap-3 select-none cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={declarationChecked}
                                            onChange={(e) => {
                                                setDeclarationChecked(e.target.checked);
                                                if (errors.declaration) {
                                                    setErrors(prev => {
                                                        const copy = { ...prev };
                                                        delete copy.declaration;
                                                        return copy;
                                                    });
                                                }
                                            }}
                                            className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-500 shrink-0 mt-0.5"
                                        />
                                        <span className="text-sm font-normal text-slate-600 leading-relaxed">
                                            I hereby declare that all information provided in this application is true and correct. <span className="text-red-600 font-semibold">*</span>
                                        </span>
                                    </label>
                                    {errors.declaration && <p className="text-red-600 text-xs font-medium">{errors.declaration}</p>}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        "Apply for Internship"
                                    )}
                                </button>

                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}