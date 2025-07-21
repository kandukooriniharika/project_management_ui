"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  id: number;
  name: string;
  key: string;
  template: string;
  startDate: string;
  endDate: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    const savedCurrent = localStorage.getItem("project");

    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedCurrent) setCurrentProject(JSON.parse(savedCurrent));
  }, []);

  const handleProjectClick = (project: Project) => {
    localStorage.setItem("project", JSON.stringify(project));
    setCurrentProject(project);
  };

  return (
    <div className="p-10 min-h-screen bg-blue-50 text-blue-900">
      {!currentProject && (
        <>
          <h1 className="text-3xl font-bold mb-6">Your Projects</h1>

          {projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className={`cursor-pointer p-5 rounded border shadow ${
                    currentProject?.id === project.id
                      ? "bg-blue-200 border-blue-400"
                      : "bg-white hover:bg-blue-100"
                  } transition`}
                >
                  <h2 className="text-xl font-semibold">
                    {project.name} ({project.key})
                  </h2>
                  <p className="text-sm">Template: {project.template}</p>
                  <p className="text-sm">
                    {project.startDate} → {project.endDate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {currentProject && (
        <>
          <h2 className="text-2xl font-bold mb-4">
            {currentProject.name} Dashboard
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/summary"
              className="bg-blue-100 text-blue-900 p-4 rounded shadow hover:bg-blue-200"
            >
              summary
            </Link>
            <Link
              href="/dashboard/timeline"
              className="bg-blue-100 text-blue-900 p-4 rounded shadow hover:bg-blue-200"
            >
              timeline
            </Link>
            <Link
              href="/dashboard/backlog"
              className="bg-blue-100 text-blue-900 p-4 rounded shadow hover:bg-blue-200"
            >
              backlog
            </Link>
            <Link
              href="/dashboard/board"
              className="bg-blue-100 text-blue-900 p-4 rounded shadow hover:bg-blue-200"
            >
              board
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
