"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  HeartHandshake, 
  Receipt, 
  Users, 
  Sparkles, 
  UtensilsCrossed, 
  Baby, 
  Smartphone, 
  Building2, 
  Copy, 
  Check, 
  Mail,
  Heart
} from 'lucide-react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
}

function AnimatedCounter({ target, duration = 1500 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={elementRef}>{count.toLocaleString()}</span>;
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{ 
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDuration: '1000ms'
      }}
      className={`transition-all transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

const benefits = [
  {
    icon: HeartHandshake,
    title: "Making Every Contribution Count",
    description: "Your contribution directly supports meaningful community programs and creates a lasting impact in the lives of those in need.",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500"
  },
  {
    icon: Receipt,
    title: "Tax Benefits",
    description: "Donations are eligible for tax deductions under Section 80G of the Income Tax Act. A donation certificate will be provided to help you claim your tax benefit.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500"
  },
  {
    icon: Users,
    title: "Volunteer-Driven Impact",
    description: "Our dedicated volunteers help maximize the impact of every contribution, ensuring more support reaches the communities we serve.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500"
  },
  {
    icon: Sparkles,
    title: "Serving Communities with Care",
    description: "We work year-round to improve lives through nutrition support, free meal distribution, education, healthcare, and community welfare initiatives.",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500"
  },
  {
    icon: UtensilsCrossed,
    title: "Support Our Weekly Meal Drive",
    description: "Your contribution helps us serve 70 free meals every Saturday to people experiencing homelessness and vulnerable individuals, bringing nourishment, hope, and compassion to those who need it most.",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500"
  },
  {
    icon: Baby,
    title: "Supports Mother & Child Nutrition",
    description: "Your contribution helps us provide monthly nutritious food to pregnant mothers, new mothers, and children, improving their health and nutritional well-being.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500"
  }
];

export default function DonatePage() {
  const [copied, setCopied] = useState(false);
  const [ifscCopied, setIfscCopied] = useState(false);
  const [accountCopied, setAccountCopied] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const upiId = "7866022053m@pnb";
  const ifscCode = "PUNB0873400";
  const accountNumber = "8734002100002391";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy UPI ID: ", err);
    }
  };

  const handleCopyIfsc = async () => {
    try {
      await navigator.clipboard.writeText(ifscCode);
      setIfscCopied(true);
      setTimeout(() => setIfscCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy IFSC code: ", err);
    }
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setAccountCopied(true);
      setTimeout(() => setAccountCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy Account Number: ", err);
    }
  };

  const causes = [
    {
      id: "sam-mam",
      badge: "Child Nutrition Welfare",
      title: "Help Us Nourish a Child, Help Us Build a Better Tomorrow",
      image: "/sam_mam.png",
      description: (
        <>
          <p className="font-bold text-slate-700 italic">Help Us Nourish a Child, Help Us Build a Better Tomorrow</p>
          <p>
            Every child deserves a healthy start in life. Yet many children are still battling Severe Acute Malnutrition (SAM) and Moderate Acute Malnutrition (MAM), putting their growth, health, and future at risk.
          </p>
          <p>
            Burdwan Sadar Pyara Nutrition Welfare Society is committed to transforming malnourished children into healthy, happy, and thriving individuals through:
          </p>
          <ul className="space-y-1.5 pl-2">
            <li>🍲 Nutritious food support</li>
            <li>🩺 Regular health check-ups</li>
            <li>📏 Growth monitoring</li>
            <li>❤️ Continuous care and family support</li>
          </ul>
          <p>
            Your contribution can help provide life-saving nutrition and care to a child in need.
          </p>
          <p className="font-bold text-slate-700">
            🌱 Every donation matters. Every meal brings hope. Every child deserves a chance to grow.
          </p>
          <p>
            Donate today and become a part of a child's journey from malnutrition to good health. Together, we can build a healthier tomorrow.
          </p>
          <p className="font-black text-[#22c55e] border-l-4 border-[#22c55e] pl-3 italic py-1 bg-emerald-50/50 rounded-r-md">
            "Good Nutrition is the Best Medicine for a Better Tomorrow." 💚
          </p>
        </>
      )
    },
    {
      id: "tb-nutrition",
      badge: "Healthcare & Recovery",
      title: "Support for Tuberculosis (TB) Patients",
      image: "/tb_patients.png",
      description: (
        <>
          <p>
            Every month, Burdwan Sadar Pyara Nutrition Welfare Society (BSPNWS) provides nutritious food kits to Tuberculosis (TB) patients, helping them regain strength, improve immunity, and recover with dignity.
          </p>
          <p>
            For many families, proper nutrition is beyond reach. Your contribution can ensure that a TB patient receives the essential food they need during treatment.
          </p>
          <p className="font-bold text-slate-700">🌿 Your donation helps provide:</p>
          <ul className="space-y-1.5 pl-4 list-disc marker:text-primary">
            <li>Protein-rich and nutritious food kits</li>
            <li>Better immunity and faster recovery</li>
            <li>Hope and support for underprivileged TB patients</li>
          </ul>
          <p>
            A small act of kindness can make a life-changing difference.
          </p>
          <p className="font-bold text-slate-800">
            🤝 Donate today and become a part of their healing journey. Together, let's build a healthier, stronger, and more compassionate community.
          </p>
          <div className="text-xs font-bold text-slate-400 mt-2 border-t border-slate-100 pt-3">
            Burdwan Sadar Pyara Nutrition Welfare Society (BSPNWS) — <span className="text-rose-500">"A Way to Healthy Life" ❤️</span>
          </div>
        </>
      )
    },
    {
      id: "karate-training",
      badge: "Youth Empowerment",
      title: "From Slum Streets to State Champions — Help Us Build More Success Stories",
      image: "/karate.png",
      description: (
        <>
          <p className="font-bold text-slate-700 italic">From Slum Streets to State Champions — Help Us Build More Success Stories</p>
          <p>
            Every Saturday, Burdwan Sadar Pyara Nutrition Welfare Society provides free karate training to children from underprivileged slum communities.
          </p>
          <p>
            Karate is more than self-defense—it teaches discipline, confidence, respect, leadership, and hope. Many of our students have already reached the State Level, proving that with the right guidance, every child can achieve greatness.
          </p>
          <p className="font-bold text-slate-700">Your donation will help us provide:</p>
          <ul className="space-y-1.5 pl-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <li>🥋 Free karate uniforms and belts</li>
            <li>🏆 Training equipment and safety gear</li>
            <li>🚍 Travel support for competitions</li>
            <li>🥇 Tournament registration fees</li>
            <li>🍎 Nutritious refreshments for young trainees</li>
            <li>👧 Continued free coaching for underprivileged children</li>
          </ul>
          <p>
            Every contribution, big or small, helps transform a child's future.
          </p>
          <p>
            Donate today and become a part of their journey—from the slum area to the State Championship podium.
          </p>
          <p className="font-black text-purple-600 border-l-4 border-purple-500 pl-3 italic py-1 bg-purple-50/50 rounded-r-md">
            "Together, let's empower children with discipline, confidence, and the courage to dream big." 💜🥋🏆
          </p>
        </>
      )
    },
    {
      id: "meals-drive",
      badge: "Welfare & Feeding",
      title: "Help Us Feed Hope Every Saturday",
      image: "/feed70.png",
      description: (
        <>
          <p className="font-bold text-slate-700 italic">Help Us Feed Hope Every Saturday</p>
          <p>
            Every Saturday, Burdwan Sadar Pyara Nutrition Welfare Society (BSPNWS) serves 70 nutritious meals to elderly, homeless, and underprivileged people living on the streets.
          </p>
          <p>
            For many of them, this is the only wholesome meal they receive all day.
          </p>
          <p>
            Your contribution—big or small—can bring comfort, dignity, and hope to someone in need.
          </p>
          <ul className="space-y-1.5 pl-2">
            <li>🍛 Sponsor a Meal.</li>
            <li>❤️ Share Kindness.</li>
            <li>🤝 Join Our Mission to End Hunger.</li>
          </ul>
          <p className="font-bold text-slate-700">
            Together, we can ensure that no one sleeps hungry.
          </p>
          <p className="font-black text-rose-600 border-l-4 border-rose-500 pl-3 py-1 bg-rose-50/50 rounded-r-md">
            Every Meal You Donate Creates a Smile. 😊
          </p>
          <div className="text-xs font-bold text-slate-400 mt-2 border-t border-slate-100 pt-3">
            Support Burdwan Sadar Pyara Nutrition Welfare Society — <span className="text-rose-500">"A Way to Healthy Life"</span>
          </div>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <div className="relative h-[340px] sm:h-[420px] md:h-[480px] w-full bg-slate-950 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/donate-hero-bg.jpg"
            alt="Smiling Children holding Nutritious Food"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]"></div>
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border border-white/10 select-none active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>

        {/* Hero Content */}
        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center relative z-10 text-white">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">
            <span>💖</span> TOGETHER WE CAN
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight uppercase mb-4 max-w-4xl drop-shadow-sm">
            Give Hope. <br /> Feed Dreams.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 font-medium tracking-wide">
            Your kindness changes lives
          </p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-white border-b border-slate-100 shadow-sm relative z-20">
        <div className="container mx-auto px-4 py-8 sm:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center max-w-5xl mx-auto">
            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight mb-1.5">
                <AnimatedCounter target={1240} />+
              </span>
              <span className="text-sm sm:text-base font-semibold text-slate-600">Children Helped</span>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight mb-1.5">
                <AnimatedCounter target={18400} />+
              </span>
              <span className="text-sm sm:text-base font-semibold text-slate-600">Meals Served</span>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight mb-1.5">
                <AnimatedCounter target={680} />+
              </span>
              <span className="text-sm sm:text-base font-semibold text-slate-600">TB Patients Supported</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Donation Container */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto">

          {/* Why Your Donation Matters Section */}
          <div className="mb-20 sm:mb-24">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Why Your Donation Matters
              </h2>

              {/* Divider Decor (coordinated with site theme) */}
              <div className="flex flex-col items-center justify-center mt-4">
                <div className="flex items-center w-40">
                  <div className="h-[2px] bg-primary flex-1"></div>
                  <div className="mx-2 w-3 h-3 bg-primary rotate-45"></div>
                  <div className="h-[2px] bg-primary flex-1"></div>
                </div>
              </div>
            </div>

            {/* 6 Benefit Cards (Professional, with custom colored icons & reveal transitions) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                const isActive = activeCard === index;
                return (
                  <ScrollReveal key={index} delay={index * 100} className="h-full">
                    <div 
                      onClick={() => setActiveCard(isActive ? null : index)}
                      className={`bg-white border rounded-2xl p-8 sm:p-10 flex flex-col items-center text-center shadow-md transition-all duration-300 cursor-pointer h-full group relative overflow-hidden select-none ${
                        isActive 
                          ? 'shadow-2xl border-slate-200/80 -translate-y-1.5 ring-2 ring-primary/10' 
                          : 'border-slate-100 hover:shadow-2xl hover:border-slate-200/50 hover:-translate-y-1.5'
                      }`}
                    >
                      {/* Color gradient background decoration on hover/active */}
                      <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full ${benefit.iconBg} transition-all duration-500 blur-xl ${
                        isActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-40'
                      }`}></div>
                      
                      {/* Icon wrapper */}
                      <div className={`w-14 h-14 ${benefit.iconBg} ${benefit.iconColor} rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-50 transition-all duration-300 ${
                        isActive ? 'scale-110' : 'group-hover:scale-110'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <h3 className={`text-lg sm:text-xl font-bold mb-4 transition-colors duration-200 ${
                        isActive ? 'text-primary' : 'text-slate-800 group-hover:text-primary'
                      }`}>
                        {benefit.title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
                        {benefit.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* How to Donate Section */}
          <div id="how-to-donate" className="mb-20 sm:mb-24 border-t border-slate-200/80 pt-16 sm:pt-20">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Support Our Mission</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                How to <span className="text-primary">Donate</span>
              </h2>
              <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-medium">
                We offer two secure, direct ways to support our humanitarian work. Choose the method that is most convenient for you.
              </p>
            </div>

            {/* How to Donate Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

              {/* Option 1: Online Donation (UPI) */}
              <ScrollReveal className="h-full">
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl flex flex-col justify-between h-full group transition-all duration-300 hover:shadow-2xl hover:border-slate-200/50">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 sm:mb-8">
                      <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100/50 group-hover:scale-105 transition-transform duration-300">
                        <Smartphone className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-800">Online Donation (UPI)</h3>
                        <p className="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">Fast & Secure</p>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                      Scan the QR code below using any UPI app (BHIM, Google Pay, PhonePe, Paytm, etc.) or copy our official UPI ID to make a direct transfer.
                    </p>

                    {/* UPI ID Copy Field */}
                    <div className="relative bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between mb-8 transition-all hover:bg-slate-100/50 hover:border-rose-200">
                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Official UPI ID</span>
                        <span className="block font-mono text-sm sm:text-lg font-black text-slate-700 truncate">{upiId}</span>
                      </div>
                      <button
                        onClick={handleCopy}
                        className={`ml-4 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all select-none whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${copied
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                          : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-sm'
                          }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* QR Code Graphic container */}
                  <div className="relative bg-slate-950 rounded-3xl p-6 sm:p-8 text-center overflow-hidden shadow-2xl border border-slate-900">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 blur-[60px] pointer-events-none"></div>
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">Scan QR to Pay</p>
                    <div className="max-w-[200px] mx-auto bg-white p-3 rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-102">
                      <Image
                        src="/donate-poster.jpg"
                        alt="Scan to Donate Poster"
                        width={400}
                        height={600}
                        className="w-full h-auto rounded-xl object-contain"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-semibold mt-4 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Works with all BHIM UPI applications
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Option 2: Direct Bank Transfer */}
              <ScrollReveal className="h-full" delay={150}>
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl flex flex-col justify-between h-full group transition-all duration-300 hover:shadow-2xl hover:border-slate-200/50">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 sm:mb-8">
                      <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-primary shadow-sm border border-orange-100/50 group-hover:scale-105 transition-transform duration-300">
                        <Building2 className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-800">Direct Bank Transfer</h3>
                        <p className="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">Traditional Banking</p>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                      You can transfer funds directly from your bank account using NetBanking (NEFT/RTGS/IMPS) or mobile banking. Here are the official society details:
                    </p>

                    {/* Bank Details Cards */}
                    <div className="space-y-4 mb-6">
                      <div className="relative">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Beneficiary Account Name</p>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 transition-all hover:bg-white hover:border-orange-200/60">
                          <p className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug">
                            Burdwan Sadar Pyara Nutrition Welfare Society
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Bank Institution</p>
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 transition-all hover:bg-white hover:border-orange-200/60">
                            <p className="font-black text-slate-800 text-xs sm:text-sm uppercase">Punjab National Bank</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">IFSC Banking Code</p>
                          <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-100 flex items-center justify-between transition-all hover:bg-white hover:border-orange-200/60">
                            <p className="font-mono font-black text-[#e07b46] text-xs sm:text-sm truncate">{ifscCode}</p>
                            <button
                              onClick={handleCopyIfsc}
                              className={`ml-2 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wide transition-all select-none whitespace-nowrap active:scale-95 flex items-center gap-1 ${ifscCopied
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                                : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-sm'
                                }`}
                            >
                              {ifscCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {ifscCopied ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Account Number</p>
                        <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-100 flex items-center justify-between transition-all hover:bg-white hover:border-orange-200/60">
                          <p className="font-mono text-sm sm:text-lg font-black text-slate-800 tracking-wider truncate">
                            {accountNumber}
                          </p>
                          <button
                            onClick={handleCopyAccount}
                            className={`ml-4 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all select-none whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${accountCopied
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                              : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-sm'
                              }`}
                          >
                            {accountCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {accountCopied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Receipt Instructions Callout */}
                  <div className="mt-4 bg-gradient-to-br from-orange-50/80 to-amber-50/50 border border-orange-100 rounded-2xl p-5 text-center shadow-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-primary" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">Get Your Receipt</p>
                    </div>
                    <p className="text-sm font-black text-slate-800 leading-relaxed">
                      Please email the transaction screenshot to <a href="mailto:bspnws@gmail.com" className="text-primary underline hover:text-[#c55b1f] transition-colors">bspnws@gmail.com</a> for your receipt.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>

          {/* Donate for a Cause Section */}
          <div className="border-t border-slate-200/80 pt-16 sm:pt-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Make an Impact</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Donate for a Cause
              </h2>

              {/* Divider Decor */}
              <div className="flex flex-col items-center justify-center mt-4">
                <div className="flex items-center w-40">
                  <div className="h-[2px] bg-primary flex-1"></div>
                  <div className="mx-2 w-3 h-3 bg-primary rotate-45"></div>
                  <div className="h-[2px] bg-primary flex-1"></div>
                </div>
              </div>
            </div>

            {/* Causes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto px-1">
              {causes.map((cause, index) => (
                <ScrollReveal key={cause.id} delay={index * 100} className="h-full">
                  <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl hover:border-slate-200/50 transition-all duration-300 group flex flex-col justify-between h-full">
                    <div>
                      {/* Image Container */}
                      <div className="relative aspect-[16/10] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                        <Image
                          src={cause.image}
                          alt={cause.title}
                          fill
                          className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>

                      {/* Content Area */}
                      <div className="p-6 sm:p-10">
                        <div className="inline-block bg-primary/10 text-primary text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider mb-4">
                          {cause.badge}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight mb-6 group-hover:text-primary transition-colors duration-200">
                          {cause.title}
                        </h3>
                        <div className="text-slate-500 text-sm sm:text-base leading-relaxed space-y-4 font-semibold">
                          {cause.description}
                        </div>
                      </div>
                    </div>

                    {/* Donate CTA Button */}
                    <div className="p-6 sm:p-10 pt-0 mt-auto">
                      <button
                        onClick={() => {
                          document.getElementById('how-to-donate')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full bg-primary hover:bg-[#c55b1f] text-white py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 group/btn active:scale-95 cursor-pointer duration-200 hover:-translate-y-0.5"
                      >
                        <span>Donate Now</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
