/**
 * Suspense-ready hook to get a Map from MJ glyph name to Unicode+IVS string.
 * Uses useMjAllData and getMjGlyphIVSMap for unified, consistent logic.
 */
import { useMjAllData } from "./useMjAllData";
import { getMjGlyphIVSMap } from "../utils/mjGlyphMapping";

export const useMjGlyphIVSMap = (): Map<string, string> => {
  const mjAllData = useMjAllData();
  return getMjGlyphIVSMap(mjAllData);
};
