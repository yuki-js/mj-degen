/**
 * Types for the full MJ_all.csv data
 */

export interface MjAllDataRow {
  // Core fields
  図形: string;
  font: string;
  MJ文字図形名: string;
  対応するUCS: string;
  実装したUCS: string;
  実装したMoji_JohoコレクションIVS: string;
  実装したSVS: string;
  戸籍統一文字番号: string;
  住基ネット統一文字コード: string;
  入管正字コード: string;
  入管外字コード: string;
  漢字施策: string;
  対応する互換漢字: string;
  X0213: string;
  "X0213 包摂連番": string;
  "X0213 包摂区分": string;
  X0212: string;
  MJ文字図形バージョン: string;
  "登記統一文字番号(参考)": string;

  // Radical and stroke count fields
  "部首1(参考)": string;
  "内画数1(参考)": string;
  "部首2(参考)": string;
  "内画数2(参考)": string;
  "部首3(参考)": string;
  "内画数3(参考)": string;
  "部首4(参考)": string;
  "内画数4(参考)": string;
  "総画数(参考)": string;

  // Reading and dictionary reference fields
  "読み(参考)": string;
  大漢和: string;
  日本語漢字辞典: string;
  新大字典: string;
  大字源: string;
  大漢語林: string;

  // Metadata fields
  更新履歴: string;
  備考: string;
}

export interface MjAllSearchResult {
  mjId: string;
  glyph: string;
  ucs?: string;
  ivs?: string;
  reading?: string;
  strokeCount?: string;
  dictionaries?: {
    大漢和?: string;
    日本語漢字辞典?: string;
    新大字典?: string;
    大字源?: string;
    大漢語林?: string;
  };
}
