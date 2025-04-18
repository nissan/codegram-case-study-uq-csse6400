"use client"

import { useState, useEffect } from "react"
import HomeTab from "@/components/home-tab"
import ArchitectureTab from "@/components/architecture-tab"
import CodeTab from "@/components/code-tab"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Filter } from "@/types/filter"

export default function CodegramApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filter[]>([
    { id: "1", name: "grayscale", enabled: false, params: { intensity: 100 } },
    { id: "2", name: "brightness", enabled: false, params: { level: 50 } },
    { id: "3", name: "contrast", enabled: false, params: { level: 50 } },
    { id: "4", name: "blur", enabled: false, params: { radius: 5 } },
    { id: "5", name: "sharpen", enabled: false, params: { amount: 50 } },
  ])
  const [mounted, setMounted] = useState(false)

  // Ensure theme is applied after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFilterToggle = (id: string) => {
    setFilters(filters.map((filter) => (filter.id === id ? { ...filter, enabled: !filter.enabled } : filter)))
  }

  const handleFilterReorder = (startIndex: number, endIndex: number) => {
    const result = Array.from(filters)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    setFilters(result)
  }

  const handleFilterParamChange = (id: string, paramName: string, value: number) => {
    setFilters(
      filters.map((filter) =>
        filter.id === id
          ? {
              ...filter,
              params: {
                ...filter.params,
                [paramName]: value,
              },
            }
          : filter,
      ),
    )
  }

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono transition-colors duration-200">
        <div className="container mx-auto p-6">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Codegram Filter UI</h1>
              <p className="text-gray-600 dark:text-gray-400">Developer tool for image filter pipeline</p>
            </div>
            <ThemeToggle />
          </header>

          <div className="mb-8">
            <div className="grid w-full grid-cols-3 mb-8 bg-gray-200 dark:bg-gray-800 rounded-md">
              <button
                onClick={() => setActiveTab("home")}
                className={`py-2 text-center text-sm font-medium transition-colors ${
                  activeTab === "home"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-t-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab("architecture")}
                className={`py-2 text-center text-sm font-medium transition-colors ${
                  activeTab === "architecture"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Architecture
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`py-2 text-center text-sm font-medium transition-colors ${
                  activeTab === "code"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-t-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Code
              </button>
            </div>

            {activeTab === "home" && (
              <HomeTab
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                filters={filters}
                onFilterToggle={handleFilterToggle}
                onFilterReorder={handleFilterReorder}
                onFilterParamChange={handleFilterParamChange}
              />
            )}

            {activeTab === "architecture" && <ArchitectureTab />}

            {activeTab === "code" && <CodeTab filters={filters.filter((f) => f.enabled)} />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
