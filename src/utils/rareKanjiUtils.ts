import { SearchResult, ShrinkMapItem } from "../types";

const commonKeys = [
  "JIS包摂規準・UCS統合規則",
  "法務省戸籍法関連通達・通知",
  "法務省告示582号別表第四",
  "辞書類等による関連字",
  "読み・字形による類推",
] as const;

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

export const findRareKanji = (
  shrinkMap: Map<string, ShrinkMapItem>
): SearchResult[] => {
  const rareKanji: SearchResult[] = [];

  for (const item of shrinkMap.values()) {
    const isRare = commonKeys.every(key => {
      const relatedItems = item[key];
      return !relatedItems || relatedItems.length === 0;
    });

    if (isRare) {
      const result = mjIdToSearchResult(item.MJ文字図形名, shrinkMap);
      if (result) {
        rareKanji.push(result);
      }
    }
  }
  return rareKanji;
};
