import React, { useMemo, useState } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMjAllData } from "../hooks/useMjAllData";
import { MjAllSearchParams, searchMjAllData } from "../utils/mjAllSearchUtils";
import { MjAllSearchResult } from "../types/MjAllData";
import MjAllSearchBar from "../components/MjAllSearchBar";
import MjAllResultsList from "../components/MjAllResultsList";
import MjAllDetailsPanel from "../components/MjAllDetailsPanel";
import { useQueryParam } from "../hooks/useQueryParam";
import "../styles/MjAllSearch.css";

// Number of results per page
const ITEMS_PER_PAGE = 50;

/**
 * MJ_all.csv search page
 */
const MjAllSearchPage: React.FC = () => {
  // Get the full CSV data
  const mjAllData = useMjAllData();

  // Get URL search params
  const search = useSearch({ from: "/mjsearch" });

  // Parse search params
  const initialParams: MjAllSearchParams = useMemo(() => {
    return {
      query: search.q as string | undefined,
      strokeCount: search.strokes as string | undefined,
      radical: search.radical as string | undefined,
      dictionary: search.dict as string | undefined,
      hasIVS: search.ivs ? search.ivs === "1" : undefined,
    };
  }, [search]);

  // State for search params and pagination
  const [searchParams, setSearchParams] =
    useState<MjAllSearchParams>(initialParams);
  const [selectedId, setSelectedId] = useQueryParam("idx");
  const [pageStr, setPageStr] = useQueryParam("page");

  const page = pageStr ? parseInt(pageStr, 10) : 1;

  // Perform search
  const searchResults = useMemo(() => {
    return searchMjAllData(mjAllData, searchParams);
  }, [mjAllData, searchParams]);

  // Calculate pagination
  const totalPages = Math.max(
    1,
    Math.ceil(searchResults.length / ITEMS_PER_PAGE)
  );
  const currentPageResults = searchResults.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Handlers
  const handleSearch = (params: MjAllSearchParams) => {
    setSearchParams(params);
    setPageStr("1"); // Reset to first page on new search
  };

  const handleSelectResult = (result: MjAllSearchResult) => {
    setSelectedId(result.mjId);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPageStr(String(newPage));
    }
  };

  return (
    <>
      <MjAllSearchBar
        data={mjAllData}
        initialParams={searchParams}
        onSearch={handleSearch}
      />
      <main className="main-content">
        <div className="search-content">
          <MjAllResultsList
            results={currentPageResults}
            selectedId={selectedId || null}
            onSelectResult={handleSelectResult}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        {selectedId && <MjAllDetailsPanel />}
      </main>
    </>
  );
};

export const Route = createFileRoute("/mjsearch")({
  component: MjAllSearchPage,
});
