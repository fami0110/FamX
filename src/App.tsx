"use client"

import { useState, useEffect } from "react";
import Background from "@/layouts/background";
import Header from "@/layouts/header";
import Main from "@/layouts/main";
import Footer from "@/layouts/footer";
import Preferences from "@/layouts/preferences";
import AppContext from "@/AppContext";
import type { PreferencesStruct } from "@/lib/utils";
import { defaultPreferences, storage } from "@/lib/utils";

const savedPreferences: (string | null) = await storage.get('preferences');
const preferences: PreferencesStruct = (savedPreferences) ? 
  JSON.parse(savedPreferences) : defaultPreferences;

export default function App() {
  const [theme, setTheme] = useState<string>(preferences.theme);
  const [searchEngine, setSearchEngine] = useState<string>(preferences.searchEngine);
  const [showClock, setShowClock] = useState<boolean>(preferences.showClock);
  const [showBattery, setShowBattery] = useState<boolean>(preferences.showBattery);
  const [showWeather, setShowWeather] = useState<boolean>(preferences.showWeather);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(preferences.showShortcuts);
  const [showTitle, setShowTitle] = useState<boolean>(preferences.showTitle);
  const [showSubtitle, setShowSubtitle] = useState<boolean>(preferences.showSubtitle);
  const [openWhenStart, setOpenWhenStart] = useState<boolean>(preferences.openWhenStart);
  const [backgroundGrid, setBackgroundGrid] = useState<boolean>(preferences.backgroundGrid);
  const [backgroundStars, setBackgroundStars] = useState<boolean>(preferences.backgroundStars);
  const [backgroundVignette, setBackgroundVignette] = useState<boolean>(preferences.backgroundVignette);

  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  useEffect(() => {
    
  }, []);

  return (
    <AppContext.Provider value={{ 
      theme, setTheme,
      searchEngine, setSearchEngine,
      showClock, setShowClock,
      showBattery, setShowBattery,
      showWeather, setShowWeather,
      showShortcuts, setShowShortcuts,
      isPanelOpen, setIsPanelOpen,
      showTitle, setShowTitle,
      showSubtitle, setShowSubtitle,
      openWhenStart, setOpenWhenStart,
      backgroundGrid, setBackgroundGrid,
      backgroundStars, setBackgroundStars,
      backgroundVignette, setBackgroundVignette
    }}>
      <Background />

      <main className="fixed z-2 min-h-screen min-w-screen bg-transparent text-foreground flex flex-col items-center justify-center overflow-hidden">
        <Header />
        <Main />
        <Footer />
        <Preferences />
      </main>
    </AppContext.Provider>
  )
}
