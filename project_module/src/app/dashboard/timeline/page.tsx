"use client";

import { useEffect, useState } from "react";
import { Gantt, Task as GanttTask } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

interface Task {
  id: number;
  title: string;
  type: "task" | "epic";
  status: string;
  epicId?: number;
  sprintId?: number;
  projectId: number;
}

interface Sprint {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
  projectId: number;
}

interface Project {
  id: number;
  name: string;
}

export default function TimelinePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    const savedTasks = localStorage.getItem("tasks");
    const savedSprints = localStorage.getItem("sprints");

    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSprints) setSprints(JSON.parse(savedSprints));
  }, []);

  const filteredTasks = tasks.filter((task) => task.projectId === selectedProjectId);
  const filteredSprints = sprints.filter((sprint) => sprint.projectId === selectedProjectId);

  const ganttTasks: GanttTask[] = filteredSprints.map((sprint) => {
    const start = sprint.startDate ? new Date(sprint.startDate) : new Date();
    const end = sprint.endDate ? new Date(sprint.endDate) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      id: sprint.id.toString(),
      name: sprint.name,
      start,
      end,
      type: "project",
      progress: 0,
      isDisabled: true,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Project Timeline</h1>

      {/* Project Selector */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-blue-800">Select Project</label>
        <select
          className="p-2 border border-blue-300 rounded w-full md:w-1/2"
          value={selectedProjectId || ""}
          onChange={(e) => setSelectedProjectId(Number(e.target.value))}
        >
          <option value="">-- Choose a Project --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Gantt Chart */}
      {selectedProjectId && ganttTasks.length > 0 && (
        <div className="bg-white border border-blue-200 p-4 rounded shadow">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Sprint Gantt Chart</h2>
          <Gantt tasks={ganttTasks} viewMode="Week" />
        </div>
      )}

      {/* Sprint Task Listing */}
      {selectedProjectId && (
        <div className="space-y-8 mt-10">
          {filteredSprints.map((sprint) => (
            <div key={sprint.id} className="bg-white border border-blue-200 p-5 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2 text-blue-700">{sprint.name}</h2>
              <div className="text-sm text-gray-500 mb-3">
                {sprint.startDate && sprint.endDate
                  ? `(${sprint.startDate} - ${sprint.endDate})`
                  : "No dates set"}
              </div>
              {filteredTasks.filter((t) => t.sprintId === sprint.id).length > 0 ? (
                <ul className="list-disc pl-6 space-y-1">
                  {filteredTasks
                    .filter((task) => task.sprintId === sprint.id)
                    .map((task) => (
                      <li key={task.id} className="text-blue-800">
                        {task.title} - <span className="italic">{task.status}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No tasks added for this sprint.</p>
              )}
            </div>
          ))}

          {filteredSprints.length === 0 && (
            <p className="text-gray-600 italic">No sprints found for this project.</p>
          )}
        </div>
      )}
    </div>
  );
}