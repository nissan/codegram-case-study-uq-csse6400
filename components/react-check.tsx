"use client"

import { useEffect, useState } from "react"

export default function ReactCheck() {
  const [hasUseEffectEvent, setHasUseEffectEvent] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      // @ts-ignore
      const React = window.React || require("react")
      setHasUseEffectEvent(typeof React.useEffectEvent === "function")
    } catch (error) {
      console.error("Error checking for useEffectEvent:", error)
      setHasUseEffectEvent(false)
    }
  }, [])

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
      <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">React Check</h2>
      <p className="text-blue-600 dark:text-blue-400">
        {hasUseEffectEvent === null
          ? "Checking if React has useEffectEvent..."
          : hasUseEffectEvent
            ? "React has useEffectEvent"
            : "React does not have useEffectEvent"}
      </p>
    </div>
  )
}
