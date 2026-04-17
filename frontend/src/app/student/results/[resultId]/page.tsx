"use client";

import { useQuery } from "@tanstack/react-query";
import { studentApi } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Download, ArrowLeft, FileText, Target, Clock, Zap, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StudentResultPage() {
  const { resultId } = useParams();
  const router = useRouter();

  const { data: result, isLoading } = useQuery({
    queryKey: ["examResult", resultId],
    queryFn: () => studentApi.getResultById(resultId as string).then(res => res.data),
  });

  const downloadPDF = async () => {
    try {
      const response = await studentApi.downloadPDF(result.attempt.exam_id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `performance_report_${resultId}.pdf`);
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
          <p className="text-muted-foreground font-bold font-heading uppercase tracking-widest text-xs">Authenticating Report...</p>
       </div>
    </div>
  );

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center p-8">
      <div>
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
           <FileText size={40} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Result Record Missing</h1>
        <p className="text-muted-foreground mb-8">We couldn't locate the specific result record you're looking for.</p>
        <Link href="/student/dashboard" className="bg-brand-indigo text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-brand-indigo/20">
           Go to Dashboard
        </Link>
      </div>
    </div>
  );

  const score = result.attempt.score;
  const totalMarks = result.answers.reduce((acc: number, curr: any) => acc + (curr.max_marks || 0), 0);
  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
  const isPassed = percentage >= 40; // Passing grade threshold

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
                  Export PDF Report
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
               
               <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl relative z-10 ${isPassed ? "bg-brand-emerald text-white shadow-brand-emerald/30" : "bg-brand-orange text-white shadow-brand-orange/30"}`}>
                   {isPassed ? <CheckCircle2 size={56} /> : <XCircle size={56} />}
               </div>
               
               <div className="relative z-10">
                  <h1 className="text-5xl font-heading font-black mb-3 tracking-tight">
                    {isPassed ? "Exam Successfully Cleared!" : "Assessment Complete"}
                  </h1>
                  <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                    {isPassed 
                      ? "Congratulations! You have demonstrated strong competency in this domain." 
                      : "You've completed the challenge. Use the breakdown below to bridge your knowledge gaps."}
                  </p>
               </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-border bg-slate-50/30">
               <div className="p-10 text-center border-r border-border">
                   <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2">
                      <Target size={14} className="text-brand-indigo" />
                      Assessment Status
                   </div>
                   <p className={`text-2xl font-black font-heading ${isPassed ? "text-brand-emerald" : "text-brand-orange"}`}>
                     {isPassed ? "PASS" : "FAIL"}
                   </p>
               </div>
               <div className="p-10 text-center border-r border-border">
                   <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2">
                      <Zap size={14} className="text-brand-purple" />
                      Score Secured
                   </div>
                   <p className="text-2xl font-black font-heading tracking-tight">
                      {score} <span className="text-sm font-bold text-muted-foreground">/ {totalMarks}</span>
                   </p>
               </div>
               <div className="p-10 text-center border-r border-border">
                   <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2">
                      <Clock size={14} className="text-brand-blue" />
                      Completion Date
                   </div>
                   <p className="text-2xl font-black font-heading tracking-tight whitespace-nowrap">
                      {new Date(result.attempt.submit_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                   </p>
               </div>
               <div className="p-10 text-center">
                   <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2">
                      <Target size={14} className="text-brand-pink" />
                      Final Percentage
                   </div>
                   <p className="text-2xl font-black font-heading tracking-tight text-brand-indigo">
                      {percentage}%
                   </p>
               </div>
           </div>

           <div className="p-10 md:p-16">
               <h2 className="text-3xl font-heading font-extrabold flex items-center gap-3 mb-10 text-slate-800">
                  Detailed Answer Breakdown
               </h2>

               <div className="space-y-8">
                   {result.answers.map((ans: any, idx: number) => (
                       <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`p-10 rounded-[40px] border-2 transition-all duration-300 relative overflow-hidden bg-white shadow-sm border-slate-100 hover:border-brand-indigo/20`}
                       >
                           <div className={`absolute top-0 left-0 w-2 h-full ${ans.is_correct ? "bg-brand-emerald" : "bg-brand-red"}`} />

                           <div className="flex justify-between items-start mb-8">
                              <div className="max-w-2xl">
                                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 block">Question {idx + 1}</span>
                                 <h3 className="text-xl font-bold text-slate-800 leading-snug">{ans.question_text}</h3>
                              </div>
                              <div className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${ans.is_correct ? "bg-brand-emerald/10 text-brand-emerald" : "bg-brand-red/10 text-brand-red"}`}>
                                 {ans.marks_awarded} / {ans.max_marks} MARKS
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                   <p className="text-[10px] font-black text-muted-foreground uppercase mb-3">Your Answer</p>
                                   <p className={`text-lg font-bold ${ans.is_correct ? "text-brand-emerald" : "text-brand-red"}`}>
                                      {ans.answer || "No response provided"}
                                   </p>
                               </div>
                               {!ans.is_correct && (
                                   <div className="p-6 bg-brand-emerald/[0.03] rounded-3xl border border-brand-emerald/10">
                                       <p className="text-[10px] font-black text-brand-emerald uppercase mb-3">Correct Solution</p>
                                       <p className="text-lg font-bold text-brand-emerald">
                                          {ans.correct_answer}
                                       </p>
                                   </div>
                               )}
                           </div>

                           {ans.explanation && (
                               <div className="pt-8 border-t border-slate-100 flex items-start gap-4">
                                   <Info size={20} className="text-brand-indigo shrink-0 mt-1" />
                                   <div className="space-y-1">
                                      <p className="text-[10px] font-black text-brand-indigo uppercase tracking-widest">Academic Explanation</p>
                                      <p className="text-slate-600 font-medium leading-relaxed">{ans.explanation}</p>
                                   </div>
                               </div>
                           )}
                       </motion.div>
                   ))}
               </div>
           </div>
        </motion.div>

        <div className="flex justify-center pt-10">
            <Link href="/student/dashboard" className="px-12 py-5 bg-slate-900 text-white rounded-[24px] font-extrabold text-lg shadow-2xl shadow-slate-900/30 hover:scale-105 active:scale-95 transition-all">
                Return to Student Portal
            </Link>
        </div>
      </div>
    </div>
  );
}
