import { Outlet, createRootRoute } from "@tanstack/react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import React, { Suspense } from "react";

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<
  React.PropsWithChildren<object>,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: React.PropsWithChildren<object>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="App">
          <p>
            エラーが発生しました: {this.state.error?.message || "不明なエラー"}
          </p>
          <p>ページをリロードしてください。</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const RootComponent = () => (
  <div className="App">
    <Header />
    <ErrorBoundary>
      <Suspense fallback={<div>データを読み込んでいます...</div>}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
    <Footer />
  </div>
);

export const Route = createRootRoute({
  component: RootComponent,
});
