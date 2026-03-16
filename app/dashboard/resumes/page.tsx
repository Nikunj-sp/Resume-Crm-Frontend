"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import ResumeTable from "@/components/ResumeTable";
import TableSkeleton from "@/components/TableSkeleton";
import { toast } from "sonner";

interface Resume {
  _id: string;
  fullName: string;
  email: string;
  category: string;
  experience: number;
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const resumesPerPage = 6;
  const router = useRouter();

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this resume?");
    if (!confirmed) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes(resumes.filter((resume) => resume._id !== id));
      toast.success("Deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">All Resumes</h1>
          <p className="text-slate-500 text-sm mt-1">Loading your pipeline...</p>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  const filteredResumes = resumes.filter((resume) =>
    resume.fullName.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const indexOfLast = currentPage * resumesPerPage;
  const indexOfFirst = indexOfLast - resumesPerPage;
  const currentResumes = filteredResumes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredResumes.length / resumesPerPage);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">All Resumes</h1>
          <p className="text-slate-500 text-sm mt-1">
            {filteredResumes.length} candidate{filteredResumes.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/add-resume")}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          + Add Resume
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1d27] border border-white/[0.07] text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1d27] border border-white/[0.07] rounded-2xl overflow-hidden">
        <ResumeTable
          resumes={currentResumes}
          onView={(id) => router.push(`/dashboard/resumes/${id}`)}
          onEdit={(id) => router.push(`/dashboard/resumes/edit/${id}`)}
          onDelete={handleDelete}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                currentPage === i + 1
                  ? "bg-indigo-500 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}