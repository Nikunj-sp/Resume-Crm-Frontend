interface StatCardProps {
  title: string;
  value: number;
}

export default function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <h2 className="text-gray-900 text-xl mb-2 font-medium">{title}</h2>
      <p className="text-3xl font-bold text-gray-500">{value}</p>
    </div>
  );
}