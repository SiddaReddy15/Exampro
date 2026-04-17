"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileDropdown from "@/components/ProfileDropdown";
import { Bell, Search } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-indigo"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <header className="bg-white/80 backdrop-blur-md border-b border-border px-8 py-4 sticky top-0 z-40">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-border">
                    <Search size={16} className="text-muted-foreground" />
                    <input type="text" placeholder="Quick search..." className="bg-transparent border-none outline-none text-sm w-64" />
                </div>
                
                <div className="flex items-center gap-6">
                    <button className="relative p-2 text-muted-foreground hover:text-brand-indigo transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-pink rounded-full border-2 border-white" />
                    </button>
                    <div className="h-8 w-[1px] bg-border mx-2" />
                    <ProfileDropdown />
                </div>
            </div>
        </header>

        <main className="p-8">
            {children}
        </main>
      </div>
    </div>
  );
}
