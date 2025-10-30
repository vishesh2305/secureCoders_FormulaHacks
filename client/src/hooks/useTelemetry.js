// src/hooks/useTelemetry.js

import { useContext } from 'react';
import { TelemetryContext } from '../context/TelemetryContext';

/**
 * Custom hook to access telemetry context
 * @returns {object} - Telemetry context with state
 */
export const useTelemetry = () => {
  const context = useContext(TelemetryContext);

  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }

  return context;
};