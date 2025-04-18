"use client"

// This file provides polyfills for experimental React features
// that might be used in the codebase but aren't available in the current React version

import { useCallback } from "react"

// Polyfill for useEffectEvent
// This is a simple implementation that just uses useCallback
// It doesn't have the exact same semantics as the real useEffectEvent,
// but it should prevent errors from occurring
export function useEffectEvent<T extends (...args: any[]) => any>(callback: T): T {
  return useCallback(callback, []) as T
}
