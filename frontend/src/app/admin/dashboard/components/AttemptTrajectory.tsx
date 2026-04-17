"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Calendar, Filter, ChevronDown, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";

const ranges = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "90d" },
  { label: "Last Year", value: "365d" },
];

export default function AttemptTrajectory() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/attempt-trajectory?range=${range}`);
        if (!response.ok) throw new Error("Failed to fetch analytics");
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
        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 animate-in fade-in zoom-in duration-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {label ? format(parseISO(label), "MMM dd, yyyy") : ""}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-indigo" />
            <p className="text-sm font-black text-slate-900">
              {payload[0].value} Attempts
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 tracking-tight">Attempt Trajectory</h3>
          <p className="text-xs text-slate-400 font-medium">Exam participation trends</p>
        </div>

        <div className="flex items-center gap-2">
            <div className="relative group">
                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 font-semibold py-2 pl-3 pr-9 rounded-lg text-xs outline-none focus:ring-2 ring-brand-indigo/20 focus:bg-white transition-all cursor-pointer"
                >
                    {ranges.map((r) => (
                    <option key={r.value} value={r.value}>
                        {r.label}
                    </option>
                    ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={14} />
                </div>
            </div>
        </div>
      </div>

      <div className="h-80 w-full relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-[2px] z-10 rounded-xl">
            <Loader2 className="animate-spin text-brand-indigo" size={32} />
            <span className="text-xs font-bold text-slate-500 tracking-wider">Loading trajectory...</span>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <AlertCircle className="text-red-400" size={32} />
            <span className="text-xs font-bold text-red-400">{error}</span>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <Calendar className="text-slate-200" size={48} />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Activity Records</span>
          </div>
        ) : null}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              tickFormatter={(str) => {
                const date = parseISO(str);
                if (range === "7d") return format(date, "EEE");
                if (range === "30d") return format(date, "dd MMM");
                return format(date, "MMM yy");
              }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
            <Line
              type="monotone"
              dataKey="attempts"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
