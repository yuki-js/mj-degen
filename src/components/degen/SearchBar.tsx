import React from "react";
import { useQueryParam } from "../../hooks/useQueryParam";
import { BaseSearchInput } from "../common/BaseSearchInput";

export const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useQueryParam("q");

  const handleSearch = (query: string | null) => {
    setSearchTerm(query);
  };

  return (
    <BaseSearchInput
      onSearch={handleSearch}
      defaultValue={searchTerm || ""}
      placeholder="漢字を一文字, MJ文字図形名 (MJxxxx), UCS符号位置 (U+xxxx) で検索"
    />
  );
};
