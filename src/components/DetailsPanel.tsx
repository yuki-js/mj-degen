import { useQueryParam } from "../hooks/useQueryParam";
import { useShrinkMap } from "../hooks/useShrinkMap";
import React from "react";
import MjGlyphImage from "./MjGlyphImage";
import InfoSection from "./InfoSection";
import RelatedInfoSection from "./RelatedInfoSection";

const DetailsPanel: React.FC = () => {
  const [selectedIndex] = useQueryParam("idx");

  const shrinkMap = useShrinkMap();

  if (!selectedIndex) {
    return <div className="details-panel">詳細が選択されていません。</div>;
  }

  const selectedResult = shrinkMap.get(selectedIndex);

  if (!selectedResult) {
    return (
      <div className="details-panel">
        選択された詳細が見つかりませんでした。
      </div>
    );
  }
  return (
    <div className="details-panel">
      <h2>詳細</h2>
      <MjGlyphImage mjId={selectedResult.MJ文字図形名} size="large" />
      <p>
        <strong>MJ文字図形名:</strong> {selectedResult.MJ文字図形名}
      </p>
      {[
        {
          title: "JIS包摂規準・UCS統合規則",
          items: selectedResult["JIS包摂規準・UCS統合規則"],
        },
        {
          title: "辞書類等による関連字",
          items: selectedResult.辞書類等による関連字,
        },
        {
          title: "読み・字形による類推",
          items: selectedResult.読み・字形による類推,
        },
        {
          title: "法務省戸籍法関連通達・通知",
          items: selectedResult.法務省戸籍法関連通達・通知,
        },
        {
          title: "法務省告示582号別表第四",
          items: selectedResult.法務省告示582号別表第四,
        },
      ].map((section, index) => (
        <RelatedInfoSection
          key={index}
          title={section.title}
          items={section.items}
        />
      ))}
      {selectedResult.参考情報 && (
        <InfoSection title="参考情報">
          <p>{selectedResult.参考情報}</p>
        </InfoSection>
      )}
      <p>
        <strong>その文字に関する情報JSON形式</strong>
      </p>

      <pre>{JSON.stringify(selectedResult, null, 2)}</pre>
    </div>
  );
};

export default DetailsPanel;
