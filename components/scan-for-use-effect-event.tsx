"use client"

import { useState, useEffect } from "react"

export default function ScanForUseEffectEvent() {
  const [found, setFound] = useState<string[]>([])
  const [scanning, setScanning] = useState(true)

  useEffect(() => {
    // This is a simple client-side scan for useEffectEvent
    const scanForUseEffectEvent = () => {
      const foundIn: string[] = []

      // Check if any script tags contain useEffectEvent
      document.querySelectorAll("script").forEach((script, index) => {
        if (script.textContent?.includes("useEffectEvent")) {
          foundIn.push(`Script tag #${index + 1}`)
        }
      })

      // Check if any function in the window object is named useEffectEvent
      Object.keys(window).forEach((key) => {
        try {
          const value = (window as any)[key]
          if (typeof value === "function" && value.name === "useEffectEvent") {
            foundIn.push(`window.${key}`)
          }
          // Check if the value is an object that might contain useEffectEvent
          if (typeof value === "object" && value !== null) {
            Object.keys(value).forEach((subKey) => {
              try {
                const subValue = value[subKey]
                if (typeof subValue === "function" && subValue.name === "useEffectEvent") {
                  foundIn.push(`window.${key}.${subKey}`)
                }
              } catch (e) {
                // Ignore errors when accessing properties
              }
            })
          }
        } catch (e) {
          // Ignore errors when accessing properties
        }
      })

      setFound(foundIn)
      setScanning(false)
    }

    // Run the scan after a short delay to ensure the page is fully loaded
    const timer = setTimeout(scanForUseEffectEvent, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
      <h2 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Scan for useEffectEvent</h2>
      {scanning ? (
        <p className="text-yellow-600 dark:text-yellow-400">Scanning for useEffectEvent...</p>
      ) : found.length > 0 ? (
        <>
          <p className="text-yellow-600 dark:text-yellow-400 mb-2">Found useEffectEvent in:</p>
          <ul className="list-disc pl-5">
            {found.map((location, index) => (
              <li key={index} className="text-yellow-600 dark:text-yellow-400">
                {location}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-yellow-600 dark:text-yellow-400">
          No instances of useEffectEvent found in the client-side code.
        </p>
      )}
    </div>
  )
}
