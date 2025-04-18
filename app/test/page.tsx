import ErrorBoundary from "@/components/error-boundary"
import TestPage from "../test-page"
import ServerComponent from "@/components/server-component"
import SimpleClientComponent from "@/components/simple-client-component"

export default function Page() {
  return (
    <ErrorBoundary>
      <ServerComponent />
      <div className="h-4"></div>
      <SimpleClientComponent />
      <div className="h-4"></div>
      <TestPage />
    </ErrorBoundary>
  )
}
