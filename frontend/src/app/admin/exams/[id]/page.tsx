"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi, studentApi } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { 
    ArrowLeft, Calendar, Clock, Trophy, FileText, 
    Settings, HelpCircle, ChevronRight, Globe, Lock, Trash2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ExamDetail() {
  const { id } = useParams();
  const router = useRouter();

  const { data: exams } = useQuery({
    queryKey: ["adminExams"],
    queryFn: () => adminApi.getExams().then(res => res.data),
  });

  const exam = exams?.find((e: any) => e.id === id);

  if (!exam) return (
    <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground font-bold">Identifying Assessment...</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 selection:bg-brand-indigo/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <Link href="/admin/exams" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-brand-indigo mb-4 transition">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Inventory
                </Link>
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-heading font-black tracking-tight">{exam.title}</h1>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 ${exam.is_published ? "bg-brand-emerald/10 text-brand-emerald" : "bg-slate-100 text-slate-500"}`}>
                        {exam.is_published ? <Globe size={12} /> : <Lock size={12} />}
                        {exam.is_published ? "PUBLISHED" : "DRAFT"}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => {/* Implement delete */}}
                  className="p-4 bg-white border border-border text-red-500 rounded-2xl hover:bg-red-50 transition shadow-sm"
                >
                    <Trash2 size={20} />
                </button>
                <Link 
                    href={`/admin/exams/${id}/questions`}
                    className="px-8 py-4 bg-primary-gradient text-white rounded-2xl font-black shadow-xl shadow-brand-indigo/20 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <HelpCircle size={20} />
                    Curate Questions
                </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-border">
                    <h2 className="text-xl font-black font-heading mb-8 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-brand-indigo rounded-full" />
                        Assessment Parameters
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                               <Clock size={14} className="text-brand-indigo" /> Time Constraint
                           </div>
                           <p className="text-2xl font-black font-heading">{exam.duration} Minutes</p>
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                               <Trophy size={14} className="text-brand-emerald" /> Excellence Threshold
                           </div>
                           <p className="text-2xl font-black font-heading">{exam.passing_score}% Score</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-border">
                    <h2 className="text-xl font-black font-heading mb-8 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-brand-purple rounded-full" />
                        Deployment Schedule
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                               <Calendar size={14} className="text-brand-purple" /> Activation
                           </div>
                           <p className="text-lg font-bold text-slate-700">{new Date(exam.start_time).toLocaleString()}</p>
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                               <Calendar size={14} className="text-brand-pink" /> Termination
                           </div>
                           <p className="text-lg font-bold text-slate-700">{new Date(exam.end_time).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <Link href={`/admin/results/${id}`} className="block bg-white p-10 rounded-[40px] shadow-sm border border-border group hover:border-brand-indigo transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Activity size={24} />
                    </div>
                    <h3 className="text-xl font-black font-heading mb-2">Live Analytics</h3>
                    <p className="text-sm text-muted-foreground font-medium mb-6">Monitor student progress and success rates in real-time.</p>
                    <div className="text-xs font-black text-brand-indigo uppercase tracking-widest flex items-center gap-2">
                        Enter Analytics <ChevronRight size={14} />
                    </div>
                </Link>

                <div className="bg-slate-900 p-10 rounded-[40px] shadow-xl text-white">
                    <Settings size={32} className="opacity-40 mb-6" />
                    <h3 className="text-xl font-black font-heading mb-2">Structure Settings</h3>
                    <p className="text-white/60 text-sm font-medium mb-8">Modify the core configuration or adjust scheduling parameters.</p>
                    <Link 
                        href={`/admin/exams/edit/${id}`}
                        className="block w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all border border-white/10 text-center"
                    >
                        Edit Configuration
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}
