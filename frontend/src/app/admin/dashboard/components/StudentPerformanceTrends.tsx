"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Cell, ComposedChart, Area
} from "recharts";
import { 
    ChevronDown, TrendingUp, AlertCircle, Loader2, Award, 
    XCircle, CheckCircle2, Target, BarChart3
} from "lucide-react";
import { format, parseISO } from "date-fns";

const ranges = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "90d" },
  { label: "Last Year", value: "365d" },
];

export default function StudentPerformanceTrends() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<{ trend: any[], summary: any }>({ trend: [], summary: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/student-performance?range=${range}`);
        if (!response.ok) throw new Error("Synchronization failure");
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 min-w-[180px]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pb-2 border-b border-slate-50">
            {label ? format(parseISO(label), "MMM dd, yyyy") : ""}
          </p>
          <div className="space-y-2">
            {payload.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] font-bold text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.value}{item.name.includes("Score") ? "%" : ""}</span>
                </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-lg transition-all duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple shadow-sm">
            <BarChart3 size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black font-heading tracking-tight text-slate-900">Student Performance Trends</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest opacity-70">Academic Outcomes & Progress</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
            {data.summary && !isLoading && (
                <div className="hidden sm:flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 mr-2">
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg. Score</p>
                        <p className="text-sm font-black text-brand-purple">{data.summary.averageScore}%</p>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pass Rate</p>
                        <p className="text-sm font-black text-brand-emerald">{data.summary.passRate}%</p>
                    </div>
                </div>
            )}
            <div className="relative">
                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="appearance-none bg-white border-2 border-slate-100 text-slate-700 font-bold py-2.5 pl-4 pr-10 rounded-xl text-xs outline-none focus:border-brand-purple/30 transition-all cursor-pointer shadow-sm"
                >
                    {ranges.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Performance Line Chart */}
        <div className="xl:col-span-8 h-80 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
              <Loader2 className="animate-spin text-brand-purple" size={32} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mapping Performance Data...</p>
            </div>
          ) : data.trend.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
              <Target className="text-slate-200" size={48} />
              <p className="text-xs font-bold text-slate-400 uppercase">No trend data available for this range</p>
            </div>
          ) : null}

          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                tickFormatter={(str) => {
                  const date = parseISO(str);
                  return range === "7d" ? format(date, "EEE") : format(date, "dd MMM");
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area
                type="monotone"
                dataKey="averageScore"
                name="Average Score"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.05}
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="highestScore"
                name="Highest Score"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Pass/Fail Bar Chart */}
        <div className="xl:col-span-4 h-80 relative bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
           <div className="flex items-center justify-between mb-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pass vs Fail Ratio</h4>
               <TrendingUp size={14} className="text-slate-300" />
           </div>
           {!isLoading && data.trend.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.trend} margin={{ top: 0, right: 0, left: -35, bottom: 0 }}>
                    <XAxis 
                        dataKey="date" 
                        hide 
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="passCount" name="Passed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="failCount" name="Failed" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
           ) : !isLoading ? (
             <div className="w-full h-full flex items-center justify-center italic text-slate-300 text-xs">Awaiting outcomes...</div>
           ) : null}
           
           <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-1 text-emerald-500">
                        <CheckCircle2 size={12} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Pass Rate</span>
                    </div>
                    <div className="text-lg font-black">{data.summary?.passRate || 0}%</div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-1 text-amber-500">
                        <XCircle size={12} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Fail Rate</span>
                    </div>
                    <div className="text-lg font-black">{100 - (data.summary?.passRate || 0)}%</div>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}
