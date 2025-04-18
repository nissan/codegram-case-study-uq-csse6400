"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TestRender() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
      <h2 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">Test Render Component</h2>
      <p className="text-green-600 dark:text-green-400 mb-4">
        If you can see this component and interact with it, the app is rendering correctly.
      </p>
      <div className="flex items-center gap-4">
        <Button onClick={() => setCount(count + 1)}>Increment</Button>
        <span className="text-green-600 dark:text-green-400">Count: {count}</span>
      </div>
    </div>
  )
}
