import React, { useMemo, useEffect } from "react";
import { SearchResult } from "../types";
import { useQueryParam } from "../hooks/useQueryParam";
import { useShrinkMap } from "../hooks/useShrinkMap";
import { performSearch } from "../utils/searchUtils";

interface ResultsListProps {
  setExactMatches: (matches: SearchResult[]) => void;
  setCandidates: (candidates: SearchResult[]) => void;
  exactMatches: SearchResult[];
  candidates: SearchResult[];
}

const ResultsList: React.FC<ResultsListProps> = ({
  setExactMatches,
  setCandidates,
  exactMatches,
  candidates,
}) => {
  const [searchTerm] = useQueryParam("q");
  const [selectedIndex, setSelectedIndex] = useQueryParam("idx");
  const shrinkMap = useShrinkMap();

  useEffect(() => {
    if (searchTerm) {
      const results = performSearch(searchTerm, shrinkMap);
      setExactMatches(results.exactMatches);
      setCandidates(results.candidates);
    } else {
      setExactMatches([]);
      setCandidates([]);
    }
  }, [searchTerm, shrinkMap, setExactMatches, setCandidates]);

  const selectedResult = useMemo(() => {
    if (selectedIndex) {
      return [...exactMatches, ...candidates].find(
        (result) => result.mjId === selectedIndex
      );
    }
    return null;
  }, [selectedIndex, exactMatches, candidates]);

  const handleSelectResult = (result: SearchResult) => {
    setSelectedIndex(result.mjId);
  };

  const hasSearched = exactMatches.length > 0 || candidates.length > 0;

  const renderResultItem = (result: SearchResult) => (
    <div
      key={result.mjId}
      className={`result-item ${
        selectedResult?.mjId === result.mjId ? "selected" : ""
      }`}
      onClick={() => handleSelectResult(result)}
    >
      <div>
        <p>
          <strong>MJ文字図形名:</strong> {result.mjId}
        </p>
      </div>
      <img
        src={`https://moji.or.jp/mojikibansearch/img/MJ/${result.mjId}.png`}
        alt={result.mjId}
        className="glyph-image"
      />
    </div>
  );

  return (
    <div className="results-container">
      {hasSearched && (
        <>
          {exactMatches.length > 0 && (
            <div className="exact-match-section">
              <h2>Exact Match</h2>
              {exactMatches.map(renderResultItem)}
            </div>
          )}
          {candidates.length > 0 && (
            <div className="candidates-section">
              <h2>縮退前候補</h2>
              {candidates.map(renderResultItem)}
            </div>
          )}
          {exactMatches.length === 0 && candidates.length === 0 && (
            <p>検索結果が見つかりませんでした。</p>
          )}
        </>
      )}
    </div>
  );
};

export default ResultsList;
