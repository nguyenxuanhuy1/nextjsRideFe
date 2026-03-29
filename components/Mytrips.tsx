"use client";

import { useEffect, useState } from "react";
import {
  acceptPassenger,
  myCreate,
  notification,
  rejectPassenger,
} from "@/api/apiUser";
import { Trip } from "@/hooks/interface";
import {
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Clock,
  Car,
  Bell,
} from "lucide-react";
import Loading from "./Loading";

const participantStatus: Record<number, { text: string; cls: string }> = {
  0: { text: "Chờ phản hồi", cls: "badge badge-pending" },
  1: { text: "Đã chấp nhận", cls: "badge badge-accepted" },
  2: { text: "Đã từ chối", cls: "badge badge-rejected" },
};

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [openTrip, setOpenTrip] = useState<number | null>(null);
  const [outstanding, setOutstanding] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = async () => {
    try {
      const res = await myCreate();
      if (res.status === 200) setTrips(res.data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        const res = await notification();
        if (res.status === 200) setOutstanding(res.data.rides);
      } catch (error) {
        console.error("Lỗi khi gọi API thông báo:", error);
      }
    };
    fetchNotification();
  }, []);

  const handlePassengerAction = async (
    participantId: number,
    action: "accepted" | "rejected"
  ) => {
    try {
      if (action === "accepted") {
        await acceptPassenger(participantId);
      } else {
        await rejectPassenger(participantId);
      }
      window.dispatchEvent(new CustomEvent("updateNotification"));
      await loadTrips();
    } catch (err) {
      console.error("Lỗi khi xử lý passenger:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loading />
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-lg text-slate-900 mb-2">Chuyến đi của tôi</h1>
          <p className="text-slate-500">Quản lý các chuyến bạn đã tạo và danh sách hành khách</p>
        </div>

        {/* Empty state */}
        {trips.length === 0 && (
          <div className="card text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="heading-md text-slate-700 mb-2">Chưa có chuyến nào</h3>
            <p className="text-slate-500 text-sm">Hãy tạo chuyến đi đầu tiên của bạn!</p>
            <a href="/create-trip" className="btn btn-primary mt-6 inline-flex">
              <Car className="w-4 h-4" />
              Tạo chuyến ngay
            </a>
          </div>
        )}

        {/* Trip List */}
        <div className="space-y-4">
          {trips.map((trip) => {
            const hasNotif = outstanding?.includes(trip.rideId);
            const isOpen = openTrip === trip.rideId;
            const pendingCount = trip.participants?.filter((p) => p.status === 0).length ?? 0;

            return (
              <div
                key={trip.rideId}
                className={`card overflow-hidden transition-all ${
                  hasNotif ? "border-l-4 border-l-orange-400" : ""
                }`}
              >
                <div className="p-5">
                  {/* Trip header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Notification indicator */}
                      {hasNotif && (
                        <div className="flex items-center gap-1.5 mb-2 text-orange-600">
                          <Bell className="w-3.5 h-3.5 animate-pulse" />
                          <span className="text-xs font-semibold">{pendingCount} yêu cầu mới</span>
                        </div>
                      )}

                      {/* Route */}
                      <div className="flex gap-3">
                        <div className="route-line mt-1 flex-shrink-0">
                          <div className="route-dot-start" />
                          <div className="route-connector" />
                          <div className="route-dot-end" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Từ</span>
                            <p className="text-sm font-semibold text-slate-800 mt-0.5 line-clamp-1">{trip.startAddress}</p>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Đến</span>
                            <p className="text-sm text-slate-600 mt-0.5 line-clamp-1">{trip.endAddress}</p>
                          </div>
                        </div>
                      </div>

                      {/* Meta chips */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {trip.occupied}/{trip.capacity} người
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(trip.startTime).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </div>

                    {/* Toggle button */}
                    <button
                      onClick={() => setOpenTrip(isOpen ? null : trip.rideId)}
                      className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-all flex-shrink-0 ${
                        isOpen
                          ? "bg-slate-100 text-slate-700"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {isOpen ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          <span className="hidden sm:inline">Thu gọn</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span className="hidden sm:inline">Xem hành khách</span>
                          {pendingCount > 0 && (
                            <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center ml-1">
                              {pendingCount}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Passengers Panel */}
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/50 animate-fade-in">
                    {trip.participants.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Chưa có ai xin đi nhờ</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {trip.participants.map((p) => {
                          const pStatus = participantStatus[p.status] ?? participantStatus[0];
                          return (
                            <div
                              key={p.id}
                              className="flex items-center gap-4 px-5 py-4"
                            >
                              {/* Avatar */}
                              <img
                                src={p.avatar || "/default-avatar.png"}
                                alt={p.userName}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0"
                              />

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-semibold text-slate-800 text-sm">{p.userName}</p>
                                  <span className={pStatus.cls}>{pStatus.text}</span>
                                </div>
                                {p.note && (
                                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                    💬 {p.note}
                                  </p>
                                )}
                              </div>

                              {/* Actions */}
                              {p.status === 0 && (
                                <div className="flex gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => handlePassengerAction(p.id, "accepted")}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                                    title="Chấp nhận"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span className="sm:inline hidden">Chấp nhận</span>
                                  </button>
                                  <button
                                    onClick={() => handlePassengerAction(p.id, "rejected")}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors"
                                    title="Từ chối"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span className="sm:inline hidden">Từ chối</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
