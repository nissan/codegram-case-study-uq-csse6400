interface FallbackDiagramProps {
  title: string
  description: string
}

export default function FallbackDiagram({ title, description }: FallbackDiagramProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4 bg-white dark:bg-gray-900">
      <h3 className="font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  )
}
