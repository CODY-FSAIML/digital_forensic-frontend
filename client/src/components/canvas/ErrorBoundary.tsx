import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Canvas error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-black/50 border border-[#22d3ee]/20 text-[#22d3ee] font-mono text-xs text-center p-4">
          <div>
            <span className="text-[#ef4444] block mb-2">[WARN] WEBGL_INITIALIZATION_FAILED</span>
            FALLBACK RENDERING ACTIVE
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
