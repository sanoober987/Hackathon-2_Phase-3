// frontend/components/PageLoader.tsx
'use client';

const PageLoader = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-zinc-900 z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-b-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;
