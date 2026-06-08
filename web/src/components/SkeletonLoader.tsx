import React from 'react';

export default function SkeletonLoader() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="h-10 bg-gray-200 rounded w-full mb-2" />
            </div>
            <div className="flex-1">
              <div className="h-10 bg-gray-200 rounded w-full mb-2" />
            </div>
            <div className="h-10 bg-gray-200 rounded w-24" />
          </div>
        </div>

        <div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="mt-4 h-8 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
