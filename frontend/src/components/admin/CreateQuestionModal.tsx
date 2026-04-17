"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/services/api";
import { X, Plus, Save, Loader2, Info, CheckCircle2, Code2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultExamId?: string;
}

export default function CreateQuestionModal({
  isOpen,
  onClose,
  defaultExamId,
}: CreateQuestionModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      exam_id: defaultExamId || "",
      category_id: "",
      type: "MCQ",
      title: "",
      question_text: "",
      marks: 1,
      difficulty: "MEDIUM",
      correct_answer: "",
      options: ["", "", "", ""],
      // Coding specific fields
      problem_description: "",
      languages: ["javascript", "python", "java"],
      sample_input: "",
      sample_output: "",
      input_format: "",
      output_format: "",
      constraints: "",
      starter_code: "",
      time_limit: "1s",
      memory_limit: "256MB"
    }
  });

  const questionType = watch("type");

  const { data: exams } = useQuery({
    queryKey: ["adminExams"],
    queryFn: () => adminApi.getExams().then(res => res.data),
    enabled: isOpen
  });

  const { data: categories } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => adminApi.getCategories().then(res => res.data),
    enabled: isOpen
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => {
        const payload = { ...data };
        if (data.type === "CODING") {
            payload.question_text = data.problem_description;
            // Map sub-fields into options config for backend or use dedicated columns
            payload.options = {
                input_format: data.input_format,
                output_format: data.output_format,
                time_limit: data.time_limit,
                memory_limit: data.memory_limit
            };
        }
        return adminApi.addQuestion(payload);
    },
    onSuccess: () => {
      toast.success("Question created successfully", {
        description: "The question has been added to the assessment repository.",
        icon: <CheckCircle2 size={16} className="text-brand-emerald" />
      });
      queryClient.invalidateQueries({ queryKey: ["adminQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["examQuestions"] });
      reset();
      onClose();
    },
    onError: () => toast.error("Failed to create question")
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-border flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
             <h2 className="text-2xl font-black font-heading tracking-tight flex items-center gap-3">
               <div className="p-2 bg-black rounded-xl text-white">
                  <Plus size={20} />
               </div>
               Create New Question
             </h2>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Assessment Configuration Module</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
             <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 selection:bg-brand-indigo/20">
          <form id="create-question-form" onSubmit={handleSubmit((data) => addMutation.mutate(data))} className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Diagnostic Title</label>
                  <input 
                    {...register("title")}
                    placeholder="e.g. Reverse Linked List Optimization"
                    className="w-full px-6 py-4 bg-slate-50 border border-border rounded-2xl font-bold focus:ring-4 ring-brand-indigo/10 outline-none transition-all"
                  />
               </div>

               <div className="space-y-3">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Repository Sector</label>
                  <select 
                    {...register("category_id")}
                    className="w-full px-6 py-4 bg-slate-50 border border-border rounded-2xl font-bold focus:ring-4 ring-brand-indigo/10 outline-none transition-all appearance-none"
                  >
                    <option value="">Choose Category...</option>
                    {categories?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
               </div>

               <div className="space-y-3">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Question Type</label>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                      {["MCQ", "CODING"].map((type) => (
                          <button
                              key={type}
                              type="button"
                              onClick={() => setValue("type", type as any)}
                              className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                                  questionType === type 
                                      ? "bg-white text-slate-900 shadow-sm" 
                                      : "text-muted-foreground hover:bg-white/50"
                              }`}
                          >
                              {type === "MCQ" ? <CheckCircle2 size={12} /> : <Code2 size={12} />}
                              {type === "MCQ" ? "Multiple Choice" : "Coding Task"}
                          </button>
                      ))}
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Target Assessment (Optional)</label>
                  <select 
                    {...register("exam_id")}
                    className="w-full px-6 py-4 bg-slate-50 border border-border rounded-2xl font-bold focus:ring-4 ring-brand-indigo/10 outline-none transition-all appearance-none"
                  >
                    <option value="">Direct to Repository only...</option>
                    {exams?.map((exam: any) => (
                      <option key={exam.id} value={exam.id}>{exam.title}</option>
                    ))}
                  </select>
               </div>

               <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Points</label>
                        <input type="number" {...register("marks")} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Difficulty</label>
                        <select {...register("difficulty")} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none">
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                        </select>
                    </div>
                  </div>
               </div>
            </div>

            <hr className="border-border" />

            {questionType === "MCQ" ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-3">
                   <label className="text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Inquiry Description</label>
                   <textarea 
                    {...register("question_text")}
                    placeholder="Enter the comprehensive question here..."
                    className="w-full px-6 py-4 bg-slate-50 border border-border rounded-[24px] font-medium focus:ring-4 ring-brand-indigo/10 outline-none transition-all min-h-[120px]"
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {["A", "B", "C", "D"].map((opt, i) => (
                     <div key={opt} className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Option {opt}</label>
                        <input 
                            {...register(`options.${i}` as any)}
                            placeholder={`Parameter ${opt}`}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-border rounded-xl font-bold focus:ring-2 ring-brand-indigo/10 outline-none focus:bg-white transition-all"
                        />
                     </div>
                   ))}
                </div>

                <div className="space-y-3 pt-4">
                  <label className="text-xs font-black text-brand-indigo uppercase tracking-widest ml-1 flex items-center gap-2">
                    <CheckCircle2 size={14} /> Prescribed Correct Solution
                  </label>
                  <select 
                    {...register("correct_answer")}
                    className="w-full px-6 py-4 bg-brand-indigo/5 border border-brand-indigo/20 text-brand-indigo rounded-2xl font-black focus:ring-4 ring-brand-indigo/10 outline-none transition-all appearance-none"
                  >
                    <option value="">Choose Correct Parameter...</option>
                    <option value="A">Parameter A</option>
                    <option value="B">Parameter B</option>
                    <option value="C">Parameter C</option>
                    <option value="D">Parameter D</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-3">
                   <label className="text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Problem Statement</label>
                   <textarea 
                    {...register("problem_description")}
                    placeholder="Describe the coding challenge in detail..."
                    className="w-full px-6 py-4 bg-slate-50 border border-border rounded-[24px] font-medium focus:ring-4 ring-brand-indigo/10 outline-none transition-all min-h-[140px]"
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Sample Invocation (Input)</label>
                      <textarea 
                        {...register("sample_input")}
                        className="w-full px-5 py-4 bg-slate-900 text-brand-emerald rounded-2xl font-mono text-xs focus:ring-4 ring-brand-indigo/10 outline-none transition-all h-[100px]"
                        placeholder="e.g. 5 10"
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Expected Evaluation (Output)</label>
                      <textarea 
                        {...register("sample_output")}
                        className="w-full px-5 py-4 bg-slate-900 text-brand-emerald rounded-2xl font-mono text-xs focus:ring-4 ring-brand-indigo/10 outline-none transition-all h-[100px]"
                        placeholder="e.g. 15"
                      />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Computational Constraints</label>
                   <input 
                    {...register("constraints")}
                    placeholder="e.g. Time: 1s, Memory: 256MB, N < 10^5"
                    className="w-full px-6 py-4 bg-slate-50 border border-border rounded-2xl font-bold focus:ring-4 ring-brand-indigo/10 outline-none transition-all"
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Initialization Code (Starter)</label>
                   <textarea 
                    {...register("starter_code")}
                    className="w-full px-6 py-6 bg-slate-900 text-slate-300 rounded-[32px] font-mono text-xs focus:ring-4 ring-brand-indigo/10 outline-none transition-all h-[180px]"
                    placeholder="function solve(a, b) {\n  // Implementation here\n}"
                   />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-8 border-t border-border bg-white flex flex-col sm:flex-row justify-end gap-4 sticky bottom-0 z-10">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="sm:w-32"
          >
            Cancel
          </Button>
          <Button 
            form="create-question-form"
            type="submit"
            variant="black"
            isLoading={addMutation.isPending}
            className="sm:w-48"
          >
            <Save size={18} className="mr-2" />
            Save Question
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
