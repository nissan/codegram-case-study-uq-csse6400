"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CodeProps {
  children: string
  language?: string
  className?: string
}

export function Code({ children, language = "javascript", className }: CodeProps) {
  const [highlighted, setHighlighted] = useState<string | null>(null)

  useEffect(() => {
    // This is a simple syntax highlighting implementation
    const highlightCode = () => {
      let code = children

      // Replace < and > with their HTML entities to prevent rendering as HTML
      code = code.replace(/</g, "&lt;").replace(/>/g, "&gt;")

      // Keywords
      const keywords = [
        "import",
        "from",
        "class",
        "def",
        "return",
        "if",
        "else",
        "for",
        "while",
        "try",
        "except",
        "with",
        "as",
        "in",
        "not",
        "and",
        "or",
        "pass",
        "None",
        "True",
        "False",
        "async",
        "await",
        "function",
        "const",
        "let",
        "var",
        "resource",
        "provider",
        "module",
        "output",
        "data",
        "FastAPI",
        "app",
      ]

      // Replace keywords with spans
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "g")
        code = code.replace(regex, `<span class="text-purple-500 dark:text-purple-400">${keyword}</span>`)
      })

      // Strings
      code = code.replace(/'([^']*)'/g, "<span class=\"text-green-600 dark:text-green-400\">'$1'</span>")
      code = code.replace(/"([^"]*)"/g, '<span class="text-green-600 dark:text-green-400">"$1"</span>')

      // Comments
      code = code.replace(/(#.*)$/gm, '<span class="text-gray-500">$1</span>')
      code = code.replace(/(\/\/.*)$/gm, '<span class="text-gray-500">$1</span>')

      // Numbers
      code = code.replace(/\b(\d+)\b/g, '<span class="text-yellow-600 dark:text-yellow-400">$1</span>')

      // Function calls
      code = code.replace(/(\w+)\(/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>(')

      setHighlighted(code)
    }

    highlightCode()
  }, [children])

  return (
    <pre
      className={cn(
        "p-4 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 overflow-auto",
        className,
      )}
    >
      {highlighted ? (
        <code
          className="text-gray-800 dark:text-gray-200 font-mono text-sm"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      ) : (
        <code className="text-gray-800 dark:text-gray-200 font-mono text-sm">{children}</code>
      )}
    </pre>
  )
}
