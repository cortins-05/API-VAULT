'use client';
import { ThemeSwitcher } from '@/components/shadcn/theme-switcher';
import { useState } from 'react';
const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  return (
    <ThemeSwitcher defaultValue="system" onChange={setTheme} value={theme} />
  );
};
export default ThemeToggle;