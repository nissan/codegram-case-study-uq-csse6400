"use client"

import { useEffect, useRef } from "react"

interface MermaidDiagramProps {
  chart: string
  caption?: string
  className?: string
}

export default function MermaidDiagram({ chart, caption, className = "" }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const diagramId = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    // We need to dynamically import mermaid to avoid SSR issues
    const renderDiagram = async () => {
      try {
        if (!containerRef.current) return

        // Clear previous content
        containerRef.current.innerHTML = `
          <div class="flex items-center justify-center p-4">
            <div class="animate-pulse text-gray-500 dark:text-gray-400">Loading diagram...</div>
          </div>
        `

        // Import mermaid dynamically
        const mermaid = (await import("mermaid")).default

        // Configure mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "monospace",
        })

        // Add the diagram markup
        containerRef.current.innerHTML = `<div class="mermaid">${chart}</div>`

        // Render the diagram
        await mermaid.run({
          nodes: [containerRef.current.querySelector(".mermaid")],
        })
      } catch (error) {
        console.error("Failed to render mermaid diagram:", error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p class="text-red-600 dark:text-red-400 text-sm font-medium">Error rendering diagram</p>
              <pre class="mt-2 text-xs overflow-auto p-2 bg-white dark:bg-gray-900 rounded border border-red-100 dark:border-red-900">${
                error instanceof Error ? error.message : String(error)
              }</pre>
              <div class="mt-4 p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Diagram source:</p>
                <pre class="text-xs overflow-auto whitespace-pre-wrap">${chart.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
              </div>
            </div>
          `
        }
      }
    }

    renderDiagram()
  }, [chart])

  return (
    <div className={`mermaid-wrapper ${className}`}>
      <div ref={containerRef} className="mermaid-container min-h-[300px]"></div>
      {caption && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">{caption}</p>}
    </div>
  )
}
