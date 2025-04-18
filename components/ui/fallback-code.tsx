"use client"

import { cn } from "@/lib/utils"

interface CodeProps {
  children: string
  language?: string
  className?: string
}

export function FallbackCode({ children, language = "javascript", className }: CodeProps) {
  return (
    <pre
      className={cn(
        "p-4 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 overflow-auto",
        `language-${language}`,
        className,
      )}
    >
      <code className="text-gray-800 dark:text-gray-200 font-mono text-sm whitespace-pre">{children}</code>
    </pre>
  )
}
