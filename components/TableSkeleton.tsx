"use client";

export default function TableSkeleton() {
  return (
    <div className="bg-white shadow-lg rounded-xl border overflow-hidden p-6">
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-6 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}