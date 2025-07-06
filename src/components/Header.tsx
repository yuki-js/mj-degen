import React from "react";
import { useQueryParam } from "../hooks/useQueryParam";

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useQueryParam("q");
  return (
    <header className="App-header">
      <h1>MJ縮退漢字 逆引き検索</h1>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="漢字を一文字, MJ文字図形名 (MJxxxx), UCS符号位置 (U+xxxx) で検索"
        />
      </div>
    </header>
  );
};

export default Header;
