import React from "react";
import { Link } from "@tanstack/react-router";

const Header: React.FC = () => {
  return (
    <header className="App-header">
      <h1>MJ漢字 検索</h1>
      <nav className="tab-nav">
        <Link to="/" activeProps={{ className: "active" }}>
          縮退漢字検索
        </Link>
        <Link to="/mjsearch" activeProps={{ className: "active" }}>
          全漢字検索
        </Link>
        <Link to="/rare" activeProps={{ className: "active" }}>
          レア漢字一覧
        </Link>
      </nav>
    </header>
  );
};

export default Header;
