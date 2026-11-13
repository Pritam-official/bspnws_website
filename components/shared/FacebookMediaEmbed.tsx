"use client";

import React, { useState } from "react";
import { ExternalLink, Image as ImageIcon, Loader2 } from "lucide-react";

interface FacebookMediaEmbedProps {
    url: string;
    type?: "images" | "videos" | "auto";
    title?: string;
}

export default function FacebookMediaEmbed({ url, type = "auto", title }: FacebookMediaEmbedProps) {
    const [isLoading, setIsLoading] = useState(true);

    if (!url || typeof url !== "string") return null;

    const trimmedUrl = url.trim();

    // Check URL patterns
    const isFacebook = /facebook\.com|fb\.watch|fb\.me/i.test(trimmedUrl);
    const isFbAlbum = /facebook\.com\/media\/set/i.test(trimmedUrl);
    const isFbDirectVideo = /facebook\.com\/(?:[^\/]+\/videos|watch)|fb\.watch/i.test(trimmedUrl);
    const isYouTube = /youtube\.com|youtu\.be/i.test(trimmedUrl);

    // Initial embed mode for Facebook:
    // If it's a direct video URL, use video.php; otherwise post.php handles posts (including posts with video attachments)
    const embedMode: "post" | "video" = isFbDirectVideo ? "video" : "post";

    // Helper for YouTube embed URL
    const getYouTubeEmbedUrl = (ytUrl: string) => {
        try {
            if (ytUrl.includes("youtu.be/")) {
                const id = ytUrl.split("youtu.be/")[1]?.split(/[?#]/)[0];
                return id ? `https://www.youtube.com/embed/${id}` : null;
            }
            if (ytUrl.includes("watch?v=")) {
                const id = new URL(ytUrl).searchParams.get("v");
                return id ? `https://www.youtube.com/embed/${id}` : null;
            }
            if (ytUrl.includes("/embed/")) {
                return ytUrl;
            }
        } catch {
            return null;
        }
        return null;
    };

    // If it is a Facebook Album (/media/set/), render a clean Album Showcase Card
    if (isFbAlbum) {
        return (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col w-full max-w-[500px] mx-auto">
                <div className="p-8 sm:p-10 text-center space-y-5 bg-gradient-to-b from-blue-50/30 via-white to-slate-50/40">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100/70 text-[#1877F2] flex items-center justify-center shadow-md shadow-blue-500/10">
                        <ImageIcon className="w-8 h-8" />
                    </div>

                    <div className="space-y-1.5 max-w-sm mx-auto">
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                            {title || "Programme Photo Gallery"}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Full high-resolution event photographs and albums are hosted on our official Facebook Page.
                        </p>
                    </div>

                    <div className="pt-2">
                        <a
                            href={trimmedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 cursor-pointer"
                        >
                            <span>Open Photo Album on Facebook</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Build Embed URL
    let embedSrc = "";
    if (isFacebook) {
        const encodedUrl = encodeURIComponent(trimmedUrl);
        if (embedMode === "video") {
            embedSrc = `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=500`;
        } else {
            embedSrc = `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=500`;
        }
    } else if (isYouTube) {
        embedSrc = getYouTubeEmbedUrl(trimmedUrl) || "";
    }

    const isVideoVisual = embedMode === "video" || isYouTube;

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col w-full max-w-[500px] mx-auto">
            {/* Embed Frame Area */}
            <div className={`relative w-full bg-white ${
                isVideoVisual ? "aspect-video" : "min-h-[700px] sm:min-h-[780px]"
            }`}>
                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 text-slate-400 gap-2 z-10">
                        <Loader2 className="w-6 h-6 animate-spin text-[#1877F2]" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Loading Post...</span>
                    </div>
                )}

                {embedSrc ? (
                    <iframe
                        key={embedSrc}
                        src={embedSrc}
                        title={title || "Facebook Post"}
                        className={`w-full border-0 transition-opacity duration-300 block ${isLoading ? "opacity-0" : "opacity-100"} ${
                            isVideoVisual ? "absolute inset-0 h-full" : "h-[700px] sm:h-[780px]"
                        }`}
                        style={{ border: "none", overflow: "hidden" }}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        onLoad={() => setIsLoading(false)}
                    />
                ) : (
                    /* Fallback Card */
                    <div className="p-8 text-center space-y-4">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-[#1877F2] flex items-center justify-center">
                            <ExternalLink className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-slate-800">Direct Facebook Media</h4>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                Click below to view this programme update directly on Facebook.
                            </p>
                        </div>
                        <a
                            href={trimmedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                        >
                            Open on Facebook
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
