import { useRef, useEffect, useContext, type ReactNode } from "react";
import AppContext from "@/AppContext";
import { cn } from "@/lib/utils";

import GoogleIcon from "@/assets/google/google.svg?react";
import GeminiIcon from "@/assets/google/google-gemini.svg?react";
import YouTubeIcon from "@/assets/google/youtube.svg?react";
import MeetIcon from "@/assets/google/google-meets.svg?react";
import MapsIcon from "@/assets/google/google-maps.svg?react";
import GmailIcon from "@/assets/google/gmail.svg?react";
import DriveIcon from "@/assets/google/drive.svg?react";
import CalendarIcon from "@/assets/google/google-calendar.svg?react";
import ClassroomIcon from "@/assets/google/google-classroom.svg?react";
import DocsIcon from "@/assets/google/google-docs.svg?react";
import SheetsIcon from "@/assets/google/google-sheets.svg?react";
import SlidesIcon from "@/assets/google/google-slides.svg?react";
import FormsIcon from "@/assets/google/google-forms.svg?react";
import KeepIcon from "@/assets/google/google-keep.svg?react";
import NotebookLMIcon from "@/assets/google/notebooklm.svg?react";
import TranslateIcon from "@/assets/google/google-translate.svg?react";
import PhotosIcon from "@/assets/google/google-photo.svg?react";
import ChromeWebStoreIcon from "@/assets/google/chrome-web-store.svg?react";
import ColabIcon from "@/assets/google/google-colaboratory.svg?react";
import CloudIcon from "@/assets/google/google-cloud.svg?react";
import PasswordManagerIcon from "@/assets/google/password-manager.svg?react";


interface AppItem {
	name: string;
	url: string;
	icon: ReactNode;
}

interface AppCategory {
	title: string;
	apps: AppItem[];
}

const appCategories: AppCategory[] = [
	{
		title: "Essentials",
		apps: [
            { name: "Account", url: "https://myaccount.google.com", icon: <img src="https://lh3.googleusercontent.com/ogw/AF2bZygEZCrfJ7tYQKMh6k_SwVTOw6nVHD0oxJEOxCw71GuXBSk=s32-c-mo" /> },
			{ name: "Search", url: "https://google.com", icon: <GoogleIcon /> },
			{ name: "Gemini", url: "https://gemini.google.com", icon: <GeminiIcon /> },
			{ name: "YouTube", url: "https://youtube.com", icon: <YouTubeIcon /> },
            { name: "Meet", url: "https://meet.google.com", icon: <MeetIcon /> },
			{ name: "Maps", url: "https://maps.google.com", icon: <MapsIcon /> },
			{ name: "Gmail", url: "https://mail.google.com", icon: <GmailIcon /> },
			{ name: "Drive", url: "https://drive.google.com", icon: <DriveIcon /> },
			{ name: "Calendar", url: "https://calendar.google.com", icon: <CalendarIcon /> },
			{ name: "Classroom", url: "https://classroom.google.com", icon: <ClassroomIcon /> },
		],
	},
	{
		title: "Productivity",
		apps: [
			{ name: "Docs", url: "https://docs.google.com/document", icon: <DocsIcon /> },
			{ name: "Sheets", url: "https://docs.google.com/spreadsheets", icon: <SheetsIcon /> },
			{ name: "Slides", url: "https://docs.google.com/presentation", icon: <SlidesIcon /> },
			{ name: "Forms", url: "https://docs.google.com/forms", icon: <FormsIcon /> },
			{ name: "Keep", url: "https://keep.google.com", icon: <KeepIcon /> },
			{ name: "NotebookLM", url: "https://notebooklm.google.com", icon: <NotebookLMIcon /> },
		],
	},
	{
		title: "Tools & Utilities",
		apps: [
			{ name: "Translate", url: "https://translate.google.com", icon: <TranslateIcon /> },
			{ name: "Photos", url: "https://photos.google.com", icon: <PhotosIcon /> },
			{ name: "Chrome Web Store", url: "https://chrome.google.com/webstore", icon: <ChromeWebStoreIcon /> },
            { name: "Colab", url: "https://colab.google/", icon: <ColabIcon /> },
            { name: "Cloud", url: "https://cloud.google.com/", icon: <CloudIcon /> },
			{ name: "Password Manager", url: "https://passwords.google.com", icon: <PasswordManagerIcon /> },
		],
	},
];

export default function Apps() {
	const { isDropdownAppsOpen, setIsDropdownAppsOpen } = useContext(AppContext);
	const menuRef = useRef<HTMLDivElement>(null);

	// Handle Click Outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsDropdownAppsOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setIsDropdownAppsOpen]);

	return (
		<div
			ref={menuRef}
			className={cn(
				"apps absolute top-16 right-4 mt-4 w-[320px] origin-top-right rounded-2xl z-50 overflow-hidden p-[3px]", 
				isDropdownAppsOpen ? "apps-active" : "",
			)}
		>
			<div 
				className="absolute"
				style={{
					background: 'conic-gradient(from 0deg, #EA4335, #FBBC05, #34A853, #4285F4, #EA4335)',
					animation: 'border-spin 4s linear infinite',
					width: '100%', 
					height: '100%',
				}}
			/>

			<div className="relative z-10 bg-card/95 backdrop-blur-xl rounded-xl h-full w-full max-h-[500px] overflow-y-auto flex flex-col gap-y-3 py-5 px-4 shadow-2xl shadow-black/50">
				{appCategories.map((category, catIndex) => (
					<div key={category.title}>
						<h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">
							{category.title}
						</h3>
						<div className="grid grid-cols-3 gap-2">
							{category.apps.map((app) => (
								<a key={app.name} href={app.url} className="flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all hover:bg-accent/10 hover:scale-105 duration-200 group gap-3">
									<div className="icon w-10 h-10 flex items-center justify-center rounded-full overflow-hidden transition-all group-hover:ring-2 ring-accent/50 ring-offset-4 ring-offset-card">
										{app.icon}
									</div>
									<span className={cn("text-sm text-muted-foreground group-hover:text-foreground font-medium text-center line-clamp-1 group-hover:line-clamp-2")}>
										{app.name}
									</span>
								</a>
							))}
						</div>
						{catIndex < appCategories.length - 1 && 
							<div className="my-2 border-t border-accent/20"></div>
						}
					</div>
				))}
			</div>
		</div>
	);
}
