'use client';

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(key);
    if (stored) {
      setValue(JSON.parse(stored));
    }
  }, [key]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, isMounted]);

  return [value, setValue] as const;
}
