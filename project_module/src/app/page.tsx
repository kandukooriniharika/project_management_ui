"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [showTemplates, setShowTemplates] = useState(false);

  const handleTemplateSelect = (template: string) => {
    router.push(`/create?template=${template}`);
  };

  const handleMenuClick = (item: string) => {
    if (item === "projects") {
      setShowTemplates(true);
    } else {
      setShowTemplates(false);
      alert(`${item} clicked`);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow h-full flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-pink-600">Project Management</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {[
              { label: "All Projects", value: "all-projects" },
              { label: "Recent", value: "recent" },
              { label: "Starred", value: "starred" },
              { label: "Projects", value: "projects" },
              { label: "Dashboard", value: "dashboard" },
              { label: "My Team", value: "my-team" },
            ].map((item) => (
              <li key={item.value}>
                <button
                  onClick={() => handleMenuClick(item.value)}
                  className="w-full text-left px-4 py-2 rounded hover:bg-pink-100 text-gray-800 font-medium transition"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto bg-blue-50">
        {showTemplates ? (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-semibold text-blue-800 mb-6">
              Select a Project Template
            </h2>
            <div className="space-x-4">
              <button
                onClick={() => handleTemplateSelect("scrum")}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
              >
                Scrum
              </button>
              <button
                onClick={() => handleTemplateSelect("kanban")}
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
              >
                Kanban
              </button>
            </div>
          </div>
        ) : (
          <div className="text-xl text-gray-600">
            Select "Projects" from the sidebar to create a new one.
          </div>
        )}
      </main>
    </div>
  );
}
