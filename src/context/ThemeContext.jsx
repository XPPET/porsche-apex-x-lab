import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'night',
  toggleTheme: () => {},
  isDay: false,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apex_vision_theme');
      if (saved === 'day' || saved === 'night') return saved;
    }
    return 'night'; // Default to low-light command center
  });

  useEffect(() => {
    localStorage.setItem('apex_vision_theme', theme);
    const root = document.documentElement;
    if (theme === 'day') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'day');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'night');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'night' ? 'day' : 'night'));
  };

  const isDay = theme === 'day';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDay }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
