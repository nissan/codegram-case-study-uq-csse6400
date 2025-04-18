"use client"

import { useEffect, useRef, useState } from "react"
import { ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react"

interface MermaidDiagramProps {
  chart: string
  caption?: string
  className?: string
}

export default function MermaidDiagram({ chart, caption, className = "" }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
  const [renderError, setRenderError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const panzoomInstanceRef = useRef<any>(null)

  // Function to initialize or reset panzoom
  const initPanzoom = async () => {
    if (!diagramRef.current) return

    // Clean up previous instance if it exists
    if (panzoomInstanceRef.current) {
      panzoomInstanceRef.current.dispose()
    }

    // Dynamically import panzoom
    const panzoom = (await import("panzoom")).default

    // Initialize panzoom on the diagram container
    panzoomInstanceRef.current = panzoom(diagramRef.current, {
      maxZoom: 4,
      minZoom: 0.5,
      bounds: true,
      boundsPadding: 0.1,
      smoothScroll: false,
    })

    // Update zoom state when zooming
    panzoomInstanceRef.current.on("zoom", (e: any) => {
      setZoom(e.getTransform().scale)
    })

    // Reset zoom to 1
    panzoomInstanceRef.current.zoomAbs(0, 0, 1)
    setZoom(1)
  }

  useEffect(() => {
    // We need to dynamically import mermaid to avoid SSR issues
    const renderDiagram = async () => {
      try {
        if (!containerRef.current) return

        // Clear previous content and show loading state
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
          logLevel: "error",
          flowchart: {
            htmlLabels: true,
            useMaxWidth: false, // Important for zooming
            curve: "basis",
          },
        })

        // Sanitize the chart definition to prevent markdown list interpretation
        const sanitizedChart = chart
          .split("\n")
          .map((line) => line.trim())
          .join("\n")
          .replace(/^\s*[-*+]\s/gm, "") // Remove markdown list markers

        // Create a unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`

        // Create a wrapper div for panzoom
        containerRef.current.innerHTML = `
          <div class="diagram-wrapper relative overflow-hidden border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
            <div id="diagram-container-${id}" class="diagram-container" style="transform-origin: 0 0;">
              <div id="${id}" class="mermaid"></div>
            </div>
          </div>
        `

        // Set the diagram content
        const mermaidElement = document.getElementById(id)
        if (mermaidElement) {
          mermaidElement.textContent = sanitizedChart
        }

        // Render the diagram
        await mermaid.run({
          nodes: [document.getElementById(id)],
        })

        // Set the diagram ref for panzoom
        diagramRef.current = document.getElementById(`diagram-container-${id}`)

        // Initialize panzoom
        await initPanzoom()

        setRenderError(null)
      } catch (error) {
        console.error("Failed to render mermaid diagram:", error)
        setRenderError(error instanceof Error ? error.message : String(error))

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

    // Re-render when theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          renderDiagram()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => {
      observer.disconnect()
      if (panzoomInstanceRef.current) {
        panzoomInstanceRef.current.dispose()
      }
    }
  }, [chart])

  // Zoom in function
  const handleZoomIn = () => {
    if (panzoomInstanceRef.current) {
      panzoomInstanceRef.current.zoomIn()
    }
  }

  // Zoom out function
  const handleZoomOut = () => {
    if (panzoomInstanceRef.current) {
      panzoomInstanceRef.current.zoomOut()
    }
  }

  // Reset zoom and position
  const handleReset = () => {
    if (panzoomInstanceRef.current) {
      panzoomInstanceRef.current.moveTo(0, 0)
      panzoomInstanceRef.current.zoomAbs(0, 0, 1)
    }
  }

  // Toggle panning mode
  const togglePanMode = () => {
    setIsPanning(!isPanning)
  }

  return (
    <div className={`mermaid-wrapper ${className}`}>
      <div className="relative">
        <div
          ref={containerRef}
          className="mermaid-container min-h-[400px] flex items-center justify-center"
          aria-live="polite"
        ></div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
            title="Reset view"
            aria-label="Reset view"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button
            onClick={togglePanMode}
            className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
              isPanning
                ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
            title={isPanning ? "Pan mode active" : "Enable pan mode"}
            aria-label={isPanning ? "Pan mode active" : "Enable pan mode"}
          >
            <Move className="h-4 w-4" />
          </button>
          <div className="px-2 flex items-center text-xs text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700">
            {Math.round(zoom * 100)}%
          </div>
        </div>
      </div>
      {caption && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">{caption}</p>}
    </div>
  )
}
