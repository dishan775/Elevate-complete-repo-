import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
    persist(
        (set, get) => ({
            theme: 'light',

            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                set({ theme: newTheme });
            },

            initTheme: () => {
                const currentTheme = get().theme;
                document.documentElement.setAttribute('data-theme', currentTheme);
            },
        }),
        {
            name: 'theme-storage',
        }
    )
);

export default useThemeStore;
