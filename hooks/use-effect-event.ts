"use client"

import { useCallback, useRef } from "react"

/**
 * A custom hook that mimics the behavior of React's useEffectEvent
 * This uses useCallback and useRef to create a stable function reference
 * that always uses the latest props/state values
 */
export function useEffectEvent<T extends (...args: any[]) => any>(callback: T): T {
  // Keep track of the latest callback
  const callbackRef = useRef(callback)

  // Update the ref whenever the callback changes
  callbackRef.current = callback

  // Return a stable function that calls the latest callback
  return useCallback(
    ((...args) => {
      return callbackRef.current(...args)
    }) as T,
    [],
  )
}
