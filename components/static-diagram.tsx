import Image from "next/image"

interface StaticDiagramProps {
  type: "pipeline" | "cloud"
  caption?: string
}

export default function StaticDiagram({ type, caption }: StaticDiagramProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden bg-white dark:bg-gray-900 p-4">
        <Image
          src={type === "pipeline" ? "/pipeline-diagram.png" : "/cloud-diagram.png"}
          alt={type === "pipeline" ? "Pipeline Architecture" : "Cloud Architecture"}
          width={800}
          height={400}
          className="max-w-full h-auto"
        />
      </div>
      {caption && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">{caption}</p>}
    </div>
  )
}
