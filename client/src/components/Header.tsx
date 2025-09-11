import React from 'react';
import UserMenu from './UserMenu';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">利润管理系统</h1>
        </div>
        
        <div className="header-right">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
