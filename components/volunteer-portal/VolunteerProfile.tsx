import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';

interface VolunteerData {
    name: string;
    email: string;
    phone: string;
    address: string;
    membershipCode: string;
    profileImage?: string;
}

export default function VolunteerProfile() {
    const [userData, setUserData] = useState<VolunteerData | null>(null);
    const [showCode, setShowCode] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Image Cropping States
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isSavingImage, setIsSavingImage] = useState(false);

    // ID Card States
    const [showIDCardModal, setShowIDCardModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);

    const handleCopyCode = () => {
        if (userData?.membershipCode) {
            navigator.clipboard.writeText(userData.membershipCode);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const storedData = localStorage.getItem('volunteer_data');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                const userId = parsed.id || parsed._id;

                if (userId) {
                    try {
                        const response = await fetch(`/api/user/profile/${userId}`);
                        if (response.ok) {
                            const dbData = await response.json();
                            // Map DB fields to component state
                            const updatedData = {
                                name: `${dbData.firstName} ${dbData.lastName}`,
                                email: dbData.email,
                                phone: dbData.phone,
                                address: dbData.address || parsed.address || "Address not provided",
                                membershipCode: dbData.membershipCode,
                                profileImage: dbData.profilePic || parsed.profileImage || "/logo.jpg"
                            };
                            setUserData(updatedData);

                            // Sync back to localStorage to update other UI components (header, sidebar)
                            localStorage.setItem('volunteer_data', JSON.stringify({
                                ...parsed,
                                ...updatedData,
                            }));
                            return;
                        }
                    } catch (error) {
                        console.error("Error fetching volunteer profile:", error);
                    }
                }

                // Fallback to localStorage if fetch fails or ID is missing
                if (!parsed.email && parsed.gmail) parsed.email = parsed.gmail;
                if (!parsed.address) parsed.address = "123 Volunteer Way, Heart City, 56789";
                setUserData(parsed);
            } else {
                // Fallback for demo/unauthenticated view
                setUserData({
                    name: "John Doe",
                    email: "john.doe@gmail.com",
                    phone: "+91 9876543210",
                    address: "123 Volunteer Way, Heart City, 56789",
                    membershipCode: "VO-2024-001",
                    profileImage: "/logo.jpg"
                });
            }
        };

        fetchUserData();
    }, []);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result as string));
            reader.readAsDataURL(file);
        }
    };

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new window.Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return '';

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return canvas.toDataURL('image/jpeg');
    };

    const handleSaveCrop = async () => {
        if (imageSrc && croppedAreaPixels) {
            setIsSavingImage(true);
            try {
                const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
                const updatedData = { ...userData!, profileImage: croppedImage };

                const storedData = localStorage.getItem('volunteer_data');
                if (storedData) {
                    const parsed = JSON.parse(storedData);
                    const userId = parsed.id || parsed._id;
                    if (userId) {
                        try {
                            await fetch(`/api/user/profile/${userId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ profilePic: croppedImage })
                            });
                        } catch (error) {
                            console.error("Error saving cropped image:", error);
                        }
                    }
                }

                setUserData(updatedData);

                // Merge into existing volunteer_data to preserve session details like 'role'
                let finalData = { ...updatedData };
                if (storedData) {
                    try {
                        const parsed = JSON.parse(storedData);
                        finalData = {
                            ...parsed,
                            ...updatedData
                        };
                    } catch (err) {
                        console.error("Error merging volunteer_data on crop:", err);
                    }
                }
                localStorage.setItem('volunteer_data', JSON.stringify(finalData));
                setImageSrc(null);
            } catch (error) {
                console.error("Error during crop save:", error);
            } finally {
                setIsSavingImage(false);
            }
        }
    };

    const handleSaveProfile = async () => {
        if (userData) {
            const storedData = localStorage.getItem('volunteer_data');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                const userId = parsed.id || parsed._id;

                if (userId) {
                    try {
                        const [firstName, ...lastNames] = userData.name.split(' ');
                        const lastName = lastNames.join(' ');

                        const response = await fetch(`/api/user/profile/${userId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                firstName,
                                lastName,
                                phone: userData.phone,
                                address: userData.address
                            })
                        });

                        if (!response.ok) {
                            throw new Error("Failed to save to database");
                        }
                    } catch (error) {
                        console.error("Error saving profile:", error);
                        alert("Could not save changes to database. Local data updated.");
                    }
                }
            }

            // Merge into existing volunteer_data to preserve session details like 'role'
            let finalData = { ...userData };
            if (storedData) {
                try {
                    const parsed = JSON.parse(storedData);
                    finalData = {
                        ...parsed,
                        ...userData
                    };
                } catch (err) {
                    console.error("Error merging volunteer_data on profile save:", err);
                }
            }

            localStorage.setItem('volunteer_data', JSON.stringify(finalData));
            setIsEditing(false);
            window.location.reload();
        }
    };

    // Check if required profile details are missing/default
    const isProfileIncomplete = () => {
        if (!userData) return true;
        const isDefaultImg = !userData.profileImage || userData.profileImage === '/logo.jpg';
        const isDefaultAddress = !userData.address || 
                                userData.address === "Address not provided" || 
                                userData.address === "123 Volunteer Way, Heart City, 56789";
        const isDefaultPhone = !userData.phone || 
                              userData.phone === "+91 9876543210" || 
                              userData.phone.trim() === "";
        return isDefaultImg || isDefaultAddress || isDefaultPhone;
    };

    const handleViewIDCard = () => {
        if (isProfileIncomplete()) {
            setShowWarningModal(true);
        } else {
            setShowIDCardModal(true);
        }
    };

    const handlePrintCard = () => {
        if (!userData) return;

        // 1. Remove any existing print iframe
        const existingIframe = document.getElementById('print-card-iframe');
        if (existingIframe) {
            existingIframe.remove();
        }

        // 2. Create a new hidden iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'print-card-iframe';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) return;

        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const logoUrl = origin + '/logo.jpg';
        const signatureUrl = origin + '/society-signature.jpg';
        const profileImgUrl = userData.profileImage || logoUrl;

        // 3. Write HTML content containing ONLY the ID card
        doc.write(`
            <html>
                <head>
                    <title>Volunteer ID Card</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background: #ffffff;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            box-sizing: border-box;
                            font-family: 'Outfit', 'Inter', sans-serif;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .id-card {
                            width: 480px;
                            height: 302px;
                            background: #ffffff;
                            border: 1px solid #cbd5e1;
                            border-radius: 16px;
                            position: relative;
                            padding: 14px;
                            box-sizing: border-box;
                            overflow: hidden;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                        }
                        .top-yellow {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 6px;
                            background: #f59e0b;
                        }
                        .bottom-wave {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            height: 45px;
                            z-index: 1;
                        }
                        .header {
                            display: flex;
                            align-items: center;
                            border-bottom: 2px double #1e3a8a;
                            padding-bottom: 6px;
                            margin-bottom: 6px;
                            gap: 12px;
                        }
                        .logo-img {
                            width: 44px;
                            height: 44px;
                            object-fit: contain;
                            border-radius: 50%;
                            border: 2px solid #fbbf24;
                        }
                        .header-text {
                            flex: 1;
                            text-align: center;
                            padding-right: 16px;
                        }
                        .society-name {
                            margin: 0;
                            font-size: 11px;
                            font-weight: 900;
                            color: #1e3a8a;
                            text-transform: uppercase;
                            letter-spacing: -0.2px;
                            line-height: 1.1;
                        }
                        .tagline {
                            margin: 2px 0 0 0;
                            font-size: 7px;
                            font-weight: 800;
                            color: #dc2626;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        .banner-container {
                            display: flex;
                            justify-content: center;
                            margin-bottom: 6px;
                        }
                        .banner {
                            background: #1e1b4b;
                            color: #ffffff;
                            font-size: 9px;
                            font-weight: 900;
                            padding: 2px 16px;
                            border-radius: 12px;
                            letter-spacing: 2px;
                            text-transform: uppercase;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            border: 1px solid #312e81;
                        }
                        .banner-arrow {
                            color: #fbbf24;
                        }
                        .content {
                            display: flex;
                            justify-content: space-between;
                            height: 175px;
                            z-index: 2;
                            gap: 12px;
                        }
                        .details {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            font-size: 9px;
                            padding-bottom: 16px;
                        }
                        .detail-row {
                            display: flex;
                            align-items: center;
                            border-bottom: 1px dashed #e2e8f0;
                            padding-bottom: 2px;
                            gap: 8px;
                        }
                        .icon-container {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #1e3a8a;
                        }
                        .icon-svg {
                            width: 14px;
                            height: 14px;
                        }
                        .label {
                            font-weight: 800;
                            color: #9ca3af;
                            width: 44px;
                            text-transform: uppercase;
                            font-size: 8px;
                            letter-spacing: 0.5px;
                        }
                        .colon {
                            color: #111827;
                            margin-right: 2px;
                        }
                        .value {
                            font-weight: 800;
                            color: #111827;
                            text-transform: uppercase;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            max-width: 180px;
                        }
                        .address-val {
                            white-space: normal;
                            line-height: 1.1;
                        }
                        .right-side {
                            width: 110px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: space-between;
                            padding-bottom: 16px;
                        }
                        .photo-frame {
                            width: 64px;
                            height: 64px;
                            border: 2px solid #1e3a8a;
                            outline: 2px solid #fbbf24;
                            border-radius: 6px;
                            overflow: hidden;
                        }
                        .photo-img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                        .barcode-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            margin: 4px 0;
                            width: 100%;
                        }
                        .barcode-stripes {
                            display: flex;
                            align-items: end;
                            gap: 1px;
                            height: 16px;
                            background: white;
                            width: 90%;
                        }
                        .barcode-stripe {
                            height: 100%;
                            background: black;
                        }
                        .barcode-stripe-short {
                            height: 80%;
                            background: black;
                        }
                        .barcode-text {
                            font-size: 6.5px;
                            font-family: monospace;
                            font-weight: bold;
                            color: #4b5563;
                            margin: 2px 0 0 0;
                            letter-spacing: 1px;
                        }
                        .sig-section {
                            text-align: center;
                            width: 100%;
                        }
                        .sig-img {
                            height: 16px;
                            object-fit: contain;
                            mix-blend-mode: multiply;
                        }
                        .sig-line {
                            border-top: 1px dashed #cbd5e1;
                            margin: 2px 0;
                        }
                        .sig-title {
                            font-size: 5.5px;
                            font-weight: 900;
                            color: #111827;
                            margin: 0;
                            text-transform: uppercase;
                        }
                        .sig-subtitle {
                            font-size: 4px;
                            color: #9ca3af;
                            margin: 0;
                        }
                        .badge-container {
                            position: absolute;
                            bottom: 4px;
                            left: 12px;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            color: #ffffff;
                            z-index: 2;
                        }
                        .badge-icon {
                            font-size: 10px;
                        }
                        .badge-text {
                            font-size: 4.5px;
                            font-weight: 900;
                            line-height: 1.2;
                            letter-spacing: 0.5px;
                            text-align: left;
                        }
                        @media print {
                            body {
                                padding: 0;
                                margin: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                min-height: 100vh;
                                background: #ffffff;
                            }
                            .id-card {
                                border: none;
                                box-shadow: none;
                                page-break-inside: avoid;
                            }
                            @page {
                                size: landscape;
                                margin: 0;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="id-card">
                        <div class="top-yellow"></div>
                        
                        <div class="header">
                            <img src="${logoUrl}" alt="Logo" class="logo-img" />
                            <div class="header-text">
                                <h2 class="society-name">BURDWAN SADAR PYARA NUTRITION WELFARE SOCIETY</h2>
                                <p class="tagline">★  A Way To Healthy Life  ★</p>
                            </div>
                        </div>

                        <div class="banner-container">
                            <div class="banner">
                                <span class="banner-arrow">✦</span>
                                VOLUNTEER
                                <span class="banner-arrow">✦</span>
                            </div>
                        </div>

                        <div class="content">
                            <div class="details">
                                <div class="detail-row">
                                    <div class="icon-container">
                                        <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <span class="label">Name</span>
                                    <span class="colon">:</span>
                                    <span class="value">${userData.name.toUpperCase()}</span>
                                </div>
                                <div class="detail-row">
                                    <div class="icon-container">
                                        <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <span class="label">Address</span>
                                    <span class="colon">:</span>
                                    <span class="value address-val">${userData.address}</span>
                                </div>
                                <div class="detail-row">
                                    <div class="icon-container">
                                        <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <span class="label">Phone</span>
                                    <span class="colon">:</span>
                                    <span class="value">${userData.phone}</span>
                                </div>
                                <div class="detail-row">
                                    <div class="icon-container">
                                        <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <span class="label">Gmail</span>
                                    <span class="colon">:</span>
                                    <span class="value">${userData.email}</span>
                                </div>
                                <div class="detail-row">
                                    <div class="icon-container">
                                        <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <span class="label">Validity</span>
                                    <span class="colon">:</span>
                                    <span class="value">31 DEC ${new Date().getFullYear()}</span>
                                </div>
                            </div>

                            <div class="right-side">
                                <div class="photo-frame">
                                    <img src="${profileImgUrl}" alt="Profile" class="photo-img" />
                                </div>

                                <div class="barcode-container">
                                    <div class="barcode-stripes">
                                        <div class="barcode-stripe" style="width: 1px; height: 100%;"></div>
                                        <div class="barcode-stripe" style="width: 2px; height: 100%;"></div>
                                        <div class="barcode-stripe" style="width: 1px; height: 100%;"></div>
                                        <div class="barcode-stripe-short" style="width: 0.5px; height: 80%;"></div>
                                        <div class="barcode-stripe" style="width: 3px; height: 100%;"></div>
                                        <div class="barcode-stripe" style="width: 1px; height: 100%;"></div>
                                        <div class="barcode-stripe-short" style="width: 0.5px; height: 80%;"></div>
                                        <div class="barcode-stripe" style="width: 3px; height: 100%;"></div>
                                        <div class="barcode-stripe" style="width: 2px; height: 100%;"></div>
                                        <div class="barcode-stripe-short" style="width: 0.5px; height: 80%;"></div>
                                        <div class="barcode-stripe" style="width: 2px; height: 100%;"></div>
                                        <div class="barcode-stripe" style="width: 1px; height: 100%;"></div>
                                        <div class="barcode-stripe" style="width: 3px; height: 100%;"></div>
                                        <div class="barcode-stripe" style="width: 1px; height: 100%;"></div>
                                    </div>
                                    <p class="barcode-text">${userData.membershipCode}</p>
                                </div>

                                <div class="sig-section">
                                    <img src="${signatureUrl}" alt="Signature" class="sig-img" />
                                    <div class="sig-line"></div>
                                    <p class="sig-title">Authorised Signatory</p>
                                    <p class="sig-subtitle">Burdwan Sadar Pyara Society</p>
                                </div>
                            </div>
                        </div>

                        <div class="badge-container">
                            <span class="badge-icon">🌱</span>
                            <div class="badge-text">
                                <div>GOOD NUTRITION</div>
                                <div>BETTER HEALTH</div>
                                <div>STRONGER FUTURE</div>
                            </div>
                        </div>

                        <svg class="bottom-wave" viewBox="0 0 500 60" preserveAspectRatio="none">
                            <path d="M0,35 Q120,5 250,45 T500,30 L500,60 L0,60 Z" fill="#1e3a8a" />
                            <path d="M0,33 Q120,3 250,43 T500,28" fill="none" stroke="#d4af37" stroke-width="3" />
                        </svg>
                    </div>
                </body>
            </html>
        `);
        doc.close();

        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
            }, 600);
        };

        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
        }, 800);
    };

    const handleDownloadCard = async () => {
        if (!userData) return;
        setIsDownloading(true);
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1000;
            canvas.height = 630;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not get canvas context");

            const loadImage = (src: string): Promise<HTMLImageElement> => {
                return new Promise((resolve, reject) => {
                    const img = new window.Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => resolve(img);
                    img.onerror = (e) => reject(e);
                    img.src = src;
                });
            };

            const [logoImg, userImg, sigImg] = await Promise.all([
                loadImage('/logo.jpg').catch(() => null),
                loadImage(userData.profileImage || '/logo.jpg').catch(() => null),
                loadImage('/society-signature.jpg').catch(() => null)
            ]);

            // Background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 1000, 630);

            // Top yellow line
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(0, 0, 1000, 12);

            // Bottom wave
            ctx.fillStyle = '#1e3a8a';
            ctx.beginPath();
            ctx.moveTo(0, 520);
            ctx.bezierCurveTo(200, 440, 400, 620, 650, 540);
            ctx.bezierCurveTo(800, 490, 900, 580, 1000, 520);
            ctx.lineTo(1000, 630);
            ctx.lineTo(0, 630);
            ctx.closePath();
            ctx.fill();

            // Gold accent line
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(0, 514);
            ctx.bezierCurveTo(200, 434, 400, 614, 650, 534);
            ctx.bezierCurveTo(800, 484, 900, 574, 1000, 514);
            ctx.stroke();

            // Logo
            if (logoImg) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(100, 105, 45, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(logoImg, 55, 60, 90, 90);
                ctx.restore();

                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(100, 105, 45, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Header Text
            ctx.fillStyle = '#1e3a8a';
            ctx.font = '900 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('BURDWAN SADAR PYARA', 560, 80);
            ctx.fillText('NUTRITION WELFARE SOCIETY', 560, 115);

            ctx.fillStyle = '#dc2626';
            ctx.font = '800 16px sans-serif';
            ctx.fillText('★  A WAY TO HEALTHY LIFE  ★', 560, 150);

            // Separators
            ctx.strokeStyle = '#1e3a8a';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(50, 175);
            ctx.lineTo(950, 175);
            ctx.stroke();

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(50, 180);
            ctx.lineTo(950, 180);
            ctx.stroke();

            // Volunteer Banner
            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(360, 200, 280, 45);

            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.moveTo(330, 222.5);
            ctx.lineTo(360, 200);
            ctx.lineTo(360, 245);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(670, 222.5);
            ctx.lineTo(640, 200);
            ctx.lineTo(640, 245);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = '900 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('VOLUNTEER', 500, 222.5);

            // Left Side Details
            const fields = [
                { label: 'Name', value: userData.name.toUpperCase() },
                { label: 'Address', value: userData.address },
                { label: 'Phone', value: userData.phone },
                { label: 'Gmail', value: userData.email },
                { label: 'Validity', value: `31 DEC ${new Date().getFullYear()}` }
            ];

            let startY = 285;
            const gap = 45;

            fields.forEach((field) => {
                ctx.fillStyle = '#1e3a8a';
                ctx.beginPath();
                ctx.arc(80, startY, 14, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.font = '14px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                let icon = '•';
                if (field.label === 'Name') icon = '👤';
                else if (field.label === 'Address') icon = '📍';
                else if (field.label === 'Validity') icon = '📅';
                else if (field.label === 'Phone') icon = '📞';
                else if (field.label === 'Gmail') icon = '✉️';

                ctx.fillText(icon, 80, startY);

                ctx.fillStyle = '#9ca3af';
                ctx.font = 'bold 14px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(field.label.toUpperCase(), 110, startY);

                ctx.fillStyle = '#111827';
                ctx.font = 'bold 15px sans-serif';
                ctx.fillText(':', 195, startY);

                ctx.fillStyle = '#111827';
                ctx.font = '800 15px sans-serif';

                let text = field.value;
                if (field.label === 'Address' && text.length > 40) {
                    const firstLine = text.substring(0, 38) + '-';
                    const secondLine = text.substring(38);
                    ctx.fillText(firstLine, 215, startY - 8);
                    ctx.font = '800 13px sans-serif';
                    ctx.fillText(secondLine, 215, startY + 10);
                } else {
                    ctx.fillText(text, 215, startY);
                }

                ctx.strokeStyle = '#e5e7eb';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(65, startY + 22);
                ctx.lineTo(680, startY + 22);
                ctx.stroke();
                ctx.setLineDash([]);

                startY += gap;
            });

            // Photo frame
            const frameX = 750;
            const frameY = 200;
            const frameWidth = 190;
            const frameHeight = 180;

            ctx.fillStyle = '#1e3a8a';
            ctx.fillRect(frameX - 6, frameY - 6, frameWidth + 12, frameHeight + 12);

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 5;
            ctx.strokeRect(frameX - 3, frameY - 3, frameWidth + 6, frameHeight + 6);

            if (userImg) {
                ctx.drawImage(userImg, frameX, frameY, frameWidth, frameHeight);
            } else {
                ctx.fillStyle = '#9ca3af';
                ctx.fillRect(frameX, frameY, frameWidth, frameHeight);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('NO PHOTO', frameX + frameWidth / 2, frameY + frameHeight / 2);
            }

            // Draw Barcode on Canvas (below photo frame, above signature)
            const barX = 755;
            const barY = 395;
            const barHeight = 25;
            const barWidths = [2, 3, 2, 1, 4, 2, 1, 4, 3, 1, 3, 2, 4, 2, 3, 1, 2];
            let currentBarX = barX;
            ctx.fillStyle = '#000000';
            barWidths.forEach((w, idx) => {
                if (idx % 2 === 0) {
                    ctx.fillRect(currentBarX, barY, w * 1.5, barHeight);
                }
                currentBarX += w * 1.5 + 1.5;
            });

            ctx.fillStyle = '#4b5563';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(userData.membershipCode, 845, barY + 38);

            // Signature
            const sigY = 455;
            if (sigImg) {
                ctx.drawImage(sigImg, 755, sigY, 180, 42);
            }

            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(740, sigY + 46);
            ctx.lineTo(950, sigY + 46);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#111827';
            ctx.font = '900 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('AUTHORISED SIGNATORY', 845, sigY + 56);

            ctx.fillStyle = '#9ca3af';
            ctx.font = 'bold 8.5px sans-serif';
            ctx.fillText('Burdwan Sadar Pyara Society', 845, sigY + 66);

            // Badge text on wave
            ctx.fillStyle = '#ffffff';
            ctx.font = '22px sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('🌱', 45, 580);

            ctx.fillStyle = '#ffffff';
            ctx.font = '900 10px sans-serif';
            ctx.fillText('GOOD NUTRITION', 80, 565);
            ctx.fillText('BETTER HEALTH', 80, 580);
            ctx.fillText('STRONGER FUTURE', 80, 595);

            const dataUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `Volunteer_ID_Card_${userData.name.replace(/\s+/g, '_')}.png`;
            downloadLink.href = dataUrl;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

        } catch (error) {
            console.error("Error downloading card:", error);
            alert("Could not generate high-res ID card. Printing option is still available!");
        } finally {
            setIsDownloading(false);
        }
    };

    if (!userData) return <div className="animate-pulse h-64 bg-white/20 rounded-3xl"></div>;

    return (
        <div className="bg-white/50 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group transition-all duration-500 hover:shadow-[0_20px_60px_rgba(219,39,119,0.08)]">
            {/* Crop Overlay */}
            {imageSrc && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-4">
                    <div className="relative w-full max-w-xl aspect-square bg-white rounded-[2rem] overflow-hidden shadow-2xl mb-6">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="flex gap-4 w-full max-w-xl">
                        <button
                            onClick={() => setImageSrc(null)}
                            disabled={isSavingImage}
                            className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveCrop}
                            disabled={isSavingImage}
                            className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:opacity-75 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-pink-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isSavingImage ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Crop & Save'
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Decorative Background Glows */}
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-pink-500/10 rounded-full blur-[80px] group-hover:bg-pink-500/15 transition-all duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-purple-500/5 rounded-full blur-[80px] group-hover:bg-purple-500/10 transition-all duration-700"></div>

            <div className="flex flex-col md:flex-row items-start gap-8 sm:gap-10 relative z-10">
                {/* Profile Image Section */}
                <div className="relative group/image shrink-0 mx-auto md:mx-0">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[2rem] overflow-hidden border-[6px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] relative transition-all duration-500 group-hover/image:scale-[1.03] group-hover/image:shadow-[0_20px_40px_rgba(219,39,119,0.15)] ring-1 ring-black/5">
                        <Image
                            src={userData.profileImage || '/logo.jpg'}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                    {isEditing && (
                        <label className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-pink-600 to-rose-600 text-white p-3.5 rounded-2xl cursor-pointer shadow-lg hover:from-pink-700 hover:to-rose-700 transition-all transform hover:scale-110 active:scale-95 animate-bounce">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    )}
                </div>

                {/* Details Section */}
                <div className="flex-1 w-full space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={userData.name}
                                    onChange={(e) => setUserData(prev => prev ? { ...prev, name: e.target.value } : null)}
                                    className="text-2xl sm:text-3xl font-black text-gray-950 leading-tight bg-white/70 border-2 border-pink-500/20 focus:border-pink-500 rounded-2xl px-4 py-2 focus:outline-none transition-all w-full shadow-inner"
                                />
                            ) : (
                                <h2 className="text-2xl sm:text-3xl font-black text-gray-950 leading-tight truncate tracking-tight">{userData.name}</h2>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <p className="text-pink-600 font-extrabold tracking-widest text-xs uppercase">Active Volunteer</p>
                            </div>
                        </div>
                        <button
                            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                            className={`p-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 group/edit cursor-pointer border ${isEditing
                                ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white border-transparent shadow-pink-600/25'
                                : 'bg-white text-gray-500 hover:text-pink-600 hover:border-pink-200 border-gray-150'
                                }`}
                        >
                            {isEditing ? (
                                <span className="text-xs font-black uppercase tracking-widest px-2">Save Profile</span>
                            ) : (
                                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        {/* Email Address */}
                        <div className="bg-white/60 border border-white/80 p-5 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all duration-300 group/field hover:-translate-y-0.5">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-2.5">
                                <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 border border-pink-100 group-hover/field:bg-pink-100 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" /></svg>
                                </span>
                                Email Address
                            </p>
                            <p className="text-gray-900 font-extrabold text-[15px] truncate pl-1">{userData.email}</p>
                        </div>

                        {/* Phone Number */}
                        <div className="bg-white/60 border border-white/80 p-5 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all duration-300 group/field hover:-translate-y-0.5">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-2.5">
                                <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 border border-pink-100 group-hover/field:bg-pink-100 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2" /></svg>
                                </span>
                                Phone Number
                            </p>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={userData.phone}
                                    onChange={(e) => setUserData(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                    className="text-gray-900 font-extrabold text-[15px] w-full bg-white/70 border border-pink-500/20 rounded-xl px-2.5 py-1 focus:outline-none focus:border-pink-500 pl-1 transition-all"
                                />
                            ) : (
                                <p className="text-gray-900 font-extrabold text-[15px] pl-1">{userData.phone}</p>
                            )}
                        </div>

                        {/* Residential Address */}
                        <div className="bg-white/60 border border-white/80 p-5 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all duration-300 group/field md:col-span-2 hover:-translate-y-0.5">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-2.5">
                                <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 border border-pink-100 group-hover/field:bg-pink-100 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" /></svg>
                                </span>
                                Residential Address
                            </p>
                            {isEditing ? (
                                <textarea
                                    value={userData.address}
                                    onChange={(e) => setUserData(prev => prev ? { ...prev, address: e.target.value } : null)}
                                    className="text-gray-900 font-extrabold text-[15px] w-full bg-white/70 border border-pink-500/20 rounded-xl px-2.5 py-2.5 focus:outline-none focus:border-pink-500 h-24 resize-none pl-1 transition-all"
                                    autoFocus
                                />
                            ) : (
                                <p className="text-gray-900 font-extrabold text-[15px] leading-relaxed pl-1">{userData.address}</p>
                            )}
                        </div>
                    </div>

                    {/* Security Code Banner */}
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 p-6 rounded-[2rem] flex items-center justify-between group/code transition-all hover:shadow-inner">
                        <div className="min-w-0 pr-4">
                            <p className="text-[10px] font-black text-pink-600/70 uppercase tracking-widest mb-1.5">Membership Security Code</p>
                            <p className="text-xl sm:text-2xl font-mono font-black text-pink-600 tracking-wider truncate">
                                {showCode ? userData.membershipCode : '••••••••••••'}
                            </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={() => setShowCode(!showCode)}
                                title={showCode ? "Hide Membership Code" : "Show Membership Code"}
                                className="p-3 text-pink-600 bg-white hover:bg-pink-600 hover:text-white rounded-2xl shadow-sm transition-all border border-pink-100 cursor-pointer active:scale-95"
                            >
                                {showCode ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                            <button
                                onClick={handleCopyCode}
                                title="Copy Membership Code"
                                className="p-3 text-pink-600 bg-white hover:bg-pink-600 hover:text-white rounded-2xl shadow-sm transition-all border border-pink-100 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                            >
                                {copiedCode ? (
                                    <>
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest hidden sm:inline">Copied</span>
                                    </>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* View ID Card Action Button */}
                    {!isEditing && (
                        <div className="pt-2">
                            <button
                                onClick={handleViewIDCard}
                                className="w-full py-4.5 bg-gradient-to-r from-indigo-950 via-purple-900 to-pink-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-widest rounded-[1.8rem] transition-all shadow-xl shadow-purple-900/10 hover:shadow-purple-900/20 active:scale-[0.99] flex items-center justify-center gap-2.5 group/idbtn cursor-pointer"
                            >
                                <svg className="w-5 h-5 transition-transform group-hover/idbtn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.333 0 4 1 4 3v1H5v-1c0-2 2.667-3 4-3z" />
                                </svg>
                                View Volunteer ID Card
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ID Card Preview Modal */}
            {showIDCardModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[999] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] border border-white/40 shadow-2xl w-full max-w-lg overflow-hidden relative p-6 sm:p-8 animate-in slide-in-from-bottom-4 duration-300">
                        {/* Close button */}
                        <button
                            onClick={() => setShowIDCardModal(false)}
                            className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-pink-600 transition-colors cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center mb-6">
                            <h3 className="text-xl font-black text-gray-950 uppercase tracking-wider">Volunteer ID Card</h3>
                            <p className="text-xs text-gray-400 font-extrabold uppercase tracking-wider mt-0.5">Official Digital Membership Identity</p>
                        </div>

                        {/* ID Card Element Wrapper for Scrollability / Responsiveness */}
                        <div className="w-full overflow-x-auto flex justify-center py-2 px-1 scrollbar-none mb-6">
                            <div className="scale-95 sm:scale-100 origin-center transition-transform shrink-0">
                                <div id="volunteer-id-card" className="relative w-[480px] h-[302px] bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden p-3.5 select-none font-sans text-left shrink-0">
                                    {/* Card background styling */}
                                    <div className="absolute inset-0 bg-radial-at-t from-blue-50/10 via-transparent to-transparent pointer-events-none"></div>
                                    {/* Top Yellow border */}
                                    <div className="absolute top-0 left-0 w-full h-[6px] bg-amber-500"></div>

                                    {/* Header */}
                                    <div className="flex items-center gap-3 border-b-2 border-double border-blue-900 pb-2">
                                        <div className="w-11 h-11 relative shrink-0">
                                            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full border-2 border-amber-400 shadow-sm" />
                                        </div>
                                        <div className="flex-1 text-center pr-3">
                                            <h1 className="text-[11px] font-black text-blue-900 leading-none uppercase tracking-tight">
                                                BURDWAN SADAR PYARA NUTRITION WELFARE SOCIETY
                                            </h1>
                                            <div className="flex items-center justify-center gap-1.5 mt-1">
                                                <span className="text-amber-500 text-[7px] animate-pulse">★</span>
                                                <span className="text-red-600 font-extrabold text-[7px] tracking-widest uppercase">A Way To Healthy Life</span>
                                                <span className="text-amber-500 text-[7px] animate-pulse">★</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Banner: VOLUNTEER */}
                                    <div className="my-2 flex justify-center">
                                        <div className="bg-indigo-950 text-white font-black text-[9px] tracking-[0.25em] px-6 py-0.5 rounded-full uppercase flex items-center gap-1.5 shadow-sm border border-indigo-900">
                                            <span className="text-amber-400 text-[8px]">✦</span>
                                            VOLUNTEER
                                            <span className="text-amber-400 text-[8px]">✦</span>
                                        </div>
                                    </div>

                                    {/* Body Content */}
                                    <div className="flex justify-between gap-4 mt-2 h-[calc(100%-120px)]">
                                        {/* Left Side Details */}
                                        <div className="flex-1 flex flex-col justify-between text-[9px] space-y-1 text-gray-800 pb-4">
                                            <div className="flex items-center gap-2 border-b border-dashed border-gray-150 pb-0.5">
                                                <span className="text-blue-900 shrink-0">
                                                    {/* User Icon */}
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                </span>
                                                <span className="font-extrabold text-gray-400 w-11 uppercase text-[8px] tracking-wider">Name</span>
                                                <span className="font-black text-gray-900 truncate">: {userData.name.toUpperCase()}</span>
                                            </div>

                                            <div className="flex items-center gap-2 border-b border-dashed border-gray-150 pb-0.5">
                                                <span className="text-blue-900 shrink-0">
                                                    {/* Pin/Address Icon */}
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                </span>
                                                <span className="font-extrabold text-gray-400 w-11 uppercase text-[8px] tracking-wider">Address</span>
                                                <span className="font-black text-gray-900 truncate max-w-[190px]" title={userData.address}>: {userData.address}</span>
                                            </div>

                                            <div className="flex items-center gap-2 border-b border-dashed border-gray-150 pb-0.5">
                                                <span className="text-blue-900 shrink-0">
                                                    {/* Phone Icon */}
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                </span>
                                                <span className="font-extrabold text-gray-400 w-11 uppercase text-[8px] tracking-wider">Phone</span>
                                                <span className="font-black text-gray-900">: {userData.phone}</span>
                                            </div>

                                            <div className="flex items-center gap-2 border-b border-dashed border-gray-150 pb-0.5">
                                                <span className="text-blue-900 shrink-0">
                                                    {/* Email Icon */}
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                </span>
                                                <span className="font-extrabold text-gray-400 w-11 uppercase text-[8px] tracking-wider">Gmail</span>
                                                <span className="font-black text-gray-900 truncate max-w-[190px]" title={userData.email}>: {userData.email}</span>
                                            </div>

                                            <div className="flex items-center gap-2 border-b border-dashed border-gray-150 pb-0.5">
                                                <span className="text-blue-900 shrink-0">
                                                    {/* Calendar Icon */}
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </span>
                                                <span className="font-extrabold text-gray-400 w-11 uppercase text-[8px] tracking-wider">Validity</span>
                                                <span className="font-black text-gray-900">: 31 DEC {new Date().getFullYear()}</span>
                                            </div>
                                        </div>

                                        {/* Right Column: Photo, Barcode & Signature */}
                                        <div className="w-[110px] flex flex-col items-center justify-between shrink-0 pb-3">
                                            {/* Photo frame */}
                                            <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-blue-900 ring-2 ring-amber-400 shadow-md relative shrink-0">
                                                <img src={userData.profileImage} alt="Profile" className="object-cover w-full h-full" />
                                            </div>

                                            {/* Barcode Graphic */}
                                            <div className="flex flex-col items-center justify-center my-1 shrink-0 w-full">
                                                <div className="flex items-end gap-[1px] h-4 w-11/12 bg-white px-1">
                                                    <div className="w-[1px] h-full bg-black"></div>
                                                    <div className="w-[1.5px] h-full bg-black"></div>
                                                    <div className="w-[1px] h-full bg-black"></div>
                                                    <div className="w-[0.5px] h-3 bg-black"></div>
                                                    <div className="w-[2px] h-full bg-black"></div>
                                                    <div className="w-[1px] h-full bg-black"></div>
                                                    <div className="w-[0.5px] h-3 bg-black"></div>
                                                    <div className="w-[2px] h-full bg-black"></div>
                                                    <div className="w-[1.5px] h-full bg-black"></div>
                                                    <div className="w-[0.5px] h-3 bg-black"></div>
                                                    <div className="w-[1.5px] h-full bg-black"></div>
                                                    <div className="w-[1px] h-full bg-black"></div>
                                                    <div className="w-[2px] h-full bg-black"></div>
                                                    <div className="w-[1px] h-full bg-black"></div>
                                                </div>
                                                <p className="text-[6.5px] font-mono font-bold text-gray-600 mt-0.5 tracking-wider scale-90">{userData.membershipCode}</p>
                                            </div>

                                            {/* Signature */}
                                            <div className="text-center w-full shrink-0">
                                                <img src="/society-signature.jpg" alt="Signature" className="h-4 object-contain mx-auto mix-blend-multiply" />
                                                <div className="w-full border-t border-dashed border-gray-200 my-0.5"></div>
                                                <p className="text-[5.5px] font-black text-gray-700 uppercase tracking-tighter leading-none">Authorised Signatory</p>
                                                <p className="text-[4px] text-gray-400 font-bold leading-none">Burdwan Sadar Pyara Society</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Left Badge on Wave */}
                                    <div className="absolute bottom-1 left-3 flex items-center gap-1.5 text-white z-10">
                                        <span className="text-[10px]">🌱</span>
                                        <div className="leading-none text-[4.5px] font-black tracking-wider text-left">
                                            <div>GOOD NUTRITION</div>
                                            <div>BETTER HEALTH</div>
                                            <div>STRONGER FUTURE</div>
                                        </div>
                                    </div>

                                    {/* Wavy bottom SVG */}
                                    <svg className="absolute bottom-0 left-0 w-full h-[45px] pointer-events-none" viewBox="0 0 500 60" preserveAspectRatio="none">
                                        <path d="M0,35 Q120,5 250,45 T500,30 L500,60 L0,60 Z" fill="#1e3a8a" />
                                        <path d="M0,33 Q120,3 250,43 T500,28" fill="none" stroke="#d4af37" strokeWidth="3" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleDownloadCard}
                                disabled={isDownloading}
                                className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-75 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-purple-600/10"
                            >
                                {isDownloading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download PNG
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handlePrintCard}
                                className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-150 text-gray-600 font-black text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-gray-200"
                            >
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Card
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Incomplete Profile Warning Modal */}
            {showWarningModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] border border-white/40 shadow-2xl w-full max-w-md overflow-hidden relative p-8 animate-in slide-in-from-bottom-4 duration-300 text-center">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500 border border-amber-100">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-black text-gray-950 uppercase tracking-wider mb-2">1st Add Your Details</h3>
                        <p className="text-sm text-gray-500 font-bold leading-relaxed mb-6">
                            In order to view and download your Volunteer ID card, please complete your profile first by saving your profile picture, residential address, and phone number.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowWarningModal(false);
                                    setIsEditing(true);
                                }}
                                className="flex-1 py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md shadow-pink-600/20 active:scale-[0.98] cursor-pointer"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={() => setShowWarningModal(false)}
                                className="px-6 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-500 font-black text-xs uppercase tracking-widest rounded-2xl transition-all border border-gray-200 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
