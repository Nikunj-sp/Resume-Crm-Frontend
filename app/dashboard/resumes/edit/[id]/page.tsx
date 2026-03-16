"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function EditResumePage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get(`/resumes/${id}`);
        setFormData({
          ...res.data,
          skills: res.data.skills?.join(","),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/resumes/${id}`, {
        ...formData,
        skills: formData.skills.split(","),
      });
      toast.success("Resume updated");
      router.push("/dashboard/resumes");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update resume");
    } finally {
      setSaving(false);
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

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-4xl mb-3">📄</p>
          <p className="text-white font-medium">Resume not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full bg-[#0f1117] border border-white/[0.07] text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all";

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-slate-500 hover:text-white text-sm mb-8 flex items-center gap-1 transition-colors"
      >
        ← Back to Resumes
      </button>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Edit Resume</h1>
        <p className="text-slate-500 text-sm mt-1">
          Editing — <span className="text-slate-300">{formData.fullName}</span>
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8">

        {/* Personal Info */}
        <section>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-4">
            Personal Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              placeholder="Full Name"
              className={inputClass}
            />
            <input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className={inputClass}
            />
            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="Phone"
              className={inputClass}
            />
            <input
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              placeholder="Location"
              className={inputClass}
            />
          </div>
        </section>

        {/* Professional Info */}
        <section>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-4">
            Professional Details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Full Stack Development" className="bg-[#0f1117]">Full Stack Development</option>
              <option value="Digital Marketing" className="bg-[#0f1117]">Digital Marketing</option>
              <option value="Cyber Security" className="bg-[#0f1117]">Cyber Security</option>
            </select>
            <input
              name="experience"
              value={formData.experience || ""}
              onChange={handleChange}
              placeholder="Experience (years)"
              className={inputClass}
            />
            <input
              name="currentCompany"
              value={formData.currentCompany || ""}
              onChange={handleChange}
              placeholder="Current Company"
              className={inputClass}
            />
            <input
              name="expectedSalary"
              value={formData.expectedSalary || ""}
              onChange={handleChange}
              placeholder="Expected Salary"
              className={inputClass}
            />
          </div>
          <div className="mt-4">
            <input
              name="skills"
              value={formData.skills || ""}
              onChange={handleChange}
              placeholder="Skills (comma separated — e.g. React, Node.js, AWS)"
              className={inputClass}
            />
          </div>
        </section>

        {/* Status */}
        <section>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-4">
            Application Status
          </p>
          <select
            name="status"
            value={formData.status || "New"}
            onChange={handleChange}
            className={`${inputClass} w-full sm:w-64`}
          >
            <option value="New" className="bg-[#0f1117]">New</option>
            <option value="Shortlisted" className="bg-[#0f1117]">Shortlisted</option>
            <option value="Rejected" className="bg-[#0f1117]">Rejected</option>
            <option value="Called" className="bg-[#0f1117]">Called</option>
          </select>
        </section>

        {/* Notes */}
        <section>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-4">
            Notes
          </p>
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            placeholder="Any additional notes about this candidate..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </section>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}