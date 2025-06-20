"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authService } from "@/lib/auth";
import { toast } from "sonner";
import { Trash2, LogOut } from "lucide-react";

interface Prize {
  id: number;
  name: string;
  description: string;
  quantity: number;
}

interface Coupon {
  id: number;
  code: string;
  prize_id: number | null;
  prize_name: string | null;
  is_used: boolean;
}

interface User {
  id: number;
  username: string;
  prize_name: string;
  coupon_code: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"prizes" | "coupons" | "users">(
    "prizes"
  );
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Prize form state
  const [prizeForm, setPrizeForm] = useState({
    id: null as number | null,
    name: "",
    description: "",
    quantity: 0,
  });

  // Coupon form state
  const [couponForm, setCouponForm] = useState({
    id: null as number | null,
    code: "",
    prizeId: null as number | null,
  });

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      if (!authService.isAdmin()) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "prizes") {
      fetchPrizes();
    } else if (isAuthenticated && activeTab === "coupons") {
      fetchCoupons();
    } else if (isAuthenticated && activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, isAuthenticated]);

  const handleLogout = () => {
    authService.logout();
    toast.success("Logout berhasil!");
    router.push("/");
  };

  const fetchPrizes = async () => {
    try {
      const response = await fetch("/api/admin/prizes");
      const data = await response.json();
      setPrizes(data.prizes || []);
    } catch (error) {
      toast.error("Gagal memuat data hadiah");
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/admin/coupons");
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      toast.error("Gagal memuat data kupon");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      toast.error("Gagal memuat data pengguna");
    }
  };

  const handlePrizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = prizeForm.id ? "PUT" : "POST";
      const response = await fetch("/api/admin/prizes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prizeForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setPrizeForm({ id: null, name: "", description: "", quantity: 0 });
        fetchPrizes();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = couponForm.id ? "PUT" : "POST";
      const response = await fetch("/api/admin/coupons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setCouponForm({ id: null, code: "", prizeId: null });
        fetchCoupons();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const deletePrize = async (id: number) => {
    if (!confirm("Yakin ingin menghapus hadiah ini?")) return;

    try {
      const response = await fetch(`/api/admin/prizes?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        fetchPrizes();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const deleteCoupon = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kupon ini?")) return;

    try {
      const response = await fetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        fetchCoupons();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const generateRandomCoupon = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCouponForm({ ...couponForm, code: result });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              SEKAWAN78 Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Kelola hadiah, kupon, dan data pengguna
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === "prizes" ? "default" : "outline"}
            onClick={() => setActiveTab("prizes")}
          >
            Hadiah
          </Button>
          <Button
            variant={activeTab === "coupons" ? "default" : "outline"}
            onClick={() => setActiveTab("coupons")}
          >
            Kupon
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
          >
            Pemenang
          </Button>
        </div>

        {/* Prizes Tab */}
        {activeTab === "prizes" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add/Edit Prize Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {prizeForm.id ? "Edit Hadiah" : "Tambah Hadiah"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePrizeSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="prizeName">Nama Hadiah</Label>
                    <Input
                      id="prizeName"
                      value={prizeForm.name}
                      onChange={(e) =>
                        setPrizeForm({ ...prizeForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="prizeDescription">Deskripsi</Label>
                    <Input
                      id="prizeDescription"
                      value={prizeForm.description}
                      onChange={(e) =>
                        setPrizeForm({
                          ...prizeForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="prizeQuantity">
                      Kuantitas (-1 untuk unlimited)
                    </Label>
                    <Input
                      id="prizeQuantity"
                      type="number"
                      value={prizeForm.quantity}
                      onChange={(e) =>
                        setPrizeForm({
                          ...prizeForm,
                          quantity: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={loading}>
                      {prizeForm.id ? "Update" : "Tambah"}
                    </Button>
                    {prizeForm.id && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setPrizeForm({
                            id: null,
                            name: "",
                            description: "",
                            quantity: 0,
                          })
                        }
                      >
                        Batal
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Prizes List */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar Hadiah</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {prizes.map((prize) => (
                    <div
                      key={prize.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <h4 className="font-medium">{prize.name}</h4>
                        <p className="text-sm text-gray-600">
                          {prize.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty:{" "}
                          {prize.quantity === -1 ? "Unlimited" : prize.quantity}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setPrizeForm({
                              id: prize.id,
                              name: prize.name,
                              description: prize.description,
                              quantity: prize.quantity,
                            })
                          }
                        >
                          Edit
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Konfirmasi Hapus Hadiah</DialogTitle>
                              <DialogDescription>
                                Apakah Anda yakin ingin menghapus hadiah &quot;
                                {prize.name}&quot;? Tindakan ini tidak dapat
                                dibatalkan.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">Batal</Button>
                              <Button
                                variant="destructive"
                                onClick={() => deletePrize(prize.id)}
                              >
                                Hapus
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === "coupons" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add/Edit Coupon Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {couponForm.id ? "Edit Kupon" : "Tambah Kupon"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCouponSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="couponCode">Kode Kupon (5 karakter)</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="couponCode"
                        value={couponForm.code}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                        maxLength={5}
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateRandomCoupon}
                      >
                        Random
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="couponPrize">Hadiah (opsional)</Label>
                    <select
                      id="couponPrize"
                      className="w-full p-2 border rounded"
                      value={couponForm.prizeId || ""}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          prizeId: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        })
                      }
                    >
                      <option value="">Pilih hadiah...</option>
                      {prizes.map((prize) => (
                        <option key={prize.id} value={prize.id}>
                          {prize.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={loading}>
                      {couponForm.id ? "Update" : "Tambah"}
                    </Button>
                    {couponForm.id && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setCouponForm({ id: null, code: "", prizeId: null })
                        }
                      >
                        Batal
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Coupons List */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar Kupon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <h4 className="font-medium">{coupon.code}</h4>
                        <p className="text-sm text-gray-600">
                          {coupon.prize_name || "Tidak ada hadiah terkait"}
                        </p>
                        <p
                          className={`text-xs ${
                            coupon.is_used ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {coupon.is_used
                            ? "Sudah digunakan"
                            : "Belum digunakan"}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setCouponForm({
                              id: coupon.id,
                              code: coupon.code,
                              prizeId: coupon.prize_id,
                            })
                          }
                          disabled={coupon.is_used}
                        >
                          Edit
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={coupon.is_used}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Konfirmasi Hapus Kupon</DialogTitle>
                              <DialogDescription>
                                Apakah Anda yakin ingin menghapus kupon &quot;
                                {coupon.code}&quot;? Tindakan ini tidak dapat
                                dibatalkan.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">Batal</Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteCoupon(coupon.id)}
                              >
                                Hapus
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pemenang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 p-2 text-left">
                        Username
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Hadiah
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Kupon
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Waktu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="border border-gray-300 p-2">
                          {user.username}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {user.prize_name}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {user.coupon_code}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {new Date(user.timestamp).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
