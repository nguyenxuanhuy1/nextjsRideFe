"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfor } from "@/api/auth";
import { myCreate } from "@/api/apiUser";
import { User, Trip } from "@/hooks/interface";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Car,
  MapPin,
  Clock,
  Shield,
  LogOut,
  ChevronRight,
  Star,
} from "lucide-react";
import Link from "next/link";
import Loading from "@/components/Loading";

const statusConfig = {
  0: { text: "Mới tạo", cls: "badge badge-new" },
  1: { text: "Đang mở", cls: "badge badge-open" },
  2: { text: "Đầy chỗ", cls: "badge badge-full" },
  3: { text: "Đang đi", cls: "badge badge-moving" },
  4: { text: "Hoàn thành", cls: "badge badge-done" },
} as const;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/");
      return;
    }

    const loadData = async () => {
      try {
        const [userRes, tripsRes] = await Promise.all([
          getUserInfor(),
          myCreate(),
        ]);
        if (userRes.status === 200) setUser(userRes.data);
        if (tripsRes.status === 200) setTrips(tripsRes.data);
      } catch (err) {
        console.error("Lỗi load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  if (!user) return null;

  const completedTrips = trips.filter((t) => t.status === 4).length;
  const activeTrips = trips.filter((t) => t.status === 1 || t.status === 3).length;
  const joinedAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        month: "long",
        year: "numeric",
      })
    : "Chưa rõ";

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        {/* ── Header Card ── */}
        <div
          className="relative overflow-hidden rounded-2xl p-8 mb-6"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #0d9488 50%, #0ea5e9 100%)",
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, white, transparent 70%)",
              transform: "translate(30%, -30%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, white, transparent 70%)",
              transform: "translate(-30%, 30%)",
            }}
          />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-xl"
              />
              {user.role === "ADMIN" && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                {user.role === "ADMIN" && (
                  <span className="px-2 py-0.5 bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-bold rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-emerald-100">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Tham gia từ {joinedAt}
                </span>
                <span className="flex items-center gap-1.5 capitalize">
                  <UserIcon className="w-3.5 h-3.5" />
                  {user.provider}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all border border-white/20 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Car, label: "Chuyến đã tạo", value: trips.length, color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: Star, label: "Hoàn thành", value: completedTrips, color: "text-amber-600", bg: "bg-amber-50" },
            { icon: MapPin, label: "Đang hoạt động", value: activeTrips, color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Shield, label: "Vai trò", value: user.role === "ADMIN" ? "Admin" : "User", color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="card-flat p-5 text-center">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── Trips ── */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-600" />
              Chuyến đi đã tạo
            </h2>
            <Link href="/My-trip" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Quản lý <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 text-sm">Bạn chưa tạo chuyến nào</p>
              <Link href="/create-trip" className="btn btn-primary btn-sm mt-4 inline-flex">
                Tạo chuyến đầu tiên
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.slice(0, 5).map((trip) => {
                const s = statusConfig[trip.status] ?? statusConfig[0];
                return (
                  <Link
                    key={trip.rideId}
                    href={`/detail-trip/${trip.id}`}
                    className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
                  >
                    {/* Route line */}
                    <div className="route-line flex-shrink-0">
                      <div className="route-dot-start" />
                      <div className="route-connector" />
                      <div className="route-dot-end" />
                    </div>

                    {/* Addresses */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 line-clamp-1">{trip.startAddress}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{trip.endAddress}</p>
                    </div>

                    {/* Meta */}
                    <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={s.cls}>{s.text}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(trip.startTime).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
                  </Link>
                );
              })}

              {trips.length > 5 && (
                <Link
                  href="/My-trip"
                  className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700 border-t border-slate-100 mt-2 transition-colors"
                >
                  Xem tất cả {trips.length} chuyến
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
