"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Copy, Check } from "lucide-react"

interface CodeProps {
  children: string
  language?: string
  className?: string
}

export function FallbackCode({ children, language = "javascript", className }: CodeProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    if (navigator.clipboard && children) {
      try {
        await navigator.clipboard.writeText(children)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy text: ", err)
      }
    }
  }

  return (
    <div className="relative group">
      <pre
        className={cn(
          "p-4 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 overflow-auto",
          `language-${language}`,
          className,
        )}
      >
        <code className="text-gray-800 dark:text-gray-200 font-mono text-sm whitespace-pre">{children}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-opacity opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
        title="Copy code"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}
