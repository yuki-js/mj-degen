import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MjAllSearchParams } from "../utils/mjAllSearchUtils";

interface MjAllSearchBarProps {
  initialParams: MjAllSearchParams;
  onSearch: (params: MjAllSearchParams) => void;
}

/**
 * Search bar component for the MJ_all.csv search page
 */
const MjAllSearchBar: React.FC<MjAllSearchBarProps> = ({
  initialParams,
  onSearch,
}) => {
  const [query, setQuery] = useState(initialParams.query || "");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the onSearch callback with the updated params
    const updatedParams = { ...initialParams, query };
    onSearch(updatedParams);

    // Build query string for URL
    const queryParams: Record<string, string> = {};
    if (query) queryParams.q = query;
    if (initialParams.strokeCount)
      queryParams.strokes = initialParams.strokeCount;
    if (initialParams.radical) queryParams.radical = initialParams.radical;
    if (initialParams.dictionary) queryParams.dict = initialParams.dictionary;
    if (initialParams.hasIVS !== undefined)
      queryParams.ivs = initialParams.hasIVS ? "1" : "0";

    // Navigate to the same route with updated search params
    navigate({
      to: window.location.pathname,
      search: queryParams,
    });
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="漢字、MJ文字図形名、UCS、読みなどで検索..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          検索
        </button>
      </form>
    </div>
  );
};

export default MjAllSearchBar;
