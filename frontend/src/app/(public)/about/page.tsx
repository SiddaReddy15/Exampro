"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, Zap, Database, Globe, Smartphone, Users, 
  BarChart3, Code2, Award, Clock, ArrowRight, CheckCircle2 
} from "lucide-react";
import Link from "next/link";

const AboutPage = () => {
  const features = [
    { icon: <ShieldCheck size={24} />, title: "Secure & Scalable Exams", description: "State-of-the-art security with JWT-based authentication and scalable architecture for high-stakes assessments." },
    { icon: <Zap size={24} />, title: "Instant Result Engine", description: "Automated grading and real-time analytics provide immediate performance feedback to students." },
    { icon: <Code2 size={24} />, title: "Coding Environment", description: "Integrated VS Code–like editor supporting multiple languages for technical and programming evaluations." },
    { icon: <BarChart3 size={24} />, title: "AI-Powered Insights", description: "Deep performance tracking and AI-driven reporting to identify engagement levels and learning trends." },
    { icon: <Clock size={24} />, title: "Resume & Auto-Save", description: "Seamless exam resumption with automatic progress saving every few seconds to prevent data loss." },
    { icon: <Award size={24} />, title: "Global Leaderboards", description: "Dynamic ranking system that promotes healthy competition and academic excellence." },
    { icon: <Database size={24} />, title: "Structured Reporting", description: "Downloadable performance reports in both indexed PDF and granular CSV formats for record-keeping." },
    { icon: <Smartphone size={24} />, title: "Role-Based Access", description: "Dedicated portals for Admins and Students with intuitive, feature-rich dashboards." }
  ];

  const techStack = [
    { name: "Next.js 14", detail: "Fast & Modern Frontend" },
    { name: "Node.js", detail: "Responsive Backend" },
    { name: "Turso (LibSQL)", detail: "Distributed & Secure Data" },
    { name: "TypeScript", detail: "Robust Code Standard" },
    { name: "Tailwind CSS", detail: "Elegant UI Design" },
    { name: "RESTful APIs", detail: "Seamless Integration" }
  ];

  return (
    <div className="min-h-screen bg-white font-body selection:bg-brand-indigo/10">

      {/* Introduction to ExamPro */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-brand-indigo/5 rounded-full blur-[140px]" />
        
        <div className="container px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-8 leading-[1.05] text-dark">
              Innovating the Future of <span className="bg-clip-text text-transparent bg-primary-gradient">Digital Assessment</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-4xl mx-auto">
              ExamPro is a professional SaaS-based assessment ecosystem designed to transform traditional examinations into seamless, secure, and intelligent digital experiences. By merging high-performance engineering with user-centric design, we provide a reliable platform for institutions, educators, and learners who value efficiency, scalability, and academic integrity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pb-32">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              className="p-16 bg-slate-50 rounded-[48px] border border-slate-100"
            >
              <h2 className="text-3xl font-heading font-black mb-6 text-dark">Our Mission</h2>
              <p className="text-slate-600 font-medium text-lg leading-relaxed">
                ExamPro is committed to empowering global education through innovative and accessible assessment solutions. We strive to provide institutions with the technological bedrock required to conduct evaluations with unparalleled precision and reliability.
              </p>
            </motion.div>

            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              className="p-16 bg-dark rounded-[48px] text-white"
            >
              <h2 className="text-3xl font-heading font-black mb-6 text-brand-indigo">Our Vision</h2>
              <p className="text-slate-300 font-medium text-lg leading-relaxed">
                Our vision is to become the globally recognized leader in online examination technology. We aim to set the gold standard for secure assessments, enabling universities and enterprises to discover and certify talent without boundaries.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Unique Capabilities */}
      <section className="py-32 bg-slate-50/50 relative overflow-hidden">
        <div className="container px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-4">What Makes ExamPro Unique</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Intelligent Software for Intelligent Evaluation</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-dark italic">
              "Redefining Academic Integrity"
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="p-8 bg-white border border-slate-200/50 rounded-[40px] hover:shadow-2xl hover:shadow-brand-indigo/10 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-indigo/5 flex items-center justify-center text-brand-indigo mb-8 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-black mb-3 text-dark">{f.title}</h3>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology & Users */}
      <section className="py-32 bg-white">
        <div className="container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
               <div>
                  <h2 className="text-4xl font-heading font-black mb-8 border-l-8 border-brand-indigo pl-8 leading-tight">The Technology <br /> Behind ExamPro</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {techStack.map((tech, i) => (
                      <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-brand-indigo/5 transition-colors">
                        <span className="font-black text-dark group-hover:text-brand-indigo">{tech.name}</span>
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                      </div>
                    ))}
                  </div>
               </div>
               <div className="p-10 bg-brand-indigo rounded-[40px] text-white relative overflow-hidden">
                  <h3 className="text-2xl font-bold mb-4">Closing Statement</h3>
                  <p className="text-indigo-100 font-medium leading-relaxed italic">
                    ExamPro is more than just a software platform; it is a commitment to excellence. We are dedicated to providing the tools that protect the value of credentials while delivering a frictionless experience for every participant.
                  </p>
               </div>
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-8">Who Trusts ExamPro</h3>
              <div className="space-y-10">
                {[
                  { title: "Universities & Colleges", desc: "Digital first infrastructure for semester examinations and entrance tests." },
                  { title: "EdTech Companies", desc: "Seamless white-labeled assessment modules for learning management systems." },
                  { title: "Corporate Organizations", desc: "Professional internal certification and training evaluation at scale." },
                  { title: "Certification Agencies", desc: "Tamper-proof environments for high-stakes professional licensing." },
                  { title: "HR Assessment Teams", desc: "Intelligent coding challenges and aptitude tests for rapid recruitment." }
                ].map((user, i) => (
                  <div key={i} className="flex gap-6 items-start">
                     <div className="p-3 rounded-xl bg-slate-100 text-brand-indigo shrink-0">
                        <CheckCircle2 size={24} />
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-dark mb-1">{user.title}</h4>
                        <p className="text-slate-500 font-medium text-sm">{user.desc}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & CTA */}
      <section className="py-32 bg-slate-50">
        <div className="container px-6">
          <div className="flex flex-wrap justify-center gap-6 mb-24">
            {["Innovation", "Security", "Reliability", "Scalability", "Excellence", "User-Centric"].map((v, i) => (
               <div key={i} className="px-8 py-4 bg-white border border-slate-200 rounded-[20px] font-black text-brand-indigo shadow-sm uppercase tracking-widest text-xs">
                 {v}
               </div>
            ))}
          </div>

          <div className="bg-primary-gradient rounded-[64px] p-12 md:p-24 text-center text-white shadow-2xl shadow-brand-indigo/30 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <h2 className="text-4xl md:text-6xl font-heading font-black mb-10 leading-tight relative z-10">Ready to Transform Your <br /> Assessment Standard?</h2>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
               <Link href="/register" className="px-12 py-5 bg-white text-dark rounded-3xl font-black text-lg shadow-xl hover:scale-105 transition-all">Get Started Now</Link>
               <Link href="/#contact" className="px-12 py-5 border-2 border-white/20 rounded-3xl font-black text-lg hover:bg-white/10 transition-all">Speak to Support</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="container px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
                <div className="bg-primary-gradient p-1.5 rounded-lg text-white">
                    <GraduationCapIC size={20} />
                </div>
                <span className="text-xl font-heading font-bold bg-clip-text text-transparent bg-primary-gradient">ExamPro</span>
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">© 2026 ExamPro System. Secure. Efficient. Intelligent.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;

const GraduationCapIC = ({ size, className }: { size?: number, className?: string }) => (
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
