import { Grip } from "lucide-react";
import AppContext from "@/AppContext";
import { useContext } from "react";
import { cn } from "@/lib/utils";

export default function DropdownApps() {
    const { isDropdownAppsOpen, setIsDropdownAppsOpen } = useContext(AppContext);

    return (
        <button
			onMouseDown={(e) => e.stopPropagation()}
			onClick={() => {setIsDropdownAppsOpen(!isDropdownAppsOpen)}}
            className={cn(
				"group p-3 rounded-full transition-all duration-300 cursor-pointer text-base", 
				(isDropdownAppsOpen ? "bg-accent/20 text-accent" : "hover:bg-accent/10 hover:text-foreground")
		)}>
            <Grip className={cn(
                "w-6 h-6 transition-transform",
                (isDropdownAppsOpen ? "scale-120" : "group-hover:scale-120")
            )} />
        </button>
    )
}
