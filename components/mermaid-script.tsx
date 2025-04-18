"use client"

import { useEffect } from "react"

export default function MermaidScript() {
  useEffect(() => {
    // Function to remove "Unsupported markdown: list" text
    const removeUnsupportedMarkdownText = () => {
      // Find all text elements in the document
      const textElements = document.querySelectorAll("text")

      textElements.forEach((textElement) => {
        if (textElement.textContent?.includes("Unsupported markdown")) {
          // Add a class to hide the element
          textElement.classList.add("hide-unsupported-markdown")

          // Also try to remove it completely
          textElement.style.display = "none"
          textElement.style.visibility = "hidden"
          textElement.style.opacity = "0"

          // Try to remove the text content
          textElement.textContent = ""
        }
      })

      // Also try to find and remove any elements with the class "list-marker"
      const listMarkers = document.querySelectorAll(".list-marker")
      listMarkers.forEach((marker) => {
        marker.classList.add("hide-unsupported-markdown")
        ;(marker as HTMLElement).style.display = "none"
      })
    }

    // Run immediately
    removeUnsupportedMarkdownText()

    // Set up a MutationObserver to continuously check for and remove the unwanted text
    const observer = new MutationObserver(() => {
      removeUnsupportedMarkdownText()
    })

    // Start observing the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    // Also run on a timer to catch any elements that might have been missed
    const interval = setInterval(removeUnsupportedMarkdownText, 1000)

    // Clean up
    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  return null
}
