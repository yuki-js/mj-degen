import React, { useState } from "react";
import { useQueryParam } from "../hooks/useQueryParam";

interface JisxProps {
  value: string;
}

const Jisx: React.FC<JisxProps> = ({ value }) => {
  const [showGlyph, setShowGlyph] = useState(false);
  const [, setSelectedIndex] = useQueryParam("idx");
  const [, setSearchQuery] = useQueryParam("q");

  return (
    <span
      className="glyph-tooltip-container"
      onMouseEnter={() => setShowGlyph(true)}
      onMouseLeave={() => setShowGlyph(false)}
      style={{ cursor: "pointer", textDecoration: "underline" }}
      onClick={() => {
        setSelectedIndex("");
        setSearchQuery(value);
      }}
    >
      {value}
      {showGlyph && (
        <div className="glyph-tooltip">
          {String.fromCodePoint(parseInt(value.replace("U+", ""), 16))}
        </div>
      )}
    </span>
  );
};

export default Jisx;
