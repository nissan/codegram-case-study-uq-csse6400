"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Error caught by error boundary:", error)
      setHasError(true)
      setError(error.error || new Error(error.message))
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen bg-red-50 p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
        <div className="bg-white p-4 rounded-md border border-red-200 mb-4">
          <p className="font-bold text-red-600">{error?.message || "Unknown error"}</p>
          {error?.stack && (
            <pre className="mt-2 text-sm text-red-500 overflow-auto p-2 bg-red-50 rounded">{error.stack}</pre>
          )}
        </div>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded">
          Reload page
        </button>
      </div>
    )
  }

  return <>{children}</>
}
