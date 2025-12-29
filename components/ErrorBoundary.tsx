"use client"

import { Component, type ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Home } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-md p-6 sm:p-8 text-center">
            <div className="mx-auto w-fit mb-4 p-3 rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-destructive" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Bir şeyler ters gitti</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-muted-foreground cursor-pointer mb-2">
                  Hata detayları
                </summary>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={this.handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Tekrar Dene
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                <Home className="mr-2 h-4 w-4" />
                Ana Sayfa
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
