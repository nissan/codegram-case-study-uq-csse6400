"use client"

import { useState, useEffect } from "react"

export default function SearchForUseEffectEvent() {
  const [results, setResults] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(true)

  useEffect(() => {
    // This is a client-side only search that looks for useEffectEvent in the page
    const searchForUseEffectEvent = () => {
      setIsSearching(true)
      const foundInstances: string[] = []

      // Search in the DOM for script tags that might contain useEffectEvent
      const scripts = document.querySelectorAll("script")
      scripts.forEach((script, index) => {
        if (script.textContent?.includes("useEffectEvent")) {
          foundInstances.push(`Found in script tag #${index + 1}`)
        }
      })

      // Search in the window object for any global variables that might contain useEffectEvent
      try {
        const allGlobals = Object.getOwnPropertyNames(window)
        for (const global of allGlobals) {
          try {
            const globalValue = (window as any)[global]
            if (typeof globalValue === "string" && globalValue.includes("useEffectEvent")) {
              foundInstances.push(`Found in window.${global}`)
            }
          } catch (e) {
            // Ignore errors when accessing certain properties
          }
        }
      } catch (e) {
        foundInstances.push(`Error searching globals: ${e}`)
      }

      setResults(
        foundInstances.length > 0 ? foundInstances : ["No instances of useEffectEvent found in the client-side code"],
      )
      setIsSearching(false)
    }

    // Run the search after a short delay to ensure the page is fully loaded
    const timer = setTimeout(searchForUseEffectEvent, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
      <h2 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Search for useEffectEvent</h2>
      <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
        This component searches for instances of useEffectEvent in the client-side code.
      </p>
      <div className="bg-white dark:bg-gray-900 p-4 rounded-md border border-yellow-100 dark:border-yellow-900 overflow-auto max-h-[300px]">
        {isSearching ? (
          <p className="text-yellow-600 dark:text-yellow-400">Searching...</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {results.map((result, index) => (
              <li key={index} className="text-xs text-yellow-800 dark:text-yellow-300">
                {result}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
