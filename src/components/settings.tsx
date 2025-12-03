import { PanelLeft } from "lucide-react";
import AppContext from "@/AppContext";
import { useContext } from "react";

export default function Settings() {
    const { setIsPanelOpen } = useContext(AppContext);

    return (
        <button
            onClick={() => setIsPanelOpen(true)}
            className="p-2 hover:bg-accent/20 transition-colors bg-card border rounded-lg cursor-pointer"
            title="Settings"
        >
            <PanelLeft className="w-5 h-5" />
        </button>
    )
}