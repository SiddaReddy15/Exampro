"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/services/api";
import { 
    Settings, Shield, Bell, Lock, Database, Globe, User, 
    Edit2, Key, X, CheckCircle2, AlertCircle, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AdminSettings() {
  const { user, setUser } = useAuth();
  
  // Modal States
  const [isAliasModalOpen, setIsAliasModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Alias Form
  const [newAlias, setNewAlias] = useState(user?.name || "");

  // Password Form
  const [passForm, setPassForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const sections = [
    { title: "Profile Security", icon: <Shield className="text-brand-indigo" />, description: "Manage your credentials and authentication methods." },
    { title: "Notifications", icon: <Bell className="text-brand-purple" />, description: "Configure system alerts and email reporting preferences." },
    { title: "Platform Config", icon: <Globe className="text-brand-emerald" />, description: "Adjust global examination parameters and timezones." },
    { title: "Data Management", icon: <Database className="text-brand-orange" />, description: "Backup logs and student submission archives." },
  ];

  const handleUpdateAlias = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlias.trim()) return toast.error("Alias cannot be empty");
    
    setLoading(true);
    try {
        const res = await authApi.updateProfile({ name: newAlias });
        if (user) {
            setUser({ ...user, name: newAlias });
        }
        toast.success("Identity updated successfully");
        setIsAliasModalOpen(false);
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to update alias");
    } finally {
        setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
        return toast.error("New passwords do not match");
    }
    if (passForm.newPassword.length < 6) {
        return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
        await authApi.changePassword({
            oldPassword: passForm.oldPassword,
            newPassword: passForm.newPassword
        });
        toast.success("Security credentials updated");
        setIsPassModalOpen(false);
        setPassForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 selection:bg-brand-indigo/20 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black tracking-tight mb-2">Platform Governance</h1>
          <p className="text-muted-foreground font-body font-medium">Fine-tune the ExamPro ecosystem and your administrative identity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-border space-y-8">
            <h2 className="text-xl font-black font-heading flex items-center gap-3">
               <div className="w-1.5 h-6 bg-brand-indigo rounded-full" />
               Identity Intelligence
            </h2>
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-primary-gradient flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-brand-indigo/20">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                   <p className="text-2xl font-black font-heading">{user?.name}</p>
                   <p className="text-sm font-medium text-muted-foreground">{user?.email}</p>
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-indigo/10 text-brand-indigo rounded-full text-[10px] font-black uppercase tracking-widest mt-2">
                       <Lock size={10} /> {user?.role} Authority
                   </div>
                </div>
            </div>
            <div className="pt-4 flex gap-4">
                <button 
                    onClick={() => setIsAliasModalOpen(true)}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Edit2 size={14} /> Update Alias
                </button>
                <button 
                    onClick={() => setIsPassModalOpen(true)}
                    className="px-6 py-3 bg-white border border-border text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                    <Key size={14} /> Change Passcode
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.map((section, idx) => (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="bg-white p-6 rounded-[32px] border border-border hover:border-brand-indigo/30 hover:shadow-xl transition-all group cursor-pointer"
                >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        {section.icon}
                    </div>
                    <h3 className="font-black text-sm mb-1">{section.title}</h3>
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{section.description}</p>
                </motion.div>
            ))}
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[40px] shadow-2xl text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <Settings size={160} />
         </div>
         <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl font-black font-heading mb-4">Critical Maintenance Mode</h3>
            <p className="text-white/60 font-medium text-sm mb-8">Enabling maintenance mode will restrict student access to exams while structural updates are being performed.</p>
            <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
                Activate Safety Lock
            </button>
         </div>
      </div>

      {/* Alias Update Modal */}
      <AnimatePresence>
        {isAliasModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAliasModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-[40px] shadow-2xl border border-border w-full max-w-md p-8 overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center">
                            <User size={24} />
                        </div>
                        <button onClick={() => setIsAliasModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <X size={20} className="text-muted-foreground" />
                        </button>
                    </div>

                    <h3 className="text-2xl font-black font-heading mb-2">Update Identity Alias</h3>
                    <p className="text-muted-foreground text-sm font-medium mb-8">Choose a professional name for your administrative profile.</p>

                    <form onSubmit={handleUpdateAlias} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Alias Name</label>
                            <input 
                                type="text"
                                value={newAlias}
                                onChange={(e) => setNewAlias(e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 transition-all font-bold text-sm"
                                placeholder="Enter your name..."
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button 
                                type="button"
                                onClick={() => setIsAliasModalOpen(false)}
                                className="flex-1 py-4 bg-white border border-border text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 bg-primary-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-indigo/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Password Change Modal */}
      <AnimatePresence>
        {isPassModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsPassModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-[40px] shadow-2xl border border-border w-full max-w-md p-8 overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                            <Lock size={24} />
                        </div>
                        <button onClick={() => setIsPassModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <X size={20} className="text-muted-foreground" />
                        </button>
                    </div>

                    <h3 className="text-2xl font-black font-heading mb-2">Change Passcode</h3>
                    <p className="text-muted-foreground text-sm font-medium mb-8">Maintain high security by updating your authentication credentials.</p>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                            <input 
                                type="password"
                                value={passForm.oldPassword}
                                onChange={(e) => setPassForm({...passForm, oldPassword: e.target.value})}
                                className="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-purple/10 transition-all font-bold text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                            <input 
                                type="password"
                                value={passForm.newPassword}
                                onChange={(e) => setPassForm({...passForm, newPassword: e.target.value})}
                                className="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 transition-all font-bold text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                            <input 
                                type="password"
                                value={passForm.confirmPassword}
                                onChange={(e) => setPassForm({...passForm, confirmPassword: e.target.value})}
                                className="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 transition-all font-bold text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex gap-3 pt-6">
                            <button 
                                type="button"
                                onClick={() => setIsPassModalOpen(false)}
                                className="flex-1 py-4 bg-white border border-border text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 bg-primary-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-indigo/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                                Update Security
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
