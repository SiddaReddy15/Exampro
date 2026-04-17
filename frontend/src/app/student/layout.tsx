"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import StudentSidebar from "@/components/StudentSidebar";
import { Loader2 } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "STUDENT")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 size={40} className="animate-spin text-brand-indigo" />
        <p className="font-heading font-black text-slate-400 uppercase tracking-widest text-xs">Initializing Session...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen selection:bg-brand-indigo/10">
      <StudentSidebar />
      <main className="flex-1 p-10 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
