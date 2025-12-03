import Battery from "@/components/battery";
import Time from "@/components/time";
import Weather from "@/components/weather";
import AppContext from "@/AppContext";
import { useContext } from "react";

export default function Footer() {
  const { showClock, showWeather, showBattery } = useContext(AppContext);

  return (
    <div className="w-full flex justify-between gap-x-3 p-3 h-16">
      {showClock && (
        <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-lg">
          <Time />
        </div>
      )}

      <div className="grow"></div>

      {showWeather && (
        <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-lg">
          <Weather />
        </div>
      )}
      
      {showBattery && (
        <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-lg z-[-2]">
          <Battery />
        </div>
      )}
    </div>
  )
}
