"use client"

import { useEffect, useRef, useState, useCallback } from "react"
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

    try {
      // Dynamically import panzoom
      const panzoomModule = await import("panzoom")
      const panzoom = panzoomModule.default

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
      panzoomInstanceRef.current.moveTo(0, 0)
      panzoomInstanceRef.current.zoomAbs(0, 0, 1)
      setZoom(1)
    } catch (error) {
      console.error("Failed to initialize panzoom:", error)
    }
  }

  // Function to remove "Unsupported markdown: list" text nodes
  const removeUnsupportedMarkdownText = useCallback(() => {
    if (!containerRef.current) return

    // Find all text nodes in the SVG
    const textElements = containerRef.current.querySelectorAll("text")

    textElements.forEach((textElement) => {
      if (textElement.textContent?.includes("Unsupported markdown")) {
        // Option 1: Remove the entire text element
        textElement.remove()

        // Option 2: Hide the text element
        // textElement.style.display = "none"
        // textElement.style.visibility = "hidden"
        // textElement.style.opacity = "0"

        // Option 3: Replace the text content
        // textElement.textContent = ""
      }
    })

    // Also try to find and remove any elements with the class "list-marker"
    const listMarkers = containerRef.current.querySelectorAll(".list-marker")
    listMarkers.forEach((marker) => {
      marker.remove()
    })
  }, [])

  useEffect(() => {
    // We need to dynamically import mermaid to avoid SSR issues
    const renderDiagram = async () => {
      try {
        if (!containerRef.current) return

        // Clear previous content and show loading state
        containerRef.current.innerHTML = `
          <div class="flex items-center justify-center p-4 w-full h-full">
            <div class="animate-pulse text-gray-500 dark:text-gray-400">Loading diagram...</div>
          </div>
        `

        // Import mermaid dynamically
        const mermaid = (await import("mermaid")).default

        // Configure mermaid with more robust settings
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "monospace",
          logLevel: "error",
          flowchart: {
            htmlLabels: true,
            useMaxWidth: false,
            curve: "basis",
            diagramPadding: 8,
            nodeSpacing: 50,
            rankSpacing: 50,
          },
          sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
            mirrorActors: true,
          },
          gantt: {
            titleTopMargin: 25,
            barHeight: 20,
            barGap: 4,
            topPadding: 50,
            leftPadding: 75,
            gridLineStartPadding: 35,
            fontSize: 11,
            numberSectionStyles: 4,
            axisFormat: "%Y-%m-%d",
          },
        })

        // Sanitize the chart definition to prevent markdown list interpretation
        const sanitizedChart = chart
          .split("\n")
          .map((line) => {
            // Trim the line and check if it starts with a list marker
            const trimmedLine = line.trim()
            if (/^[-*+]\s/.test(trimmedLine)) {
              // Replace the space after the list marker with a non-breaking space
              return line.replace(/^(\s*[-*+])\s/, "$1\u00A0")
            }
            return line
          })
          .join("\n")

        // Create a unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`

        // Create a wrapper div for panzoom
        containerRef.current.innerHTML = `
          <div class="diagram-wrapper relative overflow-hidden border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 w-full h-full">
            <div id="diagram-container-${id}" class="diagram-container w-full h-full" style="transform-origin: 0 0;">
              <div id="${id}" class="mermaid w-full h-full"></div>
            </div>
          </div>
        `

        // Set the diagram content
        const mermaidElement = document.getElementById(id)
        if (mermaidElement) {
          mermaidElement.textContent = sanitizedChart
        }

        // Render the diagram with error handling
        try {
          await mermaid.run({
            querySelector: `#${id}`,
          })
        } catch (error) {
          console.error("Mermaid rendering error:", error)
          setRenderError(error instanceof Error ? error.message : String(error))
          return
        }

        // Set the diagram ref for panzoom
        const diagramContainer = document.getElementById(`diagram-container-${id}`)
        if (diagramContainer instanceof HTMLDivElement) {
          diagramRef.current = diagramContainer
        }

        // Initialize panzoom
        await initPanzoom()

        // Remove "Unsupported markdown: list" text immediately after rendering
        removeUnsupportedMarkdownText()

        // Set up a MutationObserver to continuously check for and remove the unwanted text
        const observer = new MutationObserver(() => {
          removeUnsupportedMarkdownText()
        })

        // Start observing the container for changes
        if (containerRef.current) {
          observer.observe(containerRef.current, {
            childList: true,
            subtree: true,
            characterData: true,
          })
        }

        // Add a cleanup function to disconnect the observer
        return () => {
          observer.disconnect()
        }
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
  }, [chart, removeUnsupportedMarkdownText])

  // Zoom in function - using the correct panzoom API
  const handleZoomIn = useCallback(() => {
    if (panzoomInstanceRef.current) {
      const currentScale = panzoomInstanceRef.current.getTransform().scale
      const newScale = currentScale * 1.2 // Zoom in by 20%

      // Get the center of the viewport
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (containerRect) {
        const centerX = containerRect.width / 2
        const centerY = containerRect.height / 2

        // Zoom to the new scale at the center point
        panzoomInstanceRef.current.zoomTo(centerX, centerY, newScale)
      }
    }
  }, [])

  // Zoom out function - using the correct panzoom API
  const handleZoomOut = useCallback(() => {
    if (panzoomInstanceRef.current) {
      const currentScale = panzoomInstanceRef.current.getTransform().scale
      const newScale = currentScale / 1.2 // Zoom out by 20%

      // Get the center of the viewport
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (containerRect) {
        const centerX = containerRect.width / 2
        const centerY = containerRect.height / 2

        // Zoom to the new scale at the center point
        panzoomInstanceRef.current.zoomTo(centerX, centerY, newScale)
      }
    }
  }, [])

  // Reset zoom and position
  const handleReset = useCallback(() => {
    if (panzoomInstanceRef.current) {
      panzoomInstanceRef.current.moveTo(0, 0)
      panzoomInstanceRef.current.zoomAbs(0, 0, 1)
    }
  }, [])

  // Toggle panning mode
  const togglePanMode = useCallback(() => {
    setIsPanning(!isPanning)
  }, [isPanning])

  return (
    <div className={`mermaid-wrapper ${className}`}>
      <div className="relative w-full h-[500px]">
        <div
          ref={containerRef}
          className="mermaid-container w-full h-full flex items-center justify-center"
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
