"use client"

import { useState } from "react"

export default function TestPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">This is a minimal test page to verify that basic React functionality works.</p>
      <div className="flex items-center gap-4">
        <button onClick={() => setCount(count + 1)} className="px-4 py-2 bg-blue-500 text-white rounded">
          Increment
        </button>
        <span>Count: {count}</span>
      </div>
    </div>
  )
}
