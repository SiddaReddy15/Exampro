"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, Users, Target, ShieldCheck } from "lucide-react";

const chartData = [
  { name: "Mon", score: 65 },
  { name: "Tue", score: 85 },
  { name: "Wed", score: 78 },
  { name: "Thu", score: 90 },
  { name: "Fri", score: 82 },
  { name: "Sat", score: 95 },
  { name: "Sun", score: 88 },
];

export const DashboardPreview = () => {
  return (
    <section className="py-32 bg-white relative">
      <div className="container px-4">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 order-2 lg:order-1 relative">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Main Dashboard Preview Card */}
              <div className="bg-slate-900 rounded-[40px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-800 p-2">
                <div className="bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between">
                   <div className="flex gap-1.5 font-bold text-[10px] text-slate-500 uppercase tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-slate-800" />
                      Analytical Matrix 2.0
                   </div>
                   <div className="w-8 h-8 rounded-full bg-brand-indigo/20 flex items-center justify-center text-brand-indigo">
                      <TrendingUp size={14} />
                   </div>
                </div>
                
                <div className="p-8 bg-slate-900/50">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/50">
                       <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                          <Users size={12} className="text-brand-indigo" />
                          Enrollment
                       </div>
                       <div className="text-3xl font-heading font-black text-white">4.2k</div>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/50">
                       <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                          <Target size={12} className="text-brand-emerald" />
                          Efficiency
                       </div>
                       <div className="text-3xl font-heading font-black text-white">96.4%</div>
                    </div>
                  </div>

                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#0F172A', borderRadius: '16px', border: '1px solid #1E293B', color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* High-End Floating Widget */}
              <motion.div 
                animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[36px] shadow-2xl border border-slate-100 max-w-[240px] z-30"
              >
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald">
                      <ShieldCheck size={24} />
                   </div>
                   <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</div>
                      <div className="text-lg font-black text-slate-800 leading-none mt-1">Certified</div>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[94%] bg-brand-emerald" />
                   </div>
                   <p className="text-[11px] text-slate-500 font-medium">Identity verification synchronized with master records.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="flex-1 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-brand-indigo font-bold text-xs uppercase tracking-[0.2em] mb-4">Intelligence</div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-8 leading-[1.1] tracking-tight text-slate-900">
                Insights that <br />
                <span className="bg-clip-text text-transparent bg-primary-gradient">Elevate Outcomes.</span>
              </h2>
              <p className="text-lg text-slate-600 mb-10 font-body leading-relaxed">
                Transform raw assessment data into actionable intelligence. Our neural analysis engine identifies learning gaps and predicts performance trajectories in real-time.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Neuro-Grading", desc: "Semantic analysis for open-ended text." },
                  { title: "Live Sync", desc: "Zero-latency data orchestration." },
                  { title: "Anomaly Scan", desc: "Algorithmic integrity monitoring." },
                  { title: "Smart Flow", desc: "Adaptive difficulty orchestration." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo mt-2.5 shrink-0" />
                    <div>
                      <div className="font-heading font-bold text-slate-800">{item.title}</div>
                      <div className="text-sm text-slate-500 font-body">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
