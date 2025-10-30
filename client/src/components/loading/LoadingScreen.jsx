// F1 Race Track Loading Screen Component

import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [lightsOn, setLightsOn] = useState(0);
  const [raceStarted, setRaceStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const { playSound, toggleMute, isMuted, preloadSounds } = useSound();

  const stages = [
    'INITIALIZING SECURITY SYSTEMS...',
    'CONNECTING TO BLOCKCHAIN...',
    'LOADING MEMPOOL MONITOR...',
    'ACTIVATING AI DETECTION...',
    'PREPARING DASHBOARD...',
    'LIGHTS OUT AND AWAY WE GO!',
  ];

  // Preload all sounds on mount
  useEffect(() => {
    preloadSounds([
      'engine_idle',
      'beep_light',
      'engine_rev',
      'tire_squeal',
      'car_whoosh',
      'milestone_click',
      'victory_flag',
    ]);

    // Start engine idle sound
    playSound('engine_idle', { loop: true, volume: 0.3 });

    return () => {
      // Cleanup: stop all sounds when component unmounts
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Elapsed time counter
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 0.1);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Light sequence animation
  useEffect(() => {
    if (lightsOn < 5) {
      const timeout = setTimeout(() => {
        setLightsOn(lightsOn + 1);
        playSound('beep_light', { volume: 0.5 });
      }, 500);

      return () => clearTimeout(timeout);
    } else if (lightsOn === 5 && !raceStarted) {
      // All lights on, wait 0.5s then lights out (race start)
      const timeout = setTimeout(() => {
        setLightsOn(0); // Lights out!
        setRaceStarted(true);
        playSound('engine_rev', { volume: 0.8 });
        setTimeout(() => {
          playSound('tire_squeal', { volume: 0.6 });
        }, 500);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [lightsOn, raceStarted, playSound]);

  // Progress and stage simulation
  useEffect(() => {
    if (!raceStarted) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 2, 100);

        // Update stage based on progress
        if (newProgress >= 20 && currentStage < 1) setCurrentStage(1);
        if (newProgress >= 40 && currentStage < 2) setCurrentStage(2);
        if (newProgress >= 60 && currentStage < 3) setCurrentStage(3);
        if (newProgress >= 80 && currentStage < 4) setCurrentStage(4);
        if (newProgress >= 95 && currentStage < 5) setCurrentStage(5);

        // Play milestone sounds
        if (newProgress === 26 || newProgress === 52 || newProgress === 76) {
          playSound('milestone_click', { volume: 0.4 });
        }

        // Complete loading
        if (newProgress === 100) {
          playSound('victory_flag', { volume: 0.7 });

          setTimeout(() => {
            if (onComplete) onComplete();
          }, 1500);
        }

        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [raceStarted, currentStage, playSound, onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* Logo */}
        <div className="loading-logo">
          <span className="logo-f1">F1</span>{' '}
          <span className="logo-defi">DEFI</span>
        </div>

        {/* Start Lights */}
        <div className="start-lights">
          {[1, 2, 3, 4, 5].map((light) => (
            <div
              key={light}
              className={`light ${lightsOn >= light && !raceStarted ? 'on' : ''}`}
            />
          ))}
        </div>

        {/* Race Track */}
        <div className="race-track">
          {/* Start line (checkered) */}
          <div className="checkered-flag start-flag" />

          {/* F1 Car */}
          <div
            className="f1-car"
            style={{
              left: `${Math.min(progress * 5.6, 560)}px`,
              opacity: raceStarted ? 1 : 0,
            }}
          >
            🏎️
          </div>

          {/* Finish line (checkered) */}
          <div className="checkered-flag finish-flag" />
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Text */}
        <div className="status-text">{stages[currentStage]}</div>

        {/* Loading Stats */}
        <div className="loading-stats">
          <div className="stat-box">
            <div className="stat-value">{progress}%</div>
            <div className="stat-label">PROGRESS</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{currentStage + 1}/6</div>
            <div className="stat-label">MODULES</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{elapsedTime.toFixed(1)}s</div>
            <div className="stat-label">ELAPSED</div>
          </div>
        </div>

        {/* Mute Button */}
        <button className="mute-button" onClick={toggleMute}>
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  );
};

export default LoadingScreen;
