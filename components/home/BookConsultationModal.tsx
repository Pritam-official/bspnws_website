"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";

interface Dietitian {
  name: string;
  role: string;
  specialization: string;
  education: string;
}

interface BookConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dietitian: Dietitian | null;
}

export default function BookConsultationModal({
  isOpen,
  onClose,
  dietitian,
}: BookConsultationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    address: "",
    cause: "",
    phone: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset form states on close or open
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        gender: "",
        age: "",
        address: "",
        cause: "",
        phone: "",
        email: "",
      });
      setIsSuccess(false);
      setErrorMsg("");
    }
  }, [isOpen]);

  if (!isOpen || !dietitian) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic validation
    if (
      !formData.name ||
      !formData.gender ||
      !formData.age ||
      !formData.address ||
      !formData.cause ||
      !formData.phone ||
      !formData.email
    ) {
      setErrorMsg("Please fill in all the required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/book-consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          dietitianName: dietitian.name,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
      } else {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMsg("Failed to submit request. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-in fade-in-50 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">Book Consultation</h3>
            <p className="text-xs text-emerald-600 font-medium">
              with {dietitian.name} ({dietitian.specialization})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 rounded-xl border border-red-100 animate-shake">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Gender and Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => handleGenderSelect(g)}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${formData.gender === g
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    min="1"
                    max="120"
                    required
                    placeholder="e.g. 28"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  placeholder="Street details, City, PIN code"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Cause of Consultation */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Cause of Consultation <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="cause"
                  required
                  rows={3}
                  placeholder="e.g. Diabetes diet chart, weight gain tips, gastrointestinal issues"
                  value={formData.cause}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Contact Number and Gmail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Gmail/Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Gmail / Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Book Appointment</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success View */
            <div className="py-8 flex flex-col items-center text-center animate-in fade-in-50 slide-in-from-bottom-6 duration-300">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6 border border-emerald-100 shadow-inner">
                <CheckCircle className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Booking Requested!</h3>
              <p className="text-sm font-semibold text-emerald-600 mb-4">
                With Dietitian {dietitian.name}
              </p>
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl max-w-sm mb-8">
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  "we will connect you within 15days through mail or contact number"
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-900 hover:bg-gray-800 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
