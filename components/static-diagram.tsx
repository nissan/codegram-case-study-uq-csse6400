import Image from "next/image"

interface StaticDiagramProps {
  type: "pipeline" | "cloud"
  caption?: string
}

export default function StaticDiagram({ type, caption }: StaticDiagramProps) {
  // Create placeholder images for the diagrams
  const pipelineDiagramSrc = "/image-processing-pipeline.png"
  const cloudDiagramSrc = "/modern-web-app-architecture.png"

  return (
    <div className="flex flex-col items-center w-full">
      <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden bg-white dark:bg-gray-900 p-4 w-full h-[500px] flex items-center justify-center">
        <Image
          src={type === "pipeline" ? pipelineDiagramSrc : cloudDiagramSrc}
          alt={type === "pipeline" ? "Pipeline Architecture" : "Cloud Architecture"}
          width={800}
          height={500}
          className="max-w-full h-auto object-contain"
          priority
        />
      </div>
      {caption && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">{caption}</p>}
    </div>
  )
}
