"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

interface BoardMember {
    _id: string;
    name: string;
    designation: string;
    joiningDate?: string;
    image?: string;
}

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
}

const AVATAR_PALETTES = [
    { bg: "#eef4ff", text: "#2563eb" },
    { bg: "#f3eeff", text: "#7c3aed" },
    { bg: "#eefaf4", text: "#059669" },
    { bg: "#fff8ee", text: "#b45309" },
    { bg: "#ffeef5", text: "#be185d" },
    { bg: "#eef9ff", text: "#0369a1" },
];

export default function BoardOfDirectorsPage() {
    const [members, setMembers] = useState<BoardMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await fetch("/api/admin/board-members");
                const data = await res.json();
                if (Array.isArray(data)) setMembers(data);
            } catch (error) {
                console.error("Failed to fetch board members:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8f7f4",
                overflowX: "hidden",
                fontFamily: "'Inter', sans-serif",
                color: "#1a1a1a",
            }}
        >
            <Navbar />

            {/* ── Hero ── */}
            <div
                style={{
                    background: "#fff",
                    borderBottom: "1px solid #e8e4dc",
                    paddingTop: "clamp(72px, 10vw, 110px)",
                    paddingBottom: "clamp(36px, 5vw, 60px)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Subtle dot grid */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        backgroundImage: "radial-gradient(circle, #d4c9b0 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                        opacity: 0.35,
                    }}
                />
                {/* Gold accent bar top */}
                <div
                    style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0,
                        height: 4,
                        background: "linear-gradient(90deg, #b8960e, #c9a84c, #e8c96d, #c9a84c, #b8960e)",
                    }}
                />

                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        padding: "0 clamp(16px, 4vw, 48px)",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    {/* Eyebrow pill */}
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 22,
                            padding: "5px 14px",
                            borderRadius: 999,
                            background: "#fdf8ee",
                            border: "1px solid #e2c97e",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase" as const,
                            color: "#92700a",
                        }}
                    >
                        <span
                            style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: "#c9a84c",
                                flexShrink: 0,
                            }}
                        />
                        BSPNWS · Governing Board
                    </div>

                    {/* Title + count row */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "16px 40px",
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    fontSize: "clamp(2rem, 5vw, 3.8rem)",
                                    fontWeight: 900,
                                    lineHeight: 1.08,
                                    letterSpacing: "-0.03em",
                                    color: "#111111",
                                    fontFamily: '"Georgia", "Times New Roman", serif',
                                    margin: 0,
                                }}
                            >
                                Board of Directors
                            </h1>
                            <p
                                style={{
                                    marginTop: 14,
                                    fontSize: 15,
                                    color: "#6b6b6b",
                                    lineHeight: 1.6,
                                    maxWidth: 500,
                                }}
                            >
                                The governing board provides strategic leadership and oversight
                                for Burdawan Sadar Pyara Nutrition Welfare Society.
                            </p>
                        </div>

                        {/* Count badge */}
                        <div
                            style={{
                                flexShrink: 0,
                                background: "#fdf8ee",
                                border: "1px solid #e2c97e",
                                borderRadius: 16,
                                padding: "18px 28px",
                                textAlign: "center",
                                minWidth: 120,
                            }}
                        >
                            <p
                                style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: "0.16em",
                                    textTransform: "uppercase" as const,
                                    color: "#a07c20",
                                    marginBottom: 4,
                                }}
                            >
                                Total Directors
                            </p>
                            <p
                                style={{
                                    fontSize: "clamp(2.2rem,4vw,3rem)",
                                    fontWeight: 900,
                                    lineHeight: 1,
                                    color: "#c9a84c",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {loading ? "—" : String(members.length).padStart(2, "0")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "clamp(32px, 5vw, 60px) clamp(16px, 4vw, 48px) clamp(40px, 6vw, 80px)",
                }}
            >
                {/* Loading */}
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "100px 0", gap: 8 }}>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                style={{
                                    width: 8, height: 8, borderRadius: "50%",
                                    background: "#c9a84c",
                                    animation: "pulse 1.2s ease-in-out infinite",
                                    animationDelay: `${i * 200}ms`,
                                }}
                            />
                        ))}
                    </div>

                ) : members.length === 0 ? (
                    /* Empty state */
                    <div
                        style={{
                            border: "1px solid #e8e4dc",
                            borderRadius: 16,
                            background: "#fff",
                            padding: "80px 32px",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 48, height: 48, borderRadius: "50%",
                                background: "#fdf8ee",
                                border: "1px solid #e2c97e",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 20px",
                                fontSize: 20, color: "#c9a84c",
                            }}
                        >
                            ◈
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 6 }}>
                            Board list updating
                        </p>
                        <p style={{ fontSize: 13, color: "#aaa" }}>Governing members will appear here shortly.</p>
                    </div>

                ) : (
                    /* ── Members Grid ── */
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                            gap: 20,
                        }}
                    >
                        {members.map((member, index) => (
                            <MemberCard
                                key={member._id}
                                member={member}
                                index={index}
                                palette={AVATAR_PALETTES[index % AVATAR_PALETTES.length]}
                            />
                        ))}
                    </div>
                )}

                {/* ── Footer ── */}
                <footer
                    style={{
                        marginTop: 56,
                        paddingTop: 24,
                        borderTop: "1px solid #e8e4dc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#b0a890" }}>
                        BSPNWS · Board of Directors
                    </p>
                    <Link
                        href="/"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            fontSize: 12, fontWeight: 700,
                            color: "#888",
                            textDecoration: "none",
                            letterSpacing: "0.10em",
                            textTransform: "uppercase" as const,
                            transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#c9a84c")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
                    >
                        ← Back to Home
                    </Link>
                </footer>
            </div>

            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}

/* ── Member Card ── */
function MemberCard({
    member,
    index,
    palette,
}: {
    member: BoardMember;
    index: number;
    palette: { bg: string; text: string };
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderRadius: 18,
                background: hovered ? "#fff" : "#fff",
                border: `1px solid ${hovered ? "#c9a84c" : "#e8e4dc"}`,
                padding: "26px 22px 22px",
                display: "flex",
                flexDirection: "column",
                cursor: "default",
                transition: "all 0.28s ease",
                transform: hovered ? "translateY(-5px)" : "translateY(0)",
                boxShadow: hovered
                    ? "0 12px 40px rgba(201,168,76,0.14), 0 2px 8px rgba(0,0,0,0.06)"
                    : "0 1px 4px rgba(0,0,0,0.04)",
                animation: `fadeUp 0.45s ease ${index * 55}ms both`,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Gold top accent line */}
            <div
                style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: 3,
                    background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
                    opacity: hovered ? 1 : 0,
                    transition: "opacity 0.28s",
                    borderRadius: "18px 18px 0 0",
                }}
            />

            {/* Index */}
            <span
                style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase" as const,
                    color: "#c9a84c",
                    opacity: 0.55,
                    marginBottom: 18,
                    display: "block",
                }}
            >
                {String(index + 1).padStart(2, "0")}
            </span>

            {/* Avatar */}
            <div style={{ marginBottom: 18 }}>
                <div
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: member.image ? "transparent" : palette.bg,
                        border: `2px solid ${hovered ? "#c9a84c" : "#e8e4dc"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "border-color 0.28s",
                        flexShrink: 0,
                    }}
                >
                    {member.image ? (
                        <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span
                            style={{
                                fontSize: 20,
                                fontWeight: 900,
                                color: palette.text,
                                fontFamily: '"Georgia", serif',
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {getInitials(member.name)}
                        </span>
                    )}
                </div>
            </div>

            {/* Name */}
            <h2
                style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#111",
                    lineHeight: 1.25,
                    letterSpacing: "-0.02em",
                    marginBottom: 5,
                    fontFamily: '"Georgia", "Times New Roman", serif',
                }}
            >
                {member.name}
            </h2>

            {/* Designation */}
            <p
                style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#c9a84c",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    marginBottom: "auto",
                    lineHeight: 1.45,
                }}
            >
                {member.designation}
            </p>

            {/* Card footer */}
            <div
                style={{
                    marginTop: 22,
                    paddingTop: 16,
                    borderTop: "1px solid #f0ece3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <p style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#bbb", marginBottom: 3 }}>
                        Joined Society
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>
                        {member.joiningDate || "Active Member"}
                    </p>
                </div>

                {/* Accent dot */}
                <div
                    style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: hovered ? "#c9a84c" : "#e8e4dc",
                        boxShadow: hovered ? "0 0 10px rgba(201,168,76,0.5)" : "none",
                        transition: "all 0.28s",
                    }}
                />
            </div>
        </article>
    );
}