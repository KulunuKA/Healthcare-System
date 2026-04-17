/**
 * Utility wrapper for browser sessionStorage
 */

/**
 * Get a value from sessionStorage
 * @param {string} key - The key to retrieve
 */
export const getSessionValue = (key) => {
  if (typeof window === "undefined" || !window.sessionStorage) {
    console.warn("sessionStorage not available in this environment");
    return null;
  }

  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn("sessionStorage.getItem failed:", error);
    return null;
  }
};

/**
 * Set a value in sessionStorage
 * @param {string} key - The key to set
 * @param {string} value - The value to store
 * @returns {Promise<void>}
 */
export const setSession = async (key, value) => {
  if (typeof window === "undefined" || !window.sessionStorage) {
    console.warn("sessionStorage not available in this environment");
    return;
  }

  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.warn("sessionStorage.setItem failed:", error);
  }
};

/**
 * Remove a value from sessionStorage
 * @param {string} key - The key to remove
 * @returns {Promise<void>}
 */
export const removeSession = async (key) => {
  if (typeof window === "undefined" || !window.sessionStorage) {
    console.warn("sessionStorage not available in this environment");
    return;
  }

  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn("sessionStorage.removeItem failed:", error);
  }
};

/**
 * Clear all sessionStorage
 * @returns {Promise<void>}
 */
export const clearSession = async () => {
  if (typeof window === "undefined" || !window.sessionStorage) {
    console.warn("sessionStorage not available in this environment");
    return;
  }

  try {
    sessionStorage.clear();
  } catch (error) {
    console.warn("sessionStorage.clear failed:", error);
  }
};

/**
 * Get all keys from sessionStorage
 */
export const getSessionKeys = async () => {
  if (typeof window === "undefined" || !window.sessionStorage) {
    console.warn("sessionStorage not available in this environment");
    return [];
  }

  try {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const key = sessionStorage.key(i);
      if (key !== null) keys.push(key);
    }
    return keys;
  } catch (error) {
    console.warn("Retrieving sessionStorage keys failed:", error);
    return [];
  }
};
