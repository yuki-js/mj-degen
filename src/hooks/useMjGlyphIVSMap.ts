/**
 * Suspense-ready hook to fetch and parse public/mj_all.csv,
 * returning a Map from MJ glyph name to Unicode+IVS string.
 * No external CSV parser is used.
 */

let resource: {
  status: "pending" | "success" | "error";
  promise: Promise<Map<string, string>> | null;
  result: Map<string, string> | null;
  error: Error | null;
} = {
  status: "pending",
  promise: null,
  result: null,
  error: null,
};

function parseCSVLine(line: string): string[] {
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

const fetchMjGlyphIVSMap = () => {
  if (resource.status === "pending" && !resource.promise) {
    resource.promise = fetch("/mj_all.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.text();
      })
      .then((text) => {
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) throw new Error("CSV missing data");
        const header = parseCSVLine(lines[0]);
        const mjNameIdx = header.indexOf("MJ文字図形名");
        const ucsIdx = header.indexOf("実装したUCS");
        const ivsIdx = header.indexOf("実装したMoji_JohoコレクションIVS");
        const map = new Map<string, string>();
        for (let i = 1; i < lines.length; i++) {
          const row = parseCSVLine(lines[i]);
          const mjName = row[mjNameIdx];
          const ivs = row[ivsIdx];
          const ucs = row[ucsIdx];
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
        resource.status = "success";
        resource.result = map;
        return map;
      })
      .catch((error) => {
        resource.status = "error";
        resource.error = error;
        throw error;
      });
  }
  return resource.promise;
};

export const useMjGlyphIVSMap = (): Map<string, string> => {
  if (resource.status === "pending") {
    throw fetchMjGlyphIVSMap();
  } else if (resource.status === "error") {
    throw resource.error!;
  } else if (resource.status === "success") {
    return resource.result!;
  }
  throw new Error("Unexpected state in useMjGlyphIVSMap");
};
