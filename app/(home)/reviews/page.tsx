"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/shared/Navbar";

interface ReviewItem {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Form fields
    const [name, setName] = useState<string>("");
    const [rating, setRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");

    // Modal state
    const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);
    const [submittedName, setSubmittedName] = useState<string>("");
    const [submittedComment, setSubmittedComment] = useState<string>("");
    const [copied, setCopied] = useState<boolean>(false);

    const googleUrl =
        process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
        "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUavrGkq6GMs";

    // Fetch approved reviews
    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/reviews");
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Aggregate stats for the trust seal
    const { average, total, dialDeg } = useMemo(() => {
        if (reviews.length === 0) return { average: 0, total: 0, dialDeg: 0 };
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const avg = sum / reviews.length;
        return {
            average: avg,
            total: reviews.length,
            dialDeg: (avg / 5) * 360,
        };
    }, [reviews]);

    // Handle local submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !comment.trim()) {
            alert("Please fill in your name and a review comment.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, rating, comment }),
            });

            if (res.ok) {
                setName("");
                setRating(5);
                setComment("");

                setSubmittedName(name);
                setSubmittedComment(comment);
                setShowGoogleModal(true);
                setCopied(false);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to submit review. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleRedirect = () => {
        try {
            navigator.clipboard.writeText(submittedComment);
            setCopied(true);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }

        setTimeout(() => {
            window.open(googleUrl, "_blank", "noopener,noreferrer");
        }, 800);
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* HERO — ink band with the trust seal as the signature element */}
            <section className="relative overflow-hidden bg-[#0F1826] pt-28 pb-24 sm:pt-32 sm:pb-28">
                {/* faint brass grid texture, purely atmospheric */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#C89B3C 1px, transparent 1px), linear-gradient(90deg, #C89B3C 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />
                <div className="relative container mx-auto max-w-6xl px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7">
                            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#C89B3C] mb-5">
                                Reviews &amp; Testimonials
                            </span>
                            <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] text-white font-black leading-[1.08] mb-6">
                                What our community
                                <br />
                                says, in their words.
                            </h1>
                            <p className="text-base md:text-lg text-slate-300/90 leading-relaxed max-w-xl">
                                Every review below comes from someone who worked with BSPNWS.
                                Read what they had to say, or add your own — it takes less
                                than a minute.
                            </p>
                            <div className="mt-9 flex flex-wrap gap-4">
                                <a
                                    href="#write-review"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] motion-reduce:transition-none"
                                >
                                    Write a review
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </a>
                                <a
                                    href={googleUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/15 text-slate-100 font-bold rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98]"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Review us on Google
                                </a>
                            </div>
                        </div>

                        {/* Trust seal — a dial built from the real average rating */}
                        <div className="lg:col-span-5 flex justify-center lg:justify-end">
                            <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                                <div
                                    className="absolute inset-0 rounded-full transition-[background] duration-700"
                                    style={{
                                        background: `conic-gradient(#C89B3C ${dialDeg}deg, rgba(255,255,255,0.08) ${dialDeg}deg)`,
                                    }}
                                />
                                <div className="absolute inset-[10px] rounded-full bg-[#0F1826] border border-white/10 flex flex-col items-center justify-center text-center">
                                    <span className="font-serif text-5xl font-black text-white leading-none">
                                        {total > 0 ? average.toFixed(1) : "—"}
                                    </span>
                                    <div className="flex gap-0.5 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-3.5 h-3.5 ${i < Math.round(average) ? "text-[#C89B3C]" : "text-white/15"}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-3">
                                        {total} {total === 1 ? "review" : "reviews"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main content wrapper */}
            <div className="py-16 sm:py-24 container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Testimonials List */}
                    <div className="lg:col-span-7 space-y-6">
                        <h2 className="font-serif text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-[#C89B3C] rounded-sm"></span>
                            Recent Reviews
                        </h2>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                                <div className="w-10 h-10 border-4 border-[#C89B3C] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm font-bold uppercase tracking-wider">Loading reviews...</p>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h3 className="font-bold text-gray-700 text-lg mb-1">No reviews yet</h3>
                                <p className="text-gray-500 max-w-sm mx-auto text-sm">Be the first to share your thoughts by filling out the form.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 max-h-[720px] overflow-y-auto pr-2 custom-scrollbar">
                                {reviews.map((rev, idx) => (
                                    <div
                                        key={rev._id}
                                        className="motion-safe:animate-[fadeInUp_0.5s_ease_forwards] opacity-0 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 relative"
                                        style={{
                                            animationDelay: `${Math.min(idx * 60, 480)}ms`,
                                            borderLeft: `3px solid ${rev.rating >= 4 ? "#C89B3C" : "#CBD5E1"}`,
                                        }}
                                    >
                                        <div className="flex items-start justify-between mb-3 gap-4">
                                            <div>
                                                <h3 className="font-black text-gray-800 text-base">{rev.name}</h3>
                                                <span className="text-xs text-gray-400 font-bold">
                                                    {new Date(rev.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </div>

                                            <div className="flex gap-0.5 shrink-0">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < rev.rating ? "text-[#C89B3C]" : "text-gray-200"}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                                            {rev.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Write a Review Form */}
                    <div id="write-review" className="lg:col-span-5 scroll-mt-24">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] sticky top-24">
                            <h2 className="font-serif text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-[#C89B3C] rounded-sm"></span>
                                Share Your Experience
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Your Name*
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-gray-900 text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                        Select Rating*
                                    </span>
                                    <div className="flex items-center gap-1.5 pt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="p-1 -ml-1 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C]/50 rounded"
                                            >
                                                <svg
                                                    className={`w-8 h-8 transition-colors duration-150 ${star <= (hoverRating || rating)
                                                            ? "text-[#C89B3C]"
                                                            : "text-gray-200"
                                                        }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        ))}
                                        <span className="ml-3 text-sm font-bold text-gray-500">
                                            {rating} / 5
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="comment" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Your Review*
                                    </label>
                                    <textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                        rows={4}
                                        placeholder="Tell us what you liked, your experience, or suggestions..."
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-gray-900 text-sm whitespace-pre-line"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:bg-gray-400 disabled:shadow-none disabled:-translate-y-0 motion-reduce:transition-none"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Review"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success / Google Copy Prompt Modal */}
            {showGoogleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#0F1826]/70 backdrop-blur-sm"
                        onClick={() => setShowGoogleModal(false)}
                    ></div>

                    <div className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-gray-100 animate-[scaleIn_0.25s_ease] text-center">
                        <button
                            onClick={() => setShowGoogleModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 p-1 rounded-full hover:bg-gray-50"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#C89B3C]">
                            <svg className="w-8 h-8 text-[#C89B3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h3 className="font-serif text-2xl font-black text-gray-900 mb-3">
                            Thank you, {submittedName}!
                        </h3>

                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Your review is in for moderation and will appear on this page soon.
                        </p>

                        <div className="bg-[#F7F3EC] rounded-2xl p-4 border border-[#E9DFC9] text-left mb-6 relative">
                            <span className="text-[10px] font-bold text-[#9C7A2E] uppercase tracking-widest block mb-1">Your review text</span>
                            <p className="text-xs text-gray-600 line-clamp-3">{submittedComment}</p>
                            <div className="absolute right-2 top-2 bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                Copied to clipboard
                            </div>
                        </div>

                        <p className="text-sm font-bold text-gray-700 mb-6 leading-relaxed px-2">
                            Help us reach more people — we've copied your review to the clipboard. Paste it on Google in the next window.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={handleGoogleRedirect}
                                className={`w-full py-4 rounded-2xl text-white font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${copied
                                        ? "bg-emerald-600 shadow-lg shadow-emerald-600/20"
                                        : "bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30"
                                    }`}
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.6 4.6 1.7L19.2 3.3c-2-1.9-4.7-3-7.4-3-6.1 0-11 4.9-11 11s4.9 11 11 11c6.5 0 10.8-4.6 10.8-11 0-.7-.1-1.3-.2-1.7H12.24z" />
                                </svg>
                                {copied ? "Copied! Opening Google..." : "Share & paste on Google"}
                            </button>

                            <button
                                onClick={() => setShowGoogleModal(false)}
                                className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                Maybe later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}