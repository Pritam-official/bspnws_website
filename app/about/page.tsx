"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Target,
  Rocket,
  Heart,
  Users,
  Leaf,
  Globe,
  HandHelping,
  Brain,
  Sprout,
  Stethoscope,
  Gift,
  Baby,
  Users2,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Quote,
  ArrowUpRight,
  ChevronRight,
  Eye,
  Briefcase,
  Sparkles
} from 'lucide-react';

const Card = ({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
  <div className={`bg-white rounded-2xl p-8 shadow-xl border border-gray-100 ${hover ? 'hover:shadow-2xl transition-all duration-300 hover:-translate-y-1' : ''} ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle, light = false, align = "center" }: { title: string; subtitle: string; light?: boolean; align?: "center" | "left" }) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"} animate-fadeInUp`}>
    <span className={`text-sm font-semibold tracking-wider uppercase ${light ? 'text-primary/80' : 'text-primary'} mb-3 block`}>
      {subtitle}
    </span>
    <h2 className={`text-3xl md:text-4xl font-bold ${light ? 'text-white' : 'text-gray-900'} leading-tight`}>
      {title}
    </h2>
    <div className={`w-20 h-1 bg-primary mt-4 rounded-full ${align === "center" ? "mx-auto" : ""}`}></div>
  </div>
);

// Project Card Component for better organization
const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const isEven = index % 2 === 0;
  const colorClass = project.color === 'primary' ? 'primary' : 'secondary';

  return (
    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 items-start group`}>
      {/* Image Section */}
      <div className="flex-1 w-full">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
          <div className={`absolute inset-0 bg-gradient-to-tr from-${colorClass}/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Project Number Badge */}
          <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full">
            Project {String(index + 1).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 space-y-5">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-${colorClass}/10 rounded-xl flex items-center justify-center`}>
            <project.icon className={`w-6 h-6 text-${colorClass}`} />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{project.title}</h3>
        </div>

        <p className="text-gray-600 leading-relaxed text-lg">
          {project.desc}
        </p>

        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Key Activities
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.activities.map((act: string, i: number) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                {act}
              </span>
            ))}
          </div>
        </div>

        <div className={`bg-${colorClass}/5 border-l-4 border-${colorClass} p-5 rounded-r-xl mt-2`}>
          <p className="text-gray-700">
            <span className="font-bold text-gray-900 block mb-1">Objective:</span>
            {project.objective}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function AboutPage() {
  const stats = [
    { number: "8+", label: "Active Projects", icon: Target },
    { number: "5000+", label: "Lives Impacted", icon: Users },
    { number: "200+", label: "Active Volunteers", icon: Heart },
    { number: "50+", label: "Community Events", icon: Calendar },
  ];

  const coreValues = [
    { icon: Heart, title: "Humanity First", description: "Serving beyond religious and cultural boundaries" },
    { icon: Users, title: "Equal Opportunity", description: "No discrimination based on caste, creed, or gender" },
    { icon: HandHelping, title: "Community Spirit", description: "Building self-reliant communities through participation" },
    { icon: Leaf, title: "Eco-Conscious", description: "Sustainable practices in all our initiatives" },
  ];

  const workCulture = [
    { icon: Globe, title: "Community-Based", description: "Direct engagement with villages, slums, and underserved populations" },
    { icon: Users, title: "Volunteer-Driven", description: "Empowered volunteers leading grassroots change" },
    { icon: Heart, title: "Human-Centered", description: "Holistic support addressing emotional and physical needs" },
    { icon: HandHelping, title: "High-Impact", description: "Maximum impact through efficient resource utilization" },
    { icon: Target, title: "Awareness + Action", description: "Education paired with tangible support" },
    { icon: Users2, title: "Inclusive Culture", description: "Unity and belonging for all community members" },
  ];

  const projects = [
    {
      id: "1",
      title: "Baristha Vandana",
      icon: Heart,
      image: "/baristha.jpg",
      desc: "A dedicated initiative supporting elderly individuals from underprivileged backgrounds.",
      activities: ["Essential food supplies", "Clothing and basic necessities", "Regular health check-ups"],
      objective: "To ensure dignity, care, and basic living support for senior citizens lacking family or financial support.",
      color: "primary"
    },
    {
      id: "2",
      title: "Swasthya Vikas",
      icon: Stethoscope,
      image: "/swasta bikash.jpg",
      desc: "Comprehensive health and nutrition development program across West Bengal.",
      activities: ["Free diet consultation camps", "Blood donation drives", "Nutritional support for TB patients", "Health check-ups for street beggars"],
      objective: "To promote preventive healthcare, nutrition awareness, and accessible medical support for vulnerable communities.",
      color: "secondary"
    },
    {
      id: "3",
      title: "Aanandam",
      icon: Gift,
      image: "/picnic.jpg",
      desc: "Promoting joy, social inclusion, and emotional well-being among underprivileged communities.",
      activities: ["Durga Puja celebrations with elderly", "Damodar Mela community picnic", "Blanket distribution drives"],
      objective: "To create moments of happiness, cultural inclusion, and community bonding.",
      color: "primary"
    },
    {
      id: "4",
      title: "Annaprashana",
      icon: Baby,
      image: "/Annaprashan_Invitation.webp",
      desc: "Nutrition-focused program targeting malnourished children and maternal education.",
      activities: ["Nutritious food kits", "Clothing support for children", "Maternal education on child care"],
      objective: "To improve child health, reduce malnutrition, and educate families on proper nutritional practices.",
      color: "secondary"
    },
    {
      id: "5",
      title: "Shyamalima",
      icon: Sprout,
      image: "/syamolima.webp",
      desc: "Environmental sustainability initiative for a greener and healthier future.",
      activities: ["World Earth Day celebrations", "Tree plantation drives", "Kitchen gardens in schools"],
      objective: "To promote environmental awareness, sustainable living, and nutrition through greenery.",
      color: "primary"
    },
    {
      id: "6",
      title: "Kutumba",
      icon: Users2,
      image: "/bg-2.jpg",
      desc: "Community care program focusing on food security and social inclusion.",
      activities: ["Weekly feeding program", "Ramadan and Eid celebrations", "Support for tribal communities"],
      objective: "To strengthen community bonding and ensure no one goes hungry.",
      color: "secondary"
    },
    {
      id: "7",
      title: "Somparker Bandhan",
      icon: HandHelping,
      image: "/bhai-dooj-ceremony-with-cartoon-character-free-vector.jpg",
      desc: "Strengthening emotional connections and social harmony through festivals.",
      activities: ["Bhai Phonta for street beggars", "Raksha Bandhan with cancer patients", "Organic rakhi distribution"],
      objective: "To spread love, emotional support, and a sense of belonging among marginalized groups.",
      color: "primary"
    },
    {
      id: "8",
      title: "Utsaho",
      icon: Award,
      image: "/utsaho.jpg",
      desc: "Awareness, empowerment, and recognition through special observance days.",
      activities: ["National Girl Child Day", "International Mother Language Day", "Student felicitation programs"],
      objective: "To inspire, educate, and empower individuals through social awareness and recognition.",
      color: "secondary"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="absolute inset-0 bg-grid-primary/[0.02] bg-[size:40px_40px]"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              {/* Badge Group */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Society Act (1961)
                </span>
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> NITI Aayog
                </span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> 80G Registered
                </span>
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 12A Registered
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                About{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-primary">BSPNWS</span>
                  <svg className="absolute bottom-2 left-0 w-full h-3 text-primary/20 -z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 10, 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
                Burdwan Sadar Pyara Nutrition Welfare Society (BSPNWS) is a grassroots NGO based in Purba Bardhaman,
                West Bengal, dedicated to social justice and holistic community development.
              </p>

              <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-primary inline-block mx-auto lg:mx-0">
                <p className="text-gray-900 font-semibold italic flex items-center gap-2">
                  <Quote className="w-5 h-5 text-primary" />
                  “Healthy life through nutrition awareness and social support.”
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-primary">{stat.number}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur-2xl"></div>
                <div className="relative bg-white p-3 rounded-2xl shadow-2xl">
                  <Image
                    src="/logo.jpg"
                    alt="BSPNWS Logo"
                    width={400}
                    height={400}
                    className="object-contain w-80 h-80"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Mission Section */}
      <section className="py-20 container mx-auto px-6">
        <SectionTitle
          subtitle="OUR FOUNDATION"
          title="Vision, Mission & Values"
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center group">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              A world with social justice, equality, and no poverty — where communities are healthy and educated.
            </p>
          </Card>

          <Card className="text-center group">
            <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-secondary/20 transition-colors">
              <Briefcase className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              Support vulnerable populations, improve nutrition & health awareness, and promote education & empowerment.
            </p>
          </Card>

          <Card className="text-center group">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-gray-200 transition-colors">
              <Sparkles className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Core Values</h3>
            <div className="space-y-2 text-gray-600">
              <p>• Humanity above religion</p>
              <p>• Equality for all</p>
              <p>• Community support</p>
              <p>• Sustainable environment</p>
            </div>
          </Card>
        </div>

        {/* Values Grid Expanded */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {coreValues.map((value, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <value.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{value.title}</h4>
                <p className="text-sm text-gray-500">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Work Culture Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <SectionTitle
            subtitle="HOW WE WORK"
            title="Culture of Compassion"
            light
            align="center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workCulture.map((item, i) => (
              <div
                key={i}
                className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section - COMPLETELY REWORKED */}
      <section className="py-20 container mx-auto px-6">
        <SectionTitle
          subtitle="FLAGSHIP INITIATIVES"
          title="Our Key Projects"
          align="center"
        />

        <div className="space-y-20">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Building a Healthier, Happier &<br />
            Inclusive Society
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
            At BSPNWS, we take a holistic approach toward building community strength.
            Join us in our mission to make a direct impact on the lives of those who need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              Get Involved <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Learn More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tailwind safelist helper - Ensures dynamic colors work */}
      <div className="hidden bg-primary/10 text-primary border-primary bg-primary/5 bg-secondary/10 text-secondary border-secondary bg-secondary/5"></div>
    </div>
  );
}