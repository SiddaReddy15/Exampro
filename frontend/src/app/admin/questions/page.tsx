"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
    Globe, Settings, Database, Cpu, Code2, 
    ArrowRight, BookOpen, Sparkles, Layers
} from "lucide-react";

export default function QuestionsLanding() {
  const repositories = [
    { 
        id: "frontend",
        title: "Frontend Development", 
        icon: <Globe className="text-blue-500" />, 
        description: "Modern UI & Logic (React, Next.js)", 
        color: "bg-blue-50 text-blue-600", 
        border: "border-blue-100",
        count: 11
    },
    { 
        id: "backend",
        title: "Backend Development", 
        icon: <Settings className="text-indigo-500" />, 
        description: "APIs & Core Systems (Node, Express)", 
        color: "bg-indigo-50 text-indigo-600", 
        border: "border-indigo-100",
        count: 10
    },
    { 
        id: "database",
        title: "Database Management", 
        icon: <Database className="text-purple-500" />, 
        description: "Data Strategy & SQL (Prisma, Turso)", 
        color: "bg-purple-50 text-purple-600", 
        border: "border-purple-100",
        count: 10
    },
    { 
        id: "devops",
        title: "DevOps & Cloud", 
        icon: <Cpu className="text-emerald-500" />, 
        description: "Scale & Deployment (Docker, AWS)", 
        color: "bg-emerald-50 text-emerald-600", 
        border: "border-emerald-100",
        count: 10
    },
    { 
        id: "dsa",
        title: "DSA & Logic", 
        icon: <Code2 className="text-amber-500" />, 
        description: "Problem Solving (Arrays, Trees)", 
        color: "bg-amber-50 text-amber-600", 
        border: "border-amber-100",
        count: 10
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-indigo font-black text-[10px] uppercase tracking-widest mb-2">
            <Layers size={14} /> Knowledge Base
          </div>
          <h1 className="text-4xl font-heading font-black tracking-tight mb-2">Technical Repositories</h1>
          <p className="text-muted-foreground font-medium max-w-2xl">
            Access and manage centralized question banks across all core technical sectors. These repositories power your automated evaluation logic.
          </p>
        </div>
        <div className="bg-white px-6 py-4 rounded-[28px] border border-border flex items-center gap-4 shadow-sm">
            <div className="h-10 w-10 rounded-2xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
                <Sparkles size={20} />
            </div>
            <div>
                <div className="text-xs font-black">51 Total Questions</div>
                <div className="text-[10px] font-bold text-muted-foreground">Across all sectors</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repositories.map((repo, idx) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              href={`/admin/questions/${repo.id}`}
              className="group block h-full bg-white rounded-[40px] border border-border p-10 hover:shadow-2xl hover:border-brand-indigo/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-[24px] ${repo.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                {repo.icon}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-black font-heading tracking-tight group-hover:text-brand-indigo transition-colors">
                    {repo.title}
                </h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                    {repo.description}
                </p>
              </div>

              <div className="mt-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${repo.color} flex items-center justify-center text-[10px] font-bold`}>
                                {i}
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{repo.count} Questions</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-indigo group-hover:text-white transition-all">
                    <ArrowRight size={18} />
                </div>
              </div>

              {/* Decorative detail */}
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BookOpen size={120} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
