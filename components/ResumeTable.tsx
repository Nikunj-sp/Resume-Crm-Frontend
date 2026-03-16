"use client";

interface Resume {
  _id: string;
  fullName: string;
  email: string;
  category: string;
  experience: number;
}

interface ResumeTableProps {
  resumes: Resume[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ResumeTable({
  resumes,
  onView,
  onEdit,
  onDelete,
}: ResumeTableProps) {
  return (
    <div className="bg-white shadow-lg rounded-xl border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-200 text-gray-600 text-sm uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Experience</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {resumes.map((resume) => (
            <tr key={resume._id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-medium text-gray-800">
                {resume.fullName}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {resume.email}
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                  {resume.category}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-700">
                {resume.experience} yrs
              </td>
              <td className="px-6 py-4 space-x-3">
                <button
                  onClick={() => onView(resume._id)}
                  className="text-blue-600 hover:underline hover:text-blue-800 transition"
                >
                  View
                </button>

                <button
                  onClick={() => onEdit(resume._id)}
                  className="text-green-600 hover:underline hover:text-green-800 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(resume._id)}
                  className="text-red-600 hover:underline hover:text-red-800 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {resumes.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No resumes found.
        </div>
      )}
    </div>
  );
}