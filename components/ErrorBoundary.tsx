"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left mb-4 p-4 bg-muted rounded text-xs">
                <summary className="cursor-pointer font-semibold mb-2">Error details</summary>
                <pre className="overflow-auto">{this.state.error.toString()}</pre>
              </details>
            )}
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: undefined })
                window.location.reload()
              }}
              className="w-full"
            >
              Refresh Page
            </Button>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
