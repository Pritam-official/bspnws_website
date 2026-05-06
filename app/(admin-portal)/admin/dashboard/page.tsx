"use client";

import React, { useState, useEffect } from 'react';

const stats = [
    {
        title: 'All Volunteers',
        count: 124,
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        accent: '#4a7ab5',
        bg: '#eef4fc',
        trend: '+12 this month',
        trendUp: true,
    },
    {
        title: 'Volunteer Requests',
        count: 8,
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
        ),
        accent: '#c47d2e',
        bg: '#fdf3e7',
        trend: '3 pending review',
        trendUp: null,
    },
    {
        title: 'Total Notices',
        count: 15,
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        ),
        accent: '#b06c40',
        bg: '#f9ede3',
        trend: '+3 this week',
        trendUp: true,
    },
    {
        title: 'Annual Reports',
        count: 6,
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        accent: '#4a9e72',
        bg: '#eaf6f0',
        trend: 'Last: Mar 2026',
        trendUp: null,
    },
    {
        title: 'Total Programmes',
        count: 22,
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        accent: '#7b5ea7',
        bg: '#f2edf9',
        trend: '4 upcoming',
        trendUp: true,
    },
    {
        title: 'Total Projects',
        count: 9,
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
        accent: '#2e9aaa',
        bg: '#e7f6f8',
        trend: '2 in progress',
        trendUp: null,
    },
    {
        title: 'Our Materials',
        count: 34,
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        accent: '#c0514a',
        bg: '#fdecea',
        trend: '+5 added',
        trendUp: true,
    },
    {
        title: 'Officers',
        count: 12,
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        accent: '#7a6e3c',
        bg: '#f6f3e7',
        trend: 'All active',
        trendUp: true,
    },
];

const recentVolunteers = [
    { name: 'Rahul Sharma', date: '28 Mar 2026', status: 'Active', initials: 'RS', color: '#4a7ab5' },
    { name: 'Priya Das', date: '26 Mar 2026', status: 'Active', initials: 'PD', color: '#b06c40' },
    { name: 'Amit Kumar', date: '25 Mar 2026', status: 'Active', initials: 'AK', color: '#4a9e72' },
    { name: 'Sneha Roy', date: '24 Mar 2026', status: 'Pending', initials: 'SR', color: '#7b5ea7' },
];

const recentNotices = [
    { title: 'Annual General Meeting 2026', date: '30 Mar 2026', type: 'Meeting', color: '#b06c40' },
    { title: 'Tree Plantation Drive', date: '28 Mar 2026', type: 'Event', color: '#4a9e72' },
    { title: 'Monthly Report Submission', date: '25 Mar 2026', type: 'Report', color: '#4a7ab5' },
    { title: 'Volunteer Training Session', date: '22 Mar 2026', type: 'Training', color: '#7b5ea7' },
];

// Sample events — in production, fetch from your API
const EVENTS: Record<string, { label: string; color: string }[]> = {
    '2026-04-05': [{ label: 'Committee Meeting', color: '#b06c40' }],
    '2026-04-10': [{ label: 'Volunteer Training', color: '#7b5ea7' }],
    '2026-04-14': [{ label: 'Tree Plantation Drive', color: '#4a9e72' }],
    '2026-04-18': [{ label: 'Annual Report Due', color: '#4a7ab5' }],
    '2026-04-22': [{ label: 'General Meeting', color: '#c0514a' }],
    '2026-04-28': [{ label: 'Volunteer Drive', color: '#2e9aaa' }],
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function Calendar() {
    const [now, setNow] = useState(new Date());
    const [view, setView] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() });
    const [selected, setSelected] = useState<string | null>(null);

    useEffect(() => {
        const tick = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(tick);
    }, []);

    const today = now;
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const firstDay = new Date(view.year, view.month, 1).getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const daysInPrev = new Date(view.year, view.month, 0).getDate();

    const cells: { day: number; key: string; cur: boolean }[] = [];
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = daysInPrev - i;
        const m = view.month === 0 ? 12 : view.month;
        const y = view.month === 0 ? view.year - 1 : view.year;
        cells.push({ day: d, key: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, cur: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, key: `${view.year}-${String(view.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, cur: true });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
        const m = view.month === 11 ? 1 : view.month + 2;
        const y = view.month === 11 ? view.year + 1 : view.year;
        cells.push({ day: d, key: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, cur: false });
    }

    const prevMonth = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
    const nextMonth = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });
    const goToday = () => { setView({ year: today.getFullYear(), month: today.getMonth() }); setSelected(todayKey); };

    const selectedEvents = selected ? (EVENTS[selected] || []) : [];

    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const timeStr = `${hh}:${mm}:${ss}`;
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const h12 = now.getHours() % 12 || 12;
    const timeDisplay = `${String(h12).padStart(2, '0')}:${mm}:${ss} ${ampm}`;

    return (
        <div className="cal-panel">
            {/* Clock */}
            <div className="cal-clock-row">
                <div className="cal-clock">{timeDisplay}</div>
                <div className="cal-clock-date">
                    {DAY_NAMES[now.getDay()]}, {now.getDate()} {MONTH_NAMES[now.getMonth()]} {now.getFullYear()}
                </div>
            </div>

            {/* Month nav */}
            <div className="cal-nav">
                <button className="cal-nav-btn" onClick={prevMonth}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="cal-month-label">
                    <span>{MONTH_NAMES[view.month]}</span>
                    <span className="cal-year">{view.year}</span>
                </div>
                <button className="cal-nav-btn" onClick={nextMonth}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                <button className="cal-today-btn" onClick={goToday}>Today</button>
            </div>

            {/* Day headers */}
            <div className="cal-grid">
                {DAY_NAMES.map(d => (
                    <div key={d} className="cal-day-header">{d}</div>
                ))}
                {cells.map((cell, i) => {
                    const isToday = cell.key === todayKey;
                    const isSelected = cell.key === selected;
                    const hasEvents = !!EVENTS[cell.key];
                    return (
                        <div
                            key={i}
                            className={`cal-cell ${!cell.cur ? 'cal-cell-other' : ''} ${isToday ? 'cal-cell-today' : ''} ${isSelected && !isToday ? 'cal-cell-selected' : ''}`}
                            onClick={() => cell.cur && setSelected(cell.key === selected ? null : cell.key)}
                        >
                            <span className="cal-day-num">{cell.day}</span>
                            {hasEvents && cell.cur && (
                                <div className="cal-dots">
                                    {EVENTS[cell.key].slice(0, 3).map((ev, ei) => (
                                        <span key={ei} className="cal-dot" style={{ background: ev.color }} />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Event detail */}
            <div className={`cal-events ${selectedEvents.length > 0 ? 'cal-events-visible' : ''}`}>
                {selectedEvents.length > 0 ? (
                    <>
                        <div className="cal-events-title">
                            {selected && (() => {
                                const [y, m, d] = selected.split('-').map(Number);
                                return `${d} ${MONTH_NAMES[m - 1]}`;
                            })()}
                        </div>
                        {selectedEvents.map((ev, i) => (
                            <div key={i} className="cal-event-row">
                                <span className="cal-event-dot" style={{ background: ev.color }} />
                                <span className="cal-event-label">{ev.label}</span>
                            </div>
                        ))}
                    </>
                ) : selected ? (
                    <div className="cal-no-event">No events on this day</div>
                ) : null}
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const [now, setNow] = React.useState(new Date());
    React.useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    const dateLabel = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

                .dash-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #f7f5f2;
                    padding: 40px 32px 80px;
                    color: #1a1a1a;
                }

                /* ── Header ── */
                .dash-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 40px;
                    padding-bottom: 32px;
                    border-bottom: 1px solid #e5e0d8;
                }
                .dash-eyebrow {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b06c40;
                    margin-bottom: 8px;
                }
                .dash-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 42px;
                    font-weight: 400;
                    line-height: 1.1;
                    color: #1a1a1a;
                    margin: 0;
                }
                .dash-title em {
                    font-style: italic;
                    color: #b06c40;
                }
                .dash-subtitle {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #8a8070;
                }
                .dash-date-badge {
                    background: #fff;
                    border: 1px solid #e5e0d8;
                    border-radius: 100px;
                    padding: 10px 20px;
                    font-size: 13px;
                    font-weight: 500;
                    color: #5c5146;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .dash-date-badge svg { color: #b06c40; }

                /* ── Stat Cards ── */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px;
                    margin-bottom: 32px;
                }
                .stat-card {
                    background: #ffffff;
                    border: 1px solid #e5e0d8;
                    border-radius: 16px;
                    padding: 22px 22px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    transition: box-shadow 0.22s, transform 0.22s;
                    position: relative;
                    overflow: hidden;
                }
                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: var(--accent);
                    opacity: 0;
                    transition: opacity 0.22s;
                }
                .stat-card:hover {
                    box-shadow: 0 10px 36px rgba(0,0,0,0.09);
                    transform: translateY(-3px);
                }
                .stat-card:hover::before { opacity: 1; }

                .stat-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .stat-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg);
                    color: var(--accent);
                    flex-shrink: 0;
                }
                .stat-label {
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #9a9080;
                }
                .stat-count {
                    font-family: 'DM Serif Display', serif;
                    font-size: 38px;
                    font-weight: 400;
                    color: #1a1a1a;
                    line-height: 1;
                }
                .stat-trend {
                    font-size: 11px;
                    font-weight: 500;
                    color: #9a9080;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding-top: 6px;
                    border-top: 1px solid #f0ece6;
                }
                .trend-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                /* ── Bottom panels ── */
                .bottom-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 20px;
                }
                .panel {
                    background: #ffffff;
                    border: 1px solid #e5e0d8;
                    border-radius: 20px;
                    padding: 32px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                }
                .panel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                }
                .panel-title {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #b06c40;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .panel-title::after {
                    content: '';
                    display: block;
                    width: 40px;
                    height: 1px;
                    background: #ede8e1;
                }
                .panel-view-all {
                    font-size: 11px;
                    font-weight: 600;
                    color: #9a9080;
                    letter-spacing: 0.04em;
                    text-decoration: none;
                    border-bottom: 1px solid #d4cdc4;
                    padding-bottom: 1px;
                    transition: color 0.15s, border-color 0.15s;
                    cursor: pointer;
                    background: none;
                    border-top: none;
                    border-left: none;
                    border-right: none;
                }
                .panel-view-all:hover { color: #b06c40; border-color: #b06c40; }

                /* Row items */
                .row-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 13px 0;
                    border-bottom: 1px solid #f0ece6;
                }
                .row-item:last-child { border-bottom: none; padding-bottom: 0; }
                .row-item:first-child { padding-top: 0; }

                .row-left {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                }
                .row-avatar {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 700;
                    color: #fff;
                    flex-shrink: 0;
                    letter-spacing: 0.02em;
                }
                .row-name {
                    font-size: 14px;
                    font-weight: 500;
                    color: #1a1a1a;
                    line-height: 1.2;
                }
                .row-meta {
                    font-size: 11px;
                    color: #a09080;
                    margin-top: 2px;
                }
                .status-pill {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    padding: 4px 11px;
                    border-radius: 100px;
                }
                .status-active { background: #eaf6f0; color: #3a8a5a; }
                .status-pending { background: #fdf3e7; color: #c47d2e; }
                .type-chip {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    padding: 4px 11px;
                    border-radius: 100px;
                    background: #f0ece6;
                    color: #7a6e60;
                }

                /* Quick summary bar */
                .summary-bar {
                    background: #1a1a1a;
                    border-radius: 16px;
                    padding: 22px 32px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                    gap: 16px;
                }
                .summary-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }
                .summary-val {
                    font-family: 'DM Serif Display', serif;
                    font-size: 28px;
                    font-weight: 400;
                    color: #fff;
                    line-height: 1;
                }
                .summary-key {
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: #7a6e5e;
                }
                .summary-divider {
                    width: 1px;
                    height: 36px;
                    background: #2e2e2e;
                    flex-shrink: 0;
                }

                /* ── Calendar ── */
                .cal-panel {
                    background: #ffffff;
                    border: 1px solid #e5e0d8;
                    border-radius: 20px;
                    padding: 28px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }
                .cal-clock-row {
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #f0ece6;
                }
                .cal-clock {
                    font-family: 'DM Serif Display', serif;
                    font-size: 26px;
                    font-weight: 400;
                    color: #1a1a1a;
                    letter-spacing: 0.02em;
                    font-variant-numeric: tabular-nums;
                }
                .cal-clock-date {
                    font-size: 11px;
                    font-weight: 500;
                    color: #9a9080;
                    letter-spacing: 0.03em;
                }
                .cal-nav {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px;
                }
                .cal-nav-btn {
                    width: 30px;
                    height: 30px;
                    border-radius: 8px;
                    border: 1px solid #e5e0d8;
                    background: #faf8f5;
                    color: #5c5146;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.15s, border-color 0.15s;
                    padding: 0;
                }
                .cal-nav-btn:hover { background: #f0ece6; border-color: #d4cdc4; }
                .cal-month-label {
                    flex: 1;
                    text-align: center;
                    font-size: 14px;
                    font-weight: 600;
                    color: #1a1a1a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }
                .cal-year {
                    color: #9a9080;
                    font-weight: 400;
                }
                .cal-today-btn {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #b06c40;
                    background: #f9ede3;
                    border: 1px solid #e8d0bc;
                    border-radius: 100px;
                    padding: 5px 12px;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .cal-today-btn:hover { background: #f0ddd0; }
                .cal-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 2px;
                }
                .cal-day-header {
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #b0a898;
                    text-align: center;
                    padding: 4px 0 8px;
                }
                .cal-cell {
                    aspect-ratio: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    cursor: pointer;
                    gap: 3px;
                    transition: background 0.12s;
                    position: relative;
                }
                .cal-cell:hover:not(.cal-cell-today):not(.cal-cell-other) {
                    background: #f0ece6;
                }
                .cal-cell-other {
                    cursor: default;
                }
                .cal-cell-today {
                    background: #1a1a1a;
                }
                .cal-cell-today .cal-day-num { color: #fff; }
                .cal-cell-selected {
                    background: #f9ede3;
                    outline: 1.5px solid #b06c40;
                }
                .cal-day-num {
                    font-size: 12px;
                    font-weight: 500;
                    color: #1a1a1a;
                    line-height: 1;
                }
                .cal-cell-other .cal-day-num { color: #ccc4ba; }
                .cal-dots {
                    display: flex;
                    gap: 2px;
                    align-items: center;
                }
                .cal-dot {
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    display: block;
                }
                .cal-cell-today .cal-dot { opacity: 0.8; }
                .cal-events {
                    margin-top: 14px;
                    padding-top: 14px;
                    border-top: 1px solid #f0ece6;
                    min-height: 0;
                    overflow: hidden;
                    transition: min-height 0.2s;
                }
                .cal-events-visible { min-height: 48px; }
                .cal-events-title {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #b06c40;
                    margin-bottom: 10px;
                }
                .cal-event-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 0;
                    border-bottom: 1px solid #f5f1ec;
                }
                .cal-event-row:last-child { border-bottom: none; }
                .cal-event-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .cal-event-label {
                    font-size: 13px;
                    font-weight: 500;
                    color: #3a3228;
                }
                .cal-no-event {
                    font-size: 12px;
                    color: #b0a898;
                    font-weight: 500;
                    padding: 6px 0;
                }

                @media (max-width: 1200px) {
                    .stats-grid { grid-template-columns: repeat(4, 1fr); }
                }
                @media (max-width: 900px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .bottom-grid { grid-template-columns: 1fr; }
                }
                @media (max-width: 600px) {
                    .dash-root { padding: 24px 16px 60px; }
                    .dash-header { flex-direction: column; align-items: flex-start; gap: 16px; }
                    .dash-title { font-size: 32px; }
                    .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
                    .summary-bar { flex-wrap: wrap; }
                }
            `}</style>

            <div className="dash-root">

                {/* ── Header ── */}
                <div className="dash-header">
                    <div>
                        <div className="dash-eyebrow">Society Management</div>
                        <h1 className="dash-title">Admin <em>Dashboard</em></h1>
                        <p className="dash-subtitle">Welcome back — here's an overview of your society.</p>
                    </div>
                    <div className="dash-date-badge">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {dateLabel}
                    </div>
                </div>

                {/* ── Summary Bar ── */}
                <div className="summary-bar">
                    {[
                        { val: '124', key: 'Volunteers' },
                        { val: '22', key: 'Programmes' },
                        { val: '9', key: 'Projects' },
                        { val: '15', key: 'Notices' },
                        { val: '6', key: 'Reports' },
                        { val: '8', key: 'Requests' },
                        { val: '34', key: 'Materials' },
                        { val: '12', key: 'Officers' },
                    ].map((s, i, arr) => (
                        <React.Fragment key={s.key}>
                            <div className="summary-item">
                                <span className="summary-val">{s.val}</span>
                                <span className="summary-key">{s.key}</span>
                            </div>
                            {i < arr.length - 1 && <div className="summary-divider" />}
                        </React.Fragment>
                    ))}
                </div>

                {/* ── Stats Grid ── */}
                <div className="stats-grid">
                    {stats.map((s) => (
                        <div
                            key={s.title}
                            className="stat-card"
                            style={{ '--accent': s.accent, '--bg': s.bg } as React.CSSProperties}
                        >
                            <div className="stat-top">
                                <div className="stat-icon">{s.icon}</div>
                                <span className="stat-label">{s.title}</span>
                            </div>
                            <div className="stat-count">{s.count}</div>
                            <div className="stat-trend">
                                <span
                                    className="trend-dot"
                                    style={{ background: s.trendUp === true ? '#4a9e72' : s.trendUp === false ? '#c0514a' : '#c4bcb0' }}
                                />
                                {s.trend}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Bottom Panels ── */}
                <div className="bottom-grid">

                    {/* Recent Volunteers */}
                    <div className="panel">
                        <div className="panel-header">
                            <span className="panel-title">Recent Volunteers</span>
                            <button className="panel-view-all">View all</button>
                        </div>
                        {recentVolunteers.map((v) => (
                            <div key={v.name} className="row-item">
                                <div className="row-left">
                                    <div className="row-avatar" style={{ background: v.color }}>{v.initials}</div>
                                    <div>
                                        <div className="row-name">{v.name}</div>
                                        <div className="row-meta">{v.date}</div>
                                    </div>
                                </div>
                                <span className={`status-pill ${v.status === 'Active' ? 'status-active' : 'status-pending'}`}>
                                    {v.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Recent Notices */}
                    <div className="panel">
                        <div className="panel-header">
                            <span className="panel-title">Recent Notices</span>
                            <button className="panel-view-all">View all</button>
                        </div>
                        {recentNotices.map((n) => (
                            <div key={n.title} className="row-item">
                                <div className="row-left">
                                    <div className="row-avatar" style={{ background: n.color }}>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="row-name">{n.title}</div>
                                        <div className="row-meta">{n.date}</div>
                                    </div>
                                </div>
                                <span className="type-chip">{n.type}</span>
                            </div>
                        ))}
                    </div>

                    {/* Real-time Calendar */}
                    <Calendar />

                </div>

            </div>
        </>
    );
}