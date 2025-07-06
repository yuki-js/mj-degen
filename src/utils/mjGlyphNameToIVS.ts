/**
 * Converts an MJ glyph name (e.g., "MJ000001") to a Unicode string with IVS (Ideographic Variation Sequence),
 * using a pre-parsed Map from useMjGlyphIVSMap.
 *
 * This function is synchronous and expects the map to be provided (from Suspense hook).
 */

export function mjGlyphNameToIVS(
  mjName: string,
  ivsMap: Map<string, string>
): string | undefined {
  return ivsMap.get(mjName);
}
