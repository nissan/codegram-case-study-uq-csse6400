"use client"

import { useCallback } from "react"

// This is a simple mock for useEffectEvent that just uses useCallback
// It doesn't have the exact same semantics as the real useEffectEvent,
// but it should prevent errors from occurring
export function useEffectEvent<T extends (...args: any[]) => any>(callback: T): T {
  return useCallback(callback, []) as T
}
