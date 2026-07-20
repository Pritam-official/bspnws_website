"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [screenshotBase64, setScreenshotBase64] = useState("");
    const [screenshotPreview, setScreenshotPreview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setScreenshotBase64(base64);
                setScreenshotPreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    screenshot: screenshotBase64,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || "Thank you for your message! We will get back to you soon.");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });
                setScreenshotBase64("");
                setScreenshotPreview("");
            } else {
                alert(`Failed to send message: ${data.error || "Please try again."}`);
            }
        } catch (error) {
            console.error("Contact form API submission failed:", error);
            alert("An error occurred while sending your message. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-20 sm:pt-24 pb-16 sm:pb-24 container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Information */}
                    <div className="space-y-8 animate-slide-left">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                Get in <span className="text-primary">Touch</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Have questions or want to volunteer? We'd love to hear from you. Reach out to us using the form or the contact details below.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-lg hover:border-primary/20">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">Visit Us</h3>
                                    <p className="text-gray-600">Burdwan Sadar Pyara Nutrition Welfare Society,<br />3 No Shankari Pukur PO. Sripally, East Burdwan, Pin-713103 W.B India</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-lg hover:border-primary/20">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">Email Us</h3>
                                    <p className="text-gray-600">bspnws@gmail.com</p>

                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-lg hover:border-primary/20">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">Call Us</h3>
                                    <p className="text-gray-600">(+91) 7866022053</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 animate-slide-right">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Your Name*</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium text-gray-900"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Your Email*</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium text-gray-900"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium text-gray-900"
                                        placeholder="(+91) 98765 43210"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Subject*</label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium text-gray-900 appearance-none"
                                    >
                                        <option value="" disabled>Select a topic</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Volunteering">Volunteering</option>
                                        <option value="Donations">Donations</option>
                                        <option value="Handmade Materials">Handmade Materials</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Message*</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium text-gray-900 resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="screenshot" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Upload Screenshot (Optional)</label>
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <div className="flex-1 w-full">
                                        <input
                                            type="file"
                                            id="screenshot"
                                            accept="image/*"
                                            onChange={handleScreenshotChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium text-gray-900 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer"
                                        />
                                    </div>
                                    {screenshotPreview && (
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0 shadow-md">
                                            <img src={screenshotPreview} alt="Screenshot Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => { setScreenshotBase64(""); setScreenshotPreview(""); }}
                                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-md transition-all active:scale-90"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-600 hover:shadow-primary/30 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {isSubmitting ? "Sending Message..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Interactive Google Maps Section */}
                <div className="mt-16 sm:mt-24 space-y-6">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
                            Location Map
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                            Find Us on <span className="text-primary">Google Maps</span>
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base font-medium">
                            Visit our main society center in Bardhaman. Click on the map or get directions to navigate directly to our office.
                        </p>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden border-2 border-gray-100 shadow-2xl bg-gray-50 group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.880629737154!2d87.8577956758832!3d23.22825690807982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8499c857979a9%3A0xfc96a33f18e783ab!2sBurdwan%20Sadar%20Pyara%20Nutrition%20Welfare%20Society!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                            width="100%"
                            height="480"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Burdwan Sadar Pyara Nutrition Welfare Society Google Map"
                            className="w-full h-[380px] sm:h-[480px] rounded-3xl"
                        ></iframe>

                        <div className="absolute bottom-4 right-4 z-10">
                            <a
                                href="https://www.google.com/maps/place/Burdwan+Sadar+Pyara+Nutrition+Welfare+Society/@23.228238,87.8552997,16.9z/data=!4m22!1m15!4m14!1m6!1m2!1s0x39f8499c857979a9:0xfc96a33f18e783ab!2sBurdwan+Sadar+Pyara+Nutrition+Welfare+Society,+Sadarghat+Rd,+near+Hara+Chowmin+Stall,+Barabalidanga,+Bardhaman,+West+Bengal+713103!2m2!1d87.8603759!2d23.228252!1m6!1m2!1s0x39f8499c857979a9:0xfc96a33f18e783ab!2sBurdwan+Sadar+Pyara+Nutrition+Welfare+Society,+Sadarghat+Rd,+near+Hara+Chowmin+Stall,+Barabalidanga,+Bardhaman,+West+Bengal+713103!2m2!1d87.8603759!2d23.228252!3m5!1s0x39f8499c857979a9:0xfc96a33f18e783ab!8m2!3d23.228252!4d87.8603759!16s%2Fg%2F11vylzmhnt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-primary hover:bg-green-600 text-white font-bold px-5 py-3 rounded-2xl shadow-xl transition-all hover:-translate-y-0.5 text-xs uppercase tracking-wider"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Get Directions
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
