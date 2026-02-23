"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { getTripDetail } from "@/api/apiUser";
import Loading from "./Loading";
import { RequestRidePopover } from "./RequestRidePopover";
import { Car } from "lucide-react";
import * as Leaflet from "leaflet";
import { useMap } from "react-leaflet";
import { Trip } from "@/hooks/interface";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);

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

// Component chính
interface TripDetailProps {
  tripId: number;
}

export default function TripDetailPage({ tripId }: TripDetailProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [L, setL] = useState<typeof Leaflet | null>(null);

  // Load leaflet và cài icon mặc định
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
    fetchDetail(tripId);
  }, [tripId]);

  const fetchDetail = async (id: number) => {
    try {
      setLoading(true);
      const res = await getTripDetail(id);
      setTrip(res.data);
    } catch (err) {
      console.error("Lỗi lấy chi tiết chuyến:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!trip) return <p className="text-center mt-10">Không tìm thấy chuyến</p>;

  const route = trip.routeGeoJson ? JSON.parse(trip.routeGeoJson) : null;
  if (!route || route.type !== "LineString" || !route.coordinates.length) {
    return (
      <p className="text-center mt-10">Dữ liệu vị trí chuyến không hợp lệ</p>
    );
  }

  const polyline: [number, number][] = route.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng],
  );
  const start: [number, number] = polyline[0];
  const end: [number, number] = polyline[polyline.length - 1];

  if (!L) return <Loading />;

  return (
    <div className="mx-auto space-y-3">
      <p>
        <strong>Điểm đi:</strong> {trip.startAddress}
      </p>
      <p>
        <strong>Điểm đến:</strong> {trip.endAddress}
      </p>
      <p>
        <strong>Khoảng cách:</strong>{" "}
        {trip.distance >= 1000
          ? `${(trip.distance / 1000).toFixed(1)} km`
          : `${trip.distance} m`}
      </p>
      <p>
        <strong>Thời gian ước tính:</strong>{" "}
        {(() => {
          const adjusted = trip.duration * 1.5;
          if (adjusted < 3600) return `${Math.round(adjusted / 60)} phút`;
          const hours = Math.floor(adjusted / 3600);
          const minutes = Math.round((adjusted % 3600) / 60);
          return `${hours} giờ ${minutes} phút`;
        })()}
      </p>

      <RequestRidePopover
        id={trip.id}
        buttonText={
          <span className="flex items-center gap-1 text-emerald-500">
            <Car className="w-5 h-5" />
            Xin đi nhờ
          </span>
        }
      />

      <div className="h-[500px] w-full">
        <MapContainer
          center={start}
          attributionControl={false}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" />
          <Marker position={start}>
            <Popup>Điểm đi: {trip.startAddress}</Popup>
          </Marker>
          <Marker position={end}>
            <Popup>Điểm đến: {trip.endAddress}</Popup>
          </Marker>
          <Polyline positions={polyline} color="blue" />
          <FitBounds polyline={polyline} />
        </MapContainer>
      </div>
    </div>
  );
}
