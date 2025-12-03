// src/app/main.tsx (or your Main component file)

import SearchBar from "@/components/search-bar";
import ShortcutGrid from "@/components/shortcut-grid";
import Greetings from "@/components/greetings";
import Subtitle from "@/components/subtitle";
import AppContext from "@/AppContext";
import { useContext } from "react";

export default function Main() {
    const { showShortcuts, showTitle, showSubtitle } = useContext(AppContext);

    return (
        <div className="w-full flex flex-col items-center justify-center flex-1">
            <div className="mb-12 text-center space-y-2">
                {showTitle && (<Greetings />)}
                {showSubtitle && (<Subtitle />)}
            </div>

            <div className="w-full max-w-2xl mb-12">
                <SearchBar />
            </div>

            {showShortcuts && (
                <div className="w-full">
                    <ShortcutGrid />
                </div>
            )}
        </div>
    );
}