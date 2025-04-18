"use client"

import { useState, useEffect } from "react"

export default function ReactCheck() {
  const [reactInfo, setReactInfo] = useState<any>(null)

  useEffect(() => {
    try {
      // @ts-ignore
      const React = window.React || require("react")
      setReactInfo({
        version: React.version,
        hooks: {
          useState: typeof React.useState === "function",
          useEffect: typeof React.useEffect === "function",
          useCallback: typeof React.useCallback === "function",
          useMemo: typeof React.useMemo === "function",
          useRef: typeof React.useRef === "function",
          // Check for experimental hooks
          useEffectEvent: typeof React.useEffectEvent === "function",
        },
      })
    } catch (error) {
      setReactInfo({ error: String(error) })
    }
  }, [])

  if (!reactInfo) {
    return <div>Loading React info...</div>
  }

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
      <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">React Information</h2>
      <pre className="bg-white dark:bg-gray-900 p-4 rounded-md overflow-auto text-xs">
        {JSON.stringify(reactInfo, null, 2)}
      </pre>
    </div>
  )
}
