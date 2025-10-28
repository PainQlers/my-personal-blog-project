import React from 'react';

// Simple, reusable loading page component using Tailwind CSS
// Usage:
// import LoadingPage from './LoadingPage.jsx'
// <LoadingPage message="กำลังโหลดข้อมูล..." showSkeleton={true} />

export default function LoadingScreen({ message = 'Loading...', showSkeleton = true }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full text-center">
        {/* Spinner + Message */}
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-16 h-16 animate-spin"
            viewBox="0 0 50 50"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M25 5a20 20 0 1 0 20 20.001L45 25A20 20 0 0 1 25 5z"
            />
          </svg>

          <h1 className="text-xl font-semibold text-gray-800">{message}</h1>
          <p className="text-sm text-gray-500">โปรดรอสักครู่...</p>
        </div>

        {/* Optional skeleton preview to make page feel faster */}
        {showSkeleton && (
          <div className="mt-8 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto animate-pulse"></div>
            <div className="h-48 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-center animate-pulse">
              <span className="text-gray-300">ตัวอย่างคอนเทนต์</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Small accessibility hint for screen readers */}
        <span className="sr-only" role="status">{message}</span>
      </div>
    </div>
  );
}
