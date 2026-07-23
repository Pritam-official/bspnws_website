"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
    ChevronLeft, 
    ChevronRight, 
    ChevronsLeft, 
    ChevronsRight, 
    ZoomIn, 
    ZoomOut, 
    Maximize2, 
    Minimize2, 
    Download, 
    Printer, 
    Loader2, 
    BookOpen,
    Presentation
} from "lucide-react";

interface AnnualReport {
    _id: string;
    title: string;
    type: string;
    file: string; // Original Google Drive or Google Slides link
    date: string;
    createdAt: string;
}

export default function ReportCardSection() {
    const [report, setReport] = useState<AnnualReport | null>(null);
    const [isSlidesMode, setIsSlidesMode] = useState(false);
    const [slidesEmbedUrl, setSlidesEmbedUrl] = useState<string | null>(null);
    const [slideIndex, setSlideIndex] = useState(1); // Google Slides index tracking

    // PDF Mode states
    const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
    const [loading, setLoading] = useState(true);
    const [rendering, setRendering] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [pdfAspectRatio, setPdfAspectRatio] = useState(1.0); // 1.0 = square, > 1.2 = landscape spread

    const containerRef = useRef<HTMLDivElement>(null);
    const leftCanvasRef = useRef<HTMLCanvasElement>(null);
    const rightCanvasRef = useRef<HTMLCanvasElement>(null);
    const flipFrontCanvasRef = useRef<HTMLCanvasElement>(null);
    const flipBackCanvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isMobile, setIsMobile] = useState(false);
    // Compute view mode: if mobile OR the PDF pages are landscape spreads, use "single" canvas view
    const viewMode = (isMobile || pdfAspectRatio > 1.2) ? "single" : "double";

    // Fetch latest report from API
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch("/api/admin/annual-reports");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        const annualReports = data.filter((r: any) => r.type === "Annual Reports");
                        if (annualReports.length > 0) {
                            const latest = annualReports[0];
                            setReport(latest);

                            // Detect if Google Slides URL
                            if (latest.file.includes("docs.google.com/presentation")) {
                                setIsSlidesMode(true);
                                const match = latest.file.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
                                if (match && match[1]) {
                                    // Use rm=minimal to hide Google's default player controls
                                    setSlidesEmbedUrl(`https://docs.google.com/presentation/d/${match[1]}/embed?start=false&loop=false&delayms=3000&rm=minimal`);
                                } else {
                                    setSlidesEmbedUrl(latest.file);
                                }
                                setLoading(false);
                            } else {
                                setIsSlidesMode(false);
                            }
                        } else {
                            setErrorMsg("No published report found.");
                            setLoading(false);
                        }
                    }
                } else {
                    setErrorMsg("Failed to fetch reports from database.");
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching report:", err);
                setErrorMsg("Failed to connect to the database.");
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    // Load PDF.js CDN (only for non-slides PDF mode)
    useEffect(() => {
        if (typeof window === "undefined" || !report || isSlidesMode) return;

        if ((window as any).pdfjsLib) {
            setPdfjsLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.async = true;
        script.onload = () => {
            const pdfjsLib = (window as any).pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            setPdfjsLoaded(true);
        };
        script.onerror = () => {
            setErrorMsg("Failed to load PDF viewer scripts. Please refresh the page.");
            setLoading(false);
        };
        document.body.appendChild(script);
    }, [report, isSlidesMode]);

    // Handle viewport resize for mobile single page mode
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Listen for fullscreen change
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // Load PDF Document
    useEffect(() => {
        if (!pdfjsLoaded || !report || isSlidesMode) return;

        const loadPdfDoc = async () => {
            setLoading(true);
            setErrorMsg("");
            try {
                const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(report.file)}`;
                const pdfjsLib = (window as any).pdfjsLib;
                const loadingTask = pdfjsLib.getDocument(proxiedUrl);
                const doc = await loadingTask.promise;
                setPdfDoc(doc);
                setTotalPages(doc.numPages);
                setCurrentPage(1);

                // Detect aspect ratio of the first page to determine layout style
                if (doc.numPages > 0) {
                    const firstPage = await doc.getPage(1);
                    const viewport = firstPage.getViewport({ scale: 1.0 });
                    const aspect = viewport.width / viewport.height;
                    setPdfAspectRatio(aspect);
                    if (aspect > 1.2) {
                        setScale(0.7);
                    }
                }
            } catch (err: any) {
                console.error("PDF load error:", err);
                setErrorMsg("Failed to load the PDF file. The Google Drive link might not be shared publicly.");
            } finally {
                setLoading(false);
            }
        };

        loadPdfDoc();
    }, [pdfjsLoaded, report, isSlidesMode]);

    // Render PDF page helper
    const renderPage = useCallback(async (pageNum: number, canvas: HTMLCanvasElement | null, targetScale: number) => {
        if (!pdfDoc || !canvas) return;

        if (pageNum < 1 || pageNum > pdfDoc.numPages) {
            // Out of bounds page: clear canvas
            const context = canvas.getContext("2d");
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }

        try {
            const page = await pdfDoc.getPage(pageNum);
            const dpr = window.devicePixelRatio || 1;
            const viewport = page.getViewport({ scale: targetScale });

            canvas.width = viewport.width * dpr;
            canvas.height = viewport.height * dpr;
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;

            const context = canvas.getContext("2d");
            if (context) {
                context.scale(dpr, dpr);
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, viewport.width, viewport.height);
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
            }
        } catch (err) {
            console.error(`Error rendering page ${pageNum}:`, err);
        }
    }, [pdfDoc]);

    // Main render scheduler
    const triggerRender = useCallback(async (pageIndex: number, currentScale: number) => {
        if (!pdfDoc) return;
        setRendering(true);
        try {
            if (viewMode === "single") {
                const scaleMultiplier = pdfAspectRatio > 1.2 ? 1.0 : 1.3;
                await renderPage(pageIndex, leftCanvasRef.current, currentScale * scaleMultiplier);
            } else {
                await Promise.all([
                    renderPage(pageIndex, leftCanvasRef.current, currentScale),
                    renderPage(pageIndex + 1, rightCanvasRef.current, currentScale)
                ]);
            }
        } finally {
            setRendering(false);
        }
    }, [pdfDoc, viewMode, pdfAspectRatio, renderPage]);

    // Redraw pages on page change, layout change or scale change
    useEffect(() => {
        if (pdfDoc && !isFlipping) {
            triggerRender(currentPage, scale);
        }
    }, [pdfDoc, currentPage, scale, triggerRender, isFlipping]);

    // Helper to play page-flip audio sound effect
    const playFlipSound = useCallback(() => {
        if (audioRef.current) {
            try {
                audioRef.current.currentTime = 0;
                audioRef.current.volume = 0.4;
                audioRef.current.play().catch(err => {
                    console.log("Audio play blocked:", err);
                });
            } catch (e) {
                console.error("Audio error:", e);
            }
        }
    }, []);

    // Flip to next page
    const handleNext = async () => {
        if (!pdfDoc || isFlipping || rendering) return;

        const isSingle = viewMode === "single";
        const increment = isSingle ? 1 : 2;
        const targetPage = currentPage + increment;

        if (targetPage > totalPages) return;

        playFlipSound();

        if (isMobile) {
            // Slide effect for mobile viewport
            setIsFlipping(true);
            setFlipDirection("next");
            setTimeout(() => {
                setCurrentPage(targetPage);
                setIsFlipping(false);
                setFlipDirection(null);
            }, 300);
            return;
        }

        // 1. Render the FLIPPING page canvas templates in the background (while hidden)
        setRendering(true);
        if (isSingle) {
            await Promise.all([
                renderPage(currentPage, flipFrontCanvasRef.current, scale),
                renderPage(targetPage, flipBackCanvasRef.current, scale)
            ]);
        } else {
            await Promise.all([
                renderPage(currentPage + 1, flipFrontCanvasRef.current, scale),
                renderPage(targetPage, flipBackCanvasRef.current, scale)
            ]);
        }
        setRendering(false);

        // 2. Start the GPU-accelerated 3D flip animation!
        setIsFlipping(true);
        setFlipDirection("next");

        // 3. Immediately render the new static pages in the background while animation runs
        if (isSingle) {
            renderPage(targetPage, leftCanvasRef.current, scale);
        } else {
            Promise.all([
                renderPage(targetPage, leftCanvasRef.current, scale),
                renderPage(targetPage + 1, rightCanvasRef.current, scale)
            ]);
        }

        // 4. Complete transition after animation runs (1200ms)
        setTimeout(() => {
            setCurrentPage(targetPage);
            setIsFlipping(false);
            setFlipDirection(null);
        }, 1200);
    };

    // Flip to previous page
    const handlePrev = async () => {
        if (!pdfDoc || isFlipping || rendering || currentPage <= 1) return;

        const isSingle = viewMode === "single";
        const decrement = isSingle ? 1 : 2;
        const targetPage = Math.max(1, currentPage - decrement);

        playFlipSound();

        if (isMobile) {
            // Slide effect for mobile viewport
            setIsFlipping(true);
            setFlipDirection("prev");
            setTimeout(() => {
                setCurrentPage(targetPage);
                setIsFlipping(false);
                setFlipDirection(null);
            }, 300);
            return;
        }

        // 1. Render the FLIPPING page canvas templates in the background (while hidden)
        setRendering(true);
        if (isSingle) {
            await Promise.all([
                renderPage(targetPage, flipFrontCanvasRef.current, scale),
                renderPage(currentPage, flipBackCanvasRef.current, scale)
            ]);
        } else {
            await Promise.all([
                renderPage(targetPage + 1, flipFrontCanvasRef.current, scale),
                renderPage(currentPage, flipBackCanvasRef.current, scale)
            ]);
        }
        setRendering(false);

        // 2. Start the GPU-accelerated 3D flip animation!
        setIsFlipping(true);
        setFlipDirection("prev");

        // 3. Immediately render the new static pages in the background while animation runs
        if (isSingle) {
            renderPage(targetPage, leftCanvasRef.current, scale);
        } else {
            Promise.all([
                renderPage(targetPage, leftCanvasRef.current, scale),
                renderPage(targetPage + 1, rightCanvasRef.current, scale)
            ]);
        }

        // 4. Complete transition after animation runs (1200ms)
        setTimeout(() => {
            setCurrentPage(targetPage);
            setIsFlipping(false);
            setFlipDirection(null);
        }, 1200);
    };

    // Slides Navigation (Google Slides)
    const handleSlidesNext = () => {
        playFlipSound();
        setSlideIndex(prev => prev + 1);
    };

    const handleSlidesPrev = () => {
        if (slideIndex <= 1) return;
        playFlipSound();
        setSlideIndex(prev => prev - 1);
    };

    const handleFirstPage = () => {
        if (isFlipping || rendering) return;
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        if (isFlipping || rendering) return;
        const isSingle = viewMode === "single";
        const target = isSingle ? totalPages : totalPages - (totalPages % 2 === 0 ? 1 : 0);
        setCurrentPage(Math.max(1, target));
    };

    const handlePageInput = (e: React.FormEvent<HTMLInputElement>) => {
        const val = parseInt(e.currentTarget.value, 10);
        if (!isNaN(val) && val >= 1 && val <= totalPages) {
            if (viewMode === "single") {
                setCurrentPage(val);
            } else {
                const target = val % 2 === 0 ? val - 1 : val;
                setCurrentPage(target);
            }
        }
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.8));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
    const handleZoomFit = () => setScale(viewMode === "single" ? 0.7 : 0.85);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error("Fullscreen error:", err);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleDownload = () => {
        if (!report) return;
        window.open(report.file, "_blank");
    };

    const handlePrint = () => {
        if (!report) return;
        if (isSlidesMode) {
            window.open(report.file, "_blank");
        } else {
            const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(report.file)}`;
            const printWindow = window.open(proxiedUrl, "_blank");
            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.print();
                };
            }
        }
    };

    return (
        <section className="py-16 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
            <style jsx global>{`
                .book-wrap {
                    perspective: 2000px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                .book-viewport {
                    position: relative;
                    transform-style: preserve-3d;
                    transition: transform 0.4s ease;
                }
                
                /* Double Page Layout (Portrait) */
                .book-3d {
                    display: flex;
                    position: relative;
                    transform-style: preserve-3d;
                    background: #ccc;
                    border-radius: 6px;
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
                }
                
                /* Single Page Layout (Landscape) */
                .single-book-3d {
                    display: flex;
                    position: relative;
                    transform-style: preserve-3d;
                    background: #ccc;
                    border-radius: 6px;
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
                }
                
                /* Creases and Spines */
                .book-spine-crease {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 50%;
                    width: 40px;
                    transform: translateX(-50%) translateZ(2px);
                    background: linear-gradient(
                        90deg,
                        rgba(0, 0, 0, 0.12) 0%,
                        rgba(0, 0, 0, 0.2) 25%,
                        rgba(0, 0, 0, 0) 50%,
                        rgba(0, 0, 0, 0.2) 75%,
                        rgba(0, 0, 0, 0.12) 100%
                    );
                    z-index: 10;
                    pointer-events: none;
                }
                .book-spine-line {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 50%;
                    width: 2px;
                    transform: translateX(-50%) translateZ(3px);
                    background: rgba(0, 0, 0, 0.15);
                    z-index: 11;
                    pointer-events: none;
                }
                
                /* Page Sheets */
                .book-page-sheet {
                    background: white;
                    position: relative;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-bottom: 2px solid #bbb;
                    transition: all 0.3s ease;
                }
                .book-page-sheet.left-side {
                    border-top-left-radius: 6px;
                    border-bottom-left-radius: 6px;
                    transform-origin: right center;
                    border-right: 1px solid rgba(0,0,0,0.08);
                }
                .book-page-sheet.right-side {
                    border-top-right-radius: 6px;
                    border-bottom-right-radius: 6px;
                    transform-origin: left center;
                    border-left: 1px solid rgba(0,0,0,0.08);
                }
                .book-page-sheet.single-side {
                    border-radius: 6px;
                }
                
                /* Remaining pages stacks */
                .page-thickness-left {
                    position: absolute;
                    top: 6px;
                    bottom: 6px;
                    left: -6px;
                    width: 6px;
                    background: linear-gradient(90deg, #f3f4f6 0%, #d1d5db 100%);
                    border-top-left-radius: 4px;
                    border-bottom-left-radius: 4px;
                    border: 1px solid #ccc;
                    border-right: none;
                }
                .page-thickness-right {
                    position: absolute;
                    top: 6px;
                    bottom: 6px;
                    right: -6px;
                    width: 6px;
                    background: linear-gradient(270deg, #f3f4f6 0%, #d1d5db 100%);
                    border-top-right-radius: 4px;
                    border-bottom-right-radius: 4px;
                    border: 1px solid #ccc;
                    border-left: none;
                }
                
                /* Double Flipping Sheet overlay */
                .flipping-sheet {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 50%;
                    transform-style: preserve-3d;
                    z-index: 20;
                    pointer-events: none;
                    background: transparent;
                }
                .flipping-sheet.flip-next {
                    left: 50%;
                    transform-origin: left center;
                    animation: flip-next-anim 1.2s cubic-bezier(0.645, 0.045, 0.355, 1.0) forwards;
                }
                .flipping-sheet.flip-prev {
                    right: 50%;
                    transform-origin: right center;
                    animation: flip-prev-anim 1.2s cubic-bezier(0.645, 0.045, 0.355, 1.0) forwards;
                }
                @keyframes flip-next-anim {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(-180deg); }
                }
                @keyframes flip-prev-anim {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(180deg); }
                }
                
                /* Single Flipping Sheet overlay */
                .single-flipping-sheet {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    transform-style: preserve-3d;
                    z-index: 20;
                    pointer-events: none;
                    background: transparent;
                }
                .single-flipping-sheet.flip-next {
                    transform-origin: left center;
                    animation: single-flip-next-anim 1.2s cubic-bezier(0.645, 0.045, 0.355, 1.0) forwards;
                }
                .single-flipping-sheet.flip-prev {
                    transform-origin: left center;
                    animation: single-flip-prev-anim 1.2s cubic-bezier(0.645, 0.045, 0.355, 1.0) forwards;
                }
                @keyframes single-flip-next-anim {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(-180deg); }
                }
                @keyframes single-flip-prev-anim {
                    0% { transform: rotateY(-180deg); }
                    100% { transform: rotateY(0deg); }
                }
                
                /* Inner Page Faces */
                .flipping-face {
                    position: absolute;
                    inset: 0;
                    backface-visibility: hidden;
                    background: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
                    overflow: hidden;
                }
                .flipping-face.face-front {
                    z-index: 2;
                    border-top-right-radius: 6px;
                    border-bottom-right-radius: 6px;
                }
                .flipping-face.face-back {
                    transform: rotateY(180deg);
                    z-index: 1;
                    border-top-left-radius: 6px;
                    border-bottom-left-radius: 6px;
                }
                
                .single-flipping-face {
                    position: absolute;
                    inset: 0;
                    backface-visibility: hidden;
                    background: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
                    overflow: hidden;
                    border-radius: 6px;
                }
                .single-flipping-face.face-front {
                    z-index: 2;
                }
                .single-flipping-face.face-back {
                    transform: rotateY(180deg);
                    z-index: 1;
                }
                
                .page-shine {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 30;
                    opacity: 0;
                }
                .flipping-sheet.flip-next .face-front .page-shine {
                    background: linear-gradient(90deg, rgba(255,255,255,0) 60%, rgba(0,0,0,0.18) 100%);
                    animation: shine-fade-in-out 1.2s linear forwards;
                }
                .flipping-sheet.flip-next .face-back .page-shine {
                    background: linear-gradient(270deg, rgba(255,255,255,0) 60%, rgba(0,0,0,0.18) 100%);
                    animation: shine-fade-in-out-back 1.2s linear forwards;
                }
                .flipping-sheet.flip-prev .face-front .page-shine {
                    background: linear-gradient(270deg, rgba(255,255,255,0) 60%, rgba(0,0,0,0.18) 100%);
                    animation: shine-fade-in-out 1.2s linear forwards;
                }
                .flipping-sheet.flip-prev .face-back .page-shine {
                    background: linear-gradient(90deg, rgba(255,255,255,0) 60%, rgba(0,0,0,0.18) 100%);
                    animation: shine-fade-in-out-back 1.2s linear forwards;
                }
                
                .single-flipping-sheet.flip-next .face-front .page-shine {
                    background: linear-gradient(90deg, rgba(255,255,255,0) 60%, rgba(0,0,0,0.18) 100%);
                    animation: shine-fade-in-out 1.2s linear forwards;
                }
                .single-flipping-sheet.flip-next .face-back .page-shine {
                    background: linear-gradient(270deg, rgba(255,255,255,0) 60%, rgba(0,0,0,0.18) 100%);
                    animation: shine-fade-in-out-back 1.2s linear forwards;
                }
                .single-flipping-sheet.flip-prev .face-front .page-shine {
                    background: linear-gradient(270deg, rgba(255,255,255,0) 60%, rgba(0,0,0,0.18) 100%);
                    animation: shine-fade-in-out 1.2s linear forwards;
                }
                .single-flipping-sheet.flip-prev .face-back .page-shine {
                    background: linear-gradient(90deg, rgba(255,255,255,0) 60%, rgba(0,0,0,0.18) 100%);
                    animation: shine-fade-in-out-back 1.2s linear forwards;
                }

                @keyframes shine-fade-in-out {
                    0% { opacity: 0; }
                    40% { opacity: 1; }
                    50% { opacity: 0; }
                    100% { opacity: 0; }
                }
                @keyframes shine-fade-in-out-back {
                    0% { opacity: 0; }
                    50% { opacity: 0; }
                    60% { opacity: 1; }
                    100% { opacity: 0; }
                }

                /* Mobile View transitions */
                .mobile-page-container {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
                .mobile-slide-next {
                    animation: slide-next-anim 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                .mobile-slide-prev {
                    animation: slide-prev-anim 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                @keyframes slide-next-anim {
                    0% { transform: translateX(0); opacity: 1; }
                    50% { transform: translateX(-50px); opacity: 0; }
                    51% { transform: translateX(50px); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                @keyframes slide-prev-anim {
                    0% { transform: translateX(0); opacity: 1; }
                    50% { transform: translateX(50px); opacity: 0; }
                    51% { transform: translateX(-50px); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
            `}</style>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header */}
                <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fce8e6] text-[#b43b2f] text-xs font-black uppercase tracking-widest border border-red-100">
                        #Our Work
                    </div>
                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight"
                        style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
                    >
                        Report Card
                    </h2>
                    {report && (
                        <p className="text-slate-500 font-bold text-sm sm:text-base max-w-2xl mx-auto">
                            {report.title} - Published on {report.date}
                        </p>
                    )}
                </div>

                {/* Main Visual Display Wrapper */}
                <div 
                    ref={containerRef}
                    className={`relative bg-[#d8d8d8] rounded-[2.5rem] p-4 md:p-10 overflow-hidden shadow-2xl border-4 border-white ${
                        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none bg-[#c8c8c8] flex flex-col justify-between" : ""
                    }`}
                >
                    {isFullscreen && (
                        <button 
                            onClick={toggleFullscreen}
                            className="absolute top-4 right-4 z-50 bg-slate-900/60 hover:bg-slate-900 text-white p-3 rounded-full transition shadow-lg"
                        >
                            <Minimize2 className="w-5 h-5" />
                        </button>
                    )}

                    <div className="relative flex-1 flex items-center justify-center min-h-[420px] md:min-h-[540px] max-h-[80vh] py-2">
                        {loading ? (
                            <div className="flex flex-col items-center gap-4 bg-white/85 backdrop-blur-md p-8 rounded-3xl shadow-xl">
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                <span className="text-sm font-black uppercase tracking-widest text-slate-600">Loading Presentation...</span>
                            </div>
                        ) : errorMsg ? (
                            <div className="bg-white/80 p-8 rounded-3xl border border-red-100 shadow-xl max-w-md text-center">
                                <p className="text-red-500 font-bold mb-4">{errorMsg}</p>
                                <a 
                                    href={report?.file} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-600 transition"
                                >
                                    Open Presentation URL
                                </a>
                            </div>
                        ) : isSlidesMode && slidesEmbedUrl ? (
                            /* Google Slides Mode */
                            <div className="w-full flex justify-center items-center relative select-none">
                                {/* Large Centered Slide Navigation Buttons */}
                                <button
                                    onClick={handleSlidesPrev}
                                    disabled={slideIndex <= 1}
                                    className="absolute left-0 sm:left-4 z-40 bg-white/85 hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none p-4 sm:p-6 rounded-full shadow-2xl transition duration-300 text-slate-800 border border-slate-100"
                                    aria-label="Previous Slide"
                                >
                                    <ChevronLeft className="w-8 h-8 stroke-[3]" />
                                </button>

                                <button
                                    onClick={handleSlidesNext}
                                    className="absolute right-0 sm:right-4 z-40 bg-white/85 hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none p-4 sm:p-6 rounded-full shadow-2xl transition duration-300 text-slate-800 border border-slate-100"
                                    aria-label="Next Slide"
                                >
                                    <ChevronRight className="w-8 h-8 stroke-[3]" />
                                </button>

                                {/* Slides Iframe Container with Transparent Click Overlay */}
                                <div className="relative w-full h-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-white bg-black">
                                    {/* Transparent Click Overlay */}
                                    <div 
                                        className="absolute inset-0 z-30 cursor-pointer"
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const clickX = e.clientX - rect.left;
                                            const width = rect.width;
                                            // Left 30% goes back, right 70% goes next
                                            if (clickX < width * 0.3) {
                                                handleSlidesPrev();
                                            } else {
                                                handleSlidesNext();
                                            }
                                        }}
                                    />
                                    <iframe 
                                        src={`${slidesEmbedUrl}#slide=id.p${slideIndex}`} 
                                        frameBorder="0" 
                                        width="100%" 
                                        height="100%" 
                                        allowFullScreen={true}
                                        className="w-full h-full min-h-[380px] md:min-h-[500px]"
                                    />
                                </div>
                            </div>
                        ) : (
                            /* PDF Presentation mode: 3D flip-book layout on desktop, sliding deck on mobile */
                            <div className="w-full flex justify-center items-center relative select-none">
                                {/* Large, Centered Navigation Controllers */}
                                <button
                                    onClick={handlePrev}
                                    disabled={currentPage <= 1 || isFlipping || rendering}
                                    className="absolute left-0 sm:left-4 z-40 bg-white/85 hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none p-4 sm:p-6 rounded-full shadow-2xl transition duration-300 text-slate-800 border border-slate-100"
                                    aria-label="Previous Page"
                                >
                                    <ChevronLeft className="w-8 h-8 stroke-[3]" />
                                </button>

                                <button
                                    onClick={handleNext}
                                    disabled={currentPage + (viewMode === "single" ? 0 : 1) >= totalPages || isFlipping || rendering}
                                    className="absolute right-0 sm:right-4 z-40 bg-white/85 hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none p-4 sm:p-6 rounded-full shadow-2xl transition duration-300 text-slate-800 border border-slate-100"
                                    aria-label="Next Page"
                                >
                                    <ChevronRight className="w-8 h-8 stroke-[3]" />
                                </button>

                                {/* 3D Book & Sheet Viewports */}
                                <div 
                                    className="book-viewport"
                                    style={{
                                        transform: `scale(${scale})`,
                                    }}
                                >
                                    {viewMode === "single" ? (
                                        isMobile ? (
                                            /* Mobile Viewport Slide carousel fallback */
                                            <div className={`mobile-page-container ${
                                                isFlipping && flipDirection === "next" ? "mobile-slide-next" : ""
                                            } ${
                                                isFlipping && flipDirection === "prev" ? "mobile-slide-prev" : ""
                                            }`}>
                                                <div className="book-page-sheet rounded-xl shadow-xl overflow-hidden relative">
                                                    <canvas ref={leftCanvasRef} className="shadow-sm" />
                                                </div>
                                            </div>
                                        ) : (
                                            /* Desktop Viewport Landscape Spread: brochure 3D flip */
                                            <div className="single-book-3d">
                                                <div className="book-page-sheet single-side">
                                                    <canvas ref={leftCanvasRef} />
                                                    {pdfAspectRatio > 1.2 && (
                                                        <>
                                                            <div className="book-spine-crease" style={{ left: "50%", width: "30px" }} />
                                                            <div className="book-spine-line" style={{ left: "50%" }} />
                                                        </>
                                                    )}
                                                </div>

                                                {/* Single sheet turning transition - Always mounted, hidden when not flipping */}
                                                <div className={`single-flipping-sheet ${
                                                    isFlipping ? (flipDirection === "next" ? "flip-next" : "flip-prev") : "hidden"
                                                }`}>
                                                    <div className="single-flipping-face face-front">
                                                        <canvas ref={flipFrontCanvasRef} />
                                                        {pdfAspectRatio > 1.2 && (
                                                            <>
                                                                <div className="book-spine-crease" style={{ left: "50%", width: "30px" }} />
                                                                <div className="book-spine-line" style={{ left: "50%" }} />
                                                            </>
                                                        )}
                                                        <div className="page-shine" />
                                                    </div>
                                                    <div className="single-flipping-face face-back">
                                                        <canvas ref={flipBackCanvasRef} />
                                                        {pdfAspectRatio > 1.2 && (
                                                            <>
                                                                <div className="book-spine-crease" style={{ left: "50%", width: "30px" }} />
                                                                <div className="book-spine-line" style={{ left: "50%" }} />
                                                            </>
                                                        )}
                                                        <div className="page-shine" />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        /* Portrait Pages: side-by-side sheets fold flip */
                                        <div className="book-3d">
                                            {/* Stack visual sheets indicators */}
                                            {currentPage > 1 && <div className="page-thickness-left" />}
                                            
                                            <div className="book-page-sheet left-side">
                                                <canvas ref={leftCanvasRef} />
                                            </div>

                                            <div className="book-page-sheet right-side">
                                                <canvas ref={rightCanvasRef} />
                                            </div>

                                            {currentPage + 1 < totalPages && <div className="page-thickness-right" />}

                                            {/* Page Folding Anim Overlay - Always mounted, hidden when not flipping */}
                                            <div className={`flipping-sheet ${
                                                isFlipping ? (flipDirection === "next" ? "flip-next" : "flip-prev") : "hidden"
                                            }`}>
                                                <div className="flipping-face face-front">
                                                    <canvas ref={flipFrontCanvasRef} />
                                                    <div className="page-shine" />
                                                </div>
                                                <div className="flipping-face face-back">
                                                    <canvas ref={flipBackCanvasRef} />
                                                    <div className="page-shine" />
                                                </div>
                                            </div>

                                            {/* Central spine overlay crease */}
                                            <div className="book-spine-crease" />
                                            <div className="book-spine-line" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls Toolbar */}
                    {!loading && !errorMsg && (
                        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md px-6 py-4 rounded-3xl border border-white shadow-xl transition-all select-none">
                            {/* Left Side: Zoom Controls or Slides Indicator */}
                            <div className="flex items-center gap-3">
                                {isSlidesMode ? (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider">
                                        <Presentation className="w-4 h-4 text-primary" /> Google Slides Embedded
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleZoomOut}
                                            className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition"
                                            title="Zoom Out"
                                            disabled={scale <= 0.5}
                                        >
                                            <ZoomOut className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleZoomIn}
                                            className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition"
                                            title="Zoom In"
                                            disabled={scale >= 1.8}
                                        >
                                            <ZoomIn className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleZoomFit}
                                            className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition text-xs font-black uppercase tracking-wider"
                                            title="Fit Screen"
                                        >
                                            Fit
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Center: Pagination Controls */}
                            <div className="flex items-center gap-2">
                                {isSlidesMode ? (
                                    /* Google Slides custom navigation buttons in toolbar */
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleSlidesPrev}
                                            disabled={slideIndex <= 1}
                                            className="p-2 text-slate-500 hover:text-primary disabled:opacity-30 rounded-lg transition"
                                            title="Previous Slide"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>

                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-xl">
                                            <span className="text-slate-800 text-sm font-black">Slide {slideIndex}</span>
                                        </div>

                                        <button
                                            onClick={handleSlidesNext}
                                            className="p-2 text-slate-500 hover:text-primary disabled:opacity-30 rounded-lg transition"
                                            title="Next Slide"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    /* PDF pagination controls */
                                    <>
                                        <button
                                            onClick={handleFirstPage}
                                            disabled={currentPage <= 1 || isFlipping || rendering}
                                            className="p-2 text-slate-500 hover:text-primary disabled:opacity-30 rounded-lg transition"
                                            title="First Page"
                                        >
                                            <ChevronsLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handlePrev}
                                            disabled={currentPage <= 1 || isFlipping || rendering}
                                            className="p-2 text-slate-500 hover:text-primary disabled:opacity-30 rounded-lg transition"
                                            title="Previous Page"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>

                                        {/* Page Input Indicator */}
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-xl">
                                            {rendering && <Loader2 className="w-3.5 h-3.5 text-primary animate-spin mr-1" />}
                                            <input
                                                type="number"
                                                min={1}
                                                max={totalPages}
                                                value={viewMode === "single" ? currentPage : Math.min(currentPage + 1, totalPages)}
                                                onChange={handlePageInput}
                                                disabled={isFlipping || rendering}
                                                className="w-10 bg-transparent text-center text-sm font-black text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <span className="text-slate-400 font-bold text-xs">/</span>
                                            <span className="text-slate-500 text-sm font-bold pr-1">{totalPages}</span>
                                        </div>

                                        <button
                                            onClick={handleNext}
                                            disabled={currentPage + (viewMode === "single" ? 0 : 1) >= totalPages || isFlipping || rendering}
                                            className="p-2 text-slate-500 hover:text-primary disabled:opacity-30 rounded-lg transition"
                                            title="Next Page"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleLastPage}
                                            disabled={currentPage + (viewMode === "single" ? 0 : 1) >= totalPages || isFlipping || rendering}
                                            className="p-2 text-slate-500 hover:text-primary disabled:opacity-30 rounded-lg transition"
                                            title="Last Page"
                                        >
                                            <ChevronsRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Right Side: Action Utilities */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleDownload}
                                    className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition"
                                    title="Open / Download Source Link"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition"
                                    title={isSlidesMode ? "Open in Google Slides" : "Print Report"}
                                >
                                    {isSlidesMode ? <BookOpen className="w-5 h-5" /> : <Printer className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={toggleFullscreen}
                                    className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition"
                                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
                                >
                                    <Maximize2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <audio ref={audioRef} src="/page-flip.mp3" preload="auto" className="hidden" />
        </section>
    );
}
