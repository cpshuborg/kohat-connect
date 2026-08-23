import { useCallback, useEffect, useState } from "react";
import {
  dismissLocationPrompt,
  isLocationPromptDismissed,
  loadUserLocation,
  requestBrowserLocation,
  type UserLocation,
} from "@/lib/user-location";

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = loadUserLocation();
    setLocation(saved);
    setShowPrompt(!saved && !isLocationPromptDismissed());

    const onUpdate = (event: Event) => {
      const detail = (event as CustomEvent<UserLocation>).detail;
      setLocation(detail ?? loadUserLocation());
      setShowPrompt(false);
    };
    window.addEventListener("kohat-location-updated", onUpdate);
    return () => window.removeEventListener("kohat-location-updated", onUpdate);
  }, []);

  const requestLocation = useCallback(async () => {
    const saved = loadUserLocation();
    if (saved) {
      setLocation(saved);
      setShowPrompt(false);
      return saved;
    }
    try {
      setLoading(true);
      const next = await requestBrowserLocation();
      setLocation(next);
      setShowPrompt(false);
      return next;
    } finally {
      setLoading(false);
    }
  }, []);

  const dismissPrompt = useCallback(() => {
    dismissLocationPrompt();
    setShowPrompt(false);
  }, []);

  return {
    location,
    showPrompt,
    loading,
    requestLocation,
    dismissPrompt,
  };
}
