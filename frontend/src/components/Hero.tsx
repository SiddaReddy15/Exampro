"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, Star, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative pt-0 pb-20 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-brand-indigo/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-brand-purple/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-teal/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-16 pt-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-brand-indigo/10 text-brand-indigo text-xs font-bold uppercase tracking-wider mb-8 shadow-sm"
            >
              <div className="flex h-2 w-2 rounded-full bg-brand-indigo relative">
                <span className="absolute inset-0 rounded-full bg-brand-indigo animate-ping" />
              </div>
              Empowering 500+ Global Institutions
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.05] mb-8 tracking-tight text-slate-900">
              Transforming <br />
              <span className="bg-clip-text text-transparent bg-primary-gradient">
                Digital Assessment.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 font-body leading-relaxed">
              The all-in-one SaaS ecosystem for conducting secure, high-stakes examinations with real-time AI insights, automated grading, and flawless synchronization.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <Link 
                href="/register" 
                className="group relative flex items-center gap-3 px-10 py-5 bg-primary-gradient text-white rounded-[22px] font-bold text-lg shadow-2xl shadow-brand-indigo/30 hover:scale-[1.03] active:scale-95 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                Get Started Free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center gap-3 px-10 py-5 bg-white text-slate-800 rounded-[22px] font-bold text-lg shadow-xl shadow-slate-200/50 border border-slate-100 hover:bg-slate-50 transition-all">
                <div className="bg-brand-indigo/10 p-2 rounded-full text-brand-indigo">
                  <Play size={18} fill="currentColor" />
                </div>
                Watch Product Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start grayscale opacity-60">
                <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 size={18} className="text-brand-indigo" />
                    AI-Proctored
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 size={18} className="text-brand-indigo" />
                    SSO Ready
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 size={18} className="text-brand-indigo" />
                    Cloud Secured
                </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 relative"
          >
            <div className="relative z-10">
              <div className="relative rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(79,70,229,0.35)] border-[12px] border-white bg-white">
                <div className="aspect-[16/11] relative">
                  <Image 
                    src="/hero_dashboard.png" 
                    alt="ExamPro Premium Dashboard" 
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Enhanced Floating UI Elements */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-8 glass p-6 rounded-[28px] shadow-2xl z-20 hidden xl:block border border-white/40"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-pink flex items-center justify-center text-white shadow-lg">
                    <Star size={24} fill="white" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Performance</div>
                    <div className="text-xl font-black text-slate-800 tracking-tight">Top Tier Rank</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-12 glass p-7 rounded-[32px] shadow-2xl z-20 hidden xl:block border border-white/40"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
                       <Zap size={20} fill="currentColor" />
                    </div>
                    <div className="text-sm font-bold text-slate-800">Auto-grading...</div>
                  </div>
                  <div className="h-2.5 w-48 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "88%" }}
                      transition={{ duration: 2.5, delay: 1.5, ease: "circOut" }}
                      className="h-full bg-primary-gradient"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                     <span>Syncing</span>
                     <span className="text-brand-indigo">88%</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Background decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-indigo/20 blur-[100px] -z-10 animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
