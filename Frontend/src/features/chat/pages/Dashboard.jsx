
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

const Dashboard = () => {
    const { initializeSocketConnection } = useChat();
    const { user } = useSelector((state) => state.auth);

    const [prompt, setPrompt] = useState("");
    const [activeTab, setActiveTab] = useState("AI Chat");

const chats= useSelector((state) => state.chat.chats);
const currentChatId= useSelector((state) => state.chat.currentChatId);



    useEffect(() => {
        const socket = initializeSocketConnection();

        return () => {
            socket?.disconnect();
        };
    }, []);

    const navigation = [
        { icon: "⌂", label: "Dashboard" },
        { icon: "✧", label: "AI Chat" },
        { icon: "◷", label: "History" },
        { icon: "⚙", label: "Settings" },
    ];

    const suggestions = [
        {
            icon: "✧",
            title: "Smart Assistant",
            description: "Get instant answers to anything.",
            prompt: "What can you help me with today?",
        },
        {
            icon: "⌘",
            title: "Code Assistant",
            description: "Debug, build and understand code.",
            prompt: "Help me write clean and optimized code.",
        },
        {
            icon: "⌕",
            title: "Deep Research",
            description: "Explore topics in greater depth.",
            prompt: "Explain an interesting technology trend.",
        },
    ];

    return (
        <main className="relative flex h-screen w-full overflow-hidden bg-[#070907] text-white">

            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-[#65ff8b]/[0.055] blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] rounded-full bg-emerald-500/[0.035] blur-[140px]" />
                <div className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
                        backgroundSize: "45px 45px",
                    }}
                />
            </div>

            {/* Left Sidebar */}
            <aside className="relative z-10 flex w-[76px] shrink-0 flex-col items-center border-r border-white/[0.07] bg-[#090c09]/90 py-6">

                {/* Logo */}
                <div className="mb-12 flex h-10 w-10 items-center justify-center rounded-xl border border-[#72ff91]/30 bg-[#72ff91]/10 text-2xl font-bold text-[#72ff91] shadow-[0_0_25px_rgba(114,255,145,0.12)]">
                    A
                </div>

                {/* Navigation */}
                <div className="flex flex-1 flex-col items-center gap-4">
                    {navigation.map((item) => (
                        <button
                            key={item.label}
                            title={item.label}
                            onClick={() => setActiveTab(item.label)}
                            className={`group relative flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-all duration-300 ${
                                activeTab === item.label
                                    ? "border border-[#72ff91]/25 bg-[#72ff91]/10 text-[#72ff91] shadow-[0_0_20px_rgba(114,255,145,0.08)]"
                                    : "text-gray-500 hover:bg-white/[0.06] hover:text-white"
                            }`}
                        >
                            {item.icon}
                            {activeTab === item.label && (
                                <span className="absolute -left-[13px] h-5 w-[3px] rounded-full bg-[#72ff91] shadow-[0_0_12px_#72ff91]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Bottom profile */}
                <button
                    title="Account"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#151b16] text-sm font-semibold text-[#72ff91]"
                >
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </button>
            </aside>

            {/* Main Workspace */}
            <section className="relative z-10 flex min-w-0 flex-1 flex-col">

                {/* Top Navbar */}
                <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.07] px-6 md:px-9">

                    <div>
                        <h1 className="text-lg font-semibold tracking-wide">
                            Apex<span className="text-[#72ff91]">AI</span>
                        </h1>
                        <p className="text-[10px] tracking-[2px] text-gray-500">
                            INTELLIGENCE, REIMAGINED
                        </p>
                    </div>

                    <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] p-1 md:flex">
                        {["Dashboard", "AI Chat", "Help", "Account"].map((item) => (
                            <button
                                key={item}
                                onClick={() => setActiveTab(item)}
                                className={`rounded-full px-5 py-2 text-xs transition-all ${
                                    activeTab === item
                                        ? "border border-[#72ff91]/25 bg-[#72ff91]/10 text-[#72ff91]"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] px-3 py-2 sm:flex">
                            <span className="h-2 w-2 rounded-full bg-[#72ff91] shadow-[0_0_8px_#72ff91]" />
                            <span className="text-[11px] text-gray-400">AI Workspace</span>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#72ff91]/30 bg-[#72ff91]/10 text-sm font-semibold text-[#72ff91]">
                            {user?.username?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex flex-1 flex-col items-center overflow-y-auto px-5">

                    <div className="flex w-full max-w-[850px] flex-1 flex-col items-center justify-center py-12">

                        {/* AI Logo */}
                        <div className="relative mb-7 flex h-[76px] w-[76px] items-center justify-center">
                            <div className="absolute inset-0 animate-pulse rounded-full border border-[#72ff91]/20 shadow-[0_0_35px_rgba(114,255,145,0.15)]" />
                            <div className="absolute inset-[8px] rounded-full border border-[#72ff91]/30" />
                            <div className="absolute inset-[16px] rounded-full border border-[#72ff91]/50" />
                            <div className="h-5 w-5 rounded-full bg-[#72ff91] shadow-[0_0_25px_8px_rgba(114,255,145,0.45)]" />
                        </div>

                        {/* Welcome Text */}
                        <div className="mb-10 text-center">
                            <p className="mb-3 text-[11px] font-medium uppercase tracking-[4px] text-[#72ff91]/70">
                                Your intelligent workspace
                            </p>

                            <h2 className="text-3xl font-medium tracking-tight sm:text-5xl">
                                {user?.username
                                    ? `Hello, ${user.username}.`
                                    : "Welcome to ApexAI."}
                            </h2>

                            <h3 className="mt-3 text-2xl font-light tracking-tight text-gray-500 sm:text-4xl">
                                What are we exploring today?
                            </h3>

                            <p className="mt-5 text-sm text-gray-500">
                                Ask anything. Build something. Discover more.
                            </p>
                        </div>

                        {/* Suggestion Cards */}
                        <div className="mb-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                            {suggestions.map((item) => (
                                <button
                                    key={item.title}
                                    onClick={() => setPrompt(item.prompt)}
                                    className="group rounded-2xl border border-white/[0.08] bg-[#101510]/70 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#72ff91]/30 hover:bg-[#72ff91]/[0.045]"
                                >
                                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#72ff91]/20 bg-[#72ff91]/[0.08] text-lg text-[#72ff91] transition-all group-hover:shadow-[0_0_18px_rgba(114,255,145,0.15)]">
                                        {item.icon}
                                    </div>

                                    <h4 className="mb-1 text-sm font-medium text-gray-200">
                                        {item.title}
                                    </h4>

                                    <p className="text-xs leading-relaxed text-gray-500">
                                        {item.description}
                                    </p>
                                </button>
                            ))}
                        </div>

                        {/* Prompt Box */}
                        <div className="w-full rounded-2xl border border-[#72ff91]/20 bg-[#0d120e]/90 p-4 shadow-[0_0_40px_rgba(114,255,145,0.045)] transition-all duration-300 focus-within:border-[#72ff91]/50 focus-within:shadow-[0_0_35px_rgba(114,255,145,0.08)]">

                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ask ApexAI anything..."
                                rows={3}
                                className="w-full resize-none bg-transparent text-sm leading-relaxed text-white outline-none placeholder:text-gray-600"
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-3">

                                <div className="flex items-center gap-2">
                                    <button className="flex h-9 items-center gap-2 rounded-xl px-3 text-xs text-gray-400 transition hover:bg-white/[0.06] hover:text-white">
                                        <span className="text-base">＋</span>
                                        Attach
                                    </button>

                                    <button className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.07] px-3 text-xs text-gray-400 transition hover:border-[#72ff91]/30 hover:text-[#72ff91]">
                                        <span>✧</span>
                                        Deep Research
                                    </button>
                                </div>

                                <button
                                    disabled={!prompt.trim()}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#72ff91] text-lg text-[#071008] shadow-[0_0_20px_rgba(114,255,145,0.25)] transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(114,255,145,0.4)] disabled:cursor-not-allowed disabled:opacity-40"
                                    title="Send message"
                                >
                                    ↑
                                </button>
                            </div>
                        </div>

                        <p className="mt-5 text-center text-[10px] tracking-wide text-gray-600">
                            ApexAI can make mistakes. Verify important information.
                        </p>
                    </div>
                </div>
            </section>

            {/* Right Chat History */}
            <aside className="relative z-10 hidden w-[285px] shrink-0 flex-col border-l border-white/[0.07] bg-[#090d0a]/80 p-5 lg:flex">

                <div className="mb-7 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-200">
                        Chat History
                    </h3>

                    <button
                        onClick={() => setPrompt("")}
                        className="rounded-lg border border-[#72ff91]/25 bg-[#72ff91]/[0.08] px-3 py-2 text-[11px] text-[#72ff91] transition hover:bg-[#72ff91]/15"
                    >
                        + New Chat
                    </button>
                </div>

                <div className="mb-4">
                    <p className="mb-3 text-[10px] uppercase tracking-[2px] text-gray-600">
                        Recent conversations
                    </p>

                    <div className="rounded-xl border border-dashed border-white/[0.09] p-5 text-center">
                        <div className="mb-2 text-2xl text-gray-600">◷</div>
                        <p className="text-xs text-gray-400">
                            No conversations yet
                        </p>
                        <p className="mt-1 text-[10px] text-gray-600">
                            Your chats will appear here.
                        </p>
                    </div>
                </div>

                <div className="mt-auto rounded-xl border border-[#72ff91]/15 bg-[#72ff91]/[0.035] p-4">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#72ff91] shadow-[0_0_8px_#72ff91]" />
                        <span className="text-xs font-medium text-[#72ff91]">
                            ApexAI Workspace
                        </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-500">
                        Your personal AI space to think, create and explore.
                    </p>
                </div>
            </aside>
        </main>
    );
};

export default Dashboard;