"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { FallbackCode } from "./fallback-code"
import { Copy, Check } from "lucide-react"

interface CodeProps {
  children: string
  language?: string
  className?: string
}

export function Code({ children, language = "javascript", className }: CodeProps) {
  const [mounted, setMounted] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [copied, setCopied] = useState(false)
  const highlightInitialized = useRef(false)
  const codeRef = useRef<HTMLPreElement>(null)

  // Map our language names to highlight.js language names
  const getHighlightLanguage = (lang: string) => {
    const languageMap: Record<string, string> = {
      javascript: "javascript",
      python: "python",
      typescript: "typescript",
      jsx: "javascript",
      tsx: "typescript",
      json: "json",
      bash: "bash",
      terraform: "plaintext", // Use plaintext for terraform
      hcl: "plaintext", // Use plaintext for hcl
    }
    return languageMap[lang] || "plaintext"
  }

  useEffect(() => {
    setMounted(true)

    const initializeHighlight = async () => {
      try {
        // Add highlight.js CSS to the document head
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
        document.head.appendChild(link)

        // Load highlight.js script - use the complete version with all languages
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
        script.async = true

        script.onload = () => {
          // Once loaded, highlight all code blocks
          // @ts-ignore - hljs is loaded from CDN
          window.hljs.highlightAll()
          highlightInitialized.current = true
        }

        script.onerror = () => {
          console.error("Failed to load highlight.js")
          setLoadFailed(true)
        }

        document.body.appendChild(script)

        return () => {
          // Clean up
          if (document.head.contains(link)) {
            document.head.removeChild(link)
          }
          if (document.body.contains(script)) {
            document.body.removeChild(script)
          }
        }
      } catch (error) {
        console.error("Failed to load highlight.js:", error)
        setLoadFailed(true)
      }
    }

    initializeHighlight()
  }, [])

  useEffect(() => {
    // Re-highlight when language or content changes
    if (mounted && !loadFailed && highlightInitialized.current) {
      // @ts-ignore - hljs is loaded from CDN
      if (window.hljs) {
        setTimeout(() => {
          // @ts-ignore - hljs is loaded from CDN
          window.hljs.highlightAll()
        }, 0)
      }
    }
  }, [children, language, mounted, loadFailed])

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

  if (!mounted) {
    // Return a placeholder while the component is mounting
    return (
      <div
        className={cn(
          "p-4 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 h-64",
          className,
        )}
      >
        <div className="animate-pulse h-full bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    )
  }

  // If loading failed, use the FallbackCode component
  if (loadFailed) {
    return (
      <FallbackCode language={language} className={className}>
        {children}
      </FallbackCode>
    )
  }

  // Apply our own styling on top of highlight.js
  const codeStyle = `
    .hljs {
      background: transparent;
      padding: 0;
      color: #1e293b;
    }
    .dark .hljs {
      color: #e2e8f0;
    }
    .hljs-comment, .hljs-quote {
      color: #6b7280;
      font-style: italic;
    }
    .dark .hljs-comment, .dark .hljs-quote {
      color: #9ca3af;
    }
    .hljs-keyword, .hljs-selector-tag, .hljs-subst {
      color: #8b5cf6;
      font-weight: bold;
    }
    .dark .hljs-keyword, .dark .hljs-selector-tag, .dark .hljs-subst {
      color: #a78bfa;
    }
    .hljs-string, .hljs-doctag, .hljs-regexp {
      color: #10b981;
    }
    .dark .hljs-string, .dark .hljs-doctag, .dark .hljs-regexp {
      color: #34d399;
    }
    .hljs-title, .hljs-section, .hljs-selector-id {
      color: #3b82f6;
      font-weight: bold;
    }
    .dark .hljs-title, .dark .hljs-section, .dark .hljs-selector-id {
      color: #60a5fa;
    }
    .hljs-number, .hljs-literal, .hljs-variable, .hljs-template-variable, .hljs-tag .hljs-attr {
      color: #f59e0b;
    }
    .dark .hljs-number, .dark .hljs-literal, .dark .hljs-variable, .dark .hljs-template-variable, .dark .hljs-tag .hljs-attr {
      color: #fbbf24;
    }
    .hljs-symbol, .hljs-bullet {
      color: #ec4899;
    }
    .dark .hljs-symbol, .dark .hljs-bullet {
      color: #f472b6;
    }
    .hljs-meta {
      color: #f97316;
    }
    .dark .hljs-meta {
      color: #fb923c;
    }
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: bold;
    }
  `

  const highlightLanguage = getHighlightLanguage(language)

  return (
    <>
      <style>{codeStyle}</style>
      <div className="relative group">
        <pre
          ref={codeRef}
          className={cn(
            "p-4 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 overflow-auto",
            className,
          )}
        >
          <code className={`language-${highlightLanguage}`}>{children}</code>
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
    </>
  )
}
