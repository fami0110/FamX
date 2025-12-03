import { useState, useEffect } from "react";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  MapPin,
  Loader2,
  AlertTriangle,
} from "lucide-react";

// Define a type for our weather data for better type safety
type WeatherData = {
  location: string;
  temperature: number;
  condition: string;
  icon: React.ReactNode;
};

// A simple mapping from weather codes to icons and descriptions
const getWeatherInfo = (code: number) => {
  // Based on Open-Meteo's WMO Weather interpretation codes
  if (code === 0) 
    return { icon: <Sun className="h-5 w-5" />, condition: "Clear" };
  if (code >= 1 && code <= 3)
    return { icon: <Cloud className="h-5 w-5" />, condition: "Mainly Clear" };
  if (code >= 45 && code <= 48)
    return { icon: <Cloud className="h-5 w-5" />, condition: "Foggy" };
  if (code >= 51 && code <= 67)
    return { icon: <CloudRain className="h-5 w-5" />, condition: "Drizzle/Rain" };
  if (code >= 71 && code <= 77)
    return { icon: <CloudSnow className="h-5 w-5" />, condition: "Snow" };
  if (code >= 80 && code <= 82)
    return { icon: <CloudRain className="h-5 w-5" />, condition: "Rain Showers" };
  if (code >= 85 && code <= 86)
    return { icon: <CloudSnow className="h-5 w-5" />, condition: "Snow Showers" };
  if (code >= 95 && code <= 99)
    return { icon: <CloudRain className="h-5 w-5" />, condition: "Thunderstorm" };
    
  // Default for unknown codes
  return { icon: <Cloud className="h-5 w-5" />, condition: "Unknown" };
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Get user's location from IP using ipwho.is
        const ipResponse = await fetch(`https://ipwho.is/`);
        if (!ipResponse.ok)
          throw new Error(`HTTP error! status: ${ipResponse.status}`);

        const ipData = await ipResponse.json();
        
        if (!ipData.success)
          throw new Error(ipData.message || "Failed to fetch location data.");

        const { latitude, longitude, city } = ipData;

        // 2. Get weather data using the coordinates
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        if (!weatherResponse.ok) 
          throw new Error(`HTTP error! status: ${weatherResponse.status}`);

        const weatherData = await weatherResponse.json();
        const currentWeather = weatherData.current_weather;

        // 3. Map the weather code to an icon and description
        const { icon, condition } = getWeatherInfo(currentWeather.weathercode);

        setWeather({
          location: city,
          temperature: Math.round(currentWeather.temperature),
          condition,
          icon,
        });
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
        setError("Could not fetch weather data!");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking weather...
      </span>
    );
  }

  if (error || !weather) {
    return (
      <span className="flex items-center gap-2 text-sm font-medium text-destructive">
        <AlertTriangle className="h-4 w-4" />
        {error || "Weather unavailable"}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2 text-sm font-medium">
      {weather.icon}
      <span>{weather.temperature}°C</span>
      <span className="text-muted-foreground">|</span>
      <span className="flex items-center gap-1 text-muted-foreground">
        <MapPin className="h-3 w-3" />
        {weather.location}
      </span>
    </span>
  );
}