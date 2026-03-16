"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#0f1117] text-white">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1a1d27] border-r border-white/[0.07] flex flex-col fixed top-0 left-0 bottom-0 z-10">
        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-lg">
              📋
            </div>
            <span className="font-bold text-lg tracking-tight">Resume CRM</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 px-3 mb-2 font-semibold">
            Menu
          </p>

          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.05] hover:text-white transition-all"
          >
            <span className="text-base">◉</span> Dashboard
          </Link>

          <Link
            href="/dashboard/add-resume"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.05] hover:text-white transition-all"
          >
            <span className="text-base">＋</span> Add Resume
          </Link>

          <Link
            href="/dashboard/resumes"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.05] hover:text-white transition-all"
          >
            <span className="text-base">≡</span> All Resumes
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/[0.07]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <span className="text-base">⎋</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-60 p-10 min-h-screen">{children}</div>
    </div>
  );
}