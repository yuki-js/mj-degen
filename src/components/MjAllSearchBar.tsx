import React, { useState } from "react";
import "../styles/SqlQueryModal.css";
import SqlQueryModal from "./SqlQueryModal";
import { useNavigate } from "@tanstack/react-router";
import { MjAllDataRow } from "../types/MjAllData";
import { MjAllSearchParams } from "../utils/mjAllSearchUtils";
import {
  getUniqueRadicals,
  getUniqueStrokeCounts,
} from "../utils/mjAllSearchUtils";
import BaseSearchInput from "./common/BaseSearchInput";

// Internal FilterSelect component
interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  allOptionLabel?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  allOptionLabel = "すべて",
}) => {
  return (
    <div className="filter-group">
      <label htmlFor={id}>{label}:</label>
      <select id={id} value={value} onChange={onChange}>
        <option value="">{allOptionLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface MjAllSearchBarProps {
  data: MjAllDataRow[];
  initialParams: MjAllSearchParams;
  onSearch: (params: MjAllSearchParams) => void;
}

/**
 * Comprehensive search bar component for the MJ_all.csv search page
 * Includes both basic search and advanced filters
 */
const MjAllSearchBar: React.FC<MjAllSearchBarProps> = ({
  data,
  initialParams,
  onSearch,
}) => {
  // Local state for current params and UI state
  const [params, setParams] = useState<MjAllSearchParams>(initialParams);
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const navigate = useNavigate();

  // Get unique values for filters
  const radicals = getUniqueRadicals(data);
  const strokeCounts = getUniqueStrokeCounts(data);

  // Dictionary options
  const dictionaries = [
    { value: "大漢和", label: "大漢和" },
    { value: "日本語漢字辞典", label: "日本語漢字辞典" },
    { value: "新大字典", label: "新大字典" },
    { value: "大字源", label: "大字源" },
    { value: "大漢語林", label: "大漢語林" },
  ];

  // IVS options
  const ivsOptions = [
    { value: "yes", label: "あり" },
    { value: "no", label: "なし" },
  ];

  // Update params and trigger search
  const updateParamsAndSearch = (newParams: Partial<MjAllSearchParams>) => {
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);
    onSearch(updatedParams);

    // Build query string for URL
    const queryParams: Record<string, string> = {};
    if (updatedParams.query) queryParams.q = updatedParams.query;
    if (updatedParams.strokeCount)
      queryParams.strokes = updatedParams.strokeCount;
    if (updatedParams.radical) queryParams.radical = updatedParams.radical;
    if (updatedParams.dictionary) queryParams.dict = updatedParams.dictionary;
    if (updatedParams.hasIVS !== undefined)
      queryParams.ivs = updatedParams.hasIVS ? "1" : "0";

    // Navigate to the same route with updated search params
    navigate({
      to: window.location.pathname,
      search: queryParams,
    });
  };

  // Handle search query
  const handleSearch = (query: string | null) => {
    updateParamsAndSearch({ query: query || undefined });
  };

  // Handle SQL query from modal
  const handleSqlQuery = (sqlQuery: string) => {
    updateParamsAndSearch({ query: sqlQuery });
  };

  // Handle filter changes
  const handleStrokeCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    updateParamsAndSearch({ strokeCount: value });
  };

  const handleRadicalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    updateParamsAndSearch({ radical: value });
  };

  const handleDictionaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    updateParamsAndSearch({ dictionary: value });
  };

  const handleIVSChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let hasIVS: boolean | undefined = undefined;

    if (value === "yes") {
      hasIVS = true;
    } else if (value === "no") {
      hasIVS = false;
    }

    updateParamsAndSearch({ hasIVS });
  };

  return (
    <div className="mj-all-search">
      <div className="search-bar-container">
        <BaseSearchInput
          onSearch={handleSearch}
          defaultValue={params.query || ""}
          placeholder="漢字、MJ文字図形名、UCS、読みなどで検索..."
        />
        <button
          className="toggle-filters-button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? "詳細検索を隠す" : "詳細検索を表示"}
        </button>
      </div>

      {showAdvancedFilters && (
        <div className="advanced-filters">
          <h3>詳細検索</h3>
          <div className="filter-row">
            <FilterSelect
              id="stroke-count"
              label="画数"
              value={params.strokeCount || ""}
              onChange={handleStrokeCountChange}
              options={strokeCounts.map((count) => ({
                value: count,
                label: `${count}画`,
              }))}
            />

            <FilterSelect
              id="radical"
              label="部首"
              value={params.radical || ""}
              onChange={handleRadicalChange}
              options={radicals.map((radical) => ({
                value: radical,
                label: radical,
              }))}
            />

            <FilterSelect
              id="dictionary"
              label="辞書"
              value={params.dictionary || ""}
              onChange={handleDictionaryChange}
              options={dictionaries}
            />

            <FilterSelect
              id="ivs"
              label="IVS"
              value={
                params.hasIVS === undefined ? "" : params.hasIVS ? "yes" : "no"
              }
              onChange={handleIVSChange}
              options={ivsOptions}
            />
          </div>

          <div className="sql-search-section">
            <button
              className="sql-search-button"
              onClick={() => setShowSqlModal(true)}
            >
              SQL風検索を使用
            </button>
          </div>
        </div>
      )}

      {/* SQL Query Modal */}
      <SqlQueryModal
        isOpen={showSqlModal}
        onClose={() => setShowSqlModal(false)}
        onSubmit={handleSqlQuery}
      />
    </div>
  );
};

export default MjAllSearchBar;
