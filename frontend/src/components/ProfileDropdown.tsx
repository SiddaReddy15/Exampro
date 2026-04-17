"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings, LayoutDashboard, ChevronDown, Sparkles, Mail, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems = [
    { 
        title: "Dashboard", 
        icon: <LayoutDashboard size={16} />, 
        href: user?.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard",
        color: "text-brand-indigo" 
    },
    { 
        title: "Account Mastery", 
        icon: <Settings size={16} />, 
        href: user?.role === "ADMIN" ? "/admin/settings" : "/student/settings", 
        color: "text-slate-500" 
    },
  ];

  return (
    <div className="relative font-body" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-slate-100 transition-all duration-300 group outline-none"
      >
        <div className="relative">
            <div className={`w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-emerald border-2 border-white rounded-full shadow-sm" />
        </div>
        <div className="hidden sm:block text-left">
            <div className="text-sm font-bold text-dark leading-tight">{user?.name}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">{user?.role}</div>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 mt-3 w-72 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[24px] border border-slate-100 overflow-hidden z-[60]"
          >
            {/* Header */}
            <div className="p-6 bg-slate-50/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Sparkles size={40} />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-indigo/20">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                        <p className="font-heading font-black text-slate-900 leading-tight">{user?.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Shield size={12} className="text-brand-indigo" />
                            <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-widest">Verified {user?.role}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-white p-2 rounded-lg border border-slate-200/50 overflow-hidden">
                    <Mail size={12} className="shrink-0" />
                    <span className="truncate">{user?.email}</span>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="p-2">
              <div className="px-4 pt-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Management</div>
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    router.push(item.href);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm font-semibold text-slate-600 group"
                >
                  <div className={`p-2 rounded-lg bg-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-200 ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="group-hover:text-dark transition-colors">{item.title}</span>
                </button>
              ))}
            </div>

            {/* Logout Section */}
            <div className="p-2 mt-1 border-t border-slate-100">
                <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 text-sm font-bold group"
                >
                <div className="p-2 rounded-lg bg-red-100 group-hover:bg-white transition-all duration-200">
                    <LogOut size={16} />
                </div>
                Logout Account
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
