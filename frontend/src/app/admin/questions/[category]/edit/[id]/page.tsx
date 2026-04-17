"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/api";
import { 
    ArrowLeft, Save, X, Plus, Trash2, HelpCircle, 
    Code, Layout, BookOpen, AlertCircle, CheckCircle2, Loader2, Edit2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function EditQuestionPage() {
    const { category, id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const [type, setType] = useState<"MCQ" | "CODING">("MCQ");
    const [difficulty, setDifficulty] = useState("MEDIUM");
    const [questionText, setQuestionText] = useState("");
    const [marks, setMarks] = useState(1);
    
    // MCQ specific
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [explanation, setExplanation] = useState("");

    // Coding specific
    const [starterCode, setStarterCode] = useState("");
    const [testCases, setTestCases] = useState(""); // JSON string

    const { data: questionData, isLoading: isQuestionLoading } = useQuery({
        queryKey: ["adminQuestion", id],
        queryFn: () => adminApi.getQuestionById(id as string).then(res => res.data),
        enabled: !!id
    });

    useEffect(() => {
        if (questionData) {
            setType(questionData.type);
            setDifficulty(questionData.difficulty);
            setQuestionText(questionData.question_text);
            setMarks(questionData.marks);
            setExplanation(questionData.explanation || "");

            if (questionData.type === "MCQ") {
                const parsedOptions = typeof questionData.options === 'string' ? JSON.parse(questionData.options) : questionData.options;
                setOptions(parsedOptions || ["", "", "", ""]);
                setCorrectAnswer(questionData.correct_answer || "");
            } else {
                setStarterCode(questionData.starter_code || "");
                setTestCases(questionData.test_cases ? (typeof questionData.test_cases === 'string' ? questionData.test_cases : JSON.stringify(questionData.test_cases, null, 2)) : "");
            }
        }
    }, [questionData]);

    const mutation = useMutation({
        mutationFn: (data: any) => adminApi.updateQuestion(id as string, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminQuestions", category] });
            queryClient.invalidateQueries({ queryKey: ["adminQuestion", id] });
            toast.success("Question updated successfully");
            router.push(`/admin/questions/${category}`);
        },
        onError: () => {
            toast.error("Failed to update question");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!questionText.trim()) return toast.error("Question text is required");
        
        const payload: any = {
            type,
            question_text: questionText,
            marks: Number(marks),
            difficulty,
            explanation
        };

        if (type === "MCQ") {
            if (options.some(opt => !opt.trim())) return toast.error("All options must be filled");
            if (!correctAnswer) return toast.error("Please select the correct answer");
            payload.options = options;
            payload.correct_answer = correctAnswer;
        } else {
            payload.starter_code = starterCode;
            try {
                payload.test_cases = testCases ? JSON.parse(testCases) : null;
            } catch (e) {
                return toast.error("Invalid JSON format for test cases");
            }
        }

        mutation.mutate(payload);
    };

    if (isQuestionLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={40} className="animate-spin text-brand-indigo" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-2xl bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-brand-indigo hover:border-brand-indigo/30 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="text-[10px] font-black text-brand-indigo uppercase tracking-widest mb-1 flex items-center gap-2">
                             Edit Mode <Edit2 size={10} className="inline" />
                        </div>
                        <h1 className="text-3xl font-heading font-black tracking-tight">Modify Question</h1>
                    </div>
                </div>

                <div className="px-6 py-2.5 bg-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest text-muted-foreground">
                    {type}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-8 rounded-[40px] border border-border shadow-sm space-y-8">
                    {/* Common Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Difficulty Level</label>
                            <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                                {["EASY", "MEDIUM", "HARD"].map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setDifficulty(d)}
                                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                                            difficulty === d 
                                                ? d === 'HARD' ? "bg-red-500 text-white shadow-md shadow-red-200" : d === 'EASY' ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "bg-amber-500 text-white shadow-md shadow-amber-200"
                                                : "text-muted-foreground hover:bg-white/50"
                                        }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Marks Weightage</label>
                            <input 
                                type="number" 
                                value={marks}
                                onChange={(e) => setMarks(Number(e.target.value))}
                                className="w-full px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 focus:bg-white transition-all font-bold text-sm"
                                placeholder="e.g. 5"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Question Content</label>
                        <textarea 
                            rows={4}
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 focus:bg-white transition-all font-bold text-sm placeholder:italic"
                            placeholder="Type your question prompt here..."
                        />
                    </div>

                    {/* Conditional Fields */}
                    {type === "MCQ" ? (
                        <div className="space-y-8 pt-4">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Options & Correct Answer</label>
                                <div className="grid grid-cols-1 gap-4">
                                    {options.map((opt, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <button
                                                type="button"
                                                onClick={() => setCorrectAnswer(opt)}
                                                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                                                    correctAnswer === opt && opt !== ""
                                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                                        : "bg-slate-50 text-slate-300 border border-slate-100 group-hover:border-emerald-200"
                                                }`}
                                            >
                                                <CheckCircle2 size={20} />
                                            </button>
                                            <input 
                                                type="text"
                                                value={opt}
                                                onChange={(e) => {
                                                    const newOpts = [...options];
                                                    newOpts[i] = e.target.value;
                                                    setOptions(newOpts);
                                                }}
                                                className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-emerald-50 focus:bg-white transition-all font-bold text-sm"
                                                placeholder={`Option ${i + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 pt-4">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Starter Template Code</label>
                                <textarea 
                                    rows={8}
                                    value={starterCode}
                                    onChange={(e) => setStarterCode(e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-3xl outline-none border border-slate-800 focus:ring-4 ring-brand-indigo/10 transition-all shadow-inner"
                                    placeholder="// write your starter code here..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Test Cases (JSON Format)</label>
                                <textarea 
                                    rows={4}
                                    value={testCases}
                                    onChange={(e) => setTestCases(e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 focus:bg-white transition-all font-bold text-sm"
                                    placeholder='[{ "input": "...", "expected": "..." }]'
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Explanation (Optional)</label>
                        <textarea 
                            rows={3}
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 focus:bg-white transition-all font-bold text-sm opacity-80"
                            placeholder="Provide feedback or explanation for the correct answer..."
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-4 bg-white border border-border text-muted-foreground rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={mutation.isPending}
                        type="submit"
                        className="px-10 py-4 bg-primary-gradient text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-indigo/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        {mutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

