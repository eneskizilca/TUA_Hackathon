"use client";

import { AtSign, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      // Backend OAuth2PasswordRequestForm bekliyor (form-data format)
      const formBody = new URLSearchParams();
      formBody.append("username", formData.email); // OAuth2 'username' field'ı bekliyor
      formBody.append("password", formData.password);

      console.log("Login attempt:", { email: formData.email });

      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      const data = await response.json();
      console.log("Login response:", response.status, data);

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Token'ı localStorage'a kaydet
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Role'e göre yönlendir
      if (data.user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (data.user.role === "OPERATOR") {
        router.push("/dashboard/operator");
      } else {
        router.push("/dashboard/observer");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-[#070809] p-4 text-[0.7rem] text-slate-400 overflow-hidden font-mono tracking-widest uppercase">
      {/* Background Pattern - Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Background Pattern - Circles */}
      <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-[30%] -right-[15%] w-[60vw] h-[60vw] rounded-full border border-white/5 pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-[420px] bg-[#0c0d0f] border-t-2 border-[#7be1ea] p-10 relative z-10 flex flex-col items-center">

        {/* Logo Placement */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/astrologo.gif"
            alt="Logo"
            width={80}
            height={80}
            className="opacity-95 mix-blend-screen"
            unoptimized
          />
        </div>

        <h1 className="text-2xl font-bold text-white tracking-[0.4em] mb-3">
          ORBITAL SENSE
        </h1>
        <div className="text-[#3a8a92] text-[0.6rem] tracking-[0.15em] mb-8 font-bold text-center">
          BEYOND THE ATMOSPHERE. PREDICTING THE ANOMALY.
        </div>

        <div className="text-[#5a6a75] text-[0.6rem] tracking-[0.2em] mb-10 text-center">
          SECURE TERMINAL ACCESS
        </div>

        <form className="w-full space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 mb-6 text-red-400 text-xs font-mono tracking-wider">
              {error}
            </div>
          )}

          <div className="relative group">
            <label className="text-[0.65rem] text-[#5a6a75] tracking-widest mb-2 block font-bold">
              IDENTIFIER [MAIL]
            </label>
            <div className="relative flex items-center border-b border-white/10 group-focus-within:border-[#7be1ea] transition-colors pb-2">
              <AtSign className="w-4 h-4 text-[#5a6a75] mr-4" />
              <input
                type="email"
                placeholder="orbital_id@astro.sys"
                className="bg-transparent w-full text-white placeholder-[#3a4a55] outline-none text-sm tracking-wider"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="relative group">
            <label className="text-[0.65rem] text-[#5a6a75] tracking-widest mb-2 block font-bold">
              KEY_PHRASE [PASSWORD]
            </label>
            <div className="relative flex items-center border-b border-white/10 group-focus-within:border-[#7be1ea] transition-colors pb-2">
              <Lock className="w-4 h-4 text-[#5a6a75] mr-4" />
              <input
                type="password"
                placeholder="••••••••••••"
                className="bg-transparent w-full text-white placeholder-[#3a4a55] outline-none text-lg tracking-[0.3em]"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#7be1ea] text-black font-extrabold tracking-[0.25em] text-[0.8rem] py-4 flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.99] transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? "AUTHENTICATING..." : "SIGN IN"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <Link href="/auth/forgot-password" className="mt-8 text-[0.6rem] tracking-widest text-[#5a6a75] hover:text-white cursor-pointer transition-colors">
          FORGOT PASSWORD
        </Link>

        <div className="mt-8 text-[0.65rem] tracking-widest text-[#5a6a75]">
          DON&apos;T HAVE AN ACCOUNT? <Link href="/auth/register" className="text-[#7be1ea] hover:text-white transition-colors">SIGN UP</Link>
        </div>

        <div className="w-full h-px bg-white/5 my-8" />

        <div className="w-full flex justify-between items-end text-[0.55rem] tracking-widest text-[#4a5a65]">
          <div className="space-y-1">
            <div>NODE: 401.ALPHA</div>
            <div>ENCRYPTION: AES-256-GCM</div>
          </div>
          <div className="flex items-center gap-2 text-[#a3e635]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a3e635]" />
            SYSTEM ONLINE
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="absolute bottom-6 w-full px-10 flex justify-between items-center text-[0.55rem] text-[#4a5a65] tracking-[0.2em] z-0">
        <div>
          © 2024 ORBITAL SENTINEL SYSTEMS. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-8">
          <span className="hover:text-white cursor-pointer transition-colors">PRIVACY</span>
          <span className="hover:text-white cursor-pointer transition-colors">SECURITY</span>
          <span className="hover:text-white cursor-pointer transition-colors">TERMINAL_LOGS</span>
        </div>
      </div>
    </main>
  );
}
