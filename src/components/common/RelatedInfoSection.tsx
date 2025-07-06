import React from "react";
import {
  JIS面区点位置とUCS符号位置の組,
  法務省戸籍法関連通達通知,
  法務省告示582号別表第四,
} from "../types";
import { InfoSection } from "./InfoSection";
import { Jisx } from "./Jisx";
import { Ucs } from "./Ucs";

type RelatedItem =
  | JIS面区点位置とUCS符号位置の組
  | 法務省戸籍法関連通達通知
  | 法務省告示582号別表第四;

interface RelatedInfoSectionProps {
  title: string;
  items?: RelatedItem[];
}

export const RelatedInfoSection: React.FC<RelatedInfoSectionProps> = ({
  title,
  items,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <InfoSection title={title}>
      {items.map((item, index) => (
        <div key={index} className="info-item">
          {"種別" in item && <p>種別: {item.種別}</p>}
          {"付記" in item && item.付記 && <p>付記: {item.付記}</p>}
          {"ホップ数" in item && item.ホップ数 && (
            <p>ホップ数: {item.ホップ数}</p>
          )}
          {"表" in item && <p>表: {item.表}</p>}
          {"順位" in item && <p>順位: {item.順位}</p>}
          <p>
            JIS X 0213: <Jisx value={item["JIS X 0213"]} />
          </p>
          <p>
            UCS: <Ucs value={item.UCS} />
          </p>
        </div>
      ))}
    </InfoSection>
  );
};
