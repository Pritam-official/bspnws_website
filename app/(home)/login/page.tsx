"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Home,
  Info,
  X,
} from "lucide-react";
import AdminVerificationModal from "@/components/admin-portal/AdminVerificationModal";
import adminConfig from "@/lib/admin-config.json";

/* ─── Design tokens ───────────────────────────────────────────────
   Background : #04091a  (deep navy)
   Surface    : rgba(255,255,255,0.04)  glass card
   Gold       : #c9a84c → #e8c96d  (primary accent)
   Teal       : #0f766e → #14b8a6  (volunteer)
   Violet     : #5b21b6 → #7c3aed  (admin)
   Network    : gold nodes on navy
──────────────────────────────────────────────────────────────────*/

export default function PortalSelectionPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; roleName: string } | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  /* ── Network canvas (gold on navy) ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const NODE_COUNT = 65;
    const MAX_DIST = 145;

    type Node = { x: number; y: number; vx: number; vy: number; r: number; glow: boolean };
    let nodes: Node[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      const { width: W, height: H } = canvas;
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
        glow: Math.random() > 0.72,
      }));
    };

    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        if (n.glow) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 7);
          g.addColorStop(0, "rgba(232,201,109,0.45)");
          g.addColorStop(1, "rgba(201,168,76,0)");
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 7, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.glow ? "#e8c96d" : "rgba(201,168,76,0.55)";
        ctx.fill();
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => { cancelAnimationFrame(animRef.current); resize(); draw(); };
    resize(); init(); draw();
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); cancelAnimationFrame(animRef.current); };
  }, []);

  /* ── Toast auto-dismiss ── */
  useEffect(() => {
    if (!toast?.show) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── Portal definitions ── */
  const portals = [
    {
      title: "Volunteer",
      subtitle: "Community Impact",
      description: "Manage your profile, view programs, submit feedback, and access notices.",
      actionText: "Sign In",
      type: "volunteer",
      href: "/login/volunteer",
      Icon: Heart,
      status: "active" as const,
      iconGradient: "linear-gradient(135deg,#0f766e,#14b8a6)",
      iconShadow: "0 4px 18px rgba(20,184,166,0.38)",
      subtitleColor: "#2dd4bf",
      btnGradient: "linear-gradient(135deg,#0f766e,#0d9488)",
      btnShadow: "0 4px 18px rgba(15,118,110,0.38)",
      cardGlow: "rgba(20,184,166,0.10)",
    },
    {
      title: "Administrator",
      subtitle: "System Control",
      description: "Manage organization settings, verify data, and oversee operations.",
      actionText: "Sign In",
      type: "admin",
      href: undefined,
      Icon: ShieldCheck,
      status: "active" as const,
      iconGradient: "linear-gradient(135deg,#c9a84c,#e8c96d)",
      iconShadow: "0 4px 18px rgba(201,168,76,0.42)",
      subtitleColor: "#e8c96d",
      btnGradient: "linear-gradient(135deg,#b8960e,#d4aa30)",
      btnShadow: "0 4px 18px rgba(201,168,76,0.38)",
      cardGlow: "rgba(201,168,76,0.10)",
    },
    {
      title: "Staff",
      subtitle: "Team Operations",
      description: "Access internal tools, payroll, task boards, and attendance systems.",
      actionText: "Coming Soon",
      type: "staff",
      href: undefined,
      Icon: Briefcase,
      status: "coming_soon" as const,
      iconGradient: "", iconShadow: "", subtitleColor: "",
      btnGradient: "", btnShadow: "", cardGlow: "",
    },
    {
      title: "Intern",
      subtitle: "Development Path",
      description: "Track projects, submit work diaries, and review feedback.",
      actionText: "Coming Soon",
      type: "intern",
      href: undefined,
      Icon: GraduationCap,
      status: "coming_soon" as const,
      iconGradient: "", iconShadow: "", subtitleColor: "",
      btnGradient: "", btnShadow: "", cardGlow: "",
    },
  ];

  const handleNavigate = (portal: (typeof portals)[0]) => {
    if (portal.status === "coming_soon") {
      setToast({ show: true, roleName: portal.title });
    } else if (portal.type === "admin") {
      setIsAdminAuthOpen(true);
    } else if (portal.href) {
      router.push(portal.href);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{ background: "#04091a", fontFamily: "'Inter', sans-serif", color: "#fff" }}
    >
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" style={{ display: "block" }} />

      {/* Gradient overlays */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(to bottom, #04091a 0%, transparent 20%),
            linear-gradient(to top,    #04091a 0%, transparent 20%),
            radial-gradient(ellipse at center, transparent 25%, rgba(4,9,26,0.70) 100%)
          `,
        }}
      />

      {/* ── Header ── */}
      <header
        className="relative z-20 sticky top-0"
        style={{
          borderBottom: "1px solid rgba(201,168,76,0.12)",
          background: "rgba(4,9,26,0.75)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#c9a84c,#e8c96d)",
                boxShadow: "0 0 20px rgba(201,168,76,0.4)",
              }}
            >
              <Image src="/logo.jpg" alt="BSPNWS Logo" width={44} height={44} className="rounded-xl object-cover" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>BSPNWS</div>
              <div style={{ fontSize: 11, color: "rgba(201,168,76,0.6)" }}>Self Service Portal</div>
            </div>
          </Link>
          <Link
            href="/"
            title="Go to Home"
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all"
            style={{
              border: "1px solid rgba(201,168,76,0.18)",
              background: "rgba(201,168,76,0.06)",
              color: "rgba(201,168,76,0.55)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.14)";
              (e.currentTarget as HTMLElement).style.color = "#e8c96d";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.06)";
              (e.currentTarget as HTMLElement).style.color = "rgba(201,168,76,0.55)";
            }}
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-5 py-10">
        <div className="w-full max-w-[1200px]">

          {/* Page header */}
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full mb-6"
              style={{
                background: "rgba(201,168,76,0.10)",
                border: "1px solid rgba(201,168,76,0.28)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "#e8c96d",
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#e8c96d",
                  boxShadow: "0 0 7px #e8c96d",
                  display: "inline-block",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              Secure Portal Access
            </div>

            <h1
              style={{
                fontSize: "clamp(30px, 5vw, 46px)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                marginBottom: 14,
                color: "#fff",
              }}
            >
              Welcome to{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#c9a84c,#e8c96d,#c9a84c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                BSPNWS
              </span>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: 520, margin: "0 auto" }}>
              Select your role to access dedicated tools, dashboards, and resources designed for your work.
            </p>
          </div>

          {/* Portal grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
            {portals.map((portal, index) => {
              const { Icon } = portal;
              const isActive = portal.status === "active";
              const isHovered = hoveredCard === index;

              return (
                <div
                  key={index}
                  onClick={() => handleNavigate(portal)}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    position: "relative",
                    borderRadius: 20,
                    padding: "28px 26px 24px",
                    overflow: "hidden",
                    cursor: isActive ? "pointer" : "default",
                    opacity: isActive ? 1 : 0.4,
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${isHovered && isActive ? "rgba(201,168,76,0.30)" : "rgba(255,255,255,0.07)"}`,
                    backdropFilter: "blur(20px)",
                    transform: isHovered && isActive ? "translateY(-4px)" : "translateY(0)",
                    boxShadow: isHovered && isActive ? "0 24px 60px rgba(0,0,0,0.55)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Card glow */}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none",
                        background: `radial-gradient(ellipse at top left, ${portal.cardGlow}, transparent 65%)`,
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 0.3s",
                      }}
                    />
                  )}

                  <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Coming soon badge */}
                    {!isActive && (
                      <div
                        style={{
                          display: "inline-flex", marginBottom: 14,
                          padding: "3px 10px", borderRadius: 6,
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          fontSize: 10, fontWeight: 700,
                          letterSpacing: "0.08em", textTransform: "uppercase" as const,
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        Coming Soon
                      </div>
                    )}

                    {/* Icon */}
                    <div
                      style={{
                        width: 52, height: 52, borderRadius: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: 20,
                        background: isActive ? portal.iconGradient : "rgba(255,255,255,0.07)",
                        boxShadow: isActive ? portal.iconShadow : "none",
                        transform: isHovered && isActive ? "scale(1.1) rotate(-4deg)" : "scale(1) rotate(0deg)",
                        transition: "transform 0.3s",
                      }}
                    >
                      <Icon style={{ width: 24, height: 24, color: isActive ? "#fff" : "rgba(255,255,255,0.28)" }} />
                    </div>

                    {/* Title */}
                    <div style={{ fontSize: 19, fontWeight: 800, color: "#fff", marginBottom: 3 }}>
                      {portal.title}
                    </div>

                    {/* Subtitle */}
                    {isActive && (
                      <div style={{ fontSize: 12, fontWeight: 600, color: portal.subtitleColor, marginBottom: 10 }}>
                        {portal.subtitle}
                      </div>
                    )}

                    {/* Description */}
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.55, marginBottom: 22 }}>
                      {portal.description}
                    </p>

                    {/* Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNavigate(portal); }}
                      disabled={!isActive}
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: 12, border: "none",
                        fontSize: 11.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        cursor: isActive ? "pointer" : "not-allowed",
                        color: isActive ? (portal.type === "admin" ? "#1a1000" : "#fff") : "rgba(255,255,255,0.25)",
                        background: isActive ? portal.btnGradient : "rgba(255,255,255,0.06)",
                        boxShadow: isActive ? portal.btnShadow : "none",
                        transition: "filter 0.2s, transform 0.2s",
                      }}
                      onMouseEnter={(e) => { if (isActive) (e.currentTarget as HTMLElement).style.filter = "brightness(1.12)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1)"; }}
                    >
                      {portal.actionText}
                      {isActive && <ArrowRight style={{ width: 15, height: 15 }} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info box */}
          <div
            style={{
              width: "100%", borderRadius: 16, padding: "18px 22px",
              display: "flex", gap: 14, alignItems: "flex-start",
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.18)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Info style={{ width: 20, height: 20, color: "#c9a84c", flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Need assistance?</div>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.5, marginBottom: 8 }}>
                Can't access your portal or need technical support? Our team is ready to help.
              </p>
              <a
                href="mailto:admin@bspnws.org"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  color: "#c9a84c", fontSize: 12.5, fontWeight: 600, textDecoration: "none",
                }}
              >
                Contact support <ArrowRight style={{ width: 13, height: 13 }} />
              </a>
            </div>
          </div>
        </div>
      </main>


      {/* ── Admin Modal ── */}
      <AdminVerificationModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        adminCode={adminConfig.adminCode}
      />

      {/* ── Toast ── */}
      {toast && (
        <div
          style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 120,
            maxWidth: 300, display: "flex", alignItems: "flex-start", gap: 12,
            borderRadius: 16, padding: "14px 16px",
            background: "rgba(4,9,26,0.97)",
            border: "1px solid rgba(201,168,76,0.20)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
            backdropFilter: "blur(20px)",
            animation: "fadeInUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
          }}
        >
          <div
            style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg,#c9a84c,#e8c96d)",
            }}
          >
            <Info style={{ width: 18, height: 18, color: "#1a1000" }} />
          </div>
          <div style={{ flex: 1, paddingTop: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>
              {toast.roleName} Portal
            </div>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.4 }}>
              This portal is under development and will be available soon.
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", marginTop: 2 }}
          >
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>
      )}

      {/* ── Global styles ── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.45; transform: scale(0.75); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}