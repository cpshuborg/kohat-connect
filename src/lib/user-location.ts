export type UserLocation = {
  lat: number;
  lng: number;
  updatedAt: number;
};

const LOCATION_KEY = "kohat-user-location";
const PROMPT_KEY = "kohat-location-prompt-dismissed";

export function loadUserLocation(): UserLocation | null {
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserLocation;
    if (typeof parsed.lat !== "number" || typeof parsed.lng !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveUserLocation(lat: number, lng: number) {
  const value: UserLocation = { lat, lng, updatedAt: Date.now() };
  localStorage.setItem(LOCATION_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("kohat-location-updated", { detail: value }));
  return value;
}

export function isLocationPromptDismissed() {
  return localStorage.getItem(PROMPT_KEY) === "1";
}

export function dismissLocationPrompt() {
  localStorage.setItem(PROMPT_KEY, "1");
}

export function requestBrowserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location is not supported in this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(saveUserLocation(pos.coords.latitude, pos.coords.longitude)),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new Error("Location access was denied."));
        } else {
          reject(new Error("Could not get your location. Try again."));
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 },
    );
  });
}
