"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  acceptPassenger,
  myCreate,
  notification,
  rejectPassenger,
} from "@/api/apiUser";
import { Tag } from "antd";
import { Trip } from "@/hooks/interface";
import Image from "next/image";

// Interface theo API

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [openTrip, setOpenTrip] = useState<number | null>(null);
  const [outstanding, setOutstanding] = useState<number[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await myCreate();
        if (res.status === 200) {
          setTrips(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchTrips();
  }, []);

  // lấy  danh sách chuyến có tbao
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          return;
        }

        const res = await notification();
        if (res.status === 200) {
          setOutstanding(res.data.rides);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API thông báo:", error);
      }
    };

    fetchNotification();
  }, []);

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return <Tag color="gray">Chờ phản hồi</Tag>;
      case 1:
        return <Tag color="green">Đã được chấp nhận</Tag>;
      case 2:
        return <Tag color="red">Đã bị từ chối</Tag>;
      default:
        return <Tag color="default">Chờ phản hồi</Tag>;
    }
  };

  // Xử lý accept/reject hành khách
  const handlePassengerAction = async (
    participantId: number,
    action: "accepted" | "rejected",
  ) => {
    try {
      if (action === "accepted") {
        await acceptPassenger(participantId);
        window.dispatchEvent(new CustomEvent("updateNotification"));
      } else {
        await rejectPassenger(participantId);
        window.dispatchEvent(new CustomEvent("updateNotification"));
      }

      const res = await myCreate();
      if (res.status === 200) {
        setTrips(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi xử lý passenger:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-600">
        🚗 Các chuyến đã tạo
      </h1>
      {trips.map((trip) => (
        <div
          key={trip.rideId}
          className="border rounded-2xl p-4 shadow-sm bg-white"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <p className="font-semibold text-lg flex items-center gap-2">
                {outstanding?.includes(trip.rideId) && (
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                )}

                <span className="flex-1 overflow-hidden">
                  <span className="block text-sm sm:text-base truncate">
                    <span className="text-green-600 font-semibold">Từ:</span>{" "}
                    {trip.startAddress}
                  </span>
                  <span className="block text-sm sm:text-base truncate">
                    <span className="text-blue-600 font-semibold">Đến:</span>{" "}
                    {trip.endAddress}
                  </span>
                </span>
              </p>

              <p className="text-gray-600 text-sm">
                <strong>Sức chứa tối đa:</strong> {trip.capacity} chỗ
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Đã có:</strong> {trip.occupied} người
              </p>
            </div>

            <button
              onClick={() =>
                setOpenTrip(openTrip === trip.rideId ? null : trip.rideId)
              }
              className="flex items-center text-emerald-600 hover:text-emerald-800 font-medium"
            >
              {openTrip === trip.rideId ? (
                <>
                  <ChevronUp className="w-5 h-5 mr-1" /> Ẩn bớt
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5 mr-1" /> Xem hành khách xin đi
                  nhờ
                </>
              )}
            </button>
          </div>

          {openTrip === trip.rideId && (
            <div className="mt-4 border-t pt-3 space-y-3">
              {trip.participants.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 p-3 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={p.avatar}
                      alt={p.userName}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                    <div>
                      <p className="font-medium">{p.userName}</p>
                      <p className="text-sm text-gray-600">
                        Ghi chú: {p.note || "Không có"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Trạng thái: {getStatusLabel(p.status)}
                      </p>
                    </div>
                  </div>
                  {p.status === 0 && (
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => handlePassengerAction(p.id, "accepted")}
                        className="px-3 py-1 rounded-lg text-sm font-medium bg-emerald-600 text-white"
                      >
                        Chấp nhận
                      </button>
                      <button
                        onClick={() => handlePassengerAction(p.id, "rejected")}
                        className="px-3 py-1 rounded-lg text-sm font-medium bg-red-600 text-white"
                      >
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
