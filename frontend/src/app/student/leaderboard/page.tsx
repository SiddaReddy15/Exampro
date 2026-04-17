"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi, studentApi } from "@/services/api";
import { 
    Trophy, Medal, Search, Filter, ArrowRight, 
    Loader2, User, Star, TrendingUp, ChevronUp,
    Target, Award, BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentLeaderboard() {
  const [examId, setExamId] = useState<string>("all");

  const { data: exams } = useQuery({
    queryKey: ["allExams"],
    queryFn: () => adminApi.getExams().then(res => res.data),
  });

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard", examId],
    queryFn: () => fetch(`http://127.0.0.1:5000/api/leaderboard?examId=${examId === 'all' ? '' : examId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => res.json()),
  });

  const topThree = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 selection:bg-brand-indigo/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-heading font-black tracking-tight mb-2">Technical Rankings</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            The hall of fame for top technical talent in the ecosystem.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-[24px] border border-border shadow-sm">
            <div className="flex items-center gap-3 px-4 border-r border-slate-100">
                <Filter size={18} className="text-brand-indigo" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Context</span>
            </div>
            <select 
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                className="bg-transparent outline-none font-bold text-sm pr-6 cursor-pointer"
            >
                <option value="all">Global Rankings</option>
                {exams?.map((exam: any) => (
                    <option key={exam.id} value={exam.id}>{exam.title}</option>
                ))}
            </select>
        </div>
      </div>

      {/* Podium Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-10">
        {/* Silver - 2nd Place */}
        <div className="order-2 md:order-1">
          {topThree[1] && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl relative text-center group hover:-translate-y-2 transition-transform duration-500"
            >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 rounded-[28px] bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-white shadow-2xl relative">
                        <User size={32} />
                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center border-2 border-white font-black text-xs shadow-lg">2</div>
                    </div>
                </div>
                <div className="pt-10">
                    <h3 className="text-xl font-black font-heading truncate">{topThree[1].name}</h3>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Silver Medalist</div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="text-3xl font-black text-slate-500">{topThree[1].averagePercentage}%</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Accuracy Score</div>
                    </div>
                </div>
            </motion.div>
          )}
        </div>

        {/* Gold - 1st Place */}
        <div className="order-1 md:order-2">
          {topThree[0] && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary-gradient p-1 rounded-[52px] shadow-2xl shadow-brand-indigo/40 relative group"
            >
                <div className="bg-white p-10 rounded-[50px] text-center relative overflow-hidden">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                        <div className="w-24 h-24 rounded-[32px] bg-amber-100 flex items-center justify-center text-amber-500 border-4 border-white shadow-2xl relative">
                            <Trophy size={40} />
                            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center border-2 border-white font-black text-sm shadow-lg">1</div>
                        </div>
                    </div>
                    <div className="pt-14 relative z-10">
                        <h3 className="text-2xl font-black font-heading truncate mb-1">{topThree[0].name}</h3>
                        <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-6">Supreme Champion</div>
                        <div className="bg-amber-50 rounded-[32px] p-6 border border-amber-100">
                            <div className="text-5xl font-black text-amber-600 tracking-tight">{topThree[0].averagePercentage}%</div>
                            <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-2">Elite Precision</div>
                        </div>
                    </div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-50 rounded-full blur-3xl opacity-50" />
                </div>
            </motion.div>
          )}
        </div>

        {/* Bronze - 3rd Place */}
        <div className="order-3 md:order-3">
          {topThree[2] && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl relative text-center group hover:-translate-y-2 transition-transform duration-500"
            >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 rounded-[28px] bg-orange-50 flex items-center justify-center text-orange-400 border-4 border-white shadow-2xl relative">
                        <Medal size={32} />
                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center border-2 border-white font-black text-xs shadow-lg">3</div>
                    </div>
                </div>
                <div className="pt-10">
                    <h3 className="text-xl font-black font-heading truncate">{topThree[2].name}</h3>
                    <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-4">Bronze Medalist</div>
                    <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100/50">
                        <div className="text-3xl font-black text-orange-600">{topThree[2].averagePercentage}%</div>
                        <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-1">Accuracy Score</div>
                    </div>
                </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Detailed Ranking Table */}
      <div className="bg-white rounded-[48px] border border-border shadow-soft overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h2 className="text-xl font-black font-heading tracking-tight flex items-center gap-3">
                <BarChart3 className="text-brand-indigo" />
                Competitor Registry
            </h2>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Total Competitors: {leaderboard?.length || 0}
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-50">
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rank</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Candidate</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Exams Attempted</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Cumulative Score</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Success Rate</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {isLoading ? (
                        [1,2,3,4,5].map(i => (
                            <tr key={i} className="animate-pulse">
                                <td colSpan={5} className="px-10 py-8"><div className="h-10 bg-slate-50 rounded-2xl" /></td>
                            </tr>
                        ))
                    ) : rest.map((user: any, i: number) => (
                        <tr key={user.user_id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-10 py-6">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-sm text-slate-500">
                                    {i + 4}
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 font-black text-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-800">{user.name}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs font-black text-slate-600">
                                    {user.totalExams || 1}
                                </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                                <div className="text-sm font-black text-brand-indigo">{user.score || user.totalScore || 0} Pts</div>
                            </td>
                            <td className="px-10 py-6 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden md:block">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${user.averagePercentage || user.percentage || 0}%` }}
                                            className="h-full bg-brand-emerald rounded-full"
                                        />
                                    </div>
                                    <span className="text-sm font-black text-brand-emerald">{user.averagePercentage || user.percentage || 0}%</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
