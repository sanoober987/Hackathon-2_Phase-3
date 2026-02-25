"use client";

import { useState } from "react";
import { Task } from "@/types";
import { cn, formatRelativeTime } from "@/lib/utils";


interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  const disabled = isToggling;

  return (
    <div
      className={cn(
        "bg-white dark:bg-zinc-900 rounded-lg border p-4 transition-all",
        task.completed
          ? "border-zinc-200 dark:border-zinc-800 opacity-75"
          : "border-zinc-200 dark:border-zinc-700"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            "mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            task.completed
              ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
              : "border-zinc-300 dark:border-zinc-600 hover:border-blue-400",
            disabled && "opacity-50 cursor-wait"
          )}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          title={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && (
            <svg
              className="w-full h-full text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "text-base font-medium transition-colors",
              task.completed
                ? "text-zinc-500 dark:text-zinc-500 line-through"
                : "text-zinc-900 dark:text-zinc-100"
            )}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={cn(
                "mt-1 text-sm transition-colors",
                task.completed
                  ? "text-zinc-400 dark:text-zinc-600"
                  : "text-zinc-600 dark:text-zinc-400"
              )}
            >
              {task.description}
            </p>
          )}
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
            {formatRelativeTime(task.updated_at)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Edit task"
            title="Edit task"
            disabled={disabled}
          >
            {/* Edit Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={() => onDelete(task)}
            className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Delete task"
            title="Delete task"
            disabled={disabled}
          >
            {/* Delete Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
