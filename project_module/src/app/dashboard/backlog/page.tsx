"use client";
import { useEffect, useState } from "react";

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
  projectId: number;
}

interface Project {
  id: number;
  name: string;
}

export default function BacklogPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [epics, setEpics] = useState<Task[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);

  const [epicTitle, setEpicTitle] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [sprintName, setSprintName] = useState("");
  const [selectedEpic, setSelectedEpic] = useState<number | null>(null);
  const [selectedSprint, setSelectedSprint] = useState<number | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    const savedTasks = localStorage.getItem("tasks");
    const savedSprints = localStorage.getItem("sprints");

    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSprints) setSprints(JSON.parse(savedSprints));
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      const projectTasks = tasks.filter(t => t.projectId === selectedProjectId);
      setEpics(projectTasks.filter(t => t.type === "epic"));
    }
  }, [tasks, selectedProjectId]);

  const saveTasks = (updated: Task[]) => {
    setTasks(updated);
    setEpics(updated.filter((t) => t.type === "epic" && t.projectId === selectedProjectId));
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  const addEpic = () => {
    if (!selectedProjectId) return;
    const newEpic: Task = {
      id: Date.now(),
      title: epicTitle,
      type: "epic",
      status: "todo",
      projectId: selectedProjectId,
    };
    const updated = [...tasks, newEpic];
    saveTasks(updated);
    setEpicTitle("");
  };

  const addTask = () => {
    if (!selectedProjectId) return;
    const newTask: Task = {
      id: Date.now(),
      title: taskTitle,
      type: "task",
      status: "todo",
      epicId: selectedEpic || undefined,
      sprintId: selectedSprint || undefined,
      projectId: selectedProjectId,
    };
    const updated = [...tasks, newTask];
    saveTasks(updated);
    setTaskTitle("");
  };

  const createSprint = () => {
    if (!selectedProjectId) return;
    const newSprint: Sprint = {
      id: Date.now(),
      name: sprintName,
      projectId: selectedProjectId,
    };
    const updated = [...sprints, newSprint];
    setSprints(updated);
    localStorage.setItem("sprints", JSON.stringify(updated));
    setSprintName("");
  };

  const groupedTasks = (sprintId: number | null) =>
    tasks.filter(
      (t) =>
        t.projectId === selectedProjectId &&
        t.type === "task" &&
        (t.sprintId ?? null) === sprintId
    );

  return (
    <div className="min-h-screen bg-blue-50 p-6 text-blue-900">
      <h1 className="text-3xl font-bold mb-6">Backlog</h1>

      {/* Project Selector */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Project</label>
        <select
          className="p-2 border rounded w-full md:w-1/2"
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

      {selectedProjectId && (
        <>
          {/* Create Sprint */}
          <div className="mb-8 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Create Sprint</h2>
            <input
              className="p-2 border rounded w-1/2"
              placeholder="Sprint name"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={createSprint}
            >
              Add Sprint
            </button>
          </div>

          {/* Create Epic */}
          <div className="mb-8 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Create Epic</h2>
            <input
              className="p-2 border rounded w-1/2"
              placeholder="Epic title"
              value={epicTitle}
              onChange={(e) => setEpicTitle(e.target.value)}
            />
            <button
              className="ml-2 px-4 py-2 bg-purple-600 text-white rounded"
              onClick={addEpic}
            >
              Add Epic
            </button>
          </div>

          {/* Create Task */}
          <div className="mb-8 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Create Task</h2>
            <input
              className="p-2 border rounded w-1/2"
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <select
              className="ml-2 p-2 border rounded"
              onChange={(e) => setSelectedEpic(Number(e.target.value))}
            >
              <option value="">Select Epic</option>
              {epics.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
            <select
              className="ml-2 p-2 border rounded"
              onChange={(e) => setSelectedSprint(Number(e.target.value))}
            >
              <option value="">Select Sprint</option>
              {sprints
                .filter((s) => s.projectId === selectedProjectId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
            <button
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded"
              onClick={addTask}
            >
              Add Task
            </button>
          </div>

          {/* Sprint Task Lists */}
          {sprints
            .filter((s) => s.projectId === selectedProjectId)
            .map((sprint) => (
              <div key={sprint.id} className="mb-6">
                <h3 className="text-xl font-bold mb-2">{sprint.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedTasks(sprint.id).map((task) => (
                    <div
                      key={task.id}
                      className="bg-white p-4 border rounded shadow"
                    >
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm text-blue-700">
                        Epic:{" "}
                        {epics.find((e) => e.id === task.epicId)?.title || "None"}
                      </p>
                      <p className="text-xs">Status: {task.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* Unassigned Tasks */}
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-2">Backlog (Unassigned)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedTasks(null).map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 border rounded shadow"
                >
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-blue-700">
                    Epic:{" "}
                    {epics.find((e) => e.id === task.epicId)?.title || "None"}
                  </p>
                  <p className="text-xs">Status: {task.status}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

