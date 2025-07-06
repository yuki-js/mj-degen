import React from "react";
import { Link } from '@tanstack/react-router';

const Header: React.FC = () => {
  return (
    <header className="App-header">
      <h1>MJ縮退漢字 逆引き検索</h1>
      <nav className="tab-nav">
        <Link to="/" activeProps={{ className: 'active' }}>
          検索
        </Link>
        <Link to="/rare" activeProps={{ className: 'active' }}>
          レア漢字一覧
        </Link>
      </nav>
    </header>
  );
};

export default Header;
