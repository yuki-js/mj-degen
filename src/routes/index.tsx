import { SearchBar } from "../components/degen/SearchBar";
import { ResultsList } from "../components/degen/ResultsList";
import { DetailsPanel } from "../components/common/DetailsPanel";
import "../App.css";
import { useQueryParam } from "../hooks/useQueryParam";
import { createFileRoute } from "@tanstack/react-router";

function AppContent() {
  const [selectedIndex] = useQueryParam("idx");

  return (
    <>
      <SearchBar />
      <main className="main-content">
        <ResultsList />
        {selectedIndex && <DetailsPanel />}
      </main>
    </>
  );
}

export const Route = createFileRoute("/")({
  component: AppContent,
});
