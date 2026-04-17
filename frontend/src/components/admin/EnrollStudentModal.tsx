"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminApi } from "@/services/api";
import { X, Loader2, User, Mail, Lock, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const enrollSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type EnrollFormValues = z.infer<typeof enrollSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrollStudentModal({ isOpen, onClose }: Props) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnrollFormValues>({
    resolver: zodResolver(enrollSchema),
  });

  const onSubmit = async (data: EnrollFormValues) => {
    try {
      await adminApi.enrollStudent({
        name: data.name,
        email: data.email,
      });
      toast.success("Student enrolled. Credentials sent via email!");
      queryClient.invalidateQueries({ queryKey: ["adminStudents"] });
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl z-[101] overflow-hidden border border-slate-100 font-body"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="relative p-8 md:p-12">
              <button
                onClick={onClose}
                className="absolute right-8 top-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>

              <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-brand-indigo/10 rounded-2xl text-brand-indigo">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-[10px] font-black text-brand-indigo uppercase tracking-[0.2em]">Security Protocol</span>
                </div>
                <h2 id="modal-title" className="text-3xl font-heading font-black tracking-tight text-slate-900">Enroll New Student</h2>
                <p className="text-sm text-muted-foreground mt-2 font-medium">Provision a new academic profile. Secure credentials will be generated and dispatched automatically.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <User size={12} className="text-brand-indigo" /> Full Legal Name
                  </label>
                  <input
                    {...register("name")}
                    placeholder="Enter student's full name"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 focus:bg-white transition-all font-bold text-sm"
                  />
                  {errors.name && <p className="text-xs font-bold text-red-500 mt-1 pl-2">{errors.name.message}</p>}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={12} className="text-brand-purple" /> Academic Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="student@exampro.com"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-brand-indigo/10 focus:bg-white transition-all font-bold text-sm"
                  />
                  {errors.email && <p className="text-xs font-bold text-red-500 mt-1 pl-2">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-primary-gradient text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-brand-indigo/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 mt-4"
                >
                  {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
                  Complete Automated Enrollment
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
