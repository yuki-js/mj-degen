import React from "react";
import { MjGlyphImage } from "../components/rare/MjGlyphImage";
import { useShrinkMap } from "../hooks/useShrinkMap";
import { findRareKanji } from "../utils/rareKanjiUtils";
import { SearchResult } from "../types";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryParam } from "../hooks/useQueryParam";
import { DetailsPanel } from "../components/common/DetailsPanel";
import { Pagination } from "../components/common/Pagination";

const ITEMS_PER_PAGE = 100;

const RareKanjiList: React.FC = () => {
  const shrinkMap = useShrinkMap();
  const rareKanji = findRareKanji(shrinkMap);
  const [selectedIndex, setSelectedIndex] = useQueryParam("idx");
  const [pageStr, setPage] = useQueryParam("page");

  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const totalPages = Math.ceil(rareKanji.length / ITEMS_PER_PAGE);

  const currentPageItems = rareKanji.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleSelectResult = (result: SearchResult) => {
    setSelectedIndex(result.mjId);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(String(newPage));
    }
  };

  const renderResultItem = (result: SearchResult) => (
    <div
      key={result.mjId}
      className={`result-item ${selectedIndex === result.mjId ? "selected" : ""}`}
      onClick={() => handleSelectResult(result)}
    >
      <div>
        <p>
          <strong>MJ文字図形名:</strong> {result.mjId}
        </p>
      </div>
      <MjGlyphImage mjId={result.mjId} size="small" />
    </div>
  );

  return (
    <main className="main-content">
      <div className="results-container">
        <h2>レア漢字一覧</h2>
        <p>{rareKanji.length}件見つかりました。</p>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div className="exact-match-section">
          {currentPageItems.map(renderResultItem)}
        </div>
      </div>
      {selectedIndex && <DetailsPanel />}
    </main>
  );
};

export const Route = createFileRoute("/rare")({
  component: RareKanjiList,
});
