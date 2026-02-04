import { useEffect, useRef, useCallback, useContext, useReducer, useMemo } from "react";
import { Search, History, Globe } from "lucide-react";
import { getFaviconUrl } from "@/lib/utils";
import AppContext from "@/AppContext";
import "@/styles/search.css";

import GeminiIcon from "@/assets/ai/gemini.svg?react";
import ChatGptIcon from "@/assets/ai/chatgpt.svg?react";
import ZaiIcon from "@/assets/ai/z.svg?react";
import ClaudeIcon from "@/assets/ai/claude.svg?react";
import GrokIcon from "@/assets/ai/grok.svg?react";
import PerplexityIcon from "@/assets/ai/perplexity.svg?react";

interface Suggestion {
	text: string;
	isAI: boolean;
	url?: string;
	icon?: React.ReactNode;
}

const aiSuggestions: Suggestion[] = [
	{
		name: "Gemini",
		url: "https://www.google.com/search?udm=50&source=searchlabs&q={}",
		icon: (
            <GeminiIcon className="w-8 h-8" />
		),
	},
	{
		name: "ChatGPT",
		url: "https://chatgpt.com/?q={}",
		icon: (
			<ChatGptIcon className="w-8 h-8" />
		),
	},
	{
		name: "Z.ai",
		url: "https://chat.z.ai/?q={}",
		icon: (
			<ZaiIcon className="w-8 h-8" />
		),
	},
	{
		name: "Claude",
		url: "https://claude.ai/new?q={}",
		icon: (
			<ClaudeIcon className="w-8 h-8" />
		),
	},
	{
		name: "Grok",
		url: "https://grok.com/c?q={}",
		icon: (
			<GrokIcon className="w-8 h-8" />
		),
	},
	{
		name: "Perplexity",
		url: "https://www.perplexity.ai/search?q={}",
		icon: (
			<PerplexityIcon className="w-8 h-8" />
		),
	},
].map(
	(option): Suggestion => ({
		text: `Search ${option.name}`,
		isAI: true,
		url: option.url,
		icon: option.icon,
	})
);

const searchEngineUrls: { [key: string]: string } = {
	Google: "https://www.google.com/search",
	Bing: "https://www.bing.com/search",
	DuckDuckGo: "https://duckduckgo.com/",
	Yahoo: "https://search.yahoo.com/search",
	Brave: "https://search.brave.com/search",
	Ecosia: "https://www.ecosia.org/search",
};


// Reducer Interfaces & Default Values

interface State {
	query: string;
	isFocused: boolean;
	suggestions: Suggestion[];
	selectedSuggestionIndex: number;
	isLoadingSuggestions: boolean;
	alert: { show: boolean; message: string };
}

type Action =
	| { type: "SET_QUERY"; payload: string }
	| { type: "SET_IS_FOCUSED"; payload: boolean }
	| { type: "SET_SUGGESTIONS"; payload: Suggestion[] }
	| { type: "SET_SELECTED_SUGGESTION_INDEX"; payload: number }
	| { type: "SET_IS_LOADING_SUGGESTIONS"; payload: boolean }
	| { type: "SHOW_ALERT"; payload: string }
	| { type: "HIDE_ALERT" };

const initialState: State = {
	query: "",
	isFocused: false,
	suggestions: [],
	selectedSuggestionIndex: -1,
	isLoadingSuggestions: false,
	alert: { show: false, message: "" },
};

// Helper Functions
async function copyToClipboard(text: string, dispatch: React.Dispatch<Action>) {
	try {
		await navigator.clipboard.writeText(text);
		dispatch({ type: "SHOW_ALERT", payload: "Copied to clipboard" });
		setTimeout(() => dispatch({ type: "HIDE_ALERT" }), 3000);
	} catch (err) {
		console.error("Failed to copy text: ", err);
	}
}

const isQueryLikePrompt = (query: string): boolean => {
	const trimmedQuery = query.trim();
	const wordCount = trimmedQuery.split(/\s+/).filter(Boolean).length;
	const charCount = trimmedQuery.length;

	return wordCount > 2 && charCount > 15;
};

const isValidUrl = (str: string) => {
  const pattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,11}([/?#].*)?$/i;
  return pattern.test(str);
};

// Suggestion Item Components

interface SuggestionItemProps {
	suggestion: Suggestion;
	index: number;
	selectedIndex: number;
	onClick: () => void;
	query: string;
}

function SuggestionItem({ suggestion, index, selectedIndex, onClick, query }: SuggestionItemProps) {
	const isMathResult = /=\s*\d+/.test(suggestion.text) && !suggestion.isAI;
	const isUrlHistory = suggestion.url && !suggestion.isAI;
	const isSelected = index === selectedIndex;

	const content = useMemo(() => {
		if (suggestion.isAI) {
			return suggestion.text === "Search AI" ? (
				<div className="flex items-center gap-2 justify-between">
					<span>{suggestion.icon}</span>
					<div className="grow flex items-center gap-1">
						<span>{suggestion.text}</span>
					</div>
					<span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded">AI</span>
				</div>
			) : (
				<div className="flex items-center gap-2 justify-between">
					<span>{suggestion.icon}</span>
					<div className="grow flex items-center gap-1">
						<span>{suggestion.text}</span>
						<span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded">AI</span>
					</div>
					<span className="text-neutral-500 text-sm">"{query.length > 20 ? `${query.replace(/^!/, "").trim().substring(0, 20)}...` : query.replace(/^!/, "").trim()}"</span>
				</div>
			);
		}
		if (isMathResult) {
			return (
				<div className="flex items-center gap-2 justify-between">
					<span className="flex items-center justify-center px-3 py-px bg-accent/20 text-accent text-2xl rounded-sm fw-medium">=</span>
					<span className="text-accent text-2xl">{suggestion.text.split("=")[1].trim()}</span>
				</div>
			);
		}
		if (isUrlHistory && suggestion.url) {
			return (
				<div className="flex items-center gap-2 justify-between">
					<History className="w-4 h-4 text-orange-500" />
					<div className="flex-1">
						<h3>{(suggestion.text.length > 56) ? `${suggestion.text.replace(/^!/, "").trim().substring(0, 56)}...` : suggestion.text}</h3>
						<p className="text-primary text-xs">{(suggestion.url.length > 75) ? `${suggestion.url?.replace(/^!/, "").trim().substring(0, 75)}...` : suggestion.url}</p>
					</div>
					<span className="flex items-center justify-center w-8 h-8 bg-accent/20 text-accent text-2xl rounded-sm fw-medium">
						<img src={getFaviconUrl(suggestion.url)} className="max-w-[60%] rounded-xl" alt="favicon" />
					</span>
				</div>
			);
		}
		return (
			<div className="flex items-center gap-2">
				<Search className="w-4 h-4 text-muted-foreground" />
				<span>{suggestion.text}</span>
			</div>
		);
	}, [suggestion, isMathResult, isUrlHistory, query]);

	return (
		<div
			className={`px-4 py-3 cursor-pointer transition-colors 
				${isSelected ? "bg-accent/20 text-accent-foreground" : "hover:bg-accent/10 text-foreground"}
				${(suggestion.isAI || isMathResult || isUrlHistory) ? "border-b border-accent/10" : ""}
			`}
			data-index={index}
			onClick={onClick}
		>
			{content}
		</div>
	);
}


// Search Bar Main Component

export default function SearchBar() {
	const { searchEngine, openWhenStart } = useContext(AppContext);

	const [state, dispatch] = useReducer(
		(state: State, action: Action): State => {
			switch (action.type) {
				case "SET_QUERY":
					return { ...state, query: action.payload };
				case "SET_IS_FOCUSED":
					return { ...state, isFocused: action.payload };
				case "SET_SUGGESTIONS":
					return { ...state, suggestions: action.payload };
				case "SET_SELECTED_SUGGESTION_INDEX":
					return { ...state, selectedSuggestionIndex: action.payload };
				case "SET_IS_LOADING_SUGGESTIONS":
					return { ...state, isLoadingSuggestions: action.payload };
				case "SHOW_ALERT":
					return { ...state, alert: { show: true, message: action.payload } };
				case "HIDE_ALERT":
					return { ...state, alert: { ...state.alert, show: false } };
				default:
					return state;
			}
		},
		{
			...initialState,
			isFocused: openWhenStart,
		}
	);
	const { query, isFocused, suggestions, selectedSuggestionIndex, isLoadingSuggestions, alert } = state;

	const inputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const getAutocompleteSuggestionText = useCallback(
		(suggestions: Suggestion[], selectedSuggestionIndex: number) => {
			const startIndex = (selectedSuggestionIndex >= 0) ? selectedSuggestionIndex : 0;
			
			for (let i = startIndex; i < suggestions.length; i++) {
				const s = suggestions[i];
				if (!s.url && !s.isAI && s.text !== "Search AI") 
					return s.text;
			}

			return null;
		}, []
	);

	const searchQuery = useCallback(
		(queryString: string) => {
			const q = queryString.trim();

			if (isValidUrl(q)) {
				const url = q.includes('://') ? q : `https://${q}`;
				window.open(url, "_self");
			} else {
				const baseUrl = searchEngineUrls[searchEngine] || searchEngineUrls["Google"];
				window.open(`${baseUrl}?q=${encodeURIComponent(q)}`, "_self");
			}
		},
		[searchEngine]
	);

	const handleSuggestion = useCallback(
		(suggestion: Suggestion) => {
			if (suggestion.isAI) {
				if (suggestion.url) {
					window.open(suggestion.url.replace("{}", encodeURIComponent(query.replace(/^!/, "").trim())), "_self");
				} else {
					dispatch({ type: "SET_SUGGESTIONS", payload: aiSuggestions });
				}
			} else if (/=\s*\d+/.test(suggestion.text)) {
				const mathResult = suggestion.text.replace("= ", "");

				copyToClipboard(mathResult, dispatch);
				dispatch({ type: "SET_QUERY", payload: mathResult });
			} else {
				if (suggestion.url) {
					window.open(suggestion.url, "_self");
				} else {
					searchQuery(suggestion.text);
				}
				dispatch({ type: "SET_SELECTED_SUGGESTION_INDEX", payload: -1 });
			}
		},
		[query, searchQuery]
	);

	useEffect(() => {
		if (isFocused) {
			inputRef.current?.focus();
		} else {
			inputRef.current?.blur();

			dispatch({ type: "SET_SUGGESTIONS", payload: [] });
			dispatch({ type: "SET_SELECTED_SUGGESTION_INDEX", payload: -1 });
		}

		// Set Global Keydown Event
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.altKey) {
				dispatch({ type: "SET_IS_FOCUSED", payload: !isFocused });
			} else if (e.key === "Escape") {
				dispatch({ type: "SET_IS_FOCUSED", payload: false });
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isFocused]);

	useEffect(() => {
		// Keydown When isFocused
		const handleKeyDown = (e: KeyboardEvent) => {

            if (!isFocused) return;
            
			if (e.key === "Tab") e.preventDefault();
            
            if (suggestions.length === 0) return;

			let newIndex = -1;

			if (e.key === "ArrowDown") {
				e.preventDefault();
				newIndex = 
                    selectedSuggestionIndex == suggestions.length - 1 ? -1 : 
                    selectedSuggestionIndex < suggestions.length - 1 ? selectedSuggestionIndex + 1 : 0;
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				newIndex = 
                    selectedSuggestionIndex == 0 ? -1 : 
                    selectedSuggestionIndex > 0 ? selectedSuggestionIndex - 1 : suggestions.length - 1;
			} else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
				e.preventDefault();
				handleSuggestion(suggestions[selectedSuggestionIndex]);
			} else if (e.key === "Tab") {
				const text = getAutocompleteSuggestionText(suggestions, selectedSuggestionIndex);
				if (text) {
					dispatch({ type: "SET_QUERY", payload: text });
					dispatch({ type: "SET_SELECTED_SUGGESTION_INDEX", payload: -1 });
				}
			}

			if (e.key === "ArrowDown" || e.key === "ArrowUp") {
				dispatch({ type: "SET_SELECTED_SUGGESTION_INDEX", payload: newIndex });
				const selectedItem = suggestionsRef.current?.querySelector(`[data-index="${newIndex}"]`) as HTMLElement;

				if (selectedItem && suggestionsRef.current) {
					const containerRect = suggestionsRef.current.getBoundingClientRect();
					const itemRect = selectedItem.getBoundingClientRect();

					if (itemRect.bottom > containerRect.bottom) {
						selectedItem.scrollIntoView({ block: "end", behavior: "instant" });
					} else if (itemRect.top < containerRect.top) {
						selectedItem.scrollIntoView({ block: "start", behavior: "instant" });
					}
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isFocused, suggestions, selectedSuggestionIndex, query, handleSuggestion, getAutocompleteSuggestionText]);

	useEffect(() => {
		if (!query.trim()) {
			dispatch({ type: "SET_SUGGESTIONS", payload: [] });
			dispatch({ type: "SET_SELECTED_SUGGESTION_INDEX", payload: -1 });
			return;
		}

		abortControllerRef.current?.abort();

		abortControllerRef.current = new AbortController();
		const signal = abortControllerRef.current.signal;

		const timerId = setTimeout(async () => {
			dispatch({ type: "SET_IS_LOADING_SUGGESTIONS", payload: true });

			try {

				const historyPromise = new Promise<chrome.history.HistoryItem[]>((resolve) => {
					const isMathExpression = /[+\-*/^]/.test(query) && !/[a-zA-Z]/.test(query);

					if (typeof chrome !== "undefined" && chrome.history && !isMathExpression) {
						chrome.history.search({ 
							text: query, 
							maxResults: 3,
							startTime: 0 
						}, (results) => resolve(results));
					} else {
						resolve([]);
					}
				});

				const googlePromise = fetch(
					`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`, 
					{ signal }
				).then(res => res.ok ? res.json() : [null, []]);

				const [historyResults, googleData] = await Promise.all([historyPromise, googlePromise]);				

				const historySuggestions: Suggestion[] = historyResults.map(item => ({
					text: item.title || item.url || "Unknown Page",
					isAI: false,
					url: item.url
				}));

				const rawGoogleSuggestions = Array.isArray(googleData) && googleData[1] ? googleData[1] : [];

				const googleSuggestions: Suggestion[] = rawGoogleSuggestions
					.filter((item: string) => !/^=/.test(item) || /^=\s*\d*$/.test(item))
					.slice(0, 6)
					.map((suggestion: string) => ({
						text: suggestion,
						isAI: false,
					}));

				let newSuggestions: Suggestion[];

				if (query.startsWith("!")) {
					newSuggestions = [...aiSuggestions];
				} else if (isQueryLikePrompt(query)) {
					newSuggestions = [{ text: "Search AI", isAI: true, icon: "✨" }, ...googleSuggestions];
				} else {
					newSuggestions = [...historySuggestions, ...googleSuggestions];
				}

				dispatch({ type: "SET_SUGGESTIONS", payload: newSuggestions });
			} catch (error) {
				console.error("Error fetching suggestions:", error);
				if (query.startsWith("!")) dispatch({ type: "SET_SUGGESTIONS", payload: aiSuggestions });
			} finally {
				dispatch({ type: "SET_IS_LOADING_SUGGESTIONS", payload: false });
			}
		}, 200);

		return () => {
			clearTimeout(timerId);
			abortControllerRef.current?.abort();
		};
	}, [query]);

	const placeholderText = useMemo(() => {
		const text = getAutocompleteSuggestionText(suggestions, selectedSuggestionIndex);

		return text?.startsWith(query) ? text : "";
	}, [suggestions, selectedSuggestionIndex, query, getAutocompleteSuggestionText]);

	return (
		<>
			{isFocused && <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 animate-fade-in" onClick={() => dispatch({ type: "SET_IS_FOCUSED", payload: false })}></div>}

			<form
				onSubmit={(e) => {
					e.preventDefault();
					searchQuery(query);
				}}
				className={isFocused ? "fixed top-[20vh] left-1/2 w-full max-w-2xl z-50 animate-zoom-in" : "relative w-full"}
			>
				<div className="relative">
					<div className={`relative flex items-center gap-3 px-4 py-3 bg-card border rounded-lg transition-all duration-200
						${isFocused ? "border-accent/50 shadow-2xl shadow-accent/20" : "group-hover:border-accent/50"}`}>
            
						{isValidUrl(query) ? 
							<Globe className="w-5 h-5 text-primary shrink-0" /> :
							<Search className="w-5 h-5 text-muted-foreground shrink-0" /> 
						}

						<div className="absolute left-12 text-lg text-muted-foreground/60 pointer-events-none select-none whitespace-nowrap overflow-hidden text-ellipsis w-[82%]">
							{placeholderText}
						</div>

						<input
							ref={inputRef}
							type="text"
							value={query}
							onChange={(e) => dispatch({ type: "SET_QUERY", payload: e.target.value })}
							onFocus={() => dispatch({ type: "SET_IS_FOCUSED", payload: true })}
							placeholder="Search the web..."
							className={
								`flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-lg 
								${isValidUrl(query) ? "text-primary" : "text-foreground"}`
							}
							tabIndex={isFocused ? 0 : -1}
						/>

						<kbd className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded border transition-colors
							${(isFocused) ? "text-accent-foreground bg-accent/20 border-accent/30" : "text-muted-foreground bg-muted border-border"}`}>
								{isFocused ? (
									<span>esc</span>
								) : (<>
									<span>⌘</span>
									<span>Alt</span>
								</>)
                            }
						</kbd>
					</div>

					{isFocused && suggestions.length > 0 && (
						<div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-1 bg-card border border-accent/20 rounded-lg shadow-xl z-50 overflow-auto max-h-[50vh] text-base">
							{isLoadingSuggestions && <div className="px-4 py-3 text-muted-foreground text-sm">Loading suggestions...</div>}
							{!isLoadingSuggestions &&
								suggestions.map((suggestion, index) => (
									<SuggestionItem
										key={index}
										suggestion={suggestion}
										index={index}
										selectedIndex={selectedSuggestionIndex}
										onClick={() => handleSuggestion(suggestion)}
										query={query}
									/>
								))}
						</div>
					)}
				</div>
			</form>

			{alert.show && (
				<div className="fixed bottom-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in">
					{alert.message}
				</div>
			)}
		</>
	);
}
