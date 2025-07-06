import React from "react";

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
  const imgClass = [sizeClass[size], className].filter(Boolean).join(" ");
  return (
    <img
      src={`https://moji.or.jp/mojikibansearch/img/MJ/${mjId}.png`}
      alt={alt ?? mjId}
      className={imgClass}
      loading="lazy"
      draggable={false}
    />
  );
};

export default MjGlyphImage;
