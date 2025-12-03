import Settings from "@/components/settings";

export default function Header() {

	return (
		<div className="w-full flex justify-between gap-x-3 p-3 h-16 z-0">
			<div className="flex items-center gap-2 px-1 py-2">
				<Settings />
			</div>
			<div className="grow"></div>
			{/* <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-lg">
				
			</div> */}
		</div>
	);
}
