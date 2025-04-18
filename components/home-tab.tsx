"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Filter } from "@/types/filter"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, ImageIcon, RefreshCw } from "lucide-react"

interface HomeTabProps {
  selectedImage: string | null
  setSelectedImage: (url: string | null) => void
  filters: Filter[]
  onFilterToggle: (id: string) => void
  onFilterReorder: (startIndex: number, endIndex: number) => void
  onFilterParamChange: (id: string, paramName: string, value: number) => void
}

export default function HomeTab({
  selectedImage,
  setSelectedImage,
  filters,
  onFilterToggle,
  onFilterReorder,
  onFilterParamChange,
}: HomeTabProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showProcessed, setShowProcessed] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const [dragPreview, setDragPreview] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        handleImageLoaded()
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (imageUrl) {
      setSelectedImage(imageUrl)
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    onFilterReorder(result.source.index, result.destination.index)
  }

  const handleProcessImage = () => {
    setIsProcessing(true)
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      setShowProcessed(true)
    }, 1500)
  }

  const enabledFilters = filters.filter((f) => f.enabled)

  // Generate mock request payload
  const requestPayload = {
    image_url: selectedImage || "https://example.com/image.jpg",
    filters: enabledFilters.map((f) => ({
      name: f.name,
      params: f.params,
    })),
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)

    // Try to get a preview of the dragged image
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const item = e.dataTransfer.items[0]
      if (item.kind === "file" && item.type.match("image.*")) {
        // We can't directly access the file during dragenter due to security restrictions
        // But we can indicate that an image is being dragged
        setDragPreview("image")
      }
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // Only set isDragging to false if we're leaving the dropzone (not entering a child element)
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false)
      setDragPreview(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragPreview(null)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.match("image.*")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string)
          handleImageLoaded()
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleImageLoaded = () => {
    // Add a subtle animation or notification when an image is loaded
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("border-green-500")
      dropZoneRef.current.classList.add("bg-green-500/10")

      setTimeout(() => {
        if (dropZoneRef.current) {
          dropZoneRef.current.classList.remove("border-green-500")
          dropZoneRef.current.classList.remove("bg-green-500/10")
        }
      }, 1500)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Image Source</h2>

          <div className="space-y-4 mb-6">
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
              <Button type="submit" variant="secondary">
                <ImageIcon className="mr-2 h-4 w-4" />
                Load
              </Button>
            </form>

            <div
              ref={dropZoneRef}
              className={`relative border-2 border-dashed rounded-md p-6 transition-all ${
                isDragging
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <Upload
                  className={`h-10 w-10 mb-2 ${isDragging ? "text-blue-500" : "text-gray-400 dark:text-gray-500"}`}
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isDragging ? "Drop image here" : "Drag and drop an image or click to browse"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Supports JPG, PNG, GIF up to 10MB</p>
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
              {isDragging && (
                <div className="absolute inset-0 bg-blue-500/5 rounded-md flex flex-col items-center justify-center">
                  {dragPreview === "image" && (
                    <div className="mb-2 p-2 bg-white dark:bg-gray-800 rounded-md">
                      <ImageIcon className="h-16 w-16 text-blue-500" />
                    </div>
                  )}
                  <div className="text-blue-500 font-medium">Release to upload</div>
                </div>
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Filter Pipeline</h2>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="filters">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 mb-6">
                  {filters.map((filter, index) => (
                    <Draggable key={filter.id} draggableId={filter.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 rounded-md border ${
                            filter.enabled
                              ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                              : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={filter.enabled}
                                onCheckedChange={() => onFilterToggle(filter.id)}
                                id={`filter-${filter.id}`}
                              />
                              <Label
                                htmlFor={`filter-${filter.id}`}
                                className="capitalize text-gray-800 dark:text-gray-200"
                              >
                                {filter.name}
                              </Label>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{index + 1}</div>
                          </div>

                          {filter.enabled && (
                            <div className="mt-3 space-y-3">
                              {Object.entries(filter.params).map(([param, value]) => (
                                <div key={param} className="space-y-2">
                                  <div className="flex justify-between">
                                    <Label className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                                      {param}
                                    </Label>
                                    <span className="text-xs text-gray-700 dark:text-gray-300">{value}</span>
                                  </div>
                                  <Slider
                                    value={[value]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(values) => onFilterParamChange(filter.id, param, values[0])}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button
            onClick={handleProcessImage}
            disabled={!selectedImage || enabledFilters.length === 0 || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Apply Filters"
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Image Preview</h2>

            <Tabs defaultValue="original">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="original"
                  className="text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                >
                  Original
                </TabsTrigger>
                <TabsTrigger
                  value="processed"
                  disabled={!showProcessed}
                  className="text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                >
                  Processed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="original">
                {selectedImage ? (
                  <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Original"
                      className="w-full h-auto max-h-[400px] object-contain bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No image selected</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="processed">
                {selectedImage && showProcessed ? (
                  <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Processed"
                      className={`w-full h-auto max-h-[400px] object-contain bg-gray-100 dark:bg-gray-800 ${
                        enabledFilters.some((f) => f.name === "grayscale") ? "grayscale" : ""
                      } ${enabledFilters.some((f) => f.name === "blur") ? "blur-sm" : ""}`}
                      style={{
                        filter: enabledFilters
                          .filter((f) => ["brightness", "contrast"].includes(f.name))
                          .map((f) => {
                            if (f.name === "brightness") return `brightness(${f.params.level / 50})`
                            if (f.name === "contrast") return `contrast(${f.params.level / 50})`
                            return ""
                          })
                          .join(" "),
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">Process an image to see results</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Request Payload</h2>
            <pre className="bg-gray-50 dark:bg-gray-950 p-4 rounded-md border border-gray-200 dark:border-gray-800 overflow-auto text-sm font-mono">
              {JSON.stringify(requestPayload, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
