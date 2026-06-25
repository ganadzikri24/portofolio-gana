"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20vw] left-[-10vw] w-[60vw] h-[60vw] border-[1px] border-white/20 rounded-full animate-[spin_80s_linear_infinite]" />
        <div className="absolute bottom-[-30vw] right-[-10vw] w-[80vw] h-[80vw] border-[2px] border-white/10 rounded-full animate-[spin_100s_linear_infinite_reverse]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-10 md:p-12 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <ShieldCheck size={32} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-white text-center mb-2 tracking-tight">Admin Area</h1>
        <p className="text-sm text-gray-500 text-center mb-10 font-medium">Masukan kata sandi untuk mengakses Dasbor.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-500" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata Sandi..."
              className="w-full bg-[#111] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
              required
            />
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center font-medium">
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? "Memverifikasi..." : "Akses Dasbor"}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
