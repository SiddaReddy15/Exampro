"use client";

import { useQuery } from "@tanstack/react-query";
import { studentApi } from "@/services/api";
import { 
    FileText, Calendar, Clock, ArrowRight, 
    CheckCircle2, XCircle, Award, BarChart3,
    Search, Filter, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function MyResults() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: exams, isLoading } = useQuery({
    queryKey: ["availableExams"],
    queryFn: () => studentApi.getExams().then(res => res.data),
  });

  const completedExams = exams?.filter((e: any) => e.attempt_status === 'SUBMITTED') || [];

  const filtered = completedExams.filter((e: any) => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 selection:bg-brand-indigo/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black tracking-tight mb-2">Academic History</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">Review your past performance and growth trajectory.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-[24px] border border-border shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo shadow-inner">
                <BarChart3 size={20} />
            </div>
            <div className="pr-6">
                <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Total Completed</div>
                <div className="text-sm font-bold">{completedExams.length} Assessments</div>
            </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[32px] border border-border flex items-center gap-4 shadow-sm max-w-2xl">
        <Search className="ml-4 text-slate-300" size={20} />
        <input 
            type="text" 
            placeholder="Search through your technical records..." 
            className="flex-1 bg-transparent border-none outline-none font-bold text-sm py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="px-6 py-3 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 border border-slate-100">
            <Filter size={14} /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
            [1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-[40px] animate-pulse border border-border" />)
        ) : filtered.length === 0 ? (
            <div className="py-32 bg-white rounded-[48px] border-2 border-dashed border-border flex flex-col items-center justify-center text-center">
                <Award size={64} className="text-slate-100 mb-6" />
                <h3 className="text-2xl font-black font-heading mb-2">No Records Detected</h3>
                <p className="text-slate-400 font-bold max-w-sm mx-auto">You haven't completed any assessments yet. Start your technical journey by attempting an exam from the dashboard.</p>
                <Link href="/student/exams" className="mt-8 px-10 py-4 bg-brand-indigo text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-indigo/20 hover:scale-105 transition-all flex items-center gap-2">
                    Browse Exams <ArrowRight size={16} />
                </Link>
            </div>
        ) : filtered.map((exam: any, idx: number) => {
            const isPassed = exam.score >= exam.passing_score;
            return (
                <motion.div 
                    key={exam.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-8 rounded-[40px] border border-border shadow-sm hover:shadow-2xl hover:border-brand-indigo/20 transition-all duration-300 group"
                >
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center shrink-0 shadow-lg ${
                            isPassed ? "bg-brand-emerald/10 text-brand-emerald" : "bg-red-50 text-red-500"
                        }`}>
                            {isPassed ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                        </div>
                        
                        <div className="flex-1 space-y-2 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                    Assessment Record
                                </span>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                    isPassed ? "bg-brand-emerald text-white" : "bg-red-500 text-white"
                                }`}>
                                    {isPassed ? "PASSED" : "FAILED"}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black font-heading tracking-tight leading-none group-hover:text-brand-indigo transition-colors">{exam.title}</h3>
                            <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-bold text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-brand-indigo" /> {new Date(exam.created_at).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-brand-purple" /> 18:45 mins</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-12">
                            <div className="text-center">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score Obtained</div>
                                <div className={`text-4xl font-black ${isPassed ? "text-brand-emerald" : "text-red-500"}`}>{exam.score}%</div>
                            </div>
                            <Link 
                                href={`/student/result/${exam.attempt_id}`}
                                className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-indigo group-hover:text-white group-hover:shadow-xl group-hover:shadow-brand-indigo/20 transition-all"
                            >
                                <ChevronRight size={24} />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            );
        })}
      </div>
    </div>
  );
}
