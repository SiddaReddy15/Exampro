"use client";

import { useQuery } from "@tanstack/react-query";
import { studentApi } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Download, ArrowLeft, FileText, Target, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ExamResult() {
  const { id: examId } = useParams();
  const router = useRouter();

  const { data: result, isLoading } = useQuery({
    queryKey: ["examResult", examId],
    queryFn: () => studentApi.getResult(examId as string).then(res => res.data),
  });

  const downloadPDF = async () => {
    try {
      const response = await studentApi.downloadPDF(examId as string);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `performance_report_${examId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
       <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin" />
          <p className="text-muted-foreground font-bold">Calculating Performance Metrics...</p>
       </div>
    </div>
  );

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center p-8">
      <div>
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
           <FileText size={40} />
        </div>
        <h1 className="text-2xl font-bold mb-2">No Results Found</h1>
        <p className="text-muted-foreground mb-8">This exam hasn't been submitted or the result is currently unavailable.</p>
        <Link href="/student/dashboard" className="bg-brand-indigo text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-brand-indigo/20">
           Return to Dashboard
        </Link>
      </div>
    </div>
  );

  const score = result.attempt.score;
  const totalMarks = result.answers.reduce((acc: number, curr: any) => acc + (curr.max_marks || 0), 0);
  const percentage = Math.round((score / totalMarks) * 100) || 0;
  const isPassed = percentage >= 40; // Assuming 40% as passing

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-body selection:bg-brand-indigo/20">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <Link href="/student/dashboard" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-brand-indigo transition-colors group">
              <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
           </Link>
           <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <button 
                onClick={downloadPDF} 
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary-gradient text-white px-8 py-3 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-indigo/20"
              >
                  <Download size={18} />
                  Download Performance PDF
              </button>
           </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-border"
        >
           <div className={`p-10 md:p-16 text-center relative overflow-hidden ${isPassed ? "bg-brand-emerald/[0.03]" : "bg-brand-orange/[0.03]"}`}>
               <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] ${isPassed ? "bg-brand-emerald/20" : "bg-brand-orange/20"}`} />
               
               <div className={`w-28 h-28 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl relative z-10 ${isPassed ? "bg-brand-emerald text-white shadow-brand-emerald/30" : "bg-brand-orange text-white shadow-brand-orange/30"}`}>
                   {isPassed ? <CheckCircle2 size={56} /> : <XCircle size={56} />}
               </div>
               
               <div className="relative z-10">
                  <h1 className="text-5xl font-heading font-black mb-3 tracking-tight">
                    {isPassed ? "Outstanding Performance!" : "Valuable Effort!"}
                  </h1>
                  <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                    {isPassed 
                      ? "You've successfully cleared the assessment with excellence." 
                      : "You've gained valuable experience. Review the analysis below to improve."}
                  </p>
               </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-border bg-slate-50/30">
               <div className="p-10 text-center border-r border-border">
                   <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2">
                      <Target size={14} className="text-brand-indigo" />
                      Status
                   </div>
                   <p className={`text-2xl font-black font-heading ${isPassed ? "text-brand-emerald" : "text-brand-orange"}`}>
                     {isPassed ? "PASSED" : "RESIT"}
                   </p>
               </div>
               <div className="p-10 text-center border-r border-border">
                   <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2">
                      <Zap size={14} className="text-brand-purple" />
                      Global Score
                   </div>
                   <p className="text-2xl font-black font-heading tracking-tight">
                      {score} <span className="text-sm font-bold text-muted-foreground">/ {totalMarks}</span>
                   </p>
               </div>
               <div className="p-10 text-center border-r border-border">
                   <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2">
                      <Clock size={14} className="text-brand-blue" />
                      Submission
                   </div>
                   <p className="text-2xl font-black font-heading tracking-tight whitespace-nowrap">
                      {new Date(result.attempt.submit_time).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                   </p>
               </div>
               <div className="p-10 text-center">
                   <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2">
                      <Target size={14} className="text-brand-pink" />
                      Accuracy
                   </div>
                   <p className="text-2xl font-black font-heading tracking-tight text-brand-indigo">
                      {percentage}%
                   </p>
               </div>
           </div>

           <div className="p-10 md:p-16">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                  <h2 className="text-3xl font-heading font-extrabold flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <FileText size={20} />
                     </div>
                     Knowledge Breakdown
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-slate-50 border border-border rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-brand-emerald" />
                      <span>{result.answers.filter((a: any) => a.is_correct).length} Correct</span>
                      <div className="w-2 h-2 rounded-full bg-brand-orange ml-2" />
                      <span>{result.answers.filter((a: any) => !a.is_correct).length} Incorrect</span>
                  </div>
               </div>

               <div className="space-y-8">
                   {result.answers.map((ans: any, idx: number) => (
                       <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-8 rounded-[32px] border-2 transition-all duration-300 relative overflow-hidden group ${ans.is_correct ? "bg-white border-slate-100 hover:border-brand-emerald/20" : "bg-white border-slate-100 hover:border-brand-orange/20"}`}
                       >
                           <div className={`absolute top-0 left-0 w-2 h-full ${ans.is_correct ? "bg-brand-emerald" : "bg-brand-orange"}`} />

                           <div className="flex justify-between items-start mb-6">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Observation {idx + 1}</span>
                                 <h3 className="text-xl font-bold text-slate-800 leading-snug max-w-2xl group-hover:text-brand-indigo transition-colors">{ans.question_text}</h3>
                              </div>
                              <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${ans.is_correct ? "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20" : "bg-brand-orange/10 text-brand-orange border border-brand-orange/20"}`}>
                                 {ans.marks_awarded} / {ans.max_marks} Pts
                              </span>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                               <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-200/50">
                                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Submitted Response</p>
                                   <p className={`text-md font-extrabold ${ans.is_correct ? "text-brand-emerald" : "text-brand-orange"}`}>
                                      {ans.answer || "No response recorded"}
                                   </p>
                               </div>
                               {!ans.is_correct && (
                                   <div className="space-y-2 p-5 bg-brand-emerald/[0.03] rounded-2xl border border-brand-emerald/10">
                                       <p className="text-[10px] font-bold text-brand-emerald uppercase">Prescribed Solution</p>
                                       <p className="text-md font-extrabold text-brand-emerald">
                                          {ans.correct_answer}
                                       </p>
                                   </div>
                               )}
                           </div>
                       </motion.div>
                   ))}
               </div>
           </div>
        </motion.div>

        <div className="bg-slate-900 rounded-[40px] p-12 text-center text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-indigo/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <h3 className="text-2xl font-heading font-bold mb-4">Assessment Complete</h3>
           <p className="text-slate-400 mb-8 max-w-md mx-auto">Your performance data has been securely logged. Review your knowledge breakdown above to understand your strong suit and areas for growth.</p>
           <Link href="/student/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all">
              Return to Student Hub
           </Link>
        </div>
      </div>
    </div>
  );
}
