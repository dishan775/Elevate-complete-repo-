import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      
      // Register a new user via the backend API
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${API_BASE}/auth/register`, {
            name,
            email,
            password,
          });
          const { token, user } = res.data;
          const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase(),
            // Portfolio fields
            title: '',
            qualification: '',
            about: '',
            skills: [],
            projects: [],
            experiences: [],
          };
          set({
            token,
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Registration failed. Please try again.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // Login an existing user via the backend API
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${API_BASE}/auth/login`, {
            email,
            password,
          });
          const { token, user } = res.data;
          const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase(),
            // Portfolio fields
            title: '',
            qualification: '',
            about: '',
            skills: [],
            projects: [],
            experiences: [],
          };
          set({
            token,
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Invalid credentials. Please try again.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },
      
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false, error: null });
      },

      clearError: () => {
        set({ error: null });
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