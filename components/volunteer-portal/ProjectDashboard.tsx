"use client";

import React, { useMemo } from 'react';

export default function ProjectDashboard() {
    const currentYear = new Date().getFullYear();

    // Simulated project contribution data
    const projects = [
        { name: 'Water Distribution', code: 'PROJ-WD' },
        { name: 'Sanitation Drive', code: 'PROJ-SD' },
        { name: 'Education Support', code: 'PROJ-ES' },
        { name: 'Health Camp', code: 'PROJ-HC' },
    ];

    const intensityData = useMemo(() => {
        return projects.map(() =>
            Array.from({ length: 12 }, () => Math.floor(Math.random() * 5))
        );
    }, []);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-700"></div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-1">Project Dashboard</h3>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Contribution Programme Wise</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                        ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400">+12 Contributors</span>
                </div>
            </div>

            <div className="space-y-6">
                {projects.map((project, pIdx) => (
                    <div key={project.code} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-gray-700 uppercase tracking-tight">{project.name}</span>
                            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">{project.code}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-3 flex gap-1">
                                {months.map((month, mIdx) => (
                                    <div
                                        key={`${project.code}-${month}`}
                                        className={`flex-1 rounded-[3px] transition-all duration-300 hover:scale-x-110 hover:z-10 cursor-help ${intensityData[pIdx][mIdx] === 0 ? 'bg-gray-100 hover:bg-gray-200' :
                                                intensityData[pIdx][mIdx] === 1 ? 'bg-purple-200 shadow-sm shadow-purple-200/50' :
                                                    intensityData[pIdx][mIdx] === 2 ? 'bg-purple-400 shadow-sm shadow-purple-400/50' :
                                                        intensityData[pIdx][mIdx] === 3 ? 'bg-purple-600 shadow-sm shadow-purple-600/50' :
                                                            'bg-purple-800 shadow-sm shadow-purple-800/50'
                                            }`}
                                        title={`${project.name}: ${intensityData[pIdx][mIdx]} updates in ${month}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100/50">
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Impactful</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">No Activity</span>
                    </div>
                </div>
                <button className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline transition-all">
                    View Detailed Reports →
                </button>
            </div>
        </div>
    );
}
