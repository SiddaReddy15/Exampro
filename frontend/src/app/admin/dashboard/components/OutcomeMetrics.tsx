"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts";
import { 
    ChevronDown, Award, TrendingUp, Users, Target, 
    PieChart as PieIcon, Activity, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ranges = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "90d" },
  { label: "Last Year", value: "365d" },
];

const COLORS = ['#10B981', '#F59E0B'];

export default function OutcomeMetrics() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/outcome-metrics?range=${range}`);
        if (!response.ok) throw new Error("Synchronization Error");
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [range]);

  const pieData = data ? [
    { name: 'Passed', value: data.passed },
    { name: 'Failed', value: data.failed },
  ] : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-lg transition-all duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald shadow-sm">
            <PieIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Outcome Metrics</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest opacity-60">Result Distribution</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative group">
                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 font-bold py-2.5 pl-4 pr-10 rounded-xl text-xs outline-none focus:ring-4 ring-brand-emerald/5 focus:bg-white transition-all cursor-pointer"
                >
                    {ranges.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-emerald transition-colors" size={14} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Visualization */}
        <div className="space-y-8">
            <div className="h-64 w-full relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 rounded-full border-4 border-slate-50 border-t-brand-emerald animate-spin" />
                    </div>
                ) : data?.totalAttempts === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300">
                        <Activity size={48} />
                        <span className="text-sm font-bold uppercase tracking-widest">No results detected</span>
                    </div>
                ) : null}

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={8}
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={1500}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                            itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Stat */}
                {!isLoading && data && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-2xl font-black text-slate-900">{data.passRate}%</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Success</div>
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                    <span className="text-xs font-bold text-slate-600">Passed ({data?.passed || 0})</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <span className="text-xs font-bold text-slate-600">Failed ({data?.failed || 0})</span>
                </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Average Success</span>
                    <span className="text-sm font-black text-brand-emerald">{data?.averageSuccessRate || 0}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${data?.averageSuccessRate || 0}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    />
                </div>
            </div>
        </div>

        {/* Right: Detailed Stats */}
        <div className="grid grid-cols-2 gap-4">
            {[
                { label: "Total Attempts", value: data?.totalAttempts || 0, icon: <Activity />, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "Average Score", value: `${data?.averageScore || 0}%`, icon: <Target />, color: "text-purple-500", bg: "bg-purple-50" },
                { label: "Highest Score", value: `${data?.highestScore || 0}%`, icon: <Award />, color: "text-emerald-500", bg: "bg-emerald-50" },
                { label: "Lowest Score", value: `${data?.lowestScore || 0}%`, icon: <TrendingUp />, color: "text-amber-500", bg: "bg-amber-50" },
            ].map((stat, i) => (
                <div key={stat.label} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-slate-200 transition-all">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        {React.cloneElement(stat.icon as any, { size: 20 })}
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-lg font-black text-slate-900">{isLoading ? <div className="h-6 w-12 bg-slate-200 animate-pulse rounded" /> : stat.value}</div>
                </div>
            ))}
            
            <div className="col-span-2 p-5 rounded-2xl bg-brand-indigo/5 border border-brand-indigo/10 mt-2">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-black text-brand-indigo uppercase tracking-widest mb-1">Efficiency Index</div>
                        <div className="text-xl font-black text-brand-indigo">High Mobility</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-brand-indigo/20 border-t-brand-indigo animate-spin-slow" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
