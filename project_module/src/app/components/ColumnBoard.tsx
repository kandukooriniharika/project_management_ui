import TaskCard from "./TaskCard";

export default function ColumnBoard({ title, tasks, moveTask }: { title: string; tasks: any[]; moveTask: (id: number, status: string) => void; }) {
  return (
    <div className="bg-blue-100 p-4 rounded shadow">
      <h2 className="text-xl font-bold capitalize mb-4">{title}</h2>
      {tasks.map((task) => (
        <div key={task.id}>
          <TaskCard task={task} />
          <div className="mt-1 space-x-1">
            {["todo", "in progress", "done"].map((status) => (
              <button
                key={status}
                onClick={() => moveTask(task.id, status)}
                className={`text-xs px-2 py-1 rounded ${task.status === status ? 'bg-blue-700 text-white' : 'bg-blue-300 text-blue-800'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}