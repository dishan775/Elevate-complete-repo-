import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (email, name, serverToken) => {
        const userData = {
          email,
          name: name || email.split('@')[0],
          avatar: (name || email).charAt(0).toUpperCase(),
          title: '',
          qualification: '',
          about: '',
          skills: [],
          projects: [],
          experiences: [],
        };
        set({ token: serverToken || 'demo-token-' + Date.now(), user: userData, isAuthenticated: true });
      },

      logout: () => set({ token: null, user: null, isAuthenticated: false }),

      updateUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } })),
    }),
    { name: 'elevate-auth-storage' }
  )
);

export default useAuthStore;
