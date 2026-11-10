"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useBrowserState<T>(key: string, initial: T, isValid: (value: unknown) => value is T) {
  const current = useRef(initial);
  const writable = useRef(true);
  const [value, setValue] = useState(initial);
  const [status, setStatus] = useState<"loading" | "browser" | "session">("loading");

  const decode = useCallback((raw: string | null) => {
    if (raw === null) return initial;
    try {
      const parsed: unknown = JSON.parse(raw);
      return isValid(parsed) ? parsed : initial;
    } catch {
      return initial;
    }
  }, [initial, isValid]);

  useEffect(() => {
    function receive(event: StorageEvent) {
      if (!writable.current || event.storageArea !== window.localStorage || (event.key !== key && event.key !== null)) return;
      current.current = decode(event.newValue);
      setValue(current.current);
    }

    try {
      current.current = decode(window.localStorage.getItem(key));
      setValue(current.current);
      setStatus("browser");
    } catch {
      writable.current = false;
      setStatus("session");
    }
    window.addEventListener("storage", receive);
    return () => window.removeEventListener("storage", receive);
  }, [key, decode]);

  function update(change: (previous: T) => T) {
    let base = current.current;
    if (writable.current) {
      try { base = decode(window.localStorage.getItem(key)); } catch { writable.current = false; }
    }
    const next = change(base);
    current.current = next;
    setValue(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
      writable.current = true;
      setStatus("browser");
    } catch {
      writable.current = false;
      setStatus("session");
    }
  }

  return { value, status, update };
}
