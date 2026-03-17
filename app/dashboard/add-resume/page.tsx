"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function AddResumePage() {
  const router = useRouter();


  type FormDataType = {
  fullName: string;
  email: string;
  phone: string;
  skills: string;
  category: string;
  experience: string;
  currentCompany: string;
  expectedSalary: string;
  location: string;
  notes: string;
};
  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    email: "",
    phone: "",
    skills: "",
    category: "",
    experience: "",
    currentCompany: "",
    expectedSalary: "",
    location: "",
    notes: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      (Object.keys(formData) as (keyof FormDataType)[]).forEach((key) => {
        data.append(key, String(formData[key]));
      });
      if (file) data.append("resumeFile", file);
      await api.post("/resumes", data);
      toast.success("Resume added successfully");
      router.push("/dashboard/resumes");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add resume");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#1a1d27] border border-white/[0.07] text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all";

    const handleFileUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  if (!e.target.files) return;

  const selectedFile = e.target.files[0];
  setFile(selectedFile);
};

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Add Resume</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the candidate details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Personal Info */}
        <section>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-4">
            Personal Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="fullName" placeholder="Full Name" onChange={handleChange} required className={inputClass} />
            <input name="email" placeholder="Email" type="email" onChange={handleChange} required className={inputClass} />
            <input name="phone" placeholder="Phone" onChange={handleChange} required className={inputClass} />
            <input name="location" placeholder="Location" onChange={handleChange} className={inputClass} />
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
              required
              value={formData.category}
              onChange={handleChange}
              className={`${inputClass} ${formData.category === "" ? "text-slate-500" : "text-white"}`}
            >
              <option value="" disabled className="bg-[#1a1d27]">Select Category</option>
              <option value="Full Stack Development" className="bg-[#1a1d27] text-white">Full Stack Development</option>
              <option value="Digital Marketing" className="bg-[#1a1d27] text-white">Digital Marketing</option>
              <option value="Cyber Security" className="bg-[#1a1d27] text-white">Cyber Security</option>
            </select>
            <input name="experience" placeholder="Experience (years)" onChange={handleChange} className={inputClass} />
            <input name="currentCompany" placeholder="Current Company" onChange={handleChange} className={inputClass} />
            <input name="expectedSalary" placeholder="Expected Salary" onChange={handleChange} className={inputClass} />
          </div>
          <div className="mt-4">
            <input name="skills" placeholder="Skills (comma separated — e.g. React, Node.js, AWS)" onChange={handleChange} className={inputClass} />
          </div>
        </section>

        {/* Notes */}
        <section>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-4">
            Notes
          </p>
          <textarea
            name="notes"
            placeholder="Any additional notes about this candidate..."
            onChange={handleChange}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </section>

        {/* File Upload */}
        <section>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-4">
            Resume Upload
          </p>
          <label
            htmlFor="resume"
            className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
              file
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-white/10 bg-[#1a1d27] hover:border-indigo-500/50 hover:bg-indigo-500/5"
            }`}
          >
            {file ? (
              <>
                <span className="text-3xl mb-2">✅</span>
                <p className="text-emerald-400 font-medium text-sm">{file.name}</p>
                <p className="text-slate-500 text-xs mt-1">Click to replace</p>
              </>
            ) : (
              <>
                <svg
                  className="w-9 h-9 text-slate-500 mb-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5.5 5.5 0 0117.5 9H18a4 4 0 010 8h-3m-3-4v6m0 0l-3-3m3 3l3-3"
                  />
                </svg>
                <p className="text-slate-300 font-medium text-sm">Click or drag resume to upload</p>
                <p className="text-slate-500 text-xs mt-1">PDF only • Max size 5MB</p>
              </>
            )}
            <input
              id="resume"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileUpload}
          ></input>
          </label>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Resume"
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