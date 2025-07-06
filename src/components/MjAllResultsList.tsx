import React from "react";
import { MjAllSearchResult } from "../types/MjAllData";
import MjGlyphImage from "./MjGlyphImage";
import Pagination from "./Pagination";

interface MjAllResultsListProps {
  results: MjAllSearchResult[];
  selectedId: string | null;
  onSelectResult: (result: MjAllSearchResult) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Results list component for the MJ_all.csv search page
 */
const MjAllResultsList: React.FC<MjAllResultsListProps> = ({
  results,
  selectedId,
  onSelectResult,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (results.length === 0) {
    return (
      <div className="results-container">
        <p>検索結果がありません。</p>
      </div>
    );
  }

  const renderResultItem = (result: MjAllSearchResult) => (
    <div
      key={result.mjId}
      className={`result-item ${selectedId === result.mjId ? "selected" : ""}`}
      onClick={() => onSelectResult(result)}
    >
      <div className="result-item-content">
        <MjGlyphImage mjId={result.mjId} size="small" />
        <div className="result-item-info">
          <p>
            <strong>MJ文字図形名:</strong> {result.mjId}
          </p>
          {result.ucs && (
            <p>
              <strong>UCS:</strong> {result.ucs}
            </p>
          )}
          {result.reading && (
            <p>
              <strong>読み:</strong> {result.reading}
            </p>
          )}
          {result.strokeCount && (
            <p>
              <strong>画数:</strong> {result.strokeCount}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="results-container">
      <div className="results-header">
        <h3>検索結果</h3>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
      <div className="results-list">{results.map(renderResultItem)}</div>
      <div className="results-footer">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default MjAllResultsList;
