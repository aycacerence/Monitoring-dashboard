import { useState, useEffect, useRef } from 'react';

/**
 * Tracks the history of live values for a specific device.
 * Maintains a ring buffer of the last `maxItems` data points.
 * 
 * @param {string} deviceId - The ID of the device being monitored.
 * @param {number|string} liveValue - The current live value from the socket.
 * @param {number} maxItems - Maximum number of data points to keep (default: 30).
 * @returns {Array<number>} An array of historical numeric values.
 */
export const useDeviceHistory = (deviceId, liveValue, maxItems = 30) => {
  const [history, setHistory] = useState([]);
  
  // When device changes, reset the history
  useEffect(() => {
    setHistory([]);
  }, [deviceId]);

  // When liveValue updates, add it to the history if it's a valid number
  useEffect(() => {
    if (!deviceId || liveValue === undefined || liveValue === null || liveValue === '--') {
      return;
    }

    let numericValue = null;
    
    if (typeof liveValue === 'number' && !isNaN(liveValue)) {
      numericValue = liveValue;
    } else if (typeof liveValue === 'string') {
      // Map digital states to binary values for graphing purposes
      const lower = liveValue.toLowerCase();
      if (lower === 'kapalı' || lower === 'pasif' || lower === 'alarm') {
        numericValue = 0;
      } else if (lower === 'açık' || lower === 'aktif' || lower === 'normal') {
        numericValue = 1;
      } else {
        const parsed = parseFloat(liveValue);
        if (!isNaN(parsed)) {
          numericValue = parsed;
        }
      }
    }

    if (numericValue !== null) {
      setHistory(prev => {
        const newHistory = [...prev, numericValue];
        if (newHistory.length > maxItems) {
          return newHistory.slice(newHistory.length - maxItems);
        }
        return newHistory;
      });
    }
  }, [liveValue, deviceId, maxItems]);

  return history;
};
