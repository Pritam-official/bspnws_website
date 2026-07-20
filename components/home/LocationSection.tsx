"use client";

import React from "react";
import { MapPin, Navigation, Phone, Mail } from "lucide-react";

export default function LocationSection() {
    const mapsLink = "https://www.google.com/maps/place/Burdwan+Sadar+Pyara+Nutrition+Welfare+Society/@23.228238,87.8552997,16.9z/data=!4m22!1m15!4m14!1m6!1m2!1s0x39f8499c857979a9:0xfc96a33f18e783ab!2sBurdwan+Sadar+Pyara+Nutrition+Welfare+Society,+Sadarghat+Rd,+near+Hara+Chowmin+Stall,+Barabalidanga,+Bardhaman,+West+Bengal+713103!2m2!1d87.8603759!2d23.228252!1m6!1m2!1s0x39f8499c857979a9:0xfc96a33f18e783ab!2sBurdwan+Sadar+Pyara+Nutrition+Welfare+Society,+Sadarghat+Rd,+near+Hara+Chowmin+Stall,+Barabalidanga,+Bardhaman,+West+Bengal+713103!2m2!1d87.8603759!2d23.228252!3m5!1s0x39f8499c857979a9:0xfc96a33f18e783ab!8m2!3d23.228252!4d87.8603759!16s%2Fg%2F11vylzmhnt";

    return (
        <section className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-100 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Section Header */}
                <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
                        <MapPin className="w-3.5 h-3.5" /> Our Location
                    </div>
                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight"
                        style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
                    >
                        Find Us on <span className="text-primary">Google Maps</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-sm sm:text-base max-w-2xl mx-auto">
                        Visit our main society center in Bardhaman. Locate us easily on the map below or get instant turn-by-turn navigation.
                    </p>
                </div>

                {/* Map Container */}
                <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-white shadow-2xl bg-white p-2 sm:p-4">
                    <div className="relative rounded-[2rem] overflow-hidden h-[400px] sm:h-[480px] w-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.880629737154!2d87.8577956758832!3d23.22825690807982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8499c857979a9%3A0xfc96a33f18e783ab!2sBurdwan%20Sadar%20Pyara%20Nutrition%20Welfare%20Society!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Burdwan Sadar Pyara Nutrition Welfare Society Google Map"
                            className="w-full h-full rounded-[2rem]"
                        ></iframe>

                        {/* Direct Directions Floating Overlay */}
                        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10">
                            <a
                                href={mapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 bg-slate-900 hover:bg-primary text-white font-bold px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:-translate-y-1 text-xs uppercase tracking-wider border border-white/20"
                            >
                                <Navigation className="w-4 h-4 text-emerald-400" />
                                Get Directions
                            </a>
                        </div>
                    </div>

                    {/* Quick Info Strip Below Map */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 px-2 sm:px-4">
                        <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Address</div>
                                <div className="text-xs font-bold text-slate-800 truncate">Sadarghat Rd, near Hara Chowmin Stall, Barabalidanga, Bardhaman - 713103</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Phone / Helpline</div>
                                <div className="text-xs font-bold text-slate-800">(+91) 7866022053</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Official Email</div>
                                <div className="text-xs font-bold text-slate-800">bspnws@gmail.com</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
