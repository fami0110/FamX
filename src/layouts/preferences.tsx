import { useContext } from "react";
import { PanelLeftClose } from "lucide-react";
import AppContext from "@/AppContext";
import type { PreferencesStruct } from "@/lib/utils";
import { defaultPreferences, storage } from "@/lib/utils";

// Fungsi untuk menyimpan perubahan ke localStorage
const updateStorage = async (updatedPrefs: Partial<PreferencesStruct>) => {
  const savedPreferences = await storage.get('preferences');
  const preferences: PreferencesStruct = (savedPreferences) ? 
    JSON.parse(savedPreferences) : defaultPreferences;
  
  const newPreferences = { ...preferences, ...updatedPrefs };
  storage.set('preferences', JSON.stringify(newPreferences));
};

interface ChecklistProps {
  title: string
  keyStorage : string 
  state: any 
  setter: any
}

function Checklist({ title, keyStorage, state, setter }: ChecklistProps) {
  
  // Handler untuk perubahan toggle
  const handleToggleChange = (callback: CallableFunction, key: string, value: boolean) => {
    callback(value);
    updateStorage({ [key]: value });
  };

  return (
    <div className="flex items-center justify-between">
      <label htmlFor="backgroundGrid" className="text-sm px-3 py-1 bg-card border rounded-lg">
        {title}
      </label>

      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          id={keyStorage}
          checked={state} 
          onChange={(e) => handleToggleChange(setter, keyStorage, e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-14 h-8 bg-muted-foreground peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"></div>
      </label>
    </div>
  )
}

export default function Preferences() {
  // Ambil state dari AppContext untuk mengubah pengaturan
  const { 
    isPanelOpen, setIsPanelOpen,
    theme, setTheme,
    searchEngine, setSearchEngine,
    showClock, setShowClock,
    showBattery, setShowBattery,
    showWeather, setShowWeather,
    showShortcuts, setShowShortcuts,
    showTitle, setShowTitle,
    showSubtitle, setShowSubtitle,
    openWhenStart, setOpenWhenStart,
    backgroundGrid, setBackgroundGrid,
    backgroundStars, setBackgroundStars,
    backgroundVignette, setBackgroundVignette,
  } = useContext(AppContext);

  // Daftar mesin pencari yang tersedia
  const searchEngines = [
    "Google",
    "Bing",
    "DuckDuckGo",
    "Yahoo",
    "Brave",
    "Ecosia",
  ];

  // Tema yang tersedia
  const availableThemes = [
    {key: "Default", value: "default"},
    {key: "Claude", value: "claude-light"},
    {key: "Claude Dark", value: "claude-dark"},
    {key: "Spotify", value: "spotify-light"},
    {key: "Spotify Dark", value: "spotify-dark"},
    {key: "Caffeine", value: "caffeine"},
  ];

  // Handler untuk perubahan search engine
  const handleSearchEngineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSearchEngine = e.target.value;
    setSearchEngine(newSearchEngine);
    updateStorage({ searchEngine: newSearchEngine });
  };

  // Handler untuk perubahan theme
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    updateStorage({ theme: newTheme });
  };

  return (
    <>
      {/* Overlay gelap yang muncul saat sidepanel dibuka */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-44 transition-opacity"
          onClick={() => setIsPanelOpen(false)} // Tutup panel saat overlay diklik
        />
      )}

      {/* Sidepanel Settings */}
      <div className={`fixed top-0 left-0 h-full w-100 bg-secondary shadow-lg z-99 transform transition-transform duration-300 ease-in-out 
        ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button 
            onClick={() => setIsPanelOpen(false)}
            className="p-2 rounded-lg hover:bg-accent/20 transition-colors border cursor-pointer"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6 overflow-y-auto pt-2" style={{ maxHeight: "calc(100vh - 4.5rem)" }}>

          {/* Pengaturan Tema */}
          <h3 className="text-lg font-bold mb-0 bg-background/50 p-3">Appearence</h3>
          
          <div className="space-y-4 p-4 mb-0">
            {/* Themes */}
            <label className="flex align-middle w-full p-2 border rounded-md bg-card focus:ring-2 focus:ring-accent text-base">
              <span className="px-3 text-current/50 border-e">Themes</span>
              <select 
                value={theme || "default"} 
                onChange={handleThemeChange}
                className="flex-1 px-3 bg-card focus:outline-none"
              >
                {availableThemes.map(theme => (
                  <option key={theme.key} value={theme.value}>
                    {theme.key}
                  </option>
                ))}
              </select>
            </label>

            {/* Background Grid */}
            <Checklist 
              title="Background Grid" 
              keyStorage="backgroundGrid" 
              state={backgroundGrid} 
              setter={setBackgroundGrid} 
            />

            {/* Background Stars */}
            <Checklist 
              title="Background Stars" 
              keyStorage="backgroundStars" 
              state={backgroundStars} 
              setter={setBackgroundStars} 
            />

            {/* Background Vignette */}
            <Checklist 
              title="Background Vignette" 
              keyStorage="backgroundVignette" 
              state={backgroundVignette} 
              setter={setBackgroundVignette} 
            />

          </div>

          {/* Pengaturan Search Engine */}
          <h3 className="text-lg font-bold mb-0 bg-background/50 p-3">Search</h3>
          
          <div className="space-y-4 p-4 mb-0">
            {/* Search Engines */}
            <label className="flex align-middle w-full p-2 border rounded-md bg-card focus:ring-2 focus:ring-accent text-base">
              <span className="px-3 text-current/50 border-e">Search Engines</span>
              <select 
                value={searchEngine || "Google"} 
                onChange={handleSearchEngineChange}
                className="flex-1 px-3 bg-card focus:outline-none"
              >
                {searchEngines.map(engine => (
                  <option key={engine}>
                    {engine}
                  </option>
                ))}
              </select>
            </label>

            {/* Focus Search */}
            <Checklist 
              title="Focus Search Bar When Start" 
              keyStorage="openWhenStart" 
              state={openWhenStart} 
              setter={setOpenWhenStart} 
            />

          </div>
          
          {/* Pengaturan Tampilan Komponen */}
          <h3 className="text-lg font-bold mb-0 bg-background/50 p-3">Widget Options</h3>

          <div className="space-y-4 p-4 mb-0">
            {/* Show Clock */}
            <Checklist 
              title="Clock" 
              keyStorage="showClock" 
              state={showClock} 
              setter={setShowClock} 
            />
            
            {/* Show Battery */}
            <Checklist 
              title="Battery" 
              keyStorage="showBattery" 
              state={showBattery} 
              setter={setShowBattery} 
            />
            
            {/* Show Weather */}
            <Checklist 
              title="Weather" 
              keyStorage="showWeather" 
              state={showWeather} 
              setter={setShowWeather} 
            />
            
            {/* Show Shortcuts */}
            <Checklist 
              title="Shortcuts" 
              keyStorage="showShortcuts" 
              state={showShortcuts} 
              setter={setShowShortcuts} 
            />

          </div>

          {/* Pengaturan Search Engine */}
          <h3 className="text-lg font-bold mb-0 bg-background/50 p-3">Title</h3>

          <div className="space-y-4 p-4 mb-0">
            {/* Show Title */}
            <Checklist 
              title="Greetings" 
              keyStorage="showTitle" 
              state={showTitle} 
              setter={setShowTitle} 
            />

            {/* Show Subitle */}
            <Checklist 
              title="Subtitle" 
              keyStorage="showSubtitle" 
              state={showSubtitle} 
              setter={setShowSubtitle} 
            />
            
          </div>

        </div>
      </div>
    </>
  );
}