import type React from "react";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { getFaviconUrl } from "@/lib/utils";

interface Shortcut {
	title: string;
	url: string;
	icon: string;
}

interface ShortcutModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (shortcut: Shortcut) => void;
	initialData?: Shortcut | null;
}

export default function ShortcutModal({ isOpen, onClose, onSubmit, initialData }: ShortcutModalProps) {
	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");
	const [icon, setIcon] = useState("");
	const [isFetchingFavicon, setIsFetchingFavicon] = useState(false);
	const [faviconError, setFaviconError] = useState(false);

	useEffect(() => {
		// Choose if it edit or add new data
		if (initialData) {
			setTitle(initialData.title);
			setUrl(initialData.url);
			setIcon(initialData.icon);
		} else {
			setTitle("");
			setUrl("");
			setIcon("🌐");
		}
		setFaviconError(false);
	}, [initialData, isOpen]);

	useEffect(() => {
		if (url) {
			const fetchFavicon = async () => {
				setIsFetchingFavicon(true);
				setFaviconError(false);
				try {
					const faviconUrl = await getFaviconUrl(url);
					
					setIcon(faviconUrl);
				} catch (error) {
					console.error("Failed to fetch favicon:", error);
					setFaviconError(true);
				} finally {
					setIsFetchingFavicon(false);
				}
			};

			const debounceTimer = setTimeout(fetchFavicon, 500);
			return () => clearTimeout(debounceTimer);
		}
	}, [url]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim() && url.trim()) {
			onSubmit({ title, url, icon });
			setTitle("");
			setUrl("");
			setIcon("📌");
		}
	};

	if (!isOpen) return null;

	const isFaviconUrl = icon.startsWith("http");

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-border">
					<h2 className="text-lg font-semibold text-foreground">{initialData ? "Edit Shortcut" : "Add Shortcut"}</h2>
					<button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors cursor-pointer">
						<X className="w-5 h-5 text-muted-foreground" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{/* Icon Preview */}
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">Icon Preview</label>
						<div className="w-16 h-16 rounded-full border border-border bg-card flex items-center justify-center">
							{isFetchingFavicon ? <Loader2 className="w-6 h-6 text-accent animate-spin" /> : isFaviconUrl ? <img src={icon} /> : <span className="text-2xl">{icon}</span>}
						</div>
					</div>

					{/* Title Input */}
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">Title</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="-"
							className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
						/>
					</div>

					{/* URL Input */}
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">URL</label>
						<input
							type="url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://example.com"
							className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
						/>
						{isFetchingFavicon && <p className="text-xs text-muted-foreground mt-1">Fetching favicon...</p>}
						{faviconError && !isFetchingFavicon && <p className="text-xs text-destructive mt-1">Could not fetch favicon. Choose an emoji instead.</p>}
					</div>

					{/* Buttons */}
					<div className="flex gap-3 pt-4">
						<button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors cursor-pointer text-sm">
							Cancel
						</button>
						<button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium cursor-pointer text-sm">
							{initialData ? "Update" : "Add"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
