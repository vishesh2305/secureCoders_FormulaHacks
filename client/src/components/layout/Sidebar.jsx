// Sidebar Navigation Component

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: '⌂', label: 'Dashboard' }, // Updated from 📊
    { path: '/mempool', icon: '◷', label: 'Mempool' },    // Updated from 🔍
    { path: '/protection', icon: '🛡', label: 'Protection' }, // Updated from 🛡️
    { path: '/alerts', icon: '‼', label: 'Alerts', badge: 3 },      // Updated from ⚠️
    { path: '/analytics', icon: '⟘', label: 'Analytics' }, // Updated from 📈
    { path: '/settings', icon: '⚙', label: 'Settings' },  // Updated from ⚙️
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;