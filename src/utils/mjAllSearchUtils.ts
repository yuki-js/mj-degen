/**
 * Search utilities for the full MJ_all.csv data
 */

import { MjAllDataRow, MjAllSearchResult } from "../types/MjAllData";
import { mjRowToSearchResult } from "./mjGlyphMapping";

/**
 * Search parameters for the MJ_all.csv data
 */
export interface MjAllSearchParams {
  query?: string;
  strokeCount?: string;
  radical?: string;
  dictionary?: string;
  hasIVS?: boolean;
}

/**
 * Search the MJ_all.csv data based on the provided parameters
 *
 * @param data Array of MjAllDataRow objects from useMjAllData
 * @param params Search parameters
 * @returns Array of MjAllSearchResult objects matching the search
 */
export function searchMjAllData(
  data: MjAllDataRow[],
  params: MjAllSearchParams
): MjAllSearchResult[] {
  // Filter the data based on the search parameters
  const filtered = data.filter((row) => {
    // Free text search across multiple fields
    if (params.query) {
      const query = params.query.toLowerCase();
      const searchableFields = [
        row.図形,
        row.MJ文字図形名,
        row.対応するUCS,
        row.実装したUCS,
        row["読み(参考)"],
      ];

      if (
        !searchableFields.some(
          (field) => field && field.toLowerCase().includes(query)
        )
      ) {
        return false;
      }
    }

    // Filter by stroke count
    if (params.strokeCount && row["総画数(参考)"] !== params.strokeCount) {
      return false;
    }

    // Filter by radical
    if (params.radical) {
      const radicals = [
        row["部首1(参考)"],
        row["部首2(参考)"],
        row["部首3(参考)"],
        row["部首4(参考)"],
      ];

      if (!radicals.some((radical) => radical === params.radical)) {
        return false;
      }
    }

    // Filter by dictionary presence
    if (params.dictionary) {
      const dictionaries = {
        大漢和: row.大漢和,
        日本語漢字辞典: row.日本語漢字辞典,
        新大字典: row.新大字典,
        大字源: row.大字源,
        大漢語林: row.大漢語林,
      };

      if (!dictionaries[params.dictionary as keyof typeof dictionaries]) {
        return false;
      }
    }

    // Filter by IVS presence
    if (params.hasIVS !== undefined) {
      const hasIVS = Boolean(row.実装したMoji_JohoコレクションIVS);
      if (hasIVS !== params.hasIVS) {
        return false;
      }
    }

    return true;
  });

  // Convert the filtered data to search results
  return filtered.map(mjRowToSearchResult);
}

/**
 * Get unique values for a specific field in the MJ_all.csv data
 * Useful for populating filter dropdowns
 *
 * @param data Array of MjAllDataRow objects from useMjAllData
 * @param field Field name to get unique values for
 * @returns Array of unique values for the field
 */
export function getUniqueValues(
  data: MjAllDataRow[],
  field: keyof MjAllDataRow
): string[] {
  const values = new Set<string>();

  for (const row of data) {
    const value = row[field];
    if (value) {
      values.add(value);
    }
  }

  return Array.from(values).sort();
}

/**
 * Get all unique radicals in the MJ_all.csv data
 *
 * @param data Array of MjAllDataRow objects from useMjAllData
 * @returns Array of unique radicals
 */
export function getUniqueRadicals(data: MjAllDataRow[]): string[] {
  const radicals = new Set<string>();

  for (const row of data) {
    const fields = [
      "部首1(参考)",
      "部首2(参考)",
      "部首3(参考)",
      "部首4(参考)",
    ] as const;

    for (const field of fields) {
      const value = row[field];
      if (value) {
        radicals.add(value);
      }
    }
  }

  return Array.from(radicals).sort((a, b) => Number(a) - Number(b));
}

/**
 * Get all unique stroke counts in the MJ_all.csv data
 *
 * @param data Array of MjAllDataRow objects from useMjAllData
 * @returns Array of unique stroke counts
 */
export function getUniqueStrokeCounts(data: MjAllDataRow[]): string[] {
  return getUniqueValues(data, "総画数(参考)").sort(
    (a, b) => Number(a) - Number(b)
  );
}
