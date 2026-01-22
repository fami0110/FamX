import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// ============== CONST AND TYPES ============== //

export type PreferencesStruct = {
  theme: string;
  searchEngine: string;
  showClock: boolean;
  showBattery: boolean;
  showWeather: boolean;
  showShortcuts: boolean;
  showTitle: boolean;
  showSubtitle: boolean;
  openWhenStart: boolean;
  backgroundGrid: boolean;
  backgroundStars: boolean;
  backgroundVignette: boolean;
}

export const defaultPreferences: PreferencesStruct = {
  theme: "default",
  searchEngine: "Google",
  showClock: true,
  showBattery: true,
  showWeather: true,
  showShortcuts: true,
  showTitle: true,
  showSubtitle: true,
  openWhenStart: true,
  backgroundGrid: true,
  backgroundStars: true,
  backgroundVignette: true,
};

export type ShortcutStruct = {
  id: string
  title: string
  url: string
  icon: string
}

export const defaultShortcuts: ShortcutStruct[] = [
  {
    id: "1",
    title: "Whatsapp",
    url: "https://web.whatsapp.com/",
    icon: "https://web.whatsapp.com/favicon.ico",
  },
  {
    id: "2",
    title: "GitHub",
    url: "https://github.com",
    icon: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
  },
  {
    id: "3",
    title: "YouTube",
    url: "https://youtube.com",
    icon: "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
  },
  {
    id: "4",
    title: "Twitter",
    url: "https://twitter.com",
    icon: "https://www.google.com/s2/favicons?domain=twitter.com&sz=128",
  },
]

// ============== FUNCTIONS ============== //

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFaviconUrl(urlString: string): string {
  try {
    const url = new URL(urlString);
    const domain = url.hostname;

    const faviconSources = [
      `https://${domain}/favicon.ico`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    ]

    // Return the Google favicon as it's most reliable
    return faviconSources[1];
  } catch {
    // Fallback to a default icon if URL parsing fails
    return "https://www.google.com/s2/favicons?domain=example.com&sz=128";
  }
}

export const storage = {
  "get": async (key: string): Promise<any> => {
    try {
      const result = await chrome.storage.sync.get();
      return (result[key]) ? result[key] : null;
    } catch (error) {
      console.error("Error retrieving data from storage.sync:", error);
      return localStorage.getItem(key) || null;
    }
  },

  "set": async (key: string, data: any): Promise<void> => {
    try {
      await chrome.storage.sync.set({[key]: data});
    } catch (error) {
      console.error("Error setting data to storage.sync:", error);
      localStorage.setItem(key, data);
    }
  }
}