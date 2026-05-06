import React from 'react';

// Define the color type
type ColorKey = 'orange' | 'blue' | 'green';

// Define the registration item type
interface RegistrationItem {
    id: number;
    title: string;
    description: string;
    registrationNo?: string;
    year?: string;
    status?: string;
    icon: React.ReactNode;
    color: ColorKey;
    badge: string;
    hasDetails: boolean;
}

const AboutSection: React.FC = () => {
    const registrationData: RegistrationItem[] = [
        {
            id: 1,
            title: "Govt. Registered Society",
            description: "West Bengal Societies Registration Act, 1961",
            registrationNo: "S0028375",
            year: "2022-2023",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            color: "orange",
            badge: "Reg #1",
            hasDetails: true
        },
        {
            id: 2,
            title: "NITI AAYOG",
            description: "Registered Organization with Govt. of India",
            registrationNo: "WB/2023/0347627",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            color: "blue",
            badge: "Reg #2",
            hasDetails: true
        },
        {
            id: 3,
            title: "80G Certificate",
            description: "Tax Exemption under Section 80G",
            status: "Certified",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "green",
            badge: "Tax Benefits",
            hasDetails: false
        },
        {
            id: 4,
            title: "12A Certificate",
            description: "Tax Exemption under Section 12A",
            status: "Certified",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "green",
            badge: "Tax Benefits",
            hasDetails: false
        }
    ];

    const colorStyles: Record<ColorKey, {
        bg: string;
        text: string;
        hover: string;
        border: string;
        badge: string;
        gradient: string;
    }> = {
        orange: {
            bg: "bg-orange-50",
            text: "text-orange-600",
            hover: "group-hover:bg-orange-600",
            border: "border-orange-500",
            badge: "bg-orange-100 text-orange-700",
            gradient: "from-orange-400 to-orange-600"
        },
        blue: {
            bg: "bg-blue-50",
            text: "text-blue-600",
            hover: "group-hover:bg-blue-600",
            border: "border-blue-500",
            badge: "bg-blue-100 text-blue-700",
            gradient: "from-blue-400 to-blue-600"
        },
        green: {
            bg: "bg-green-50",
            text: "text-green-600",
            hover: "group-hover:bg-green-600",
            border: "border-green-500",
            badge: "bg-green-100 text-green-700",
            gradient: "from-green-400 to-green-600"
        }
    };

    // Helper function to get color styles safely
    const getColorStyles = (color: ColorKey) => colorStyles[color];

    return (
        <section className="py-20 md:py-28 bg-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header Section */}
                <div className="max-w-5xl mx-auto text-center mb-16 md:mb-20">
                    <div className="inline-block mb-4">
                        <span className="text-sm md:text-base font-semibold text-primary uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full">
                            Who We Are
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                        Burdwan Sadar Pyara Nutrition{' '}
                        <span className="text-primary relative inline-block">
                            Welfare Society
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 200 8" preserveAspectRatio="none">
                                <path d="M0 4 C20 8, 40 0, 60 4 C80 8, 100 0, 120 4 C140 8, 160 0, 180 4 L200 4" fill="none" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-amber-500 mx-auto rounded-full"></div>
                </div>

                {/* Mission Statement Cards */}
                <div className="max-w-7xl mx-auto mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 - Wellness */}
                        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-primary/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                    <svg className="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Way to Healthy Life</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    BSPNWS is dedicated to promoting wellness for every individual in the community, working tirelessly to ensure access to quality health and nutrition for all.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 - Women Empowerment */}
                        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-pink-500/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-500 group-hover:scale-110 transition-all duration-300">
                                    <svg className="w-7 h-7 text-pink-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Women Empowerment</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Committed to improving the quality of life for vulnerable groups, with special focus on empowering women through education and skill development.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 - Environment */}
                        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-green-500/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                                    <svg className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Cleaner & Greener</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Working towards a better environment because a healthy life requires a cleaner, greener surroundings with proper hygiene practices.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Text */}
                <div className="max-w-4xl mx-auto mb-20">
                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-3xl p-8 md:p-10 shadow-md border border-gray-100">
                        <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">
                            <span className="font-bold text-gray-900">Burdwan Sadar Pyara Nutrition Welfare Society (BSPNWS)</span> is a non-government organization working in the field of wellness for every person in the community. Therefore, BSPNWS means — <span className="font-bold italic text-primary">"a way to a healthy life"</span>.
                        </p>
                        <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">
                            Team BSPNWS is trying to improve the quality of life of vulnerable groups as well as ensure <span className="font-bold text-gray-900">women empowerment</span>. Not only that, Team BSPNWS is also working in the field of environment because, to live a healthy life, we need a better environment, and hygienic means must be followed to maintain a healthy environment. So make your surroundings <span className="font-bold text-green-600">cleaner and greener</span>.
                        </p>
                        <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                            Team Burdwan Sadar Pyara Nutrition Welfare Society is working hard to promote <span className="font-bold text-gray-900">nutrition education</span> as nutrition education is the only key factor which gives knowledge on how to lead a healthy life.
                        </p>
                    </div>
                </div>
            </div>

            {/* Registration Section */}
            <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 md:py-24 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                </div>

                {/* Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Official Recognition</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                                Registration & Certifications
                            </h3>
                            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                                Officially recognized by Government of India and West Bengal Government bodies
                            </p>
                        </div>

                        {/* Registration Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {registrationData.map((item) => {
                                const styles = getColorStyles(item.color);
                                return (
                                    <div
                                        key={item.id}
                                        className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                                    >
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.gradient}`}></div>
                                        <div className="p-6">
                                            {/* Icon and Badge */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`w-12 h-12 rounded-xl ${styles.bg} flex items-center justify-center ${styles.text} ${styles.hover} group-hover:text-white transition-all duration-300`}>
                                                    {item.icon}
                                                </div>
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${styles.badge}`}>
                                                    {item.badge}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <h4 className={`text-xl font-bold text-gray-900 mb-2 group-hover:${styles.text} transition-colors`}>
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 mb-4">{item.description}</p>

                                            {/* Details or Status */}
                                            {item.hasDetails ? (
                                                <div className="pt-4 border-t border-gray-100">
                                                    <p className="text-xs text-gray-400 font-medium mb-1">Registration No</p>
                                                    <p className="text-sm font-mono font-bold text-gray-900 break-all">{item.registrationNo}</p>
                                                    {item.year && (
                                                        <p className="text-xs text-gray-400 mt-2">Year: {item.year}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="pt-4 border-t border-gray-100">
                                                    <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        {item.status}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Hover Effect Overlay */}
                                        <div className={`absolute inset-0 ${styles.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Additional Info Badge */}
                        <div className="text-center mt-12">
                            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
                                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-300 text-sm">All certifications are valid and verified by respective government authorities</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;