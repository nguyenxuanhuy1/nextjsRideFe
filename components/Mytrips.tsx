"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, User, MapPin } from "lucide-react";

interface Passenger {
  id: number;
  name: string;
  pickup: string;
  status: "pending" | "accepted" | "rejected";
}

interface Trip {
  id: number;
  start: string;
  end: string;
  distance: number; // mét
  duration: number; // giây
  passengers: Passenger[];
}

const mockTrips: Trip[] = [
  {
    id: 1,
    start: "Hà Nội",
    end: "Hải Phòng",
    distance: 12000,
    duration: 1500,
    passengers: [
      { id: 1, name: "Nguyễn Văn A", pickup: "Cầu Giấy", status: "pending" },
      { id: 2, name: "Trần Thị B", pickup: "Long Biên", status: "accepted" },
    ],
  },
  {
    id: 2,
    start: "Hà Nội",
    end: "Ninh Bình",
    distance: 98000,
    duration: 5400,
    passengers: [
      { id: 3, name: "Lê Văn C", pickup: "Phủ Lý", status: "rejected" },
    ],
  },
];

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [openTrip, setOpenTrip] = useState<number | null>(null);

  const formatDistance = (m: number) => {
    return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;
  };

  const formatDuration = (s: number) => {
    const minutes = Math.ceil(s / 60);
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
  };

  const handlePassengerAction = (
    tripId: number,
    passengerId: number,
    status: "accepted" | "rejected"
  ) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              passengers: t.passengers.map((p) =>
                p.id === passengerId ? { ...p, status } : p
              ),
            }
          : t
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-600">
        🚗 Các chuyến đã tạo
      </h1>
      {trips.map((trip) => (
        <div
          key={trip.id}
          className="border rounded-2xl p-4 shadow-sm bg-white"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <p className="font-semibold text-lg">
                {trip.start} → {trip.end}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Quãng đường:</strong> {formatDistance(trip.distance)}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Thời gian:</strong> {formatDuration(trip.duration)}
              </p>
            </div>
            <button
              onClick={() => setOpenTrip(openTrip === trip.id ? null : trip.id)}
              className="flex items-center text-emerald-600 hover:text-emerald-800 font-medium"
            >
              {openTrip === trip.id ? (
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

          {openTrip === trip.id && (
            <div className="mt-4 border-t pt-3 space-y-3">
              {trip.passengers.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 p-3 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {p.pickup}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() =>
                        handlePassengerAction(trip.id, p.id, "accepted")
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        p.status === "accepted"
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-emerald-100"
                      }`}
                    >
                      Chấp nhận
                    </button>
                    <button
                      onClick={() =>
                        handlePassengerAction(trip.id, p.id, "rejected")
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        p.status === "rejected"
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-red-100"
                      }`}
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
