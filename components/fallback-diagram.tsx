interface FallbackDiagramProps {
  title: string
  description: string
}

export default function FallbackDiagram({ title, description }: FallbackDiagramProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md p-6 bg-white dark:bg-gray-900 h-[500px] flex flex-col items-center justify-center">
      <h3 className="font-medium text-xl text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
