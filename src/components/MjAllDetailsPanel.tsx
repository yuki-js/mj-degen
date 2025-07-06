import React from "react";
import { useQueryParam } from "../hooks/useQueryParam";
import { useMjAllData } from "../hooks/useMjAllData";
import MjGlyphImage from "./MjGlyphImage";
import InfoSection from "./InfoSection";

const MjAllDetailsPanel: React.FC = () => {
  const [selectedId] = useQueryParam("idx");
  const mjAllData = useMjAllData();

  if (!selectedId) {
    return <div className="details-panel">詳細が選択されていません。</div>;
  }

  // Find the selected item in the MJ_all.csv data
  const selectedItem = mjAllData.find((row) => row.MJ文字図形名 === selectedId);

  if (!selectedItem) {
    return (
      <div className="details-panel">
        選択された詳細が見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="details-panel">
      <h2>詳細</h2>
      <MjGlyphImage mjId={selectedItem.MJ文字図形名} size="large" />

      <InfoSection title="基本情報">
        <p>
          <strong>MJ文字図形名:</strong> {selectedItem.MJ文字図形名}
        </p>
        <p>
          <strong>図形:</strong> {selectedItem.図形}
        </p>
        {selectedItem.対応するUCS && (
          <p>
            <strong>対応するUCS:</strong> {selectedItem.対応するUCS}
          </p>
        )}
        {selectedItem.実装したUCS && (
          <p>
            <strong>実装したUCS:</strong> {selectedItem.実装したUCS}
          </p>
        )}
      </InfoSection>

      <InfoSection title="文字情報">
        {selectedItem["総画数(参考)"] && (
          <p>
            <strong>総画数:</strong> {selectedItem["総画数(参考)"]}
          </p>
        )}
        {selectedItem["読み(参考)"] && (
          <p>
            <strong>読み:</strong> {selectedItem["読み(参考)"]}
          </p>
        )}

        {/* 部首情報 */}
        <div>
          <strong>部首:</strong>{" "}
          {[
            selectedItem["部首1(参考)"],
            selectedItem["部首2(参考)"],
            selectedItem["部首3(参考)"],
            selectedItem["部首4(参考)"],
          ]
            .filter(Boolean)
            .join(", ")}
        </div>
      </InfoSection>

      <InfoSection title="辞書情報">
        <ul>
          {selectedItem.大漢和 && <li>大漢和: {selectedItem.大漢和}</li>}
          {selectedItem.日本語漢字辞典 && (
            <li>日本語漢字辞典: {selectedItem.日本語漢字辞典}</li>
          )}
          {selectedItem.新大字典 && <li>新大字典: {selectedItem.新大字典}</li>}
          {selectedItem.大字源 && <li>大字源: {selectedItem.大字源}</li>}
          {selectedItem.大漢語林 && <li>大漢語林: {selectedItem.大漢語林}</li>}
        </ul>
      </InfoSection>

      <InfoSection title="IVS情報">
        {selectedItem.実装したMoji_JohoコレクションIVS ? (
          <p>IVS: あり ({selectedItem.実装したMoji_JohoコレクションIVS})</p>
        ) : (
          <p>IVS: なし</p>
        )}
      </InfoSection>

      <InfoSection title="JSON形式">
        <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
      </InfoSection>
    </div>
  );
};

export default MjAllDetailsPanel;
