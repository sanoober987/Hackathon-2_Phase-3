"use client";

import { Task } from "@/types";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "./EmptyState";
import { LoadingScreen } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onToggleComplete: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onRetry: () => void;
}

export function TaskList({
  tasks,
  isLoading,
  error,
  onToggleComplete,
  onEdit,
  onDelete,
  onRetry,
}: TaskListProps) {
  if (isLoading && tasks.length === 0) {
    return <LoadingScreen message="Loading your tasks..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12" aria-live="polite">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-4 mb-6">
          <p className="font-medium">Error loading tasks</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
        <Button onClick={onRetry} variant="secondary">
          Try Again
        </Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
