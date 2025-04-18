"use client"

import { useState, useEffect } from "react"
import { useEffectEvent } from "@/hooks/use-effect-event"

export default function HookTest() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("")

  // This function will always use the latest count value
  const logCount = useEffectEvent(() => {
    setMessage(`Current count is: ${count}`)
  })

  useEffect(() => {
    // This effect runs once, but the logCount function will always use the latest count
    const timer = setInterval(() => {
      logCount()
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
      <h2 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">useEffectEvent Test</h2>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Increment: {count}
        </button>
      </div>
      <p className="text-green-600 dark:text-green-400">{message}</p>
      <p className="text-sm text-green-500 dark:text-green-400 mt-2">
        This component tests our custom useEffectEvent hook. The message should always show the current count, even
        though the effect only runs once.
      </p>
    </div>
  )
}
