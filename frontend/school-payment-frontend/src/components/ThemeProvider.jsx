import { useEffect, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Safe localStorage access
    if (typeof window !== 'undefined') {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    
    // Safe localStorage access
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}