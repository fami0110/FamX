import Settings from "@/components/settings";
import DropdownApps from "@/components/dropdown-apps";

export default function Header() {

	return (
		<div className="w-full flex justify-between gap-x-4 p-4 h-16 z-0">
			<div className="flex items-center gap-2 h-min">
				<Settings />
			</div>
			<div className="grow"></div>
			<div className="flex items-center gap-2 h-min">
				<DropdownApps />
			</div>
		</div>
	);
}
