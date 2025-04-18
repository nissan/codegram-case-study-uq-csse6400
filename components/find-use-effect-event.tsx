"use client"

import { useState, useEffect } from "react"

export default function FindUseEffectEvent() {
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This is just a placeholder - in a real scenario, we would need server-side code to scan files
    setFiles(["components/architecture-tab.tsx", "components/mermaid-diagram.tsx", "components/ui/code.tsx"])
    setLoading(false)
  }, [])

  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
      <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
        Files that might import useEffectEvent
      </h2>
      {loading ? (
        <p>Scanning files...</p>
      ) : (
        <ul className="list-disc pl-5">
          {files.map((file) => (
            <li key={file} className="text-red-600 dark:text-red-400">
              {file}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
