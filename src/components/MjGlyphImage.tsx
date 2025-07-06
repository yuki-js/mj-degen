import React from "react";
import { useMjGlyphIVSMap } from "../hooks/useMjGlyphIVSMap";
import { mjGlyphNameToIVS } from "../utils/mjGlyphNameToIVS";

type MjGlyphImageProps = {
  mjId: string;
  size?: "small" | "large";
  alt?: string;
  className?: string;
};

const sizeClass = {
  small: "glyph-image",
  large: "glyph-image-large",
};

export const MjGlyphImage: React.FC<MjGlyphImageProps> = ({
  mjId,
  size = "small",
  alt,
  className = "",
}) => {
  const ivsMap = useMjGlyphIVSMap();
  const glyph = mjGlyphNameToIVS(mjId, ivsMap);

  const spanClass = [sizeClass[size], className].filter(Boolean).join(" ");

  // Fallback: if glyph not found, show alt or mjId
  return (
    <span
      className={spanClass}
      style={{}}
      title={alt ?? mjId}
      aria-label={alt ?? mjId}
    >
      {glyph ?? alt ?? mjId}
    </span>
  );
};

export default MjGlyphImage;
