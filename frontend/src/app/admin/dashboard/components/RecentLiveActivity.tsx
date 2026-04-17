"use client";

import React, { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Activity as ActivityIcon, User, Layers, Calendar, ChevronRight, Loader2, History, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentLiveActivity({ activities = [], isLoading = false, error = null }: { activities?: any[], isLoading?: boolean, error?: string | null }) {
  // We no longer need local state as we receive data from the parent dashboard
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed': return 'text-brand-emerald bg-brand-emerald/10';
      case 'updated': return 'text-brand-indigo bg-brand-indigo/10';
      case 'deleted': return 'text-brand-pink bg-brand-pink/10';
      default: return 'text-slate-500 bg-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-lg transition-all duration-500">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-pink/10 flex items-center justify-center text-brand-pink shadow-sm">
            <ActivityIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black font-heading tracking-tight text-slate-900">Recent Live Activity</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">Real-time Platform Audit</p>
          </div>
        </div>
        <button className="text-[10px] font-black text-brand-indigo uppercase tracking-widest hover:underline flex items-center gap-1.5 bg-brand-indigo/5 px-4 py-2 rounded-xl transition-colors">
          View Audit Log <ChevronRight size={14} />
        </button>
      </div>

      <div className="relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-brand-pink" size={32} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hydrating Log Stream...</span>
          </div>
        ) : error ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
             <AlertCircle className="text-brand-pink" size={32} />
             <span className="text-sm font-bold text-brand-pink">{error}</span>
           </div>
        ) : activities.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <History className="text-slate-200" size={48} />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Awaiting system events</span>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {activities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center justify-between p-5 rounded-[24px] bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-default"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-bold shadow-sm group-hover:scale-110 group-hover:border-brand-pink/20 group-hover:text-brand-pink transition-all">
                        {activity.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-slate-800">{activity.userName}</span>
                        <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                            {activity.userRole}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-bold">
                        {activity.action} – <span className="text-brand-indigo font-black opacity-80">{activity.entityTitle}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg mb-2 inline-block ${getStatusColor(activity.status)}`}>
                        {activity.status}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase opacity-60 flex items-center justify-end gap-1">
                        <Calendar size={10} />
                        {formatDistanceToNow(parseISO(activity.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {!isLoading && activities.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 italic text-[10px] font-bold text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                  Live activity synchronization active
              </div>
          </div>
      )}
    </div>
  );
}
