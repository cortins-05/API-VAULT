'use client';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Monitor, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
type ThemeKey = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'theme-preference';
const isThemeKey = (value: string | null): value is ThemeKey =>
  value === 'light' || value === 'dark' || value === 'system';
const themes = [
  {
    key: 'light',
    icon: Sun,
    label: 'Light theme',
  },
  {
    key: 'dark',
    icon: Moon,
    label: 'Dark theme',
  },
];
export type ThemeSwitcherProps = {
  value?: ThemeKey;
  onChange?: (theme: ThemeKey) => void;
  defaultValue?: ThemeKey;
  className?: string;
};
export const ThemeSwitcher = ({
  value,
  onChange,
  defaultValue = 'system',
  className,
}: ThemeSwitcherProps) => {
  const [theme, setTheme] = useControllableState<ThemeKey>({
    defaultProp: defaultValue,
    prop: value,
    onChange,
  });
  const [mounted, setMounted] = useState(false);
  const handleThemeClick = useCallback(
    (themeKey: ThemeKey) => {
      setTheme(themeKey);
    },
    [setTheme]
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Load stored preference only when uncontrolled
    if (value === undefined) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isThemeKey(stored)) {
        setTheme(stored);
      }
    }
    setMounted(true);
  }, [setTheme, value]);
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
      const root = document.documentElement;
      root.classList.toggle('dark', resolved === 'dark');
      root.style.colorScheme = resolved === 'dark' ? 'dark' : 'light';
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch (error) {
        // ignore storage errors
      }
    };
    applyTheme();
    const listener = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [theme, mounted]);
  if (!mounted) {
    return null;
  }
  return (
    <div
      className={cn(
        'relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border',
        className
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;
        return (
          <button
            aria-label={label}
            className="relative h-6 w-6 rounded-full"
            key={key}
            onClick={() => handleThemeClick(key as 'light' | 'dark' | 'system')}
            type="button"
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-secondary"
                layoutId="activeTheme"
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
            <Icon
              className={cn(
                'relative z-10 m-auto h-4 w-4',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};