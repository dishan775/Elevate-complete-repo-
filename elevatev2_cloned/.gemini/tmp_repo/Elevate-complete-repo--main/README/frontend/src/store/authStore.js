import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (email, name) => {
        const userData = {
          email: email,
          name: name || email.split('@')[0],
          avatar: name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase(),
          // Portfolio fields
          title: '',
          qualification: '',
          about: '',
          skills: [],
          projects: [],
          experiences: [],
        };
        set({ 
          token: 'demo-token-' + Date.now(), 
          user: userData, 
          isAuthenticated: true 
        });
      },
      
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
      
      updateUser: (userData) => {
        set((state) => ({ 
          user: { ...state.user, ...userData } 
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;