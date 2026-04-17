"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/api";
import { 
    Users, Search, Filter, Mail, Calendar, MoreVertical, 
    UserPlus, Download, ShieldCheck, ShieldAlert, Award, FileText,
    ArrowUpDown, ChevronRight, MapPin, GraduationCap, Loader2, Clock, RefreshCw
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import EnrollStudentModal from "@/components/admin/EnrollStudentModal";
import { toast } from "sonner";

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: "asc" | "desc" } | null>(null);

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const res = await adminApi.getStudents();
      const students = res.data.data;

      const csv = [
        ["ID", "Name", "Email", "Registration Date", "Status", "Last Active"],
        ...students.map((s: any) => [
          s.id,
          s.name,
          s.email,
          new Date(s.createdAt).toLocaleDateString(),
          s.status || "VERIFIED",
          s.lastActive ? new Date(s.lastActive).toLocaleString() : "N/A"
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `exampro_students_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Student records exported successfully!");
    } catch (error) {
      toast.error("Failed to export records");
    } finally {
      setIsExporting(false);
    }
  };

  const { data: students, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["adminStudents"],
    queryFn: () => adminApi.getStudents().then(res => res.data.data || res.data),
  });

  const handleSync = async () => {
    try {
        await refetch();
        toast.success("Academic registry synchronized with Turso cloud");
    } catch (error) {
        toast.error("Synchronization failed. Check connection parameters.");
    }
  };

  const sortedStudents = [...(students || [])].sort((a: any, b: any) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredStudents = sortedStudents?.filter((student: any) => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-10 font-body pb-20 selection:bg-brand-indigo/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black tracking-tight mb-2">Academic Registry</h1>
          <p className="text-muted-foreground font-medium italic">High-fidelity monitoring of student engagement and security parameters.</p>
        </div>
        <div className="flex items-center gap-3">
             <button 
                onClick={handleSync}
                disabled={isRefetching}
                className="group flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 text-xs shadow-sm hover:border-brand-purple/20"
            >
                {isRefetching ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} className="text-brand-purple" />}
                Sync Registry
            </button>
             <button 
                onClick={handleExportCSV}
                disabled={isExporting}
                className="group flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 text-xs shadow-sm hover:border-brand-indigo/20"
            >
                {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} className="text-brand-indigo" />}
                Export Dataset
            </button>
            <button 
                onClick={() => setIsEnrollModalOpen(true)}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
            >
                <UserPlus size={18} />
                Enroll Member
            </button>
        </div>
      </div>

      <EnrollStudentModal 
        isOpen={isEnrollModalOpen} 
        onClose={() => setIsEnrollModalOpen(false)} 
      />

      <div className="bg-white p-5 rounded-[40px] border border-border flex flex-col md:flex-row gap-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
            <Users size={120} />
        </div>
        <div className="flex-1 relative flex items-center">
            <Search className="absolute left-5 text-slate-300" size={20} />
            <input 
                type="text" 
                placeholder="Query by name, email or hash..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 ring-brand-indigo/10 focus:bg-white transition-all font-bold text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-3">
            <div className="flex bg-slate-100 p-1.5 rounded-3xl border border-slate-200 items-center">
                <button 
                    onClick={() => handleSort("name")}
                    className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${sortConfig?.key === 'name' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <ArrowUpDown size={12} />
                    Alpha
                </button>
                <button 
                    onClick={() => handleSort("createdAt")}
                    className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${sortConfig?.key === 'createdAt' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Calendar size={12} />
                    Recency
                </button>
            </div>
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all">
                <Filter size={14} className="text-brand-indigo" />
                Filters
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[48px] border border-border shadow-soft overflow-hidden overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-slate-50/30 border-b border-slate-100">
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Principal Identity</th>
                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Onboarding</th>
                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Engagement Factor</th>
                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Audit Profile</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
                [1,2,3,4,5].map(i => (
                    <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-10 py-8"><div className="h-14 bg-slate-50 rounded-[28px]" /></td>
                    </tr>
                ))
            ) : filteredStudents?.map((student: any, idx: number) => (
                <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    key={student.id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                >
                    <td className="px-10 py-7">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-[24px] bg-primary-gradient flex items-center justify-center text-white font-black text-xl shadow-xl group-hover:scale-105 transition-transform duration-500">
                                    {student.name.charAt(0)}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-white rounded-full ${student.status === 'SUSPENDED' ? 'bg-red-400' : 'bg-brand-emerald'}`} />
                            </div>
                            <div>
                                <div className="text-base font-black text-slate-900 leading-none mb-1.5">{student.name}</div>
                                <div className="flex items-center gap-2">
                                    <Mail size={12} className="text-slate-300" />
                                    <span className="text-xs font-bold text-slate-400">{student.email}</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-7 font-black text-xs text-slate-600">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-brand-indigo/10 rounded-xl text-brand-indigo">
                                <Calendar size={14} />
                            </div>
                            {new Date(student.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </td>
                    <td className="px-8 py-7">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>Recent Load</span>
                                <span className="text-brand-indigo">78%</span>
                            </div>
                            <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "78%" }}
                                    className="h-full bg-brand-indigo" 
                                />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 flex items-center gap-1">
                                <Clock size={10} />
                                Active {student.lastActive ? new Date(student.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                            </span>
                        </div>
                    </td>
                    <td className="px-8 py-7">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl w-fit ${student.status === 'SUSPENDED' ? 'bg-red-50 text-red-500' : 'bg-brand-emerald/10 text-brand-emerald'}`}>
                            {student.status === 'SUSPENDED' ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                            <span className="text-[10px] font-black uppercase tracking-[0.15em]">{student.status || 'VERIFIED'}</span>
                        </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-3 text-slate-400 hover:text-brand-indigo hover:bg-white hover:shadow-lg rounded-2xl transition-all">
                                <FileText size={20} />
                            </button>
                            <button className="p-3 text-slate-400 hover:text-brand-purple hover:bg-white hover:shadow-lg rounded-2xl transition-all">
                                <GraduationCap size={20} />
                            </button>
                            <button className="p-3 text-slate-400 hover:bg-white hover:shadow-lg rounded-2xl transition-all">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    </td>
                </motion.tr>
            ))}
          </tbody>
        </table>
        
        {filteredStudents?.length === 0 && !isLoading && (
            <div className="text-center py-24 bg-white">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Users size={40} />
                </div>
                <h3 className="text-xl font-black font-heading mb-2">No Students Found</h3>
                <p className="text-muted-foreground font-medium max-w-sm mx-auto">Try adjusting your search terms or filters to find the student you're looking for.</p>
            </div>
        )}
      </div>

    </div>
  );
}
