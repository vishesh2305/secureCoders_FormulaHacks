// Dashboard Layout Component (Header + Sidebar + Main Content)

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Header />
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default DashboardLayout;
