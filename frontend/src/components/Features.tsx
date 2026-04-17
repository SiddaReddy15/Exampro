"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, Users, Zap, Search, Globe, Layout, Cpu, Database } from "lucide-react";

const features = [
  {
    title: "Centralized Command",
    description: "Complete institutional dashboard for managing exams, student cycles, and real-time operational insights.",
    icon: <Layout className="text-brand-indigo" size={28} />,
    color: "bg-brand-indigo/10",
  },
  {
    title: "Secure Flow Engine",
    description: "Distraction-free environment with advanced biometric-inspired monitoring and encrypted data streams.",
    icon: <ShieldCheck className="text-brand-indigo" size={28} />,
    color: "bg-brand-indigo/10",
  },
  {
    title: "AI-Powered Grading",
    description: "Automated scoring for MCQ and short-form answers with semantic analysis for deeper understanding.",
    icon: <Cpu className="text-brand-indigo" size={28} />,
    color: "bg-brand-indigo/10",
  },
  {
    title: "Granular Analytics",
    description: "Multi-dimensional performance tracking with interactive charts and predicted outcome modeling.",
    icon: <BarChart3 className="text-brand-indigo" size={28} />,
    color: "bg-brand-indigo/10",
  },
  {
    title: "Global Scalability",
    description: "Infrastructure engineered to handle 100k+ concurrent examinees with sub-millisecond latency.",
    icon: <Database className="text-brand-indigo" size={28} />,
    color: "bg-brand-indigo/10",
  },
  {
    title: "Proctor Integration",
    description: "Seamless synchronization with external proctoring tools and multi-camera live feeds.",
    icon: <Zap className="text-brand-indigo" size={28} />,
    color: "bg-brand-indigo/10",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-32 bg-slate-50/50 relative overflow-hidden">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-indigo font-bold text-xs uppercase tracking-[0.2em] mb-4"
          >
            Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-8 tracking-tight text-slate-900"
          >
            Everything needed to <br />
            <span className="bg-clip-text text-transparent bg-primary-gradient">Govern Education.</span>
          </motion.h2>
          <p className="text-lg text-slate-600 font-body leading-relaxed max-w-2xl mx-auto">
            Experience an ecosystem designed for high-stakes assessments, combining industrial-grade security with intuitive student experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-10 rounded-[40px] border border-slate-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(79,70,229,0.12)] hover:border-brand-indigo/20 transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-indigo scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-t-full" />
              
              <div className={`w-16 h-16 rounded-[22px] ${feature.color} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-heading font-bold mb-4 text-slate-800 transition-colors group-hover:text-brand-indigo">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed font-body">
                {feature.description}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-brand-indigo font-bold text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all cursor-pointer">
                 Learn More
                 <Zap size={14} className="fill-brand-indigo" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
