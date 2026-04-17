"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { 
    ArrowLeft, PieChart as PieChartIcon, BarChart3, Users, 
    Target, Layout, CheckCircle2, XCircle, Activity, Info
} from "lucide-react";
import Link from "next/link";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from "recharts";
import { motion } from "framer-motion";

export default function ExamAnalytics() {
  const { id: examId } = useParams();
  
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["examAnalytics", examId],
    queryFn: () => adminApi.getExamAnalytics(examId as string).then(res => res.data),
  });

  const pieData = analytics?.distribution ? [
    { name: 'Passed', value: analytics.distribution.passed },
    { name: 'Failed', value: analytics.distribution.failed },
  ] : [];

  const COLORS = ['#10B981', '#F59E0B'];

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-indigo"></div>
    </div>
  );

  return (
    <div className="space-y-10 selection:bg-brand-indigo/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link href="/admin/results" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-brand-indigo mb-4 transition">
            <ArrowLeft size={16} className="mr-2" />
            Back to Registry
          </Link>
          <h1 className="text-4xl font-heading font-black tracking-tight mb-2">Granular Performance Analysis</h1>
          <p className="text-muted-foreground font-body font-medium">Detailed breakdown of question-level effectiveness and candidate outcomes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-brand-indigo/5 rounded-2xl text-brand-indigo">
                  <PieChartIcon size={24} />
              </div>
              <h2 className="text-xl font-bold font-heading">Outcome Distribution</h2>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={10}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontWeight: 700}} />
                </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-border flex flex-col justify-center">
           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center">
                       <Users size={24} />
                    </div>
                    <div>
                        <div className="text-xs font-black text-muted-foreground uppercase opacity-60">Total Submissions</div>
                        <div className="text-2xl font-black">{analytics?.summary?.count || 0}</div>
                    </div>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                       <Target size={24} />
                    </div>
                    <div>
                        <div className="text-xs font-black text-muted-foreground uppercase opacity-60">Average Global Score</div>
                        <div className="text-2xl font-black">{Math.round(analytics?.summary?.avg_score || 0)} Pts</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-primary-gradient p-8 rounded-[40px] shadow-xl shadow-brand-indigo/20 text-white flex flex-col justify-center">
           <div>
              <Activity size={32} className="opacity-40 mb-4" />
              <h3 className="text-xl font-black mb-2">Assessment Health</h3>
              <p className="text-white/70 text-sm font-medium leading-relaxed">This assessment has a {Math.round((analytics?.distribution?.passed / analytics?.summary?.count) * 100) || 0}% pass rate, providing valuable insights into candidate quality and exam effectiveness.</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-border overflow-hidden">
        <div className="p-8 border-b border-border bg-slate-50/30">
           <h2 className="text-2xl font-black font-heading tracking-tight flex items-center gap-3">
              <div className="p-2 bg-brand-indigo/10 rounded-xl text-brand-indigo">
                <Layout size={20} />
              </div>
              Question Effectiveness analysis
           </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Question Detail</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Success Rate</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {analytics?.questions?.map((q: any, i: number) => {
                const successRate = Math.round((q.correct_count / q.total_answers) * 100) || 0;
                return (
                  <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 mt-1">
                          {i + 1}
                        </div>
                        <div className="text-sm font-bold text-slate-800 max-w-md">{q.question_text}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-[10px] text-brand-indigo uppercase tracking-wider">{q.type}</td>
                    <td className="px-8 py-6">
                      <div className="w-40 space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                            <span>{successRate}% Accuracy</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-brand-emerald" style={{ width: `${successRate}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black ${successRate > 70 ? "bg-brand-emerald/10 text-brand-emerald" : successRate > 30 ? "bg-brand-orange/10 text-brand-orange" : "bg-red-100 text-red-600"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${successRate > 70 ? "bg-brand-emerald" : successRate > 30 ? "bg-brand-orange" : "bg-red-600"}`} />
                          {successRate > 70 ? "EASY" : successRate > 30 ? "MODERATE" : "CRITICAL"}
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
