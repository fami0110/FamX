import { useEffect, useRef, useCallback, useContext, useReducer, useMemo } from "react";
import { Search } from "lucide-react";
import AppContext from "@/AppContext";
import "@/styles/search.css";

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
      <svg width="2rem" height="2rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
        <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="#3186FF"></path>
        <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#lobe-icons-gemini-fill-0)"></path>
        <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#lobe-icons-gemini-fill-1)"></path>
        <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#lobe-icons-gemini-fill-2)"></path>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="lobe-icons-gemini-fill-0" x1="7" x2="11" y1="15.5" y2="12">
            <stop stop-color="#08B962"></stop>
            <stop offset="1" stop-color="#08B962" stop-opacity="0"></stop>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="lobe-icons-gemini-fill-1" x1="8" x2="11.5" y1="5.5" y2="11">
            <stop stop-color="#F94543"></stop><stop offset="1" stop-color="#F94543" stop-opacity="0"></stop>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="lobe-icons-gemini-fill-2" x1="3.5" x2="17.5" y1="13.5" y2="12">
            <stop stop-color="#FABC12"></stop><stop offset=".46" stop-color="#FABC12" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
      </svg>
		),
	},
  {
		name: "ChatGPT",
		url: "https://chatgpt.com/?q={}",
		icon: (
			<svg width="2rem" height="2rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
				<path className="fill-foreground" d="M 14.070312 2 C 11.330615 2 8.9844456 3.7162572 8.0390625 6.1269531 C 6.061324 6.3911222 4.2941948 7.5446684 3.2773438 9.3066406 C 1.9078196 11.678948 2.2198602 14.567816 3.8339844 16.591797 C 3.0745422 18.436097 3.1891418 20.543674 4.2050781 22.304688 C 5.5751778 24.677992 8.2359331 25.852135 10.796875 25.464844 C 12.014412 27.045167 13.895916 28 15.929688 28 C 18.669385 28 21.015554 26.283743 21.960938 23.873047 C 23.938676 23.608878 25.705805 22.455332 26.722656 20.693359 C 28.09218 18.321052 27.78014 15.432184 26.166016 13.408203 C 26.925458 11.563903 26.810858 9.4563257 25.794922 7.6953125 C 24.424822 5.3220082 21.764067 4.1478652 19.203125 4.5351562 C 17.985588 2.9548328 16.104084 2 14.070312 2 z M 14.070312 4 C 15.226446 4 16.310639 4.4546405 17.130859 5.2265625 C 17.068225 5.2600447 17.003357 5.2865019 16.941406 5.3222656 L 12.501953 7.8867188 C 12.039953 8.1527187 11.753953 8.6456875 11.751953 9.1796875 L 11.724609 15.146484 L 9.5898438 13.900391 L 9.5898438 8.4804688 C 9.5898438 6.0104687 11.600312 4 14.070312 4 z M 20.492188 6.4667969 C 21.927441 6.5689063 23.290625 7.3584375 24.0625 8.6953125 C 24.640485 9.696213 24.789458 10.862812 24.53125 11.958984 C 24.470201 11.920997 24.414287 11.878008 24.351562 11.841797 L 19.910156 9.2773438 C 19.448156 9.0113437 18.879016 9.0103906 18.416016 9.2753906 L 13.236328 12.236328 L 13.248047 9.765625 L 17.941406 7.0546875 C 18.743531 6.5915625 19.631035 6.4055313 20.492188 6.4667969 z M 7.5996094 8.2675781 C 7.5972783 8.3387539 7.5898438 8.4087418 7.5898438 8.4804688 L 7.5898438 13.607422 C 7.5898438 14.141422 7.8729844 14.635297 8.3339844 14.904297 L 13.488281 17.910156 L 11.34375 19.134766 L 6.6484375 16.425781 C 4.5094375 15.190781 3.7747656 12.443687 5.0097656 10.304688 C 5.5874162 9.3043657 6.522013 8.5923015 7.5996094 8.2675781 z M 18.65625 10.865234 L 23.351562 13.574219 C 25.490562 14.809219 26.225234 17.556313 24.990234 19.695312 C 24.412584 20.695634 23.477987 21.407698 22.400391 21.732422 C 22.402722 21.661246 22.410156 21.591258 22.410156 21.519531 L 22.410156 16.392578 C 22.410156 15.858578 22.127016 15.364703 21.666016 15.095703 L 16.511719 12.089844 L 18.65625 10.865234 z M 15.009766 12.947266 L 16.78125 13.980469 L 16.771484 16.035156 L 14.990234 17.052734 L 13.21875 16.017578 L 13.228516 13.964844 L 15.009766 12.947266 z M 18.275391 14.853516 L 20.410156 16.099609 L 20.410156 21.519531 C 20.410156 23.989531 18.399687 26 15.929688 26 C 14.773554 26 13.689361 25.54536 12.869141 24.773438 C 12.931775 24.739955 12.996643 24.713498 13.058594 24.677734 L 17.498047 22.113281 C 17.960047 21.847281 18.246047 21.354312 18.248047 20.820312 L 18.275391 14.853516 z M 16.763672 17.763672 L 16.751953 20.234375 L 12.058594 22.945312 C 9.9195938 24.180312 7.1725 23.443687 5.9375 21.304688 C 5.3595152 20.303787 5.2105423 19.137188 5.46875 18.041016 C 5.5297994 18.079003 5.5857129 18.121992 5.6484375 18.158203 L 10.089844 20.722656 C 10.551844 20.988656 11.120984 20.989609 11.583984 20.724609 L 16.763672 17.763672 z" />
			</svg>
		),
	},
	{
		name: "Z.ai",
		url: "https://chat.z.ai/?q={}",
		icon: (
			<svg width="2rem" height="2rem" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="1.49" y="1.49" width="27.02" height="27.02" rx="4" fill="#2D2D2D" stroke="white" strokeWidth="0.63" />
				<path d="M15.47 7.1L14.17 8.95C13.97 9.24 13.63 9.42 13.27 9.42H6.17V7.09H15.47Z" fill="white" />
				<path d="M24.3 7.1L13.14 22.91H5.7L16.86 7.1H24.3Z" fill="white" />
				<path d="M14.53 22.91L15.84 21.05C16.04 20.76 16.38 20.58 16.74 20.58H23.83V22.91H14.53Z" fill="white" />
			</svg>
		),
	},
	{
		name: "Claude",
		url: "https://claude.ai/new?q={}",
		icon: (
      <svg width="2rem" height="2rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" fill="#D97757" fillRule="nonzero"></path>
      </svg>
		),
	},
	{
		name: "Grok",
		url: "https://grok.com/c?q={}",
		icon: (
      <svg width="2rem" height="2rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path className="fill-foreground" d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"></path>
      </svg>
		),
	},
	{
		name: "Perplexity",
		url: "https://www.perplexity.ai/search?q={}",
		icon: (
			<svg width="2rem" height="2rem" viewBox="0 0 101 116" stroke="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="stroke-foreground group-hover:stroke-super transition-colors duration-300" d="M86.4325 6.53418L50.4634 36.9696H86.4325V6.53418Z M50.4625 36.9696L17.2603 6.53418V36.9696H50.4625Z M50.4634 1L50.4634 114.441 M83.6656 70.172L50.4634 36.9697V79.3026L83.6656 108.908V70.172Z M17.2603 70.172L50.4625 36.9697V78.4497L17.2603 108.908V70.172Z M3.42627 36.9697V81.2394H17.2605V70.172L50.4628 36.9697H3.42627Z M50.4634 36.9697L83.6656 70.172V81.2394H97.4999V36.9697L50.4634 36.9697Z" strokeWidth="5.53371" strokeMiterlimit="10"></path>
      </svg>
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

const isQueryLikePrompt = (query: string): boolean => {
  const trimmedQuery = query.trim();
  const wordCount = trimmedQuery.split(/\s+/).filter(Boolean).length;
  const charCount = trimmedQuery.length;
  
  return wordCount > 2 && charCount > 15;
};

// --- Reducer ---
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

// Helper Functions: Copy To Clipboard
async function copyToClipboard(text: string, dispatch: React.Dispatch<Action>) {
	try {
		await navigator.clipboard.writeText(text);
		dispatch({ type: "SHOW_ALERT", payload: "Copied to clipboard" });
		setTimeout(() => dispatch({ type: "HIDE_ALERT" }), 3000);
	} catch (err) {
		console.error("Failed to copy text: ", err);
	}
}

// Suggestion Item Components
interface SuggestionItemProps { 
  suggestion: Suggestion; 
  index: number; 
  selectedIndex: number; 
  onClick: () => void; 
  query: string 
};

function SuggestionItem(
  { suggestion, index, selectedIndex, onClick, query } : SuggestionItemProps
) {
  const isMathResult = /=\s*\d+/.test(suggestion.text) && !suggestion.isAI;
	const isSelected = index === selectedIndex;

	const content = useMemo(() => {
		if (suggestion.isAI) {
			return suggestion.text === "Search AI" ? (
				<div className="flex items-center gap-2 justify-between">
					<div className="flex items-center gap-2 text-accent">{suggestion.icon}</div>
					<div className="grow flex items-center gap-1">
						<span>{suggestion.text}</span>
					</div>
					<span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded">AI</span>
				</div>
			) : (
				<div className="flex items-center gap-2 justify-between">
					<div className="flex items-center gap-2 text-accent">{suggestion.icon}</div>
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
		return (
			<div className="flex items-center gap-2">
				<Search className="w-4 h-4 text-muted-foreground" />
				<span>{suggestion.text}</span>
			</div>
		);
	}, [suggestion, isMathResult, query]);

	return (
		<div 
      className={`px-4 py-3 cursor-pointer transition-colors 
        ${isSelected ? "bg-accent/20 text-accent-foreground" : "hover:bg-accent/10 text-foreground"}
        ${suggestion.isAI || isMathResult ? "border-b border-accent/10" : ""}
      `}
      data-index={index} onClick={onClick}>
			{content}
		</div>
	);
}

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
  }, {
		...initialState,
		isFocused: openWhenStart,
	});
	const { query, isFocused, suggestions, selectedSuggestionIndex, isLoadingSuggestions, alert } = state;

	const inputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const searchQuery = useCallback(
    (queryString: string) => {
      const searchEngineUrls: { [key: string]: string } = {
        Google: "https://www.google.com/search",
        Bing: "https://www.bing.com/search",
        DuckDuckGo: "https://duckduckgo.com/",
        Yahoo: "https://search.yahoo.com/search",
        Brave: "https://search.brave.com/search",
        Ecosia: "https://www.ecosia.org/search",
      };

      if (queryString.trim()) {
        const baseUrl = searchEngineUrls[searchEngine] || searchEngineUrls["Google"];
        window.open(`${baseUrl}?q=${encodeURIComponent(queryString.trim())}`, "_self");
      }
    }, 
  [searchEngine]);

	const handleSuggestion = useCallback(
		(suggestion: Suggestion) => {
			if (suggestion.isAI) {
				if (suggestion.url) {
					window.open(suggestion.url.replace("{}", encodeURIComponent(query.replace(/^!/, "").trim())), "_blank");
				} else {
					dispatch({ type: "SET_SUGGESTIONS", payload: aiSuggestions });
				}
			} else if (/=\s*\d+/.test(suggestion.text)) {
				const mathResult = suggestion.text.replace("= ", "");
        
				copyToClipboard(mathResult, dispatch);
				dispatch({ type: "SET_QUERY", payload: mathResult });
			} else {
				searchQuery(suggestion.text);
				dispatch({ type: "SET_SELECTED_SUGGESTION_INDEX", payload: -1 });
			}
    }, 
  [query, searchQuery]);

	useEffect(() => {
		if (isFocused) {
			inputRef.current?.focus();
		} else {
			inputRef.current?.blur();

			dispatch({ type: "SET_QUERY", payload: "" });
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

			if (!isFocused || suggestions.length === 0) return;

			let newIndex = -1;

			if (e.key === "ArrowDown") {
				e.preventDefault();
				newIndex = selectedSuggestionIndex < suggestions.length - 1 ? selectedSuggestionIndex + 1 : 0;
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				newIndex = selectedSuggestionIndex > 0 ? selectedSuggestionIndex - 1 : suggestions.length - 1;
			} else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
				e.preventDefault();
				handleSuggestion(suggestions[selectedSuggestionIndex]);
			} else if (e.key === "Tab" || e.key === "ArrowRight") {
				e.preventDefault();
				const selected = suggestions[
					selectedSuggestionIndex >= 0 ? selectedSuggestionIndex : 0
				];
				if (!selected.isAI) {
					dispatch({ type: "SET_QUERY", payload: selected.text })
					dispatch({ type: "SET_SELECTED_SUGGESTION_INDEX", payload: -1 });
				};
			}

			if (newIndex !== -1) {
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
	}, [isFocused, suggestions, selectedSuggestionIndex, query, handleSuggestion]);

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
				const response = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`, { signal });
				if (!response.ok) throw new Error("Failed to fetch suggestions");

				const [ _ , data] = await response.json();

				if ( _ && Array.isArray(data)) {

					const formatted: Suggestion[] = data
						.filter((item: string) => !/^=/.test(item) || /^=\s*\d*$/.test(item))
						.map((suggestion: string) => ({
							text: suggestion,
							isAI: false,
						}));

					let newSuggestions: Suggestion[];

					if (isQueryLikePrompt(query)) {
						newSuggestions = [{ 
              text: "Search AI", 
              isAI: true, 
              icon: "✨" 
            }, ...formatted];
            
					} else if (query.startsWith("!")) {
						newSuggestions = [...aiSuggestions];
					} else {
						newSuggestions = [...formatted];
					}
					dispatch({ type: "SET_SUGGESTIONS", payload: newSuggestions });
				}
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
		const text = suggestions[
      selectedSuggestionIndex >= 0 ? selectedSuggestionIndex : 0
    ]?.text;
		return text?.startsWith(query) ? text : "";
	}, [suggestions, selectedSuggestionIndex, query]);

	return (
		<>
			{isFocused && 
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 animate-fade-in" 
          onClick={() => dispatch({ type: "SET_IS_FOCUSED", payload: false })}>
        </div>}

			<form
				onSubmit={(e) => {
					e.preventDefault();
					searchQuery(query);
				}}
				className={isFocused ? "fixed top-[20vh] left-1/2 w-full max-w-2xl z-50 animate-zoom-in" : "relative w-full"}
			>
				<div className="relative">
					<div
						className={`relative flex items-center gap-3 px-4 py-3 bg-card border rounded-lg transition-all duration-200
            ${isFocused ? "border-accent/50 shadow-2xl shadow-accent/20" : "group-hover:border-accent/50"}
          `}>
            
						<Search className="w-5 h-5 text-muted-foreground shrink-0" />

						<div className="absolute left-12 text-lg text-muted-foreground/60 pointer-events-none select-none whitespace-nowrap overflow-hidden">
              {placeholderText}
            </div>

						<input
							ref={inputRef}
							type="text"
							value={query}
							onChange={(e) => dispatch({ type: "SET_QUERY", payload: e.target.value })}
							onFocus={() => dispatch({ type: "SET_IS_FOCUSED", payload: true })}
							placeholder="Search the web..."
							className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-lg"
							tabIndex={isFocused ? 0 : -1}
						/>

						<kbd className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded border transition-colors
              ${(isFocused) ? "text-accent-foreground bg-accent/20 border-accent/30" : "text-muted-foreground bg-muted border-border"}`}>
							{isFocused ? (
								<span>esc</span>
							) : (<>
                <span>⌘</span>
                <span>Alt</span>
              </>)}
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

			{alert.show && 
        <div className="fixed bottom-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in">
          {alert.message}
        </div>
      }
		</>
	);
}
