// composables/useReferralApi.ts
import { ref, computed, onMounted } from 'vue';
import type { Referral, ReferralStats, User } from '~/types';
import { saveReferrals, loadReferrals, saveUser, loadUser } from '~/utils/api';

export const useReferralApi = () => {
  // In a real application, these would be API calls
  // For demo purposes, we'll use local state with localStorage persistence
  const referrals = ref<Referral[]>([]);
  const currentUser = ref<User>({
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    referrals: [],
    referredBy: null
  });
  
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Load data on mount
  onMounted(() => {
    const loadedReferrals = loadReferrals();
    if (loadedReferrals.length > 0) {
      referrals.value = loadedReferrals;
    }
    
    const loadedUser = loadUser();
    if (loadedUser) {
      currentUser.value = loadedUser;
    } else {
      // Save default user if none exists
      saveUser(currentUser.value);
    }
  });

  // Generate a unique referral code
  const generateReferralCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  // Create a new referral code
  const createReferralCode = async (platform: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReferral: Referral = {
        id: `ref-${Date.now()}`,
        code: generateReferralCode(),
        referrerId: currentUser.value.id,
        referrerName: currentUser.value.name,
        referredUserId: null,
        referredUserName: null,
        status: 'pending',
        dateCreated: new Date().toISOString(),
        dateUsed: null,
        platform
      };
      
      referrals.value.push(newReferral);
      currentUser.value.referrals.push(newReferral);
      
      // Save to "persistence"
      saveReferrals(referrals.value);
      saveUser(currentUser.value);
      
      return newReferral;
    } catch (err) {
      error.value = 'Failed to create referral code';
      console.error(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Use a referral code (simulating a new user signup)
  const useReferralCode = async (code: string, userName: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const referralIndex = referrals.value.findIndex(r => r.code === code && r.status === 'pending');
      
      if (referralIndex === -1) {
        error.value = 'Invalid or already used referral code';
        return false;
      }
      
      // Update the referral
      const updatedReferral: Referral = {
        ...referrals.value[referralIndex],
        referredUserId: `user-${Date.now()}`,
        referredUserName: userName,
        status: 'completed',
        dateUsed: new Date().toISOString()
      };
      
      referrals.value[referralIndex] = updatedReferral;
      
      // Update in the user's referrals as well
      const userReferralIndex = currentUser.value.referrals.findIndex(r => r.code === code);
      if (userReferralIndex !== -1) {
        currentUser.value.referrals[userReferralIndex] = updatedReferral;
      }
      
      // Save to "persistence"
      saveReferrals(referrals.value);
      saveUser(currentUser.value);
      
      return true;
    } catch (err) {
      error.value = 'Failed to use referral code';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Get referral stats
  const getReferralStats = computed<ReferralStats>(() => {
    const totalReferrals = referrals.value.length;
    const completedReferrals = referrals.value.filter(r => r.status === 'completed').length;
    const pendingReferrals = totalReferrals - completedReferrals;
    const conversionRate = totalReferrals > 0 ? (completedReferrals / totalReferrals) * 100 : 0;
    
    // Calculate top platforms
    const platformCounts: Record<string, number> = {};
    referrals.value.forEach(r => {
      platformCounts[r.platform] = (platformCounts[r.platform] || 0) + 1;
    });
    
    const topPlatforms = Object.entries(platformCounts)
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalReferrals,
      pendingReferrals,
      completedReferrals,
      conversionRate,
      topPlatforms
    };
  });

  // Get user's referrals
  const getUserReferrals = computed(() => {
    return currentUser.value.referrals;
  });

  return {
    isLoading,
    error,
    createReferralCode,
    useReferralCode,
    getReferralStats,
    getUserReferrals
  };
};