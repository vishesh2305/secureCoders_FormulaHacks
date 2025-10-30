// Custom hook for playing sound effects

import { useCallback, useRef, useState } from 'react';

/**
 * Custom hook for managing sound effects
 * @returns {object} - Sound methods and state
 */
export const useSound = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRefs = useRef({});

  /**
   * Play a sound effect
   * @param {string} soundName - Name of the sound file (without extension)
   * @param {object} options - Playback options
   */
  const playSound = useCallback(
    (soundName, options = {}) => {
      if (isMuted) return;

      const {
        volume = 0.6,
        loop = false,
        onEnd = null,
      } = options;

      try {
        // Create new audio instance or reuse existing one
        if (!audioRefs.current[soundName]) {
          const audio = new Audio(`/assets/sounds/${soundName}.mp3`);
          audio.volume = volume;
          audio.loop = loop;

          if (onEnd) {
            audio.addEventListener('ended', onEnd);
          }

          audioRefs.current[soundName] = audio;
        }

        const audio = audioRefs.current[soundName];
        audio.volume = volume;
        audio.loop = loop;

        // Reset and play
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.warn(`Failed to play sound ${soundName}:`, error);
        });
      } catch (error) {
        console.warn(`Error loading sound ${soundName}:`, error);
      }
    },
    [isMuted]
  );

  /**
   * Stop a sound
   * @param {string} soundName - Name of the sound to stop
   */
  const stopSound = useCallback((soundName) => {
    if (audioRefs.current[soundName]) {
      const audio = audioRefs.current[soundName];
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  /**
   * Stop all playing sounds
   */
  const stopAllSounds = useCallback(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  /**
   * Toggle mute state
   */
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (newMuted) {
        stopAllSounds();
      }
      return newMuted;
    });
  }, [stopAllSounds]);

  /**
   * Preload sound files
   * @param {string[]} soundNames - Array of sound names to preload
   */
  const preloadSounds = useCallback((soundNames) => {
    soundNames.forEach((soundName) => {
      if (!audioRefs.current[soundName]) {
        try {
          const audio = new Audio(`/assets/sounds/${soundName}.mp3`);
          audio.preload = 'auto';
          audioRefs.current[soundName] = audio;
        } catch (error) {
          console.warn(`Failed to preload sound ${soundName}:`, error);
        }
      }
    });
  }, []);

  return {
    playSound,
    stopSound,
    stopAllSounds,
    toggleMute,
    preloadSounds,
    isMuted,
  };
};
