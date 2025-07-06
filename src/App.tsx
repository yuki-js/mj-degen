import React, { Suspense } from "react";
import Header from "./components/Header";
import ResultsList from "./components/ResultsList";
import DetailsPanel from "./components/DetailsPanel";
import Footer from "./components/Footer";

import "./App.css";
import { useQueryParam } from "./hooks/useQueryParam";
import { useState } from "react";
import { SearchResult } from "./types";
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
  const [exactMatches, setExactMatches] = useState<SearchResult[]>([]);
  const [candidates, setCandidates] = useState<SearchResult[]>([]);

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <ResultsList
          setExactMatches={setExactMatches}
          setCandidates={setCandidates}
          exactMatches={exactMatches}
          candidates={candidates}
        />
        {selectedIndex && <DetailsPanel />}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>データを読み込んでいます...</div>}>
        <AppContent />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
