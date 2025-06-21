"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy, Gift, Sparkles } from "lucide-react";

// Dynamically import Wheel component to avoid SSR issues
const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  {
    ssr: false,
    loading: () => (
      <div className="w-80 h-80 rounded-full border-8 border-gray-300 flex items-center justify-center bg-gray-100">
        <div className="text-gray-500 text-lg font-semibold">Loading...</div>
      </div>
    ),
  }
);

interface Prize {
  id: number;
  name: string;
  description: string;
  quantity: number;
  category: "hadiah" | "zonk";
  created_at: string;
}

interface WheelPrize {
  option: string;
  style?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

// Helper function to generate random colors for wheel segments
function getRandomColor(): string {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

const LuckyWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [username, setUsername] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [hasWon, setHasWon] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [wheelPrizes, setWheelPrizes] = useState<WheelPrize[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrizes = async () => {
    try {
      const response = await fetch("/api/admin/prizes");
      const data = await response.json();
      if (data.prizes && Array.isArray(data.prizes)) {
        // Store original prize data
        setPrizes(data.prizes);

        // Format for wheel display
        const formattedPrizes = data.prizes.map((prize: Prize) => ({
          option: prize.name,
          style: {
            backgroundColor:
              prize.category === "zonk" ? "#ff6b6b" : getRandomColor(),
            textColor: "white",
          },
        }));
        setWheelPrizes(formattedPrizes);
      }
    } catch (error) {
      console.error("Error fetching prizes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  const handleSpinClick = async () => {
    if (!username.trim()) {
      toast.error("Silakan masukkan nama pengguna!");
      return;
    }

    if (!couponCode.trim() || couponCode.length !== 5) {
      toast.error("Kode kupon harus 5 karakter!");
      return;
    }

    try {
      // Validate coupon
      const response = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: couponCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Kode kupon tidak valid!");
        return;
      }

      // Find the prize index based on the assigned prize_id from coupon
      const assignedPrizeIndex = prizes.findIndex(
        (prize) => prize.id === result.coupon.prize_id
      );

      if (assignedPrizeIndex === -1) {
        toast.error("Hadiah tidak ditemukan!");
        return;
      }

      // Start spinning with the assigned prize
      setIsSpinning(true);
      setPrizeNumber(assignedPrizeIndex);
      setMustSpin(true);
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleStopSpinning = async () => {
    setMustSpin(false);
    setIsSpinning(false);
    const selectedPrizeName =
      wheelPrizes[prizeNumber]?.option || "Unknown Prize";
    const selectedPrize = prizes.find((p) => p.name === selectedPrizeName);

    if (selectedPrize) {
      setWonPrize(selectedPrize);
    }

    try {
      const response = await fetch("/api/spin-wheel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          couponCode,
          prizeName: selectedPrizeName,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setHasWon(true);
        setShowWinDialog(true);
      } else {
        toast.error(data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error recording win:", error);
      toast.error("Terjadi kesalahan saat merekam kemenangan");
    }
  };

  const resetGame = () => {
    setUsername("");
    setCouponCode("");
    setHasWon(false);
    setWonPrize(null);
    setPrizeNumber(0);
    setShowWinDialog(false);
  };

  const closeWinDialog = () => {
    setShowWinDialog(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-8 p-4">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="Sekawan78 Logo"
              className="h-16 md:h-20 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2">
            SEKAWAN78
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-yellow-600 dark:text-yellow-400">
            Lucky Spin
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Terus mainkan dan raih keberuntuntungan di{" "}
            <a
              href="https://sekawan78.info/"
              className="text-yellow-600 underline hover:text-yellow-500 font-semibold"
            >
              Sekawan78
            </a>
          </p>
        </div>

        {/* Loading Wheel */}
        <div className="w-80 h-80 rounded-full border-8 border-gray-300 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="text-gray-500 text-lg font-semibold">
            Memuat roda...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8 p-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="Sekawan78 Logo"
            className="h-16 md:h-20 w-auto"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2">
          SEKAWAN78
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-yellow-600 dark:text-yellow-400">
          Lucky Spin
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          Terus mainkan dan raih keberuntuntungan di{" "}
          <a
            href="https://sekawan78.info/"
            className="text-yellow-600 underline hover:text-yellow-500 font-semibold"
          >
            Sekawan78
          </a>
        </p>
      </div>

      {/* Wheel */}
      <div className="relative">
        {wheelPrizes.length > 0 && (
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={wheelPrizes}
            onStopSpinning={handleStopSpinning}
            backgroundColors={[
              "#FCD34D",
              "#F59E0B",
              "#FBBF24",
              "#EAB308",
              "#FDE047",
              "#FACC15",
            ]}
            textColors={["#000000"]}
            outerBorderColor="#000000"
            outerBorderWidth={8}
            innerBorderColor="#000000"
            innerBorderWidth={4}
            radiusLineColor="#000000"
            radiusLineWidth={2}
            fontSize={16}
            textDistance={60}
          />
        )}
      </div>

      {/* Input Form */}
      {!hasWon && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Masukkan Data Anda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nama Pengguna</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan nama Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSpinning}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon">Kode Kupon (5 karakter)</Label>
              <Input
                id="coupon"
                type="text"
                placeholder="Masukkan kode kupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                maxLength={5}
                disabled={isSpinning}
              />
            </div>
            <Button
              onClick={handleSpinClick}
              disabled={
                isSpinning || !username.trim() || couponCode.length !== 5
              }
              className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-bold py-3 text-lg shadow-lg"
            >
              {isSpinning ? "Berputar..." : "PUTAR RODA!"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Win Dialog */}
      <Dialog open={showWinDialog} onOpenChange={setShowWinDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle
              className={`flex items-center gap-2 text-2xl font-bold ${
                wonPrize?.category === "zonk"
                  ? "text-blue-600"
                  : "text-green-600"
              }`}
            >
              <Trophy className="h-6 w-6" />
              {wonPrize?.category === "zonk" ? "Coba Lagi!" : "Selamat!"}
            </DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <Gift className="h-16 w-16 text-orange-500" />
                  <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-800">
                  <strong>{username}</strong>,{" "}
                  {wonPrize?.category === "zonk"
                    ? "silakan coba lagi:"
                    : "Anda memenangkan:"}
                </p>
                <p
                  className={`text-xl font-bold p-3 rounded-lg border-2 ${
                    wonPrize?.category === "zonk"
                      ? "text-blue-600 bg-blue-50 border-blue-200"
                      : "text-orange-600 bg-orange-50 border-orange-200"
                  }`}
                >
                  {wonPrize?.name}
                </p>
                {wonPrize?.description && (
                  <p className="text-sm text-gray-600 italic">
                    {wonPrize.description}
                  </p>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={closeWinDialog}
              variant="outline"
              className="flex-1"
            >
              Tutup
            </Button>
            {wonPrize?.category === "hadiah" && (
              <Button
                onClick={() => {
                  const currentTime = new Date().toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const message = `Saya (${username}) telah memenangkan ${wonPrize.name} dari lucky spin sekawan78 pada ${currentTime}`;
                  const whatsappUrl = `https://wa.me/6285589470567?text=${encodeURIComponent(
                    message
                  )}`;
                  window.open(whatsappUrl, "_blank");
                  toast.success("Hadiah berhasil diklaim!");
                  closeWinDialog();
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold"
              >
                Klaim Sekarang
              </Button>
            )}
            <Button
              onClick={resetGame}
              className="flex-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-semibold shadow-lg"
            >
              Main Lagi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LuckyWheel;
