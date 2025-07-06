import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const x = useMotionValue(0); // ドラッグのXオフセット
  const lastReportedPage = useRef(currentPage);

  // ドラッグのXオフセットを、表示上のページオフセットに変換
  // 例: -200pxから200pxのドラッグで、-10ページから10ページ分の視覚的な変化
  const visualPageOffset = useTransform(x, [-200, 200], [-10, 10]);

  // ドラッグ中にページ番号をリアルタイムで更新
  visualPageOffset.on("change", (offset) => {
    const newPage = Math.round(currentPage + offset);
    const clampedPage = Math.max(1, Math.min(totalPages, newPage));

    if (clampedPage !== lastReportedPage.current) {
      lastReportedPage.current = clampedPage;
      onPageChange(clampedPage);
    }
  });

  const handleDragEnd = () => {
    // ドラッグが終わったら、Xオフセットを0に戻すアニメーション
    animate(x, 0, { type: "spring", stiffness: 400, damping: 40 });
  };

  return (
    <motion.div
      className="pagination-controls interactive"
      drag="x"
      style={{ x }} // Xオフセットを要素のスタイルに適用
      dragConstraints={{ left: 0, right: 0 }} // 水平方向のみドラッグを許可
      dragElastic={0.2} // ドラッグの弾性
      onDragEnd={handleDragEnd} // ドラッグ終了時のイベントハンドラ
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        前へ
      </button>
      <div className="page-display">
        ページ{" "}
        <motion.span>
          {Math.round(currentPage + visualPageOffset.get())}
        </motion.span>{" "}
        / {totalPages}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        次へ
      </button>
    </motion.div>
  );
};
