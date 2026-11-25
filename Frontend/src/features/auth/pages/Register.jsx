import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BatEmblem = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 120 60" fill="currentColor" className={className}>
        <path d="M60 8 L64 18 L68 10 L72 22 C84 16 102 14 118 22 C104 26 96 34 94 44 C84 36 74 38 68 46 L60 54 L52 46 C46 38 36 36 26 44 C24 34 16 26 2 22 C18 14 36 16 48 22 L52 10 L56 18 Z" />
    </svg>
);

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await axios.post(
               `${import.meta.env.VITE_API_URL}/api/auth/register`,
                {
                    username,
                    email,
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            console.log("Registration successful:", response.data);

            alert(
                "Registration successful! Please check your email for verification."
            );

            setUsername("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error(
                "Registration failed:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.err ||
                    error.response?.data?.message ||
                    "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050608] px-4 py-8 text-gray-100 selection:bg-amber-400/25 selection:text-amber-200">
            {/* Gotham Moody Background & Bat-Signal */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#171d2b_0%,#07080c_55%,#030405_100%)]" />

                {/* Tactical Grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(250,204,21,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.35) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* Glowing Bat-Signal */}
                <div className="animate-batsignal absolute -top-14 left-[10%] flex h-72 w-72 items-center justify-center rounded-full bg-amber-300/20 blur-2xl">
                    <div className="flex h-40 w-40 items-center justify-center rounded-full border border-amber-300/40 bg-amber-200/25 shadow-[0_0_80px_rgba(251,191,36,0.45)]">
                        <BatEmblem className="h-16 w-28 text-black/80" />
                    </div>
                </div>

                {/* Flying Bats */}
                <div className="animate-bat-1 absolute top-[18%] left-0 text-amber-400/35">
                    <BatEmblem className="animate-wing h-5 w-10" />
                </div>
                <div className="animate-bat-2 absolute top-[72%] left-0 text-sky-400/25">
                    <BatEmblem className="animate-wing h-4 w-8" />
                </div>
            </div>

            {/* Registration Terminal Card */}
            <div className="relative z-10 w-full max-w-md rounded-3xl border border-amber-400/25 bg-[#090b10]/85 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(250,204,21,0.15)] backdrop-blur-2xl">
                {/* Top Emblem & Status */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-11 w-16 items-center justify-center rounded-2xl border border-amber-400/35 bg-amber-400/10 text-amber-400 shadow-[0_0_25px_rgba(250,204,21,0.2)]">
                        <BatEmblem className="h-6 w-11" />
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                        New Clearance
                    </span>
                </div>

                <h1 className="bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
                    Join the Watch
                </h1>

                <p className="mt-1.5 text-sm text-gray-400">
                    Register your operative profile to access BatAI.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-gray-300"
                        >
                            Codename / Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="dark_knight"
                            required
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-gray-100 placeholder-gray-600 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-gray-300"
                        >
                            Secure Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="operative@gotham.org"
                            required
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-gray-100 placeholder-gray-600 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-gray-300"
                        >
                            Encrypted Passkey
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a strong passkey"
                            required
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-gray-100 placeholder-gray-600 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 py-3 text-sm font-bold text-black shadow-[0_0_25px_rgba(250,204,21,0.35)] transition hover:scale-[1.01] hover:from-amber-300 hover:to-yellow-300 active:scale-[0.99] disabled:opacity-50"
                    >
                        <BatEmblem className="h-4 w-7" />
                        <span>
                            {loading
                                ? "Generating Clearance..."
                                : "Activate Operative"}
                        </span>
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already cleared for access?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-amber-400 transition hover:text-amber-300 hover:underline"
                    >
                        Log in
                    </Link>
                </p>
            </div>

            {/* Footer Credit */}
            <p className="relative z-10 mt-6 font-mono text-xs tracking-wider text-gray-500">
                Engineered & Made by{" "}
                <span className="font-semibold text-amber-400/90">
                    Alok Yadav
                </span>
            </p>
        </div>
    );
};

export default Register;