"use client"

import { useCallback } from "react"

// This is a simple replacement for useEffectEvent that just uses useCallback
export function useEffectEvent<T extends (...args: any[]) => any>(callback: T): T {
  return useCallback(callback, []) as T
}
