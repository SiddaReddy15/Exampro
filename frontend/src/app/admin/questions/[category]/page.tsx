"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/services/api";
import { 
    Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, 
    ArrowLeft, FileSpreadsheet, Download, HelpCircle, Code,
    ChevronLeft, ChevronRight, Loader2, AlertCircle, CheckCircle2, X
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function QuestionCategoryPage() {
  const { category } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const { data: categories, isLoading: isCatsLoading } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => adminApi.getCategories().then(res => res.data),
  });

  const categoryInfo = categories?.find((c: any) => c.slug === category) || {
    id: "",
    name: category?.toString().replace(/-/g, ' ').toUpperCase(),
    description: "Manage repository questions."
  };

  const { data: questions, isLoading } = useQuery({
    queryKey: ["adminQuestions", category],
    queryFn: () => adminApi.getQuestionsByCategory(category as string).then(res => res.data),
    enabled: !!category
  });

  const uploadMutation = useMutation({
      mutationFn: (formData: FormData) => adminApi.bulkImport(formData),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["adminQuestions", category] });
          toast.success("Questions imported successfully");
          setIsImportModalOpen(false);
      },
      onError: (err: any) => {
          toast.error(err.response?.data?.error || "Failed to import questions");
      }
  });

  const deleteMutation = useMutation({
      mutationFn: (id: string) => adminApi.deleteQuestion(id),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["adminQuestions", category] });
          toast.success("Question deleted successfully");
      },
      onError: (err: any) => {
          toast.error(err.response?.data?.error || "Failed to delete question");
      }
  });

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this question?")) return;
      
      try {
          const res = await fetch(`/api/questions/${id}`, {
              method: "DELETE",
          });

          if (res.ok) {
              queryClient.invalidateQueries({ queryKey: ["adminQuestions", category] });
              toast.success("Question removed from repository");
          } else {
              toast.error("Failed to delete question");
          }
      } catch (error) {
          toast.error("Network error during deletion");
      }
  };

  const handleEdit = (question: any) => {
      setSelectedQuestion({
          ...question,
          questionText: question.question_text || question.questionText,
          correctAnswer: question.correct_answer || question.correctAnswer
      });
      setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
      if (!selectedQuestion) return;

      try {
          const res = await fetch(`/api/questions/${selectedQuestion.id}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(selectedQuestion),
          });

          const data = await res.json();

          if (data.success) {
              queryClient.invalidateQueries({ queryKey: ["adminQuestions", category] });
              toast.success("Question updated successfully");
              setIsEditModalOpen(false);
          } else {
              toast.error(data.error || "Update failed");
          }
      } catch (error) {
          toast.error("Network error during update");
      }
  };

  const handleFileUpload = (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category_id", categoryInfo.id);
      uploadMutation.mutate(formData);
  };

  const handleDownloadTemplate = async () => {
      try {
          const response = await adminApi.downloadTemplate();
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'questions_template.xlsx');
          document.body.appendChild(link);
          link.click();
          link.remove();
      } catch (error) {
          toast.error("Failed to download template");
      }
  };

  const filteredQuestions = questions?.filter((q: any) => {
      const qContent = q.question_text || q.questionText || "";
      const matchesSearch = qContent.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "ALL" || q.type === typeFilter;
      return matchesSearch && matchesType;
  }) || [];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
            <button 
                onClick={() => router.back()}
                className="mt-1 w-10 h-10 rounded-2xl bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-brand-indigo hover:border-brand-indigo/30 transition-all shadow-sm"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <div className="flex items-center gap-2 text-brand-indigo font-black text-[10px] uppercase tracking-widest mb-1">
                    Technical Repository
                </div>
                <h1 className="text-3xl font-heading font-black tracking-tight">{categoryInfo.name}</h1>
                <p className="text-muted-foreground font-medium text-sm mt-1">{categoryInfo.description}</p>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
                disabled={isCatsLoading}
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-border rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isCatsLoading ? <Loader2 size={16} className="animate-spin text-brand-indigo" /> : <FileSpreadsheet size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />}
                Bulk Import
            </button>
            <Link 
                href={`/admin/questions/${category}/create`}
                className="flex items-center gap-2 px-6 py-3 bg-primary-gradient text-white rounded-[18px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-indigo/20 hover:scale-105 active:scale-95 transition-all"
            >
                <Plus size={16} />
                Add Question
            </Link>
        </div>
      </div>

      <AnimatePresence>
          {isImportModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsImportModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden"
                  >
                      <div className="absolute top-0 right-0 p-8">
                          <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                              <X size={24} />
                          </button>
                      </div>

                      <div className="flex flex-col items-center text-center">
                          <div className="w-20 h-20 rounded-[28px] bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 shadow-inner">
                              <FileSpreadsheet size={40} />
                          </div>
                          <h2 className="text-2xl font-black font-heading tracking-tight mb-2">Bulk Repository Import</h2>
                          <p className="text-muted-foreground text-sm font-medium mb-10 max-w-[280px]">Upload your Excel workbook to batch-update the {categoryInfo.name} repository.</p>
                          
                          <label className="w-full">
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".xlsx, .xls, .csv" 
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file);
                                }}
                              />
                              <div className="border-4 border-dashed border-slate-100 rounded-[32px] p-12 hover:border-brand-emerald/30 hover:bg-emerald-50/20 transition-all cursor-pointer group">
                                  {uploadMutation.isPending ? (
                                      <div className="flex flex-col items-center gap-4">
                                          <Loader2 className="animate-spin text-brand-emerald" size={32} />
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parsing Workbook...</span>
                                      </div>
                                  ) : (
                                      <div className="flex flex-col items-center gap-4">
                                          <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                                              <Download size={24} />
                                          </div>
                                          <span className="text-[10px] font-black text-brand-emerald uppercase tracking-widest">Select Excel File</span>
                                      </div>
                                  )}
                              </div>
                          </label>
                          
                          <div className="mt-10 pt-8 border-t border-slate-50 w-full flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                      <HelpCircle size={18} className="text-slate-400" />
                                  </div>
                                  <div className="text-left">
                                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Template</div>
                                      <div 
                                        onClick={handleDownloadTemplate}
                                        className="text-xs font-black text-brand-indigo underline cursor-pointer hover:text-brand-purple transition-colors"
                                      >
                                          Download Schema
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      <AnimatePresence>
          {isEditModalOpen && selectedQuestion && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsEditModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-10 max-h-[90vh] overflow-y-auto"
                  >
                      <div className="flex items-center justify-between mb-8">
                          <h2 className="text-2xl font-black font-heading tracking-tight">Edit Question</h2>
                          <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                              <X size={24} className="text-slate-400" />
                          </button>
                      </div>

                      <div className="space-y-6">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Question Text</label>
                              <textarea 
                                value={selectedQuestion.questionText}
                                onChange={(e) => setSelectedQuestion({...selectedQuestion, questionText: e.target.value})}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 font-bold text-sm"
                                rows={4}
                              />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Difficulty</label>
                                  <select 
                                    value={selectedQuestion.difficulty}
                                    onChange={(e) => setSelectedQuestion({...selectedQuestion, difficulty: e.target.value})}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 font-bold text-sm appearance-none"
                                  >
                                      <option value="EASY">EASY</option>
                                      <option value="MEDIUM">MEDIUM</option>
                                      <option value="HARD">HARD</option>
                                  </select>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marks</label>
                                  <input 
                                    type="number"
                                    value={selectedQuestion.marks}
                                    onChange={(e) => setSelectedQuestion({...selectedQuestion, marks: Number(e.target.value)})}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 font-bold text-sm"
                                  />
                              </div>
                          </div>

                          {selectedQuestion.type === 'MCQ' && (
                              <div className="space-y-4">
                                  <div className="flex items-center justify-between ml-1">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Options Configuration</label>
                                      <span className="text-[9px] font-black text-brand-indigo uppercase tracking-widest">Select Correct Answer</span>
                                  </div>
                                  {(selectedQuestion.options || ["", "", "", ""]).map((opt: string, i: number) => (
                                      <div key={i} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                          <button 
                                            type="button"
                                            onClick={() => setSelectedQuestion({...selectedQuestion, correctAnswer: opt})}
                                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                                selectedQuestion.correctAnswer === opt && opt !== ""
                                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                                    : "bg-white border-2 border-slate-100 text-transparent"
                                            }`}
                                          >
                                              <CheckCircle2 size={16} />
                                          </button>
                                          <input 
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...(selectedQuestion.options || ["", "", "", ""])];
                                                newOpts[i] = e.target.value;
                                                setSelectedQuestion({...selectedQuestion, options: newOpts});
                                            }}
                                            className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 ring-brand-indigo/5 font-bold text-sm"
                                            placeholder={`Option ${i + 1}`}
                                          />
                                      </div>
                                  ))}
                              </div>
                          )}

                          {selectedQuestion.type === 'CODING' && (
                              <div className="space-y-6">
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Starter Template Code</label>
                                      <textarea 
                                        value={selectedQuestion.starterCode || selectedQuestion.starter_code || ""}
                                        onChange={(e) => setSelectedQuestion({...selectedQuestion, starterCode: e.target.value})}
                                        className="w-full px-6 py-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-3xl outline-none border border-slate-800 focus:ring-4 ring-brand-indigo/10 transition-all shadow-inner"
                                        rows={8}
                                        placeholder="// Write starter code here..."
                                      />
                                  </div>

                                  <div className="space-y-2">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Constraints</label>
                                      <textarea 
                                        value={selectedQuestion.constraints || ""}
                                        onChange={(e) => setSelectedQuestion({...selectedQuestion, constraints: e.target.value})}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 font-bold text-sm"
                                        rows={2}
                                        placeholder="e.g. Time complexity: O(n), Memory limit: 256MB"
                                      />
                                  </div>

                                  <div className="space-y-2">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Test Cases (JSON Format)</label>
                                      <textarea 
                                        value={typeof selectedQuestion.testCases === 'string' ? selectedQuestion.testCases : (typeof selectedQuestion.test_cases === 'string' ? selectedQuestion.test_cases : JSON.stringify(selectedQuestion.testCases || selectedQuestion.test_cases || [], null, 2))}
                                        onChange={(e) => setSelectedQuestion({...selectedQuestion, testCases: e.target.value})}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 font-bold text-sm"
                                        rows={4}
                                        placeholder='[{ "input": "...", "expected": "..." }]'
                                      />
                                  </div>
                              </div>
                          )}

                          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                              <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                  Cancel
                              </button>
                              <button 
                                onClick={handleUpdate}
                                className="px-10 py-3 bg-primary-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-indigo/20 hover:scale-105 active:scale-95 transition-all"
                              >
                                  Save Changes
                              </button>
                          </div>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: "Total Questions", value: questions?.length || "0", icon: <HelpCircle size={14} />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "MCQ Type", value: questions?.filter((q:any) => q.type === 'MCQ').length || "0", icon: <HelpCircle size={14} />, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Coding Type", value: questions?.filter((q:any) => q.type === 'CODING').length || "0", icon: <Code size={14} />, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Repository Health", value: "98%", icon: <CheckCircle2 size={14} />, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl border border-border flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    {stat.icon}
                </div>
                <div>
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{stat.label}</div>
                    <div className="text-lg font-black">{stat.value}</div>
                </div>
            </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[32px] border border-border flex flex-col md:flex-row gap-4 shadow-sm items-center">
        <div className="flex-1 relative flex items-center w-full">
            <Search className="absolute left-5 text-muted-foreground" size={18} />
            <input 
                type="text" 
                placeholder="Search questions by text or keywords..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 focus:bg-white transition-all font-bold text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 self-stretch md:self-auto">
            {["ALL", "MCQ", "CODING"].map((type) => (
                <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                        typeFilter === type 
                            ? "bg-white text-brand-indigo shadow-sm" 
                            : "text-muted-foreground hover:bg-white/50"
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-[40px] border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 border-bottom border-border">
                        <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Question Details</th>
                        <th className="px-6 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Type</th>
                        <th className="px-6 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Difficulty</th>
                        <th className="px-6 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Marks</th>
                        <th className="px-8 py-6 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                        [1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="animate-pulse">
                                <td className="px-8 py-6"><div className="h-10 bg-slate-50 rounded-xl" /></td>
                                <td className="px-6 py-6"><div className="h-6 w-20 bg-slate-50 rounded-lg" /></td>
                                <td className="px-6 py-6"><div className="h-6 w-20 bg-slate-50 rounded-lg" /></td>
                                <td className="px-6 py-6"><div className="h-6 w-10 bg-slate-50 rounded-lg" /></td>
                                <td className="px-8 py-6"><div className="h-10 bg-slate-50 rounded-xl ml-auto" /></td>
                            </tr>
                        ))
                    ) : (
                        filteredQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((q: any, idx: number) => (
                        <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td 
                                onClick={() => handleEdit(q)}
                                className="px-8 py-6 max-w-md cursor-pointer hover:bg-slate-100/50 transition-colors"
                            >
                                <div className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-brand-indigo transition-colors">
                                    {q.question_text || q.questionText}
                                </div>
                                <div className="mt-2 text-[10px] font-black text-brand-indigo uppercase tracking-widest opacity-60">ID: Q-{q.id.slice(0, 6)}</div>
                            </td>
                            <td className="px-6 py-6">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    q.type === 'CODING' ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600"
                                }`}>
                                    {q.type === 'CODING' ? <Code size={12} /> : <HelpCircle size={12} />}
                                    {q.type === 'CODING' ? "Coding" : "MCQ"}
                                </div>
                            </td>
                            <td className="px-6 py-6">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${
                                    q.difficulty === 'HARD' ? "bg-red-50 text-red-600" : q.difficulty === 'EASY' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                                }`}>
                                    {q.difficulty}
                                </div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="text-sm font-black text-slate-800">{q.marks} Marks</div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button 
                                        onClick={() => handleEdit(q)}
                                        className="p-2.5 text-slate-400 hover:text-brand-indigo hover:bg-brand-indigo/5 rounded-xl transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(q.id)}
                                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

        {/* Empty State Mock */}
        {!isLoading && filteredQuestions?.length === 0 && (
            <div className="py-24 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
                    <HelpCircle size={40} />
                </div>
                <h3 className="text-xl font-black font-heading mb-2">No questions found</h3>
                <p className="text-muted-foreground font-medium max-w-sm">There are no questions matching your criteria in the {categoryInfo.name} repository.</p>
                <button 
                  onClick={() => setIsImportModalOpen(true)}
                  className="mt-8 px-8 py-3 bg-brand-indigo text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-indigo/10"
                >
                    Bulk Import Questions
                </button>
            </div>
        )}

        {/* Footer / Pagination */}
        <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Showing <span className="text-slate-900">{Math.min(filteredQuestions.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(filteredQuestions.length, currentPage * itemsPerPage)}</span> of <span className="text-slate-900">{filteredQuestions.length}</span> questions
            </div>
            <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-2.5 rounded-xl bg-white border border-border text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
                >
                    <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.ceil(filteredQuestions.length / itemsPerPage) }).map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-xl text-xs transition-all ${
                                currentPage === i + 1 
                                    ? "bg-brand-indigo text-white font-black" 
                                    : "bg-white text-muted-foreground font-bold hover:bg-slate-50"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <button 
                  disabled={currentPage === Math.ceil(filteredQuestions.length / itemsPerPage) || filteredQuestions.length === 0}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2.5 rounded-xl bg-white border border-border text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
