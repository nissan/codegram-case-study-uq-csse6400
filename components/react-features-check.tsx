"use client"

import { useState, useEffect } from "react"

export default function ReactFeaturesCheck() {
  const [features, setFeatures] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      // @ts-ignore - Check for experimental features
      const React = window.React || require("react")

      setFeatures({
        version: React.version,
        useEffectEvent: typeof React.experimental_useEffectEvent === "function",
        useOptimistic: typeof React.useOptimistic === "function",
        use: typeof React.use === "function",
        cache: typeof React.cache === "function",
        // Add other experimental features as needed
      })
    } catch (error) {
      console.error("Error checking React features:", error)
    }
  }, [])

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
      <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">React Features Check</h2>
      <pre className="bg-white dark:bg-gray-900 p-4 rounded-md overflow-auto text-xs">
        {JSON.stringify(features, null, 2)}
      </pre>
    </div>
  )
}
