import { useContext } from "react";
import { PanelLeftClose } from "lucide-react";
import AppContext from "@/AppContext";
import type { PreferencesStruct } from "@/lib/utils";
import { defaultPreferences, storage } from "@/lib/utils";

export default function Preferences() {
  // State untuk mengontrol apakah sidepanel terbuka atau tidak
  const { 
    isPanelOpen, setIsPanelOpen,
    theme, setTheme,
  } = useContext(AppContext);

  // Ambil fungsi dan nilai dari AppContext untuk mengubah pengaturan
  const { 
    searchEngine, setSearchEngine,
    showClock, setShowClock,
    showBattery, setShowBattery,
    showWeather, setShowWeather,
    showShortcuts, setShowShortcuts,
    showTitle, setShowTitle,
    showSubtitle, setShowSubtitle,
    openWhenStart, setOpenWhenStart
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

  // Fungsi untuk menyimpan perubahan ke localStorage
  const updateStorage = async (updatedPrefs: Partial<PreferencesStruct>) => {
    const savedPreferences = await storage.get('preferences');
    const preferences: PreferencesStruct = (savedPreferences) ? 
      JSON.parse(savedPreferences) : defaultPreferences;
    
    const newPreferences = { ...preferences, ...updatedPrefs };
    storage.set('preferences', JSON.stringify(newPreferences));
  };

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

  // Handler untuk perubahan toggle
  const handleToggleChange = (callback: CallableFunction, key: keyof PreferencesStruct, value: boolean) => {
    // Update state di context
    callback(value);

    // Simpan ke localStorage
    updateStorage({ [key]: value });
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
        
        <div className="space-y-6 overflow-y-auto h-full pt-2">
          {/* Pengaturan Tema */}
          <h3 className="text-lg font-bold mb-0 bg-background/50 p-3">Theme</h3>
          
          <div className="space-y-4 p-4 mb-0">
            <select 
              value={theme || "default"} 
              onChange={handleThemeChange}
              className="w-full p-2 mb-0 border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {availableThemes.map(theme => (
                <option key={theme.key} value={theme.value}>
                  {theme.key}
                </option>
              ))}
            </select>
          </div>

          {/* Pengaturan Search Engine */}
          <h3 className="text-lg font-bold mb-0 bg-background/50 p-3">Search</h3>
          
          <div className="space-y-4 p-4 mb-0">
            <select 
              value={searchEngine || "Google"} 
              onChange={handleSearchEngineChange}
              className="w-full p-2 border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {searchEngines.map(engine => (
                <option key={engine}>
                  {engine}
                </option>
              ))}
            </select>

            {/* Focus Search */}
            <div className="flex items-center justify-between">
              <label htmlFor="showShortcuts" className="text-sm px-3 py-1 bg-card border rounded-lg">
                Focus Search Bar When Start
              </label>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="showShortcuts" 
                  checked={openWhenStart} 
                  onChange={(e) => handleToggleChange(setOpenWhenStart, "openWhenStart", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-muted-foreground peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>

          </div>
          
          {/* Pengaturan Tampilan Komponen */}
          <h3 className="text-lg font-bold mb-0 bg-background/50 p-3">Widget Options</h3>

          <div className="space-y-4 p-4 mb-0">
            {/* Show Clock */}
            <div className="flex items-center justify-between">
              <label htmlFor="showClock" className="text-sm px-3 py-1 bg-card border rounded-lg">
                Clock
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="showClock" 
                  checked={showClock} 
                  onChange={(e) => handleToggleChange(setShowClock, "showClock", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-muted-foreground peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
            
            {/* Show Battery */}
            <div className="flex items-center justify-between">
              <label htmlFor="showBattery" className="text-sm px-3 py-1 bg-card border rounded-lg">
                Battery
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="showBattery" 
                  checked={showBattery} 
                  onChange={(e) => handleToggleChange(setShowBattery, "showBattery", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-muted-foreground peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
            
            {/* Show Weather */}
            <div className="flex items-center justify-between">
              <label htmlFor="showWeather" className="text-sm px-3 py-1 bg-card border rounded-lg">
                Weather
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="showWeather" 
                  checked={showWeather} 
                  onChange={(e) => handleToggleChange(setShowWeather, "showWeather", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-muted-foreground peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
            
            {/* Show Shortcuts */}
            <div className="flex items-center justify-between">
              <label htmlFor="showShortcuts" className="text-sm px-3 py-1 bg-card border rounded-lg">
                Shortcuts
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="showShortcuts" 
                  checked={showShortcuts} 
                  onChange={(e) => handleToggleChange(setShowShortcuts, "showShortcuts", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-muted-foreground peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>

          </div>

          {/* Pengaturan Search Engine */}
          <h3 className="text-lg font-bold mb-0 bg-background/50 p-3">Title</h3>

          <div className="space-y-4 p-4 mb-0">
            {/* Show Title */}
            <div className="flex items-center justify-between">
              <label htmlFor="showShortcuts" className="text-sm px-3 py-1 bg-card border rounded-lg">
                Greetings
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="showShortcuts" 
                  checked={showTitle} 
                  onChange={(e) => handleToggleChange(setShowTitle, "showTitle", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-muted-foreground peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>

            {/* Show Subitle */}
            <div className="flex items-center justify-between">
              <label htmlFor="showShortcuts" className="text-sm px-3 py-1 bg-card border rounded-lg">
                Subtitle
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="showShortcuts" 
                  checked={showSubtitle} 
                  onChange={(e) => handleToggleChange(setShowSubtitle, "showSubtitle", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-muted-foreground peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}