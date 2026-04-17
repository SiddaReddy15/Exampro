"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/api";
import { FileText, Users, Award, TrendingUp, Calendar, ChevronRight, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import AttemptTrajectory from "./components/AttemptTrajectory";
import StudentPerformanceTrends from "./components/StudentPerformanceTrends";
import OutcomeMetrics from "./components/OutcomeMetrics";
import RecentLiveActivity from "./components/RecentLiveActivity";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => adminApi.getStats().then(res => res.data),
  });

  const passRate = stats?.passRate 
    ? Math.round((stats.passRate.passed / (stats.passRate.passed + stats.passRate.failed)) * 100) || 0 
    : 0;

  const cards = [
    { title: "Total Exams", value: stats?.totalExams || 0, icon: <FileText size={24} />, color: "text-brand-blue", bg: "bg-brand-blue/10", trend: "+4%" },
    { title: "Total Students", value: stats?.totalUsers || 0, icon: <Users size={24} />, color: "text-brand-indigo", bg: "bg-brand-indigo/10", trend: "+12%" },
    { title: "Total Submissions", value: stats?.totalAttempts || 0, icon: <TrendingUp size={24} />, color: "text-brand-purple", bg: "bg-brand-purple/10", trend: "+18%" },
    { title: "Upcoming Exams", value: stats?.upcomingExams || 0, icon: <Award size={24} />, color: "text-brand-emerald", bg: "bg-brand-emerald/10", trend: "0%" },
  ];

  const pieData = stats?.passRate ? [
    { name: 'Passed', value: stats.passRate.passed },
    { name: 'Failed', value: stats.passRate.failed },
  ] : [];

  const COLORS = ['#10B981', '#F59E0B'];

  return (
    <div className="space-y-10 selection:bg-brand-indigo/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black tracking-tight mb-2">Platform Overview</h1>
          <p className="text-muted-foreground font-body font-medium">Monitoring real-time academic performance and system activity.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-[24px] border border-border shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo shadow-inner">
            <Calendar size={20} />
          </div>
          <div className="pr-6">
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Current Session</div>
            <div className="text-sm font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            key={card.title} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-border group hover:shadow-2xl hover:border-brand-indigo/20 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <div className="text-[10px] font-black text-brand-emerald px-2 py-1 rounded-lg bg-brand-emerald/10 uppercase tracking-wider">
                {card.trend}
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-xs font-black text-muted-foreground mb-1 uppercase tracking-widest opacity-60 font-heading">{card.title}</div>
              <div className="text-3xl font-black tracking-tight text-dark">
                {isLoading ? <div className="h-9 w-20 bg-slate-100 animate-pulse rounded-xl" /> : card.value}
              </div>
            </div>
            {/* Subtle background decoration */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${card.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2"
        >
          <AttemptTrajectory />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.25 }}
        >
          <OutcomeMetrics />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <StudentPerformanceTrends />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-8"
      >
        <RecentLiveActivity />
      </motion.div>
    </div>
  );
}
