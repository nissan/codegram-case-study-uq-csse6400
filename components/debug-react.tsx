"use client"

import React from "react"

export default function DebugReact() {
  // Instead of using require, we'll check for specific exports
  // that we're concerned about
  const reactExports = {
    // Core hooks
    useState: typeof React.useState === "function",
    useEffect: typeof React.useEffect === "function",
    useContext: typeof React.useContext === "function",
    useReducer: typeof React.useReducer === "function",
    useCallback: typeof React.useCallback === "function",
    useMemo: typeof React.useMemo === "function",
    useRef: typeof React.useRef === "function",

    // Additional hooks
    useLayoutEffect: typeof React.useLayoutEffect === "function",
    useDebugValue: typeof React.useDebugValue === "function",
    useDeferredValue: typeof React.useDeferredValue === "function",
    useTransition: typeof React.useTransition === "function",
    useId: typeof React.useId === "function",

    // Experimental hooks (these might not exist)
    useEffectEvent: typeof (React as any).useEffectEvent === "function",
    useEvent: typeof (React as any).useEvent === "function",

    // React version
    version: React.version,
  }

  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
      <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">React Exports Debug</h2>
      <p className="text-sm text-red-600 dark:text-red-400 mb-4">
        This component checks for specific React exports to help debug import issues.
      </p>
      <div className="bg-white dark:bg-gray-900 p-4 rounded-md border border-red-100 dark:border-red-900 overflow-auto max-h-[300px]">
        <pre className="text-xs text-red-800 dark:text-red-300">{JSON.stringify(reactExports, null, 2)}</pre>
      </div>
    </div>
  )
}
