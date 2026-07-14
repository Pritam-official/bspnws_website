"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Star, Trash2, Check, X, MessageSquare, AlertCircle } from "lucide-react";

interface ReviewItem {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    status: "Pending" | "Approved" | "Rejected";
    createdAt: string;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/reviews");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setReviews(data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: "Approved" | "Rejected") => {
        try {
            const res = await fetch("/api/admin/reviews", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (res.ok) {
                setReviews((prev) =>
                    prev.map((rev) => (rev._id === id ? { ...rev, status: newStatus } : rev))
                );
            } else {
                alert("Failed to update review status. Please try again.");
            }
        } catch (error) {
            console.error("Error updating review status:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this review from the database?")) return;

        try {
            const res = await fetch(`/api/admin/reviews?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setReviews((prev) => prev.filter((rev) => rev._id !== id));
            } else {
                alert("Failed to delete review.");
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    // Computations
    const counts = {
        All: reviews.length,
        Pending: reviews.filter((r) => r.status === "Pending").length,
        Approved: reviews.filter((r) => r.status === "Approved").length,
        Rejected: reviews.filter((r) => r.status === "Rejected").length,
    };

    const filteredReviews = reviews.filter((rev) => {
        if (activeTab === "All") return true;
        return rev.status === activeTab;
    });

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Manage Reviews</h2>
                    <p className="text-sm text-gray-400 font-bold mt-1">
                        Moderate local reviews submitted by users on your website
                    </p>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {([
                    { name: "Total Submissions", value: counts.All, color: "text-blue-600 bg-blue-50 border-blue-100" },
                    { name: "Pending Review", value: counts.Pending, color: "text-amber-600 bg-amber-50 border-amber-100" },
                    { name: "Approved / Public", value: counts.Approved, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                    { name: "Rejected / Private", value: counts.Rejected, color: "text-rose-600 bg-rose-50 border-rose-100" },
                ] as const).map((card) => (
                    <div
                        key={card.name}
                        className={`p-6 rounded-2xl border bg-white flex flex-col justify-between shadow-[0_4px_12px_rgba(0,0,0,0.01)] ${card.color}`}
                    >
                        <span className="text-xs font-black uppercase tracking-wider text-gray-400">{card.name}</span>
                        <span className="text-3xl font-black mt-2">{card.value}</span>
                    </div>
                ))}
            </div>

            {/* Filters Navigation */}
            <div className="flex border-b border-gray-200">
                {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                            activeTab === tab
                                ? "border-rose-500 text-rose-600 font-black"
                                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                        }`}
                    >
                        {tab} <span className="text-xs opacity-75 font-normal ml-1">({counts[tab]})</span>
                    </button>
                ))}
            </div>

            {/* Reviews Feed */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                    <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
                    <p className="text-xs font-black uppercase tracking-wider">Loading reviews...</p>
                </div>
            ) : filteredReviews.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-gray-800 mb-1">No reviews found</h3>
                    <p className="text-sm text-gray-400 max-w-sm mx-auto">
                        There are no reviews matching the status &ldquo;{activeTab.toLowerCase()}&rdquo;.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredReviews.map((rev) => (
                        <div
                            key={rev._id}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-black text-gray-900">{rev.name}</h4>
                                        <span className="text-xs text-gray-400">
                                            {new Date(rev.createdAt).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>

                                    {/* Status Badge */}
                                    <span
                                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                            rev.status === "Approved"
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                : rev.status === "Rejected"
                                                ? "bg-rose-50 text-rose-700 border border-rose-100"
                                                : "bg-amber-50 text-amber-700 border border-amber-100"
                                        }`}
                                    >
                                        {rev.status}
                                    </span>
                                </div>

                                {/* Stars */}
                                <div className="flex gap-0.5 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < rev.rating
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-200 fill-gray-200"
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Comment */}
                                <p className="text-sm text-gray-600 italic leading-relaxed whitespace-pre-wrap mb-6">
                                    &ldquo;{rev.comment}&rdquo;
                                </p>
                            </div>

                            {/* Actions panel */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                <div className="flex items-center gap-2">
                                    {rev.status !== "Approved" && (
                                        <button
                                            onClick={() => handleUpdateStatus(rev._id, "Approved")}
                                            className="px-3.5 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                                        >
                                            <Check className="w-3.5 h-3.5" /> Approve
                                        </button>
                                    )}
                                    {rev.status !== "Rejected" && (
                                        <button
                                            onClick={() => handleUpdateStatus(rev._id, "Rejected")}
                                            className="px-3.5 py-2 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                                        >
                                            <X className="w-3.5 h-3.5" /> Reject
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleDelete(rev._id)}
                                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer active:scale-95"
                                    title="Delete review"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
