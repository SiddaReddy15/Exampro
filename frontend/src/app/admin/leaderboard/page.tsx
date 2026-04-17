"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    Trophy, Medal, Search, Filter, Calendar, 
    ArrowRight, Loader2, User, Mail, Star, TrendingUp,
    ChevronUp, ChevronDown, Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function LeaderboardPage() {
    const [timeframe, setTimeframe] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("");

    const { data: leaderboardData, isLoading, refetch } = useQuery({
        queryKey: ["leaderboard", timeframe, categoryFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (timeframe !== "all") params.append("timeframe", timeframe);
            if (categoryFilter) params.append("category", categoryFilter);
            
            const res = await fetch(`/api/leaderboard?${params.toString()}`);
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            return data.data;
        }
    });

    const getRankStyle = (rank: number) => {
        if (rank === 1) return {
            bg: "bg-amber-50",
            border: "border-amber-200",
            icon: <Trophy className="text-amber-500" size={20} />,
            text: "text-amber-700",
            shadow: "shadow-amber-100"
        };
        if (rank === 2) return {
            bg: "bg-slate-50",
            border: "border-slate-200",
            icon: <Medal className="text-slate-400" size={20} />,
            text: "text-slate-700",
            shadow: "shadow-slate-100"
        };
        if (rank === 3) return {
            bg: "bg-orange-50",
            border: "border-orange-200",
            icon: <Medal className="text-orange-400" size={20} />,
            text: "text-orange-700",
            shadow: "shadow-orange-100"
        };
        return {
            bg: "bg-white",
            border: "border-border",
            icon: <span className="text-muted-foreground font-black">#{rank}</span>,
            text: "text-slate-600",
            shadow: "shadow-sm"
        };
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-brand-indigo font-black text-[10px] uppercase tracking-widest mb-2">
                        <Trophy size={14} /> Competitive Ranking
                    </div>
                    <h1 className="text-4xl font-heading font-black tracking-tight mb-2">Performance Leaderboard</h1>
                    <p className="text-muted-foreground font-medium max-w-2xl">
                        Recognizing top academic performers based on cumulative scores and precision metrics.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                        {[
                            { id: "all", label: "All Time" },
                            { id: "30d", label: "30 Days" },
                            { id: "7d", label: "7 Days" }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTimeframe(t.id)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    timeframe === t.id 
                                        ? "bg-white text-brand-indigo shadow-sm" 
                                        : "text-muted-foreground hover:bg-white/50"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top 3 Spotlight */}
            {!isLoading && leaderboardData && leaderboardData.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map((student, idx) => {
                        const actualIdx = idx === 0 ? 1 : idx === 1 ? 0 : 2;
                        const style = getRankStyle(actualIdx + 1);
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={student.id}
                                className={`relative ${style.bg} border-2 ${style.border} rounded-[40px] p-8 ${idx === 1 ? 'md:-translate-y-4 shadow-2xl scale-105' : 'shadow-xl'} transition-all`}
                            >
                                <div className="absolute top-6 right-6">
                                    {style.icon}
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-20 h-20 rounded-full ${idx === 1 ? 'bg-amber-100' : 'bg-slate-100'} flex items-center justify-center text-3xl font-black mb-6 border-4 border-white shadow-lg`}>
                                        {student.name.charAt(0)}
                                    </div>
                                    <h3 className="text-xl font-black font-heading mb-1">{student.name}</h3>
                                    <p className="text-muted-foreground text-xs font-bold mb-6">{student.email}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-black/5">
                                        <div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Score</div>
                                            <div className="text-lg font-black text-brand-indigo">{student.totalScore}</div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Accuracy</div>
                                            <div className="text-lg font-black text-emerald-500">{student.percentage}%</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Main Table */}
            <div className="bg-white rounded-[40px] border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-border">
                                <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Rank</th>
                                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Student</th>
                                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Exams Attempted</th>
                                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Cumulative Score</th>
                                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Success Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-10 py-8">
                                            <div className="h-10 bg-slate-50 rounded-2xl w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : leaderboardData?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                            <Award size={48} className="opacity-20" />
                                            <p className="font-bold">No ranking data available for this criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : leaderboardData?.map((student: any) => {
                                const style = getRankStyle(student.rank);
                                return (
                                    <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center border ${style.border} ${style.shadow} transition-transform group-hover:scale-110`}>
                                                {style.icon}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-brand-indigo">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{student.name}</div>
                                                    <div className="text-[10px] font-bold text-muted-foreground">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs font-black text-slate-600">
                                                {student.totalExams}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="text-sm font-black text-brand-indigo">{student.totalScore} Pts</div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden hidden md:block">
                                                    <div 
                                                        className="h-full bg-emerald-500 rounded-full" 
                                                        style={{ width: `${student.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-black text-emerald-600">{student.percentage}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
