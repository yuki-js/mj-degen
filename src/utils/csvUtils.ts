/**
 * Utility functions for parsing CSV data
 */

/**
 * Parse a CSV line, handling quoted fields correctly
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Parse a CSV string into an array of objects with named fields
 */
export function parseCSV<T extends Record<string, string>>(csvText: string): T[] {
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV missing data");

  const header = parseCSVLine(lines[0]);
  const results: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length !== header.length) continue; // Skip malformed rows

    const obj = {} as T;
    for (let j = 0; j < header.length; j++) {
      (obj as Record<string, string>)[header[j]] = row[j];
    }
    results.push(obj);
  }

  return results;
}
