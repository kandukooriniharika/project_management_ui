export default function TaskCard({ task }: { task: any }) {
  return (
    <div className="bg-white mb-2 p-3 rounded shadow">
      <p className="font-bold">{task.title}</p>
      <p className="text-sm text-blue-700">{task.type} - {task.status}</p>
    </div>
  );
}