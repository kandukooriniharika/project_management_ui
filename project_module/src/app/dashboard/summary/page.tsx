"use client";
import { useEffect, useState } from "react";

export default function SummaryPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  const taskCount = tasks.length;
  const epicCount = tasks.filter((t) => t.type === "epic").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="min-h-screen bg-blue-50 p-10 text-blue-900">
      <h1 className="text-3xl font-bold mb-6">Project Summary</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">Total Items: {taskCount}</div>
        <div className="bg-white p-6 rounded shadow">Epics: {epicCount}</div>
        <div className="bg-white p-6 rounded shadow">Completed: {doneCount}</div>
      </div>
    </div>
  );
}
