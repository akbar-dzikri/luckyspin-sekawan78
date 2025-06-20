"use client";

import LuckyWheel from "@/components/LuckyWheel";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-bounce [animation-delay:0s]"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-yellow-300/40 rounded-full animate-bounce [animation-delay:1s]"></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:2s]"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-orange-300/30 rounded-full animate-bounce [animation-delay:0.5s]"></div>
        <div className="absolute top-60 left-1/2 w-2 h-2 bg-pink-300/40 rounded-full animate-bounce [animation-delay:1.5s]"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <LuckyWheel />
      </div>

      {/* Footer */}
      <footer className="bottom-0 left-0 right-0 text-center py-4 text-white/70 text-sm z-10">
        <p>&copy; 2025 Sekawan78. Semua hak dilindungi.</p>
      </footer>
    </main>
  );
}
