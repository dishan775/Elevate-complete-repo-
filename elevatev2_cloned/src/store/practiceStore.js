import { create } from 'zustand';

const usePracticeStore = create((set, get) => ({
  xp: 0,
  level: 1,
  latestScore: 0,
  latestType: 'none',
  activityCount: 0,
  badge: 'Beginner',
  loading: false,
  error: null,

  fetchSummary: async () => {
    set({ loading: true });
    try {
      const res = await fetch('https://elevate-backend-2v69.onrender.com/api/english/summary');
      const data = await res.json();
      if (data.success) {
        set({
          xp: data.data.totalXP,
          level: data.data.level,
          latestScore: data.data.latestScore,
          latestType: data.data.latestType,
          activityCount: data.data.activityCount,
          badge: data.data.badge,
          loading: false
        });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addXP: async (amount, reason = 'Activity Completion') => {
    try {
      const res = await fetch('https://elevate-backend-2v69.onrender.com/api/english/add-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, reason })
      });
      const data = await res.json();
      if (data.success) {
        set({
          xp: data.data.totalXP,
          level: data.data.level,
          latestScore: data.data.latestScore,
          latestType: data.data.latestType,
          activityCount: data.data.activityCount,
          badge: data.data.badge
        });
      }
    } catch (err) {
      console.error('Failed to add XP:', err);
    }
  },

  saveScore: async (score, type) => {
    try {
      const res = await fetch('https://elevate-backend-2v69.onrender.com/api/english/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, type })
      });
      const data = await res.json();
      if (data.success) {
        // Re-fetch summary after saving score to get updated metrics
        get().fetchSummary();
      }
    } catch (err) {
      console.error('Failed to save score:', err);
    }
  }
}));

export default usePracticeStore;
