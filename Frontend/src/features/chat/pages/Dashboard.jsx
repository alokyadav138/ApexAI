import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hook/useAuth";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { clearMessages } from "../chat.slice";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

/* Custom Bat Logo SVG */
const BatEmblem = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 120 60" fill="currentColor" className={className}>
        <path d="M60 8 L64 18 L68 10 L72 22 C84 16 102 14 118 22 C104 26 96 34 94 44 C84 36 74 38 68 46 L60 54 L52 46 C46 38 36 36 26 44 C24 34 16 26 2 22 C18 14 36 16 48 22 L52 10 L56 18 Z" />
    </svg>
);

/* Animated Background Batcave Scene (Batman, Bat-Signal, Flying Bats & Moving Batmobile) */
/* Cinematic Vigilante Batman Background (Supports custom image + built-in high-detail vigilante art) */
const BatcaveBackdrop = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {/* Deep Moody Gotham Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,#1c2333_0%,#08090d_52%,#030406_100%)]" />

        {/* Optional: Agar tum 'public/batman-bg.jpg' rakhte ho to automatically woh vigilante photo dikhegi */}
        <div
            className="absolute inset-0 bg-cover bg-right-bottom bg-no-repeat opacity-25 mix-blend-lighten transition-opacity duration-700"
            style={{
                backgroundImage: `url('/batman-bg.jpg')`,
            }}
        />

        {/* Subtle Tactical Grid */}
        <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(250,204,21,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.35) 1px, transparent 1px)",
                backgroundSize: "52px 52px",
            }}
        />

        {/* Bat-Signal Spotlight in Gotham Sky */}
        <div className="animate-batsignal absolute -top-12 right-[18%] flex h-[320px] w-[320px] items-center justify-center rounded-full bg-amber-300/20 blur-2xl">
            <div className="flex h-44 w-44 items-center justify-center rounded-full border-2 border-amber-300/40 bg-amber-200/25 shadow-[0_0_90px_rgba(251,191,36,0.5)]">
                <BatEmblem className="h-20 w-32 text-black/80" />
            </div>
        </div>

        {/* Flying Bats */}
        <div className="animate-bat-1 absolute top-[16%] left-0 text-amber-400/35">
            <BatEmblem className="animate-wing h-6 w-12" />
        </div>
        <div className="animate-bat-2 absolute top-[28%] left-0 text-sky-400/25">
            <BatEmblem className="animate-wing h-5 w-10" />
        </div>
        <div className="animate-bat-3 absolute top-[11%] left-0 text-amber-300/25">
            <BatEmblem className="animate-wing h-4 w-8" />
        </div>

        {/* CINEMATIC VIGILANTE BATMAN CLOSE-UP SILHOUETTE (Right Side) */}
        <div className="absolute bottom-6 right-0 z-0 flex items-end justify-end opacity-55 sm:right-6 lg:right-12">
            {/* Rim-Light Glow Behind Batman */}
            <div className="absolute bottom-16 right-12 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
            <div className="absolute bottom-28 right-20 h-44 w-44 rounded-full bg-amber-400/10 blur-2xl" />

            <svg
                viewBox="0 0 420 500"
                className="h-[360px] w-[310px] sm:h-[460px] sm:w-[390px] drop-shadow-[0_0_35px_rgba(0,0,0,0.95)]"
            >
                <defs>
                    {/* Rim light gradient on armor & cowl */}
                    <linearGradient id="cowlRim" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                        <stop offset="45%" stopColor="#111622" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#050608" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="capeFlow" x1="20%" y1="0%" x2="80%" y2="100%">
                        <stop offset="0%" stopColor="#0d111a" />
                        <stop offset="60%" stopColor="#07090d" />
                        <stop offset="100%" stopColor="#030406" />
                    </linearGradient>
                    <linearGradient id="goldChest" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#facc15" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
                    </linearGradient>
                </defs>

                {/* Dramatic Flowing Vigilante Cape */}
                <path
                    d="M145,195 C85,245 35,345 15,495 L115,470 L165,498 L215,465 L265,498 L325,468 L405,495 C390,355 345,250 285,195 Z"
                    fill="url(#capeFlow)"
                    stroke="#38bdf8"
                    strokeOpacity="0.14"
                    strokeWidth="1.5"
                />

                {/* Broad Armored Shoulders & Chest */}
                <path
                    d="M110,245 C135,212 175,202 215,202 C255,202 295,212 320,245 L345,355 L295,465 L135,465 L85,355 Z"
                    fill="url(#cowlRim)"
                    stroke="#38bdf8"
                    strokeOpacity="0.22"
                    strokeWidth="1.2"
                />

                {/* Tactical Chest Armor Plates */}
                <path
                    d="M150,245 L215,270 L280,245 L270,320 L215,342 L160,320 Z"
                    fill="#090c12"
                    stroke="#facc15"
                    strokeOpacity="0.18"
                    strokeWidth="1"
                />

                {/* Glowing Tactical Bat Symbol on Chest */}
                <path
                    d="M215,274 L218,282 L222,276 L225,286 C236,281 250,279 264,286 C252,290 245,296 243,304 C235,298 227,299 222,306 L215,313 L208,306 C203,299 195,298 187,304 C185,296 178,290 166,286 C180,279 194,281 205,286 L208,276 L212,282 Z"
                    fill="url(#goldChest)"
                />

                {/* High Tactical Collar */}
                <path
                    d="M168,195 L182,222 L215,228 L248,222 L262,195 L252,175 L178,175 Z"
                    fill="#0b0f17"
                    stroke="#38bdf8"
                    strokeOpacity="0.28"
                    strokeWidth="1.2"
                />

                {/* Batman Cowl & Sharp Ears */}
                <path
                    d="M174,115 L172,42 L188,92 C196,87 205,85 215,85 C225,85 234,87 242,92 L258,42 L256,115 C262,128 262,148 255,165 L242,196 L188,196 L175,165 C168,148 168,128 174,115 Z"
                    fill="url(#cowlRim)"
                    stroke="#38bdf8"
                    strokeOpacity="0.35"
                    strokeWidth="1.5"
                />

                {/* Brow Scowl Lines */}
                <path
                    d="M182,126 L207,136 M248,126 L223,136"
                    stroke="#030406"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                />

                {/* Intense White/Amber Vigilante Eyes */}
                <polygon
                    points="185,134 206,141 187,143"
                    fill="#f8fafc"
                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.95)]"
                />
                <polygon
                    points="245,134 224,141 243,143"
                    fill="#f8fafc"
                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.95)]"
                />

                {/* Lower Jaw / Chin Shadow */}
                <path
                    d="M192,162 L238,162 L232,188 L215,195 L198,188 Z"
                    fill="#161b26"
                    opacity="0.85"
                />
            </svg>
        </div>

        {/* Gotham Street / Batcave Road Strip */}
        <div className="absolute bottom-7 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
        <div className="absolute bottom-0 left-0 h-7 w-full bg-[#030406]" />

        {/* Animated Moving Batmobile */}
        <div className="animate-batmobile absolute bottom-[26px] left-0 flex items-center">
            <div className="mr-[-8px] h-2.5 w-28 rounded-l-full bg-gradient-to-r from-transparent via-sky-400/70 to-amber-400 blur-[2px]" />
            <svg
                viewBox="0 0 220 65"
                className="h-11 w-40 drop-shadow-[0_0_18px_rgba(250,204,21,0.4)]"
            >
                <path
                    d="M12,46 L18,30 L58,26 L92,16 L138,18 L178,28 L208,34 L212,46 Z"
                    fill="#0d1017"
                    stroke="#facc15"
                    strokeWidth="1.3"
                    strokeOpacity="0.55"
                />
                <polygon
                    points="14,30 4,10 38,27"
                    fill="#090b10"
                    stroke="#facc15"
                    strokeWidth="1"
                    strokeOpacity="0.45"
                />
                <polygon
                    points="88,25 104,18 134,19 144,26"
                    fill="#facc15"
                    opacity="0.55"
                />
                <polygon
                    points="208,36 220,33 220,42 208,40"
                    fill="#fef08a"
                    opacity="0.95"
                />
                <circle
                    cx="52"
                    cy="47"
                    r="13"
                    fill="#050608"
                    stroke="#38bdf8"
                    strokeWidth="2"
                />
                <circle cx="52" cy="47" r="5" fill="#facc15" opacity="0.8" />
                <circle
                    cx="168"
                    cy="47"
                    r="13"
                    fill="#050608"
                    stroke="#38bdf8"
                    strokeWidth="2"
                />
                <circle cx="168" cy="47" r="5" fill="#facc15" opacity="0.8" />
            </svg>
        </div>
    </div>
);

function CodeBlock({ children }) {
    const [copied, setCopied] = useState(false);

    const codeElement = React.Children.toArray(children).find(
        (child) => React.isValidElement(child) && child.type === "code"
    );

    const codeText = codeElement
        ? String(codeElement.props.children ?? "")
        : "";

    const language =
        codeElement?.props?.className
            ?.replace("hljs language-", "")
            ?.replace("language-", "") || "waynetech-script";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Copy failed:", error);
        }
    };

    return (
        <div className="my-5 overflow-hidden rounded-2xl border border-amber-400/20 bg-[#06070a]/95 shadow-[0_16px_40px_rgba(0,0,0,0.75)]">
            <div className="flex items-center justify-between border-b border-amber-400/15 bg-amber-400/[0.04] px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#facc15]" />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-300">
                        {language}
                    </span>
                </div>

                <button
                    onClick={handleCopy}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-all ${
                        copied
                            ? "border-amber-400/50 bg-amber-400/20 text-amber-300"
                            : "border-white/10 bg-white/[0.04] text-gray-400 hover:border-amber-400/40 hover:text-amber-300"
                    }`}
                >
                    {copied ? "✓ Copied" : "Copy"}
                </button>
            </div>

            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
                {children}
            </pre>
        </div>
    );
}

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    const {
        initializeSocketConnection,
        handleSendMessage,
        handleRegenerateMessage,
        handleMessageFeedback,
        fetchChats,
        fetchMessages,
        handleDeleteChat,
    } = useChat();

    const { user } = useSelector((state) => state.auth);
    const chats = useSelector((state) => state.chat.chats);
    const messages = useSelector((state) => state.chat.messages);
    const currentChatId = useSelector((state) => state.chat.currentChatId);
    const loading = useSelector((state) => state.chat.loading);
    const error = useSelector((state) => state.chat.error);

    const [prompt, setPrompt] = useState("");
    const [activeView, setActiveView] = useState("chat");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedModel, setSelectedModel] = useState("Batcomputer v4.2");
    const [showModelMenu, setShowModelMenu] = useState(false);
    const [activeMode, setActiveMode] = useState("Default");
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [isListening, setIsListening] = useState(false);

    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);
    const chatContainerRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        fetchChats();
        const socket = initializeSocketConnection();
        return () => socket?.disconnect();
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024) setSidebarOpen(false);
    }, []);

    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;
        const isNearBottom =
            container.scrollHeight -
                container.scrollTop -
                container.clientHeight <
            200;

        if (isNearBottom) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, loading]);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
    }, [prompt]);

    const handleVoiceTyping = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Voice typing is not supported. Please use Chrome or Edge.");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setPrompt((prev) => {
                const finalTranscript =
                    event.results[event.results.length - 1].isFinal;
                return finalTranscript
                    ? prev
                        ? `${prev} ${transcript}`
                        : transcript
                    : prev;
            });
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
            "image/jpeg",
            "image/png",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Only PDF, DOCX, TXT, JPG and PNG files are supported.");
            e.target.value = "";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("File size must be below 10 MB.");
            e.target.value = "";
            return;
        }

        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        if ((!prompt.trim() && !selectedFile) || loading) return;

        const message = prompt.trim();
        const file = selectedFile;

        setPrompt("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        try {
            await handleSendMessage({
                message,
                chatId: currentChatId,
                file,
            });
        } catch (err) {
            console.error("SEND ERROR:", err);
            setPrompt(message);
            setSelectedFile(file);
        }
    };

    const handleNewChat = () => {
        dispatch(clearMessages());
        setPrompt("");
        setActiveView("chat");
        if (window.innerWidth < 1024) setSidebarOpen(false);
        textareaRef.current?.focus();
    };

    const handleOpenChat = async (chatId) => {
        if (loading) return;
        setActiveView("chat");
        if (window.innerWidth < 1024) setSidebarOpen(false);
        await fetchMessages(chatId);
    };

    const handleDelete = async (e, chatId) => {
        e.stopPropagation();
        await handleDeleteChat(chatId);
    };

    const handleLogoutClick = async () => {
        const success = await handleLogout();
        if (success) navigate("/login", { replace: true });
    };

    const handleCopy = async (content, id) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error(err);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const lastAIMessageIndex = messages.reduce(
        (lastIndex, msg, idx) => (msg.role === "ai" ? idx : lastIndex),
        -1
    );

    const filteredChats = chats.filter((c) =>
        (c.title || "New Mission")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const models = [
        {
            name: "Batcomputer v4.2",
            badge: "Tactical Core",
            desc: "Deep forensic reasoning & code synthesis",
        },
        {
            name: "Oracle Neural Net",
            badge: "Intel",
            desc: "Multi-document analysis & threat detection",
        },
        {
            name: "Nightwing Turbo",
            badge: "Stealth Fast",
            desc: "Ultra-low latency rapid responses",
        },
    ];

    const quickPrompts = [
        {
            category: "WayneTech Engineering",
            title: "Architect & debug clean production code",
            prompt: "Help me architect and write clean, high-performance code.",
        },
        {
            category: "Forensic Dossier",
            title: "Analyze encrypted PDFs, docs & evidence",
            prompt: "Analyze my uploaded file and extract all critical intelligence.",
        },
        {
            category: "Tactical Strategy",
            title: "Break down complex system architectures",
            prompt: "Explain how modern autonomous AI agents execute multi-step tasks.",
        },
        {
            category: "Gotham R&D",
            title: "Generate project blueprints & roadmaps",
            prompt: "Create a step-by-step technical blueprint for a full-stack AI app.",
        },
    ];

    const userInitial = user?.username?.charAt(0)?.toUpperCase() || "B";

    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-[#050608] text-gray-100 selection:bg-amber-400/25 selection:text-amber-200">
            {/* Animated Batcave Environment */}
            <BatcaveBackdrop />

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* LEFT BATCAVE TERMINAL DRAWER */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-amber-400/15 bg-[#080a0f]/90 backdrop-blur-2xl transition-all duration-300 lg:static ${
                    sidebarOpen
                        ? "w-[280px] translate-x-0"
                        : "w-0 -translate-x-full overflow-hidden border-none lg:w-0"
                }`}
            >
                <div className="flex w-[280px] flex-1 flex-col overflow-hidden p-4">
                    {/* WayneTech Header */}
                    <div className="mb-5 flex items-center justify-between">
                        <div
                            onClick={handleNewChat}
                            className="flex cursor-pointer items-center gap-2.5"
                        >
                            <div className="flex h-9 w-11 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-400 shadow-[0_0_20px_rgba(250,204,21,0.25)]">
                                <BatEmblem className="h-5 w-9" />
                            </div>
                            <div>
                                <span className="text-base font-bold tracking-wider text-white">
                                    BAT<span className="text-amber-400">AI</span>
                                </span>
                                <span className="block font-mono text-[9px] uppercase tracking-[2px] text-amber-400/70">
                                    WayneTech OS
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/[0.06] hover:text-amber-300"
                            title="Collapse Terminal"
                        >
                            ◧
                        </button>
                    </div>

                    {/* New Mission Button */}
                    <button
                        onClick={handleNewChat}
                        className="group mb-4 flex w-full items-center justify-between rounded-xl border border-amber-400/35 bg-gradient-to-r from-amber-400/15 to-amber-500/5 px-3.5 py-2.5 text-xs font-semibold text-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition hover:border-amber-400/70 hover:from-amber-400/25 hover:to-amber-500/10"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-base leading-none">+</span>
                            New Mission Log
                        </span>
                        <kbd className="rounded bg-black/50 px-1.5 py-0.5 font-mono text-[10px] text-amber-400/70">
                            BAT-01
                        </kbd>
                    </button>

                    {/* Search Case Files */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search case files..."
                            className="w-full rounded-xl border border-white/[0.08] bg-black/40 py-2 pl-3 pr-3 text-xs text-gray-200 outline-none placeholder:text-gray-600 focus:border-amber-400/50"
                        />
                    </div>

                    {/* Tactical Tabs */}
                    <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl border border-white/[0.07] bg-black/40 p-1">
                        {[
                            { id: "chat", label: "Comms" },
                            { id: "analytics", label: "Telemetry" },
                            { id: "guide", label: "Protocols" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveView(tab.id)}
                                className={`rounded-lg py-1.5 text-[11px] font-medium transition ${
                                    activeView === tab.id
                                        ? "bg-amber-400/15 text-amber-300 shadow-sm"
                                        : "text-gray-500 hover:text-gray-300"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Case Files List */}
                    <div className="mb-2 flex items-center justify-between px-1">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                            Encrypted Logs ({filteredChats.length})
                        </span>
                    </div>

                    <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
                        {filteredChats.length === 0 ? (
                            <div className="mt-6 rounded-xl border border-dashed border-amber-400/15 p-4 text-center">
                                <p className="text-xs text-gray-500">
                                    No mission logs recorded
                                </p>
                            </div>
                        ) : (
                            filteredChats.map((chat) => {
                                const active =
                                    currentChatId === chat._id &&
                                    activeView === "chat";
                                return (
                                    <div
                                        key={chat._id}
                                        onClick={() => handleOpenChat(chat._id)}
                                        className={`group flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2.5 transition-all ${
                                            active
                                                ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                                                : "border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                                        }`}
                                    >
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <span
                                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                                    active
                                                        ? "bg-amber-400 shadow-[0_0_8px_#facc15]"
                                                        : "bg-gray-700 group-hover:bg-sky-400"
                                                }`}
                                            />
                                            <p className="truncate text-xs font-medium">
                                                {chat.title || "Classified Log"}
                                            </p>
                                        </div>

                                        <button
                                            onClick={(e) =>
                                                handleDelete(e, chat._id)
                                            }
                                            className="shrink-0 rounded p-1 text-gray-500 opacity-0 transition hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                                            title="Purge Log"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Vigilante Profile Footer */}
                    <div className="mt-3 border-t border-amber-400/15 pt-3">
                        <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-black/40 p-2.5">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-400/40 bg-amber-400/15 font-bold text-amber-300">
                                    {userInitial}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold text-white">
                                        {user?.username || "Dark Knight"}
                                    </p>
                                    <p className="truncate font-mono text-[10px] text-sky-400">
                                        ● Batcave Linked
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogoutClick}
                                title="Lock Terminal"
                                className="rounded-lg p-2 text-xs text-gray-400 transition hover:bg-red-500/15 hover:text-red-400"
                            >
                                ↪
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN BATCOMPUTER WORKSPACE */}
            <div className="relative z-10 flex min-w-0 flex-1 flex-col">
                {/* Top Tactical HUD Bar */}
                <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        {!sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/25 bg-black/50 text-amber-300 backdrop-blur-md transition hover:border-amber-400"
                                title="Open Terminal"
                            >
                                ☰
                            </button>
                        )}

                        {/* Model Switcher */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowModelMenu((prev) => !prev)
                                }
                                className="flex items-center gap-2 rounded-xl border border-amber-400/25 bg-[#0a0c12]/80 px-3.5 py-2 text-xs font-semibold text-amber-200 backdrop-blur-md transition hover:border-amber-400/60"
                            >
                                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#facc15]" />
                                <span>{selectedModel}</span>
                                <span className="text-amber-400/70">▾</span>
                            </button>

                            {showModelMenu && (
                                <div className="absolute left-0 top-12 z-50 w-64 rounded-2xl border border-amber-400/25 bg-[#090b10]/95 p-1.5 shadow-2xl backdrop-blur-2xl">
                                    {models.map((m) => (
                                        <button
                                            key={m.name}
                                            onClick={() => {
                                                setSelectedModel(m.name);
                                                setShowModelMenu(false);
                                            }}
                                            className={`flex w-full flex-col rounded-xl p-2.5 text-left transition ${
                                                selectedModel === m.name
                                                    ? "bg-amber-400/15 text-amber-200"
                                                    : "text-gray-300 hover:bg-white/[0.05]"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold">
                                                    {m.name}
                                                </span>
                                                <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9px] text-amber-300">
                                                    {m.badge}
                                                </span>
                                            </div>
                                            <span className="mt-1 text-[11px] text-gray-500">
                                                {m.desc}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Telemetry Pill */}
                    <div className="flex items-center gap-2.5">
                        <span className="hidden items-center gap-1.5 rounded-full border border-sky-400/20 bg-sky-400/[0.06] px-3 py-1 font-mono text-[10px] text-sky-300 sm:flex">
                            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-sky-400" />
                            GOTHAM GRID SECURE
                        </span>
                        <button
                            onClick={handleNewChat}
                            className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition hover:bg-amber-400/20"
                        >
                            + Mission
                        </button>
                    </div>
                </header>

                {/* VIEW 1: COMMS / CHAT */}
                {activeView === "chat" && (
                    <div
                        ref={chatContainerRef}
                        className="flex flex-1 flex-col overflow-y-auto px-4 sm:px-8"
                    >
                        <div className="mx-auto flex w-full max-w-[820px] flex-1 flex-col pb-12">
                            {messages.length === 0 ? (
                                /* Batcomputer Launchpad */
                                <div className="my-auto flex flex-col items-center justify-center py-8 text-center">
                                    <div className="mb-5 flex h-16 w-28 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/[0.07] text-amber-400 shadow-[0_0_40px_rgba(250,204,21,0.2)]">
                                        <BatEmblem className="h-9 w-20" />
                                    </div>

                                    <h1 className="max-w-2xl bg-gradient-to-b from-white via-amber-100 to-amber-500/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
                                        {user?.username
                                            ? `Welcome back, ${user.username}.`
                                            : "Batcomputer Online."}
                                    </h1>

                                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base">
                                        Gotham’s tactical neural mainframe is at
                                        your command. Analyze intel, decode
                                        systems, or build in stealth.
                                    </p>

                                    {/* Tactical Starter Cards */}
                                    <div className="mt-10 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-2">
                                        {quickPrompts.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setPrompt(item.prompt);
                                                    textareaRef.current?.focus();
                                                }}
                                                className="group rounded-2xl border border-amber-400/20 bg-[#0a0c12]/80 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/50 hover:shadow-[0_10px_30px_rgba(250,204,21,0.1)]"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400/80">
                                                        {item.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500 transition-transform group-hover:translate-x-1 group-hover:text-amber-300">
                                                        →
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-sm font-medium text-gray-100">
                                                    {item.title}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Tactical Chat Stream */
                                <div className="flex flex-1 flex-col gap-7 pt-4 pb-8">
                                    {messages.map((msg, index) => {
                                        const isUser = msg.role === "user";

                                        if (isUser) {
                                            return (
                                                <div
                                                    key={msg._id || index}
                                                    className="flex justify-end"
                                                >
                                                    <div className="max-w-[80%] rounded-3xl rounded-br-md border border-amber-400/25 bg-amber-400/[0.09] px-5 py-3.5 text-sm leading-relaxed text-amber-50 shadow-lg backdrop-blur-md">
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                key={msg._id || index}
                                                className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-[#090b10]/75 p-4 backdrop-blur-md"
                                            >
                                                {/* Bat Emblem Avatar */}
                                                <div className="mt-1 flex h-8 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/35 bg-amber-400/10 text-amber-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                                                    <BatEmblem className="h-4 w-7" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-1.5 flex items-center gap-2">
                                                        <span className="text-xs font-bold tracking-wide text-amber-300">
                                                            BATCOMPUTER
                                                        </span>
                                                        <span className="font-mono text-[10px] text-sky-400/80">
                                                            // {selectedModel}
                                                        </span>
                                                    </div>

                                                    <div
                                                        className="prose prose-invert max-w-none text-[15px] leading-7 text-gray-200
                                                        prose-headings:font-semibold prose-headings:text-amber-200
                                                        prose-a:text-sky-400
                                                        prose-strong:text-white
                                                        prose-code:rounded-md prose-code:bg-amber-400/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-amber-300 prose-code:before:content-none prose-code:after:content-none
                                                        prose-blockquote:border-l-2 prose-blockquote:border-amber-400 prose-blockquote:text-gray-300"
                                                    >
                                                        <ReactMarkdown
                                                            remarkPlugins={[
                                                                remarkGfm,
                                                            ]}
                                                            rehypePlugins={[
                                                                rehypeHighlight,
                                                            ]}
                                                            components={{
                                                                pre: CodeBlock,
                                                            }}
                                                        >
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    </div>

                                                    {msg._id !==
                                                        "streaming-ai-message" && (
                                                        <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-2.5">
                                                            <button
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        msg.content,
                                                                        msg._id ||
                                                                            index
                                                                    )
                                                                }
                                                                className="rounded-lg px-2 py-1 text-xs text-gray-400 transition hover:bg-amber-400/10 hover:text-amber-300"
                                                            >
                                                                {copiedId ===
                                                                (msg._id ||
                                                                    index)
                                                                    ? "✓ Copied"
                                                                    : "Copy"}
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleMessageFeedback(
                                                                        msg._id,
                                                                        msg.feedback ===
                                                                            "like"
                                                                            ? "none"
                                                                            : "like"
                                                                    )
                                                                }
                                                                className={`rounded-lg px-2 py-1 text-xs transition ${
                                                                    msg.feedback ===
                                                                    "like"
                                                                        ? "text-amber-400"
                                                                        : "text-gray-500 hover:text-gray-200"
                                                                }`}
                                                            >
                                                                👍
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleMessageFeedback(
                                                                        msg._id,
                                                                        msg.feedback ===
                                                                            "dislike"
                                                                            ? "none"
                                                                            : "dislike"
                                                                    )
                                                                }
                                                                className={`rounded-lg px-2 py-1 text-xs transition ${
                                                                    msg.feedback ===
                                                                    "dislike"
                                                                        ? "text-red-400"
                                                                        : "text-gray-500 hover:text-gray-200"
                                                                }`}
                                                            >
                                                                👎
                                                            </button>

                                                            {index ===
                                                                lastAIMessageIndex && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleRegenerateMessage(
                                                                            msg._id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                    className="ml-auto rounded-lg px-2 py-1 text-xs text-gray-400 transition hover:bg-amber-400/10 hover:text-amber-300 disabled:opacity-40"
                                                                >
                                                                    ↻ Re-run
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {loading && (
                                        <div className="flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-[#090b10]/80 px-4 py-3">
                                            <BatEmblem className="h-4 w-8 animate-pulse text-amber-400" />
                                            <span className="animate-pulse font-mono text-xs text-amber-200">
                                                Decrypting & analyzing via{" "}
                                                {selectedModel}...
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {error && (
                                <p className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-center text-xs text-red-300">
                                    {error}
                                </p>
                            )}

                            {/* FLOATING BATCAVE COMMAND CONSOLE */}
                            <div className="sticky bottom-0 z-20 pt-2">
                                <div className="rounded-3xl border border-amber-400/25 bg-[#090b10]/90 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(250,204,21,0.15)] backdrop-blur-2xl transition-all focus-within:border-amber-400/60">
                                    {selectedFile && (
                                        <div className="mb-2.5 inline-flex items-center gap-2.5 rounded-2xl border border-sky-400/30 bg-sky-400/10 px-3 py-1.5">
                                            <span className="text-xs text-sky-300">
                                                📁 {selectedFile.name}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                (
                                                {(
                                                    selectedFile.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB)
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    if (fileInputRef.current)
                                                        fileInputRef.current.value =
                                                            "";
                                                }}
                                                className="text-xs text-gray-400 hover:text-red-400"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    <textarea
                                        ref={textareaRef}
                                        value={prompt}
                                        onChange={(e) =>
                                            setPrompt(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        placeholder={
                                            isListening
                                                ? "Voice com-link active... speak now"
                                                : "Enter tactical directive or attach classified intel..."
                                        }
                                        rows={1}
                                        className="max-h-[180px] w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-relaxed text-white outline-none placeholder:text-gray-500"
                                    />

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />

                                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 pt-1">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <button
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs text-gray-300 transition hover:border-amber-400/40 hover:text-amber-300"
                                            >
                                                <span>+</span> Intel File
                                            </button>

                                            <button
                                                onClick={handleVoiceTyping}
                                                className={`flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition ${
                                                    isListening
                                                        ? "animate-pulse border-red-400/60 bg-red-500/20 text-red-300"
                                                        : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-amber-400/40 hover:text-amber-300"
                                                }`}
                                            >
                                                {isListening
                                                    ? "● Recording"
                                                    : "🎙 Com-Link"}
                                            </button>

                                            {["Forensic Mode", "Stealth Code"].map(
                                                (mode) => (
                                                    <button
                                                        key={mode}
                                                        onClick={() =>
                                                            setActiveMode(
                                                                activeMode ===
                                                                    mode
                                                                    ? "Default"
                                                                    : mode
                                                            )
                                                        }
                                                        className={`hidden h-8 items-center gap-1 rounded-full border px-3 text-xs transition sm:flex ${
                                                            activeMode === mode
                                                                ? "border-amber-400/50 bg-amber-400/15 text-amber-300"
                                                                : "border-white/[0.07] text-gray-400 hover:text-gray-200"
                                                        }`}
                                                    >
                                                        ⚡ {mode}
                                                    </button>
                                                )
                                            )}
                                        </div>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={
                                                (!prompt.trim() &&
                                                    !selectedFile) ||
                                                loading
                                            }
                                            className="flex h-9 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-black shadow-[0_0_20px_rgba(250,204,21,0.45)] transition hover:scale-105 active:scale-95 disabled:opacity-30 disabled:shadow-none"
                                            title="Transmit"
                                        >
                                            <BatEmblem className="h-3.5 w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VIEW 2: TELEMETRY */}
                {activeView === "analytics" && (
                    <div className="flex-1 overflow-y-auto p-6 sm:p-10">
                        <div className="mx-auto max-w-4xl">
                            <h2 className="text-2xl font-bold text-amber-300">
                                Batcave Telemetry
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Live diagnostic status of WayneTech servers.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-amber-400/20 bg-[#0a0c12]/80 p-6 backdrop-blur-md">
                                    <span className="text-xs text-gray-400">
                                        Mission Logs
                                    </span>
                                    <p className="mt-2 text-4xl font-bold text-amber-400">
                                        {chats.length}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-amber-400/20 bg-[#0a0c12]/80 p-6 backdrop-blur-md">
                                    <span className="text-xs text-gray-400">
                                        Active Mainframe
                                    </span>
                                    <p className="mt-2 text-xl font-bold text-white">
                                        {selectedModel}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-sky-400/20 bg-[#0a0c12]/80 p-6 backdrop-blur-md">
                                    <span className="text-xs text-gray-400">
                                        Batmobile Status
                                    </span>
                                    <p className="mt-2 text-xl font-bold text-sky-400">
                                        Patrolling Sector 7
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VIEW 3: PROTOCOLS */}
                {activeView === "guide" && (
                    <div className="flex-1 overflow-y-auto p-6 sm:p-10">
                        <div className="mx-auto max-w-3xl space-y-4">
                            <h2 className="text-2xl font-bold text-amber-300">
                                WayneTech Protocols
                            </h2>
                            {[
                                [
                                    "Intel Dossier Upload",
                                    "Drop PDF, DOCX, TXT, JPG, or PNG files up to 10MB for forensic breakdown.",
                                ],
                                [
                                    "Voice Com-Link",
                                    "Hands-free voice transcription straight into the Batcomputer terminal.",
                                ],
                                [
                                    "Stealth Code Blocks",
                                    "Syntax-highlighted code with instant clipboard extraction.",
                                ],
                            ].map(([title, desc]) => (
                                <div
                                    key={title}
                                    className="rounded-2xl border border-amber-400/20 bg-[#0a0c12]/80 p-5 backdrop-blur-md"
                                >
                                    <h3 className="font-semibold text-amber-300">
                                        {title}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-400">
                                        {desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;