// Settings Page Component

import React from 'react';

const Settings = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Configure your preferences and security settings
        </p>
      </div>

      <div className="placeholder-content">
        <div className="placeholder-icon">⚙️</div>
        <h2>Configuration</h2>
        <p>Manage your account settings, preferences, and security options.</p>
      </div>
    </div>
  );
};

export default Settings;
