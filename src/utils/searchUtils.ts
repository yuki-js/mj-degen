import {
  SearchResult,
  ShrinkMapItem,
  JIS面区点位置とUCS符号位置の組,
  法務省戸籍法関連通達通知,
  法務省告示582号別表第四,
} from "../types";

type RelatedItem =
  | JIS面区点位置とUCS符号位置の組
  | 法務省戸籍法関連通達通知
  | 法務省告示582号別表第四;

const commonKeys = [
  "JIS包摂規準・UCS統合規則",
  "法務省戸籍法関連通達・通知",
  "法務省告示582号別表第四",
  "辞書類等による関連字",
  "読み・字形による類推",
] as const;

// Helper function for UCS search
const matchByUcs = (item: ShrinkMapItem, searchUcs: string): boolean => {
  for (const key of commonKeys) {
    const relatedItems = item[key];
    if (!relatedItems) {
      continue;
    }
    for (const related of relatedItems) {
      if (related.UCS === searchUcs) {
        return true;
      }
    }
  }
  return false;
};

// Helper function for JIS X 0213 search
const matchByJisX = (item: ShrinkMapItem, searchJisX: string): boolean => {
  for (const key of commonKeys) {
    const relatedItems = item[key] as RelatedItem[] | undefined;
    if (!relatedItems) {
      continue;
    }
    for (const related of relatedItems) {
      if ("JIS X 0213" in related && related["JIS X 0213"] === searchJisX) {
        return true;
      }
    }
  }
  return false;
};

type ParsedSearchTerm =
  | {
      mjId: string;
    }
  | {
      ucs: string;
    }
  | {
      jisX: string;
    }
  | {
      charUcs: string;
    };

const parseSearchTerm = (searchTerm: string): ParsedSearchTerm => {
  let parsed = {} as ParsedSearchTerm;
  const upperCaseSearchTerm = searchTerm.toUpperCase();
  const jisXRegex = /^(\d+)-(\d+)-(\d+)$/;

  if (upperCaseSearchTerm.startsWith("MJ")) {
    parsed = { mjId: upperCaseSearchTerm };
  } else if (upperCaseSearchTerm.startsWith("U+")) {
    parsed = { ucs: upperCaseSearchTerm };
  } else if (jisXRegex.test(upperCaseSearchTerm)) {
    parsed = {
      jisX: upperCaseSearchTerm,
    };
  } else if (searchTerm.length === 1) {
    // Assuming single character search is for UCS
    parsed = {
      charUcs: `U+${searchTerm.charCodeAt(0).toString(16).toUpperCase()}`,
    };
  }
  return parsed;
};

const matchItemBySearchTerm = (
  item: ShrinkMapItem,
  parsedSearchTerm: ParsedSearchTerm
): boolean => {
  if ("mjId" in parsedSearchTerm) {
    return item.MJ文字図形名 === parsedSearchTerm.mjId;
  }
  if ("ucs" in parsedSearchTerm) {
    return matchByUcs(item, parsedSearchTerm.ucs);
  }
  if ("jisX" in parsedSearchTerm) {
    return matchByJisX(item, parsedSearchTerm.jisX);
  }
  if ("charUcs" in parsedSearchTerm) {
    return matchByUcs(item, parsedSearchTerm.charUcs);
  }
  return false;
};

const findCandidateMatches = (
  shrinkMapItem: ShrinkMapItem,
  allShrinkMap: Map<string, ShrinkMapItem>
): Set<string> => {
  const candidateUcs: Set<string> = new Set();
  const candidateJisX: Set<string> = new Set();

  for (const key of commonKeys) {
    const relatedItems = shrinkMapItem[key] as RelatedItem[] | undefined;
    if (relatedItems) {
      for (const related of relatedItems) {
        if ("UCS" in related) {
          candidateUcs.add(related.UCS);
        }
        if ("JIS X 0213" in related) {
          candidateJisX.add(related["JIS X 0213"]);
        }
      }
    }
  }

  const resultMjIds = new Set<string>();

  for (const ucs of candidateUcs) {
    const results = findOneLevel({ ucs }, allShrinkMap);
    for (const mjId of results) {
      resultMjIds.add(mjId);
    }
  }

  for (const jisX of candidateJisX) {
    const results = findOneLevel({ jisX }, allShrinkMap);
    for (const mjId of results) {
      resultMjIds.add(mjId);
    }
  }

  return resultMjIds;
};

const findOneLevel = (
  parsedSearchTerm: ParsedSearchTerm,
  shrinkMap: Map<string, ShrinkMapItem>
): Set<string> => {
  const results: Set<string> = new Set();
  for (const item of shrinkMap.values()) {
    if (matchItemBySearchTerm(item, parsedSearchTerm)) {
      results.add(item.MJ文字図形名);
    }
  }
  return results;
};

function mjIdToSearchResult(
  mjId: string,
  shrinkMap: Map<string, ShrinkMapItem>
): SearchResult | undefined {
  const item = shrinkMap.get(mjId);
  if (item) {
    return {
      mjId: item.MJ文字図形名,
    };
  }
  return undefined;
}
export const performSearch = (
  searchTerm: string,
  shrinkMap: Map<string, ShrinkMapItem>
): {
  exactMatches: SearchResult[];
  candidates: SearchResult[];
} => {
  const parsedSearchTerm = parseSearchTerm(searchTerm);

  const foundExactMatches = findOneLevel(parsedSearchTerm, shrinkMap);
  const foundCandidates = new Set<string>();
  for (const matchMjId of foundExactMatches) {
    const shrinkMapItem = shrinkMap.get(matchMjId);
    if (shrinkMapItem) {
      const candidates = findCandidateMatches(shrinkMapItem, shrinkMap);
      candidates.forEach((mjId) => foundCandidates.add(mjId));
    }
  }
  // duplicate removal
  // foundCandidates - foundExactMatches
  foundCandidates.forEach((mjId) => {
    if (foundExactMatches.has(mjId)) {
      foundCandidates.delete(mjId);
    }
  });

  const exactResults = Array.from(foundExactMatches)
    .map((mjId) => mjIdToSearchResult(mjId, shrinkMap))
    .filter((result): result is SearchResult => result !== undefined);

  const candidateResults = Array.from(foundCandidates)
    .map((mjId) => mjIdToSearchResult(mjId, shrinkMap))
    .filter((result): result is SearchResult => result !== undefined);

  return { exactMatches: exactResults, candidates: candidateResults };
};
