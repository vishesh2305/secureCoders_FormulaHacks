// Main App Component

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS styles
import { TelemetryProvider } from './context/TelemetryContext';
// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Mempool from './pages/Mempool';
import Protection from './pages/Protection';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import SecureDAppDashboard from './pages/SecureDAppDashboard'; // NEW: Import the new page

// Import styles
import './styles/colors.css';
import './styles/carbon-fiber.css';
import './styles/global.css';
import './pages/Pages.css';

// App Routes Component
const AppRoutes = () => {
  // Initialize AOS on mount
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true, 
      easing: 'ease-out-cubic', 
    });
  }, []);
  
  return (
    <Routes>
      {/* Public Route: Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Dedicated Dashboard/Protected Routes (Now all use DashboardLayout directly and check connection internally) */}
      <Route path="/secure-dapp" element={<DashboardLayout><SecureDAppDashboard /></DashboardLayout>} />

      <Route
        path="/dashboard"
        element={<DashboardLayout><Dashboard /></DashboardLayout>} 
      />
      <Route
        path="/mempool"
        element={<DashboardLayout><Mempool /></DashboardLayout>}
      />
      <Route
        path="/protection"
        element={<DashboardLayout><Protection /></DashboardLayout>}
      />
      <Route
        path="/alerts"
        element={<DashboardLayout><Alerts /></DashboardLayout>}
      />
      <Route
        path="/analytics"
        element={<DashboardLayout><Analytics /></DashboardLayout>}
      />
      <Route
        path="/settings"
        element={<DashboardLayout><Settings /></DashboardLayout>}
      />

      {/* Catch all: Redirects any unknown paths to the Landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component wrapped in the Router and Context Provider
function App() {
  return (
<Router>
      <WalletProvider>
        <TelemetryProvider> 
          <AppRoutes />
        </TelemetryProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;