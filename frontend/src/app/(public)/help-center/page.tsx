"use client";

import { motion } from "framer-motion";
import { 
  Search, BookOpen, ShieldCheck, UserCog, 
  LifeBuoy, Mail, ArrowRight, MessageSquare, 
  HelpCircle, ChevronRight 
} from "lucide-react";
import Link from "next/link";

const HelpCenterPage = () => {
  const categories = [
    {
      icon: <BookOpen className="text-brand-indigo" />,
      title: "Getting Started",
      desc: "Learn how to register, log in, and begin your first exam on ExamPro seamlessly.",
      links: ["Account Setup", "Student Enrollment", "Navigation Guide"]
    },
    {
      icon: <ShieldCheck className="text-brand-emerald" />,
      title: "Exam Guidelines",
      desc: "Understand exam rules, timers, auto-submit features, and anti-cheating protocols.",
      links: ["Code of Conduct", "Timer Logic", "Hardware Requirements"]
    },
    {
      icon: <UserCog className="text-brand-purple" />,
      title: "Account Management",
      desc: "Learn how to update your profile, reset your password, and manage your security settings.",
      links: ["Password Reset", "Profile Privacy", "Role Permissions"]
    },
    {
      icon: <LifeBuoy className="text-brand-blue" />,
      title: "Technical Support",
      desc: "Facing issues? Contact our expert support team for immediate assistance and troubleshooting.",
      links: ["System Status", "Browser Compatibility", "Known Issues"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-body selection:bg-brand-indigo/10">
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-indigo/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="container px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-brand-indigo text-xs font-black uppercase tracking-widest mb-8">
              <HelpCircle size={14} />
              Knowledge Base & Support
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tight mb-8 leading-[1.1] text-dark">
              How can we <span className="bg-clip-text text-transparent bg-primary-gradient">Help You</span> today?
            </h1>
            
            <div className="relative max-w-2xl mx-auto mt-12">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Search for articles, guides, and tutorials..." 
                className="w-full pl-16 pr-6 py-6 bg-white border border-slate-200 rounded-[32px] focus:ring-4 focus:ring-brand-indigo/10 focus:border-brand-indigo outline-none transition-all shadow-xl shadow-slate-200/50 font-medium"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-brand-indigo/10 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-brand-indigo group-hover:text-white transition-all">
                   {cat.icon}
                </div>
                <h2 className="text-2xl font-black font-heading mb-4 text-dark">{cat.title}</h2>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">{cat.desc}</p>
                
                <div className="space-y-3">
                   {cat.links.map((link, j) => (
                     <Link key={j} href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-brand-indigo/5 transition-colors group/link">
                       <span className="text-sm font-bold text-slate-700 group-hover/link:text-brand-indigo">{link}</span>
                       <ChevronRight size={16} className="text-slate-300 group-hover/link:text-brand-indigo" />
                     </Link>
                   ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 bg-white">
        <div className="container px-6">
          <div className="bg-dark rounded-[50px] p-12 md:p-20 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-slate-900/20">
             <div className="relative z-10 max-w-xl">
               <h2 className="text-4xl font-heading font-black mb-6">Still need assistance?</h2>
               <p className="text-slate-400 font-medium text-lg leading-relaxed">
                 Our support team is available 24/7 to help you resolve any technical hurdles or procedural questions.
               </p>
               <div className="mt-10 flex flex-col sm:flex-row gap-6">
                  <Link href="mailto:support@exampro.com" className="flex items-center gap-3 px-8 py-4 bg-brand-indigo rounded-2xl font-bold hover:bg-brand-indigo/90 transition-all group">
                    <Mail size={18} />
                    support@exampro.com
                  </Link>
                  <Link href="#" className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/10 rounded-2xl font-bold hover:bg-white/20 transition-all">
                    <MessageSquare size={18} />
                    Live Chat
                  </Link>
               </div>
             </div>
             <div className="relative z-10 hidden lg:block">
                <div className="w-48 h-48 rounded-full bg-primary-gradient p-1 flex items-center justify-center animate-bounce [animation-duration:3000ms]">
                   <div className="w-full h-full rounded-full bg-dark flex items-center justify-center">
                      <GraduationCap size={64} className="text-white" />
                   </div>
                </div>
             </div>
             
             {/* Background shapes */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-brand-indigo/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </section>

      {/* Simple Footer Link */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="container px-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-indigo font-black uppercase tracking-widest text-[10px] transition-colors">
            <ArrowRight size={14} className="rotate-180" />
            Back to ExamPro Home
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenterPage;

const GraduationCap = ({ size, className }: { size?: number, className?: string }) => (
    <svg 
        width={size || 24} 
        height={size || 24} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);
