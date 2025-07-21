"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const template = searchParams.get("template") || "scrum";

  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
    duration: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const newProject = {
      ...formData,
      template,
      id: Date.now(),
    };

    // Save to `projects` array in localStorage
    const existing = JSON.parse(localStorage.getItem("projects") || "[]");
    localStorage.setItem("projects", JSON.stringify([...existing, newProject]));

    // Also update the current active project
    localStorage.setItem("project", JSON.stringify(newProject));
    localStorage.setItem("tasks", JSON.stringify([]));
    localStorage.setItem("sprints", JSON.stringify([]));

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-10 text-blue-900">
      <h1 className="text-3xl font-bold mb-6">Create {template} Project</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          name="name"
          onChange={handleChange}
          placeholder="Project Name"
          className="p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="key"
          onChange={handleChange}
          placeholder="Project Key (e.g. JIRA)"
          className="p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="duration"
          onChange={handleChange}
          placeholder="Duration (in weeks)"
          className="p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div>
          <label className="block text-sm font-semibold mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            onChange={handleChange}
            className="w-full p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            onChange={handleChange}
            className="w-full p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <textarea
        name="description"
        onChange={handleChange}
        placeholder="Project Description"
        rows={4}
        className="mt-6 block w-full p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
      >
        Create Project
      </button>
    </div>
  );
}
