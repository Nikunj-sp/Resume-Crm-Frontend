"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Resume {
  category: string;
  status: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  colorClass: string;
  barClass: string;
  note?: string;
}

function StatCard({ title, value, icon, colorClass, barClass, note }: StatCardProps) {
  return (
    <div className="relative bg-[#1a1d27] border border-white/[0.07] rounded-2xl p-6 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 group">
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl ${barClass}`} />

      <div className="text-2xl mb-4">{icon}</div>
      <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-2">
        {title}
      </p>
      <p className={`text-5xl font-semibold tracking-tighter leading-none ${colorClass}`}>
        {value}
      </p>
      {note && (
        <p className="mt-3 text-xs text-slate-500">{note}</p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get("/resumes");
        setResumes(res.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const total = resumes.length;
  const fullStack = resumes.filter((r) => r.category === "Full Stack Development").length;
  const digital = resumes.filter((r) => r.category === "Digital Marketing").length;
  const cyber = resumes.filter((r) => r.category === "Cyber Security").length;
  const shortlisted = resumes.filter((r) => r.status === "Shortlisted").length;

  const stats: StatCardProps[] = [
    {
      title: "Total Resumes",
      value: total,
      icon: "📁",
      colorClass: "text-indigo-400",
      barClass: "bg-gradient-to-r from-indigo-500 to-violet-400",
      note: "All categories combined",
    },
    {
      title: "Full Stack",
      value: fullStack,
      icon: "💻",
      colorClass: "text-emerald-400",
      barClass: "bg-gradient-to-r from-emerald-400 to-green-300",
      note: total ? `${Math.round((fullStack / total) * 100)}% of total` : undefined,
    },
    {
      title: "Digital Marketing",
      value: digital,
      icon: "📣",
      colorClass: "text-amber-400",
      barClass: "bg-gradient-to-r from-amber-400 to-yellow-300",
      note: total ? `${Math.round((digital / total) * 100)}% of total` : undefined,
    },
    {
      title: "Cyber Security",
      value: cyber,
      icon: "🔐",
      colorClass: "text-rose-400",
      barClass: "bg-gradient-to-r from-rose-400 to-pink-300",
      note: total ? `${Math.round((cyber / total) * 100)}% of total` : undefined,
    },
    {
      title: "Shortlisted",
      value: shortlisted,
      icon: "⭐",
      colorClass: "text-teal-400",
      barClass: "bg-gradient-to-r from-teal-400 to-cyan-300",
      note: "Ready for interview",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            {total} Resume{total !== 1 ? "s" : ""} 
          </p>
        </div>
        <a 
          href="/dashboard/add-resume"
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          + Add Resume
        </a>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>
    </div>
  );
}