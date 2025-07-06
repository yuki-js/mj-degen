import React from "react";
import { useQueryParam } from "../hooks/useQueryParam";

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useQueryParam("q");

  const formAction = (form: FormData) => {
    const query = form.get("query") as string;
    if (query) {
      setSearchTerm(query.trim());
    } else {
      setSearchTerm(null);
    }
  };

  return (
    <header className="App-header">
      <h1>MJ縮退漢字 逆引き検索</h1>
      <form className="search-container" action={formAction}>
        <input
          type="text"
          defaultValue={searchTerm || ""}
          placeholder="漢字を一文字, MJ文字図形名 (MJxxxx), UCS符号位置 (U+xxxx) で検索"
          name="query"
        />
        <button type="submit">検索</button>
      </form>
    </header>
  );
};

export default Header;
