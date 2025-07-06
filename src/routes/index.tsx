import React, { Suspense, useState } from "react";
import Header from "../components/Header";
import ResultsList from "../components/ResultsList";
import DetailsPanel from "../components/DetailsPanel";
import Footer from "../components/Footer";
import "../App.css";
import { useQueryParam } from "../hooks/useQueryParam";
import { SearchResult } from "../types";
import { createFileRoute } from "@tanstack/react-router";

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

function AppContent() {
  const [selectedIndex] = useQueryParam("idx");

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <ResultsList />
        {selectedIndex && <DetailsPanel />}
      </main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

export default function IndexRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>データを読み込んでいます...</div>}>
        <AppContent />
      </Suspense>
    </ErrorBoundary>
  );
}
