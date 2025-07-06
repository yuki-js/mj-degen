import React from "react";
import { MjAllDataRow } from "../types/MjAllData";
import { MjAllSearchParams } from "../utils/mjAllSearchUtils";
import {
  getUniqueRadicals,
  getUniqueStrokeCounts,
} from "../utils/mjAllSearchUtils";

interface MjAllAdvancedFiltersProps {
  data: MjAllDataRow[];
  params: MjAllSearchParams;
  onFilterChange: (params: MjAllSearchParams) => void;
}

/**
 * Advanced filters component for the MJ_all.csv search page
 */
const MjAllAdvancedFilters: React.FC<MjAllAdvancedFiltersProps> = ({
  data,
  params,
  onFilterChange,
}) => {
  // Get unique values for filters
  const radicals = getUniqueRadicals(data);
  const strokeCounts = getUniqueStrokeCounts(data);

  // Dictionary options
  const dictionaries = [
    { id: "大漢和", label: "大漢和" },
    { id: "日本語漢字辞典", label: "日本語漢字辞典" },
    { id: "新大字典", label: "新大字典" },
    { id: "大字源", label: "大字源" },
    { id: "大漢語林", label: "大漢語林" },
  ];

  const handleStrokeCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    onFilterChange({ ...params, strokeCount: value });
  };

  const handleRadicalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    onFilterChange({ ...params, radical: value });
  };

  const handleDictionaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    onFilterChange({ ...params, dictionary: value });
  };

  const handleIVSChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let hasIVS: boolean | undefined = undefined;

    if (value === "yes") {
      hasIVS = true;
    } else if (value === "no") {
      hasIVS = false;
    }

    onFilterChange({ ...params, hasIVS });
  };

  return (
    <div className="advanced-filters">
      <h3>詳細検索</h3>

      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="stroke-count">画数:</label>
          <select
            id="stroke-count"
            value={params.strokeCount || ""}
            onChange={handleStrokeCountChange}
          >
            <option value="">すべて</option>
            {strokeCounts.map((count) => (
              <option key={count} value={count}>
                {count}画
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="radical">部首:</label>
          <select
            id="radical"
            value={params.radical || ""}
            onChange={handleRadicalChange}
          >
            <option value="">すべて</option>
            {radicals.map((radical) => (
              <option key={radical} value={radical}>
                {radical}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="dictionary">辞書:</label>
          <select
            id="dictionary"
            value={params.dictionary || ""}
            onChange={handleDictionaryChange}
          >
            <option value="">すべて</option>
            {dictionaries.map((dict) => (
              <option key={dict.id} value={dict.id}>
                {dict.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="ivs">IVS:</label>
          <select
            id="ivs"
            value={
              params.hasIVS === undefined ? "" : params.hasIVS ? "yes" : "no"
            }
            onChange={handleIVSChange}
          >
            <option value="">すべて</option>
            <option value="yes">あり</option>
            <option value="no">なし</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MjAllAdvancedFilters;
