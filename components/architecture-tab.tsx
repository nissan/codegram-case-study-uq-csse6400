"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MermaidDiagram from "./mermaid-diagram"
import FallbackDiagram from "./fallback-diagram"
import StaticDiagram from "./static-diagram"
import { AlertTriangle, Info } from "lucide-react"

export default function ArchitectureTab() {
  const [view, setView] = useState("pipeline")
  const [displayMode, setDisplayMode] = useState<"mermaid" | "fallback" | "static">("mermaid")

  // Updated Mermaid syntax with proper formatting to avoid list interpretation
  // Made the diagrams more detailed for better visualization when zoomed in
  const pipelineArchitecture = `
graph LR
  A["Client Browser"] -->|HTTP Request| B["FastAPI Server"]
  B -->|1. Load Image| C["Image Loader"]
  C -->|2. Apply Filters| D["Filter Pipeline"]
  D -->|Grayscale| E["Grayscale Filter"]
  D -->|Brightness| F["Brightness Filter"]
  D -->|Contrast| G["Contrast Filter"]
  D -->|Blur| H["Blur Filter"]
  D -->|Sharpen| I["Sharpen Filter"]
  E & F & G & H & I -->|3. Process| J["OpenCV Processing"]
  J -->|4. Return| K["Response Handler"]
  K -->|HTTP Response| A
  
  subgraph "Filter Processing"
    E
    F
    G
    H
    I
  end
  
  subgraph "Server Components"
    B
    C
    D
    J
    K
  end
`

  const cloudArchitecture = `
graph TD
  A["Client Browser"] -->|1. Request| B["React App"]
  B -->|2. POST Request| H["Load Balancer"]
  H -->|3. Route Request| G["ECS Fargate"]
  G -->|4. Pull Image| F["ECR Registry"]
  G -->|5. Process Request| C["FastAPI"]
  C -->|6. Apply Filters| D["Image Filters"]
  D -->|7. Generate| E["Response"]
  E -->|8. Store| K["S3 Cache"]
  E -->|9. Log| I["RDS Database"]
  K -->|10. Distribute| J["CloudFront CDN"]
  J -->|11. Serve| B
  B -->|12. Display| A
  
  subgraph "AWS Cloud"
    H
    G
    F
    C
    D
    E
    K
    I
    J
  end
  
  subgraph "Client Side"
    A
    B
  end
`

  const toggleDisplayMode = () => {
    if (displayMode === "mermaid") setDisplayMode("static")
    else if (displayMode === "static") setDisplayMode("fallback")
    else setDisplayMode("mermaid")
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Architecture</h2>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDisplayMode}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
            >
              <AlertTriangle className="h-3 w-3" />
              {displayMode === "mermaid"
                ? "Show Static Image"
                : displayMode === "static"
                  ? "Show Text Description"
                  : "Try Mermaid"}
            </button>

            <Tabs value={view} onValueChange={setView} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="pipeline"
                  className="text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                >
                  Pipeline View
                </TabsTrigger>
                <TabsTrigger
                  value="cloud"
                  className="text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                >
                  Cloud Deployment
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="mb-4 overflow-auto bg-gray-50 dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800">
          {displayMode === "fallback" ? (
            view === "pipeline" ? (
              <FallbackDiagram
                title="Image Processing Pipeline"
                description="A pipeline architecture showing how images flow from the client browser through FastAPI, to the image loader, filter pipeline (with grayscale, brightness, contrast, blur, and sharpen filters), OpenCV processing, and back to the client."
              />
            ) : (
              <FallbackDiagram
                title="AWS Cloud Deployment Architecture"
                description="A cloud architecture showing how requests flow from the client browser through React, AWS Load Balancer, ECS Fargate, FastAPI, image filters, and how processed images are stored in S3, distributed via CloudFront CDN, and logs are stored in RDS."
              />
            )
          ) : displayMode === "static" ? (
            <StaticDiagram
              type={view === "pipeline" ? "pipeline" : "cloud"}
              caption={view === "pipeline" ? "Image Processing Pipeline" : "AWS Cloud Deployment Architecture"}
            />
          ) : view === "pipeline" ? (
            <MermaidDiagram chart={pipelineArchitecture} caption="Image Processing Pipeline" />
          ) : (
            <MermaidDiagram chart={cloudArchitecture} caption="AWS Cloud Deployment Architecture" />
          )}
        </div>

        {displayMode === "mermaid" && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium">Interactive Diagram Controls:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Use the zoom controls in the bottom right to zoom in and out</li>
                <li>Click the pan button to enable pan mode, then click and drag to move around</li>
                <li>Click the reset button to return to the original view</li>
                <li>You can also use your mouse wheel to zoom in and out</li>
              </ul>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Architecture Summary</h3>

          {view === "pipeline" && (
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>The Codegram filter pipeline processes images through a series of steps:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Client sends an image URL or file with filter configuration</li>
                <li>FastAPI receives the request and loads the image</li>
                <li>The filter pipeline applies selected filters in sequence</li>
                <li>Each filter is implemented using OpenCV image processing</li>
                <li>Processed image is returned to the client</li>
              </ol>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Filters can be reordered to change the processing sequence, which can significantly affect the final
                output. For example, applying grayscale before brightness produces different results than applying
                brightness first.
              </p>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                FastAPI provides significant performance benefits over Flask through its async support, automatic
                validation via Pydantic, and built-in OpenAPI documentation.
              </p>
            </div>
          )}

          {view === "cloud" && (
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>The Codegram cloud infrastructure is deployed on AWS using Terraform:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Frontend React application served via CloudFront</li>
                <li>FastAPI containerized and stored in Amazon ECR</li>
                <li>API runs on ECS Fargate for serverless container execution</li>
                <li>Application Load Balancer routes traffic to ECS tasks</li>
                <li>Processed images cached in S3 and served via CloudFront CDN</li>
                <li>Filter logs and image hashes stored in Amazon RDS (optional)</li>
              </ol>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                The infrastructure is fully managed through Terraform, enabling infrastructure-as-code practices and
                consistent deployments across environments. The serverless Fargate approach allows for automatic scaling
                based on demand.
              </p>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Using FastAPI allows us to leverage async/await for handling concurrent requests efficiently, which is
                particularly beneficial for image processing operations that may take time to complete.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
