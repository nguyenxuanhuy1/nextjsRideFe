"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { getTripDetail } from "@/api/apiUser";
import Loading from "./Loading";
import { RequestRidePopover } from "./RequestRidePopover";
import * as Leaflet from "leaflet";
import { useMap } from "react-leaflet";
import { Trip } from "@/hooks/interface";
import {
  MapPin,
  Clock,
  Users,
  Ruler,
  Timer,
  Car,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

const statusConfig = {
  0: { text: "Mới tạo", cls: "badge badge-new" },
  1: { text: "Đang mở", cls: "badge badge-open" },
  2: { text: "Đầy chỗ", cls: "badge badge-full" },
  3: { text: "Đang đi", cls: "badge badge-moving" },
  4: { text: "Hoàn thành", cls: "badge badge-done" },
} as const;

interface FitBoundsProps {
  polyline: [number, number][];
}

const FitBounds: React.FC<FitBoundsProps> = ({ polyline }) => {
  const map = useMap();
  useEffect(() => {
    if (polyline.length) {
      const bounds = Leaflet.latLngBounds(polyline);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, polyline]);
  return null;
};

interface TripDetailProps {
  tripId: number;
}

function formatTime(t: string) {
  return new Date(t).toLocaleString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number) {
  const adjusted = seconds * 1.5;
  if (adjusted < 3600) return `${Math.round(adjusted / 60)} phút`;
  const hours = Math.floor(adjusted / 3600);
  const minutes = Math.round((adjusted % 3600) / 60);
  return `${hours} giờ ${minutes > 0 ? `${minutes} phút` : ""}`;
}

export default function TripDetailPage({ tripId }: TripDetailProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [L, setL] = useState<typeof Leaflet | null>(null);
  const router = useRouter();

  useEffect(() => {
    import("leaflet").then((mod) => {
      const Leaflet = mod.default;
      const DefaultIcon = new Leaflet.Icon({
        iconUrl: "/end.png",
        iconRetinaUrl: "/end.png",
        shadowUrl: "/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      Leaflet.Marker.prototype.options.icon = DefaultIcon;
      setL(Leaflet);
    });
  }, []);

  useEffect(() => {
    if (!tripId) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getTripDetail(tripId);
        setTrip(res.data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết chuyến:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [tripId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loading />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: 600 }}>
          <div className="card text-center py-20">
            <Car className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h2 className="heading-md text-slate-600 mb-2">Không tìm thấy chuyến</h2>
            <button onClick={() => router.back()} className="btn btn-secondary mt-4">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const route = trip.routeGeoJson ? JSON.parse(trip.routeGeoJson) : null;
  if (!route || route.type !== "LineString" || !route.coordinates.length) {
    return (
      <div className="section">
        <div className="container">
          <div className="card text-center py-16">
            <p className="text-slate-500">Dữ liệu vị trí chuyến không hợp lệ</p>
          </div>
        </div>
      </div>
    );
  }

  const polyline: [number, number][] = route.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng]
  );
  const startPos: [number, number] = polyline[0];
  const endPos: [number, number] = polyline[polyline.length - 1];
  const status = statusConfig[trip.status as keyof typeof statusConfig] ?? statusConfig[0];
  const canJoin = trip.status === 0 || trip.status === 1;

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 1000 }}>
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Info Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title card */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h1 className="heading-md text-slate-900">Chi tiết chuyến</h1>
                <span className={status.cls}>{status.text}</span>
              </div>

              {/* Route */}
              <div className="flex gap-3">
                <div className="route-line flex-shrink-0 mt-1">
                  <div className="route-dot-start" />
                  <div className="route-connector" style={{ minHeight: 40 }} />
                  <div className="route-dot-end" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Điểm đi</p>
                    <p className="text-sm font-semibold text-slate-800 line-clamp-2">{trip.startAddress}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">Điểm đến</p>
                    <p className="text-sm text-slate-600 line-clamp-2">{trip.endAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: Clock,
                  label: "Khởi hành",
                  value: formatTime(trip.startTime),
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  icon: Users,
                  label: "Chỗ trống",
                  value: `${trip.capacity} người`,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: Ruler,
                  label: "Khoảng cách",
                  value: trip.distance >= 1000
                    ? `${(trip.distance / 1000).toFixed(1)} km`
                    : `${trip.distance} m`,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  icon: Timer,
                  label: "Thời gian ước tính",
                  value: formatDuration(trip.duration),
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="card-flat p-4">
                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center mb-2`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Participants */}
            {trip.participants && trip.participants.length > 0 && (
              <div className="card p-4">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  Hành khách ({trip.participants.length})
                </h3>
                <div className="space-y-2">
                  {trip.participants.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center gap-2.5">
                      <img
                        src={p.avatar || "/default-avatar.png"}
                        alt={p.userName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-slate-700">{p.userName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Join trip */}
            {canJoin && (
              <div className="card p-4 border-emerald-100 bg-emerald-50/30">
                <p className="text-sm font-medium text-slate-700 mb-3">
                  Bạn muốn đi cùng chuyến này?
                </p>
                <RequestRidePopover
                  id={trip.id}
                  buttonText={
                    <span className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Gửi yêu cầu xin đi nhờ
                    </span>
                  }
                />
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="card overflow-hidden" style={{ height: 520 }}>
              {L ? (
                <MapContainer
                  center={startPos}
                  attributionControl={false}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" />
                  <Marker position={startPos}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold text-emerald-700 mb-1">📍 Điểm đi</p>
                        <p className="text-slate-600">{trip.startAddress}</p>
                      </div>
                    </Popup>
                  </Marker>
                  <Marker position={endPos}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold text-blue-700 mb-1">🏁 Điểm đến</p>
                        <p className="text-slate-600">{trip.endAddress}</p>
                      </div>
                    </Popup>
                  </Marker>
                  <Polyline
                    positions={polyline}
                    color="#10b981"
                    weight={4}
                    opacity={0.8}
                  />
                  <FitBounds polyline={polyline} />
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-slate-50">
                  <Loading />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
