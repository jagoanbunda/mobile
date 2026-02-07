import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_CHILD_KEY = '@jagoanbunda:active_child_id';

/**
 * User preferences storage
 * Manages persisted user preferences like active child selection
 */
export const preferencesStorage = {
  /**
   * Get the active child ID from storage
   * @returns The stored child ID or null if not set
   */
  async getActiveChildId(): Promise<number | null> {
    const value = await AsyncStorage.getItem(ACTIVE_CHILD_KEY);
    return value ? parseInt(value, 10) : null;
  },

  /**
   * Set the active child ID in storage
   * @param childId - The child ID to set as active
   */
  async setActiveChildId(childId: number): Promise<void> {
    await AsyncStorage.setItem(ACTIVE_CHILD_KEY, childId.toString());
  },

  /**
   * Remove the active child ID from storage
   */
  async removeActiveChildId(): Promise<void> {
    await AsyncStorage.removeItem(ACTIVE_CHILD_KEY);
  },

  /**
   * Clear all preferences
   */
  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([ACTIVE_CHILD_KEY]);
  },
};
