// src/components/layout/LandingNav.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingNav.css';

const LandingNav = ({
    isDashboard = false,
    activeSection = 'home',
    navigateToSection = () => { }
}) => {
    const navigate = useNavigate();

    // Define all navigation items
    const navItems = [
        // Landing Page Items (scrolling)
        { label: 'HOME', id: 'home', isScroll: true, path: '/' },
        { label: 'FEATURES', id: 'features', isScroll: true },
        { label: 'DAPP ANALYZER', id: 'dapp-analyzer', isScroll: true },
        { label: 'RISK METER', id: 'risk-meter', isScroll: true },
        { label: 'ABOUT US', id: 'about', isScroll: true }, // MODIFIED: Reverted ID and Label
        // Direct Links (main pages)
        { label: 'FULL DASHBOARD', id: 'secure-dapp', path: '/secure-dapp', isScroll: false },
        { label: 'MAIN DASHBOARD', id: 'dashboard', path: '/dashboard', isScroll: false },
    ];

    const handleClick = (item) => {
        if (isDashboard) {
            // Logic for navigation FROM the Dashboard (protected route)

            if (item.path === '/') {
                // FIX: Navigate to the root path and append the hash fragment.
                // Pass a state flag to temporarily bypass the auto-redirect on the Landing page.
                navigate(`/#${item.id}`, { state: { bypassRedirect: true } });
            } else {
                // For direct page links (e.g., /dashboard, /secure-dapp)
                navigate(item.path);
            }
        } else {
            // Logic for navigation ON the Landing page (scroll handler)
            if (item.isScroll) {
                navigateToSection(item.id);
            } else {
                navigate(item.path);
            }
        }
    }

    // Filter items: Dashboard gets Home and Main Dashboard links for simplicity
    const displayItems = isDashboard
        ? navItems.filter(item => item.path === '/' || item.path === '/dashboard')
        : navItems.filter(item => item.id !== 'dashboard');

    return (
        <nav className="landing-nav-bar">
            {displayItems.map((item) => (
                <button
                    key={item.id || item.label}
                    // Only apply active-nav on the Landing page
                    className={`landing-nav-item ${!isDashboard && activeSection === item.id ? 'active-nav' : ''}`}
                    onClick={() => handleClick(item)}
                >
                    {item.label}
                </button>
            ))}
        </nav>
    );
};

export default LandingNav;