"use client";
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function DraggableTask({ task }: { task: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useDraggable({ id: task.id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`mb-2 p-3 rounded shadow cursor-move flex justify-between items-center ${
        task.status === "done" ? "bg-pink-100 text-pink-900" : "bg-white"
      }`}
    >
      <div>
        <p className="font-semibold">
          {task.title}{" "}
          <span className="text-xs text-gray-500">({task.type})</span>
        </p>
        <p className="text-sm text-blue-700">
          Epic: <span className="font-medium">{task.epic || "None"}</span>
        </p>
      </div>
      {task.status === "done" && (
        <span className="text-green-600 text-xl font-bold ml-2">✓</span>
      )}
    </div>
  );
}

function DroppableColumn({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] p-4 rounded shadow ${
        id === "done" ? "bg-pink-100" : "bg-blue-100"
      }`}
    >
      {children}
    </div>
  );
}

export default function BoardPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const updated = tasks.map((task) =>
        task.id === active.id ? { ...task, status: over.id } : task
      );
      setTasks(updated);
      localStorage.setItem("tasks", JSON.stringify(updated));
    }
  };

  const columns = ["todo", "in progress", "done"];

  return (
    <div className="min-h-screen bg-blue-50 p-10 text-blue-900">
      <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => (
            <div key={col}>
              <h2 className="text-xl font-bold capitalize mb-4 text-center">
                {col}
              </h2>
              <DroppableColumn id={col}>
                <SortableContext
                  items={tasks.filter((t) => t.status === col)}
                  strategy={verticalListSortingStrategy}
                >
                  {tasks
                    .filter((t) => t.status === col)
                    .map((task) => (
                      <DraggableTask key={task.id} task={task} />
                    ))}
                </SortableContext>
              </DroppableColumn>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
