// frontend/components/LoadingSkeleton.tsx
"use client";

interface LoadingSkeletonProps {
  type?: "task-list" | "task-item" | "form";
}

const baseCardClasses =
  "animate-pulse bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 mb-3";

const LoadingSkeleton = ({ type = "task-list" }: LoadingSkeletonProps) => {
  if (type === "task-list") {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className={baseCardClasses}>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-200 dark:bg-zinc-700 h-6 w-6"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-1/2"></div>
              </div>
              <div className="h-5 w-5 bg-gray-200 dark:bg-zinc-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "task-item") {
    return (
      <div className={baseCardClasses}>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gray-200 dark:bg-zinc-700 h-6 w-6"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-1/2"></div>
          </div>
          <div className="h-5 w-5 bg-gray-200 dark:bg-zinc-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="animate-pulse bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 mb-6 space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 dark:bg-zinc-700 rounded"></div>
        <div className="h-20 bg-gray-200 dark:bg-zinc-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-zinc-700 rounded w-1/6 ml-auto"></div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
