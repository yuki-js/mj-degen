export interface JISX0213面区点位置 {
  "JIS X 0213": string;
}

export interface UCS符号位置 {
  UCS: string;
}

export interface JIS面区点位置とUCS符号位置の組 extends JISX0213面区点位置, UCS符号位置 {}

export interface 法務省戸籍法関連通達通知 extends JIS面区点位置とUCS符号位置の組 {
  種別: string;
  付記?: string;
  ホップ数?: number;
}

export interface 法務省告示582号別表第四 extends JIS面区点位置とUCS符号位置の組 {
  表: string;
  順位: string;
}

export interface ShrinkMapItem {
  MJ文字図形名: string;
  "JIS包摂規準・UCS統合規則"?: JIS面区点位置とUCS符号位置の組[];
  法務省戸籍法関連通達・通知?: 法務省戸籍法関連通達通知[];
  法務省告示582号別表第四?: 法務省告示582号別表第四[];
  辞書類等による関連字?: JIS面区点位置とUCS符号位置の組[];
  読み・字形による類推?: JIS面区点位置とUCS符号位置の組[];
  参考情報?: string;
}

export interface Meta {
  version: string;
  // Add other meta properties as needed
}

export interface ShrinkMapData {
  meta: Meta;
  content: ShrinkMapItem[];
}

export interface SearchResult {
  mjId: string;
}
