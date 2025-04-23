// utils/api.ts
import type { Referral, User } from '~/types';

// In a real application, this would be an API call to your backend
// For demo purposes, we're using localStorage to persist data
export const saveReferrals = (referrals: Referral[]): void => {
  if (process.client) {
    localStorage.setItem('referrals', JSON.stringify(referrals));
  }
};

export const loadReferrals = (): Referral[] => {
  if (process.client) {
    const stored = localStorage.getItem('referrals');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored referrals', e);
      }
    }
  }
  return [];
};

export const saveUser = (user: User): void => {
  if (process.client) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
};

export const loadUser = (): User | null => {
  if (process.client) {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
  }
  return null;
};