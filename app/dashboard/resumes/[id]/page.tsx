"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";

const statusConfig: Record<string, { color: string; dot: string }> = {
  New: { color: "text-slate-400", dot: "bg-slate-400" },
  Shortlisted: { color: "text-teal-400", dot: "bg-teal-400" },
  Rejected: { color: "text-rose-400", dot: "bg-rose-400" },
  Called: { color: "text-indigo-400", dot: "bg-indigo-400" },
};

function InfoItem({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return (
    <div className="bg-[#0f1117] rounded-xl px-4 py-3">
      <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-1">{label}</p>
      <p className="text-white text-sm font-medium">{value}</p>
    </div>
  );
}

export default function ResumeDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get(`/resumes/${id}`);
        setResume(res.data);
        setStatus(res.data.status);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id, router]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/resumes/${id}`, { status });
      toast.success("Status updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-4xl mb-3">📄</p>
          <p className="text-white font-medium">Resume not found</p>
          <button onClick={() => router.back()} className="mt-4 text-sm text-slate-400 hover:text-white transition-colors">
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = statusConfig[status] ?? statusConfig["New"];

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-slate-500 hover:text-white text-sm mb-8 flex items-center gap-1 transition-colors"
      >
        ← Back to Resumes
      </button>

      {/* Profile Header */}
      <div className="bg-[#1a1d27] border border-white/[0.07] rounded-2xl p-6 mb-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl font-bold">
            {resume.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{resume.fullName}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{resume.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#0f1117] px-4 py-2 rounded-xl">
          <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`} />
          <span className={`text-sm font-medium ${currentStatus.color}`}>{status}</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="bg-[#1a1d27] border border-white/[0.07] rounded-2xl p-6 mb-5">
        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-4">
          Contact & Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoItem label="Email" value={resume.email} />
          <InfoItem label="Phone" value={resume.phone} />
          <InfoItem label="Experience" value={resume.experience ? `${resume.experience} years` : undefined} />
          <InfoItem label="Location" value={resume.location} />
          <InfoItem label="Current Company" value={resume.currentCompany} />
          <InfoItem label="Expected Salary" value={resume.expectedSalary ? `₹${resume.expectedSalary}` : undefined} />
        </div>
      </div>

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <div className="bg-[#1a1d27] border border-white/[0.07] rounded-2xl p-6 mb-5">
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-4">Skills</p>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-lg text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {resume.notes && (
        <div className="bg-[#1a1d27] border border-white/[0.07] rounded-2xl p-6 mb-5">
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-3">Notes</p>
          <p className="text-slate-300 text-sm leading-relaxed">{resume.notes}</p>
        </div>
      )}

      {/* Status Update */}
      <div className="bg-[#1a1d27] border border-white/[0.07] rounded-2xl p-6 mb-5">
        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-4">
          Application Status
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-[#0f1117] border border-white/[0.07] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          >
            <option value="New" className="bg-[#0f1117]">New</option>
            <option value="Shortlisted" className="bg-[#0f1117]">Shortlisted</option>
            <option value="Rejected" className="bg-[#0f1117]">Rejected</option>
            <option value="Called" className="bg-[#0f1117]">Called</option>
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={updating}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
          >
            {updating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </button>
        </div>
      </div>

      {/* Download */}
      {resume.resumeFile && (
        <div className="bg-[#1a1d27] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-4">Resume File</p>
          <a
            href={`http://localhost:5000/${resume.resumeFile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0f1117] border border-white/[0.07] hover:border-indigo-500/50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all hover:bg-indigo-500/5"
          >
            📄 Download Resume PDF
          </a>
        </div>
      )}
    </div>
  );
}