/**
 * Utility functions for working with MJ glyph mappings
 */

import { MjAllDataRow } from "../types/MjAllData";

/**
 * Convert an MJ glyph name to a Unicode+IVS string
 * This is a pure function that derives the mapping from the full CSV data
 *
 * @param mjAllData Array of MjAllDataRow objects from useMjAllData
 * @returns Map from MJ glyph name to Unicode+IVS string
 */
export function getMjGlyphIVSMap(
  mjAllData: MjAllDataRow[]
): Map<string, string> {
  const map = new Map<string, string>();

  for (const row of mjAllData) {
    const mjName = row.MJ文字図形名;
    const ivs = row.実装したMoji_JohoコレクションIVS;
    const ucs = row.実装したUCS;

    if (mjName) {
      if (ivs) {
        // e.g. "3404_E0101" → U+3404 U+E0101
        const m = ivs.match(/^([0-9A-Fa-f]+)_E([0-9A-Fa-f]+)$/);
        if (m) {
          const base = String.fromCodePoint(parseInt(m[1], 16));
          const vs = String.fromCodePoint(0xe0000 + parseInt(m[2], 16));
          map.set(mjName, base + vs);
        } else {
          map.set(mjName, ivs);
        }
      } else if (ucs) {
        const m = ucs.match(/^U\+([0-9A-Fa-f]+)$/);
        if (m) {
          map.set(mjName, String.fromCodePoint(parseInt(m[1], 16)));
        } else {
          map.set(mjName, ucs);
        }
      }
    }
  }

  return map;
}

/**
 * Convert MjAllDataRow to a search result object
 *
 * @param row MjAllDataRow from the CSV
 * @returns MjAllSearchResult with key fields extracted
 */
export function mjRowToSearchResult(row: MjAllDataRow): MjAllSearchResult {
  return {
    mjId: row.MJ文字図形名,
    glyph: row.図形,
    ucs: row.実装したUCS,
    ivs: row.実装したMoji_JohoコレクションIVS,
    reading: row["読み(参考)"],
    strokeCount: row["総画数(参考)"],
    dictionaries: {
      大漢和: row.大漢和,
      日本語漢字辞典: row.日本語漢字辞典,
      新大字典: row.新大字典,
      大字源: row.大字源,
      大漢語林: row.大漢語林,
    },
  };
}

// Import this type here to avoid circular dependency
import { MjAllSearchResult } from "../types/MjAllData";
