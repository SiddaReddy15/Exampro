"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
    LogOut, User, Shield, Bell, 
    Settings as SettingsIcon, ChevronRight,
    Smartphone, Globe, Moon, Save,
    CheckCircle2, AlertCircle, Eye, EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function StudentSettings() {
    const { logout, user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        name: user?.name || "",
        email: user?.email || ""
    });

    // Security State
    const [security, setSecurity] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    // Preferences State
    const [preferences, setPreferences] = useState({
        examReminders: true,
        scoreAlerts: true,
        marketingEmails: false,
        darkMode: false,
        language: "English"
    });

    // Load theme on mount
    useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
                // We can't set state directly in useState initializer but this works for class
            }
        }
    });

    // Update state based on current class on mount
    useState(() => {
        if (typeof window !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark');
            // We'll update the initial preferences state
        }
    });

    const handleLogout = () => {
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    logout();
                    resolve(true);
                }, 1000);
            }),
            {
                loading: 'Signing you out safely...',
                success: 'Logged out successfully. See you soon!',
                error: 'Logout failed',
            }
        );
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setIsSaving(false);
        toast.success("Profile updated successfully!");
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (security.newPassword !== security.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsSaving(false);
        toast.success("Password changed successfully!");
        setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: <User size={18} /> },
        { id: "security", label: "Security", icon: <Shield size={18} /> },
        { id: "notifications", label: "Preferences", icon: <Bell size={18} /> },
        { id: "platform", label: "System", icon: <Smartphone size={18} /> }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-4xl font-heading font-black tracking-tight mb-2">Account Settings</h1>
                <p className="text-muted-foreground font-medium">Manage your candidate identity and platform experience.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-72 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                                activeTab === tab.id 
                                ? "bg-brand-indigo text-white shadow-lg shadow-brand-indigo/20" 
                                : "bg-white text-slate-500 hover:bg-slate-50"
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                    <div className="pt-4 mt-4 border-t border-slate-200">
                         <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 w-full bg-white rounded-[40px] border border-border shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                    <div className="p-10 flex-1">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div 
                                    key="profile"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-6 pb-8 border-b border-slate-50">
                                        <div className="w-24 h-24 rounded-[32px] bg-brand-indigo/10 flex items-center justify-center text-brand-indigo font-black text-4xl border-4 border-white shadow-xl">
                                            {user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-800">Profile Information</h3>
                                            <p className="text-slate-400 font-medium text-sm">Update your public candidate profile</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSaveProfile} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-indigo/20 outline-none transition-all font-bold text-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    value={profile.email}
                                                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-indigo/20 outline-none transition-all font-bold text-slate-700"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <button 
                                                disabled={isSaving}
                                                className="inline-flex items-center gap-3 px-10 py-4 bg-brand-indigo text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-indigo/20 disabled:opacity-50"
                                            >
                                                {isSaving ? "Saving..." : <><Save size={16} /> Save Changes</>}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div 
                                    key="security"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800">Security Settings</h3>
                                        <p className="text-slate-400 font-medium text-sm">Keep your account secure with a strong password</p>
                                    </div>

                                    <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Current Password</label>
                                                <input 
                                                    type="password" 
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-indigo/20 outline-none transition-all font-bold text-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2 relative">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Password</label>
                                                <input 
                                                    type={showPassword ? "text" : "password"}
                                                    value={security.newPassword}
                                                    onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-indigo/20 outline-none transition-all font-bold text-slate-700"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-6 bottom-4 text-slate-400 hover:text-brand-indigo transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Confirm New Password</label>
                                                <input 
                                                    type="password"
                                                    value={security.confirmPassword}
                                                    onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-indigo/20 outline-none transition-all font-bold text-slate-700"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-start pt-4">
                                            <button 
                                                disabled={isSaving}
                                                className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                                            >
                                                {isSaving ? "Updating..." : "Update Password"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === 'notifications' && (
                                <motion.div 
                                    key="notifications"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800">Notification Preferences</h3>
                                        <p className="text-slate-400 font-medium text-sm">Control how and when we reach out to you</p>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { id: "examReminders", label: "Exam Reminders", desc: "Get notified before your scheduled assessments" },
                                            { id: "scoreAlerts", label: "Score Alerts", desc: "Receive immediate updates when your exams are graded" },
                                            { id: "marketingEmails", label: "Newsletter", desc: "Periodic updates about new certifications and features" }
                                        ].map((pref) => (
                                            <div key={pref.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                                                <div>
                                                    <div className="font-bold text-slate-700">{pref.label}</div>
                                                    <div className="text-xs text-slate-400 font-medium">{pref.desc}</div>
                                                </div>
                                                <button 
                                                    onClick={() => setPreferences({...preferences, [pref.id]: !preferences[pref.id as keyof typeof preferences]})}
                                                    className={`w-14 h-8 rounded-full relative transition-all duration-300 ${preferences[pref.id as keyof typeof preferences] ? "bg-brand-indigo" : "bg-slate-200"}`}
                                                >
                                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${preferences[pref.id as keyof typeof preferences] ? "right-1" : "left-1"}`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'platform' && (
                                <motion.div 
                                    key="platform"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800">System Preferences</h3>
                                        <p className="text-slate-400 font-medium text-sm">Customize your ExamPro interface</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-slate-400">
                                                <Moon size={24} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-700">Appearance Mode</div>
                                                <p className="text-xs text-slate-400 font-medium mb-4">Choose between light and dark themes</p>
                                                <div className="flex bg-white p-1 rounded-xl border border-border">
                                                    <button 
                                                        onClick={() => {
                                                            setPreferences({...preferences, darkMode: false});
                                                            document.documentElement.classList.remove('dark');
                                                            localStorage.setItem('theme', 'light');
                                                        }}
                                                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!preferences.darkMode ? "bg-brand-indigo text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                                                    >
                                                        Light
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setPreferences({...preferences, darkMode: true});
                                                            document.documentElement.classList.add('dark');
                                                            localStorage.setItem('theme', 'dark');
                                                        }}
                                                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${preferences.darkMode ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                                                    >
                                                        Dark
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-slate-400">
                                                <Globe size={24} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-700">Language Setting</div>
                                                <p className="text-xs text-slate-400 font-medium mb-4">Select your primary display language</p>
                                                <select 
                                                    className="w-full p-2 bg-white border border-border rounded-xl text-sm font-bold text-slate-600 outline-none"
                                                    value={preferences.language}
                                                    onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                                                >
                                                    <option>English</option>
                                                    <option>Spanish</option>
                                                    <option>French</option>
                                                    <option>Hindi</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-8 bg-red-50/30 border-t border-red-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="font-black text-red-600 mb-1 flex items-center gap-2">
                                <AlertCircle size={18} /> Danger Zone
                            </div>
                            <p className="text-sm text-red-500/70 font-medium">Be careful, some actions are irreversible.</p>
                        </div>
                        <button className="text-red-600 font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                            Deactivate My Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
