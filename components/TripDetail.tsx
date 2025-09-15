"use client";

import { useEffect, useState } from "react";
import { Card, Button, Spin } from "antd";
import { Car } from "lucide-react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { getTripDetail } from "@/api/apiUser";

// Dynamic import các component react-leaflet
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

// Interface props
interface TripDetailProps {
  tripId: number;
}

export default function TripDetailPage({ tripId }: TripDetailProps) {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [L, setL] = useState<any>(null);

  // Lấy leaflet trên client
  useEffect(() => {
    import("leaflet").then((mod) => {
      const Leaflet = mod.default;

      // Cài icon mặc định
      const DefaultIcon = new Leaflet.Icon({
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
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

  if (loading) return <Spin className="mt-10" />;

  if (!trip) return <p className="text-center mt-10">Không tìm thấy chuyến</p>;

  // Parse routeGeoJson
  const route = trip.routeGeoJson ? JSON.parse(trip.routeGeoJson) : null;
  if (!route || route.type !== "LineString" || !route.coordinates.length) {
    return (
      <p className="text-center mt-10">Dữ liệu vị trí chuyến không hợp lệ</p>
    );
  }

  // GeoJSON dùng [lng, lat], Leaflet dùng [lat, lng]
  const polyline: [number, number][] = route.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng]
  );

  const start: [number, number] = polyline[0];
  const end: [number, number] = polyline[polyline.length - 1];

  // Component FitBounds client only
  const FitBounds = () => {
    const { useMap } = require("react-leaflet");
    const map = useMap();
    useEffect(() => {
      if (polyline.length) {
        map.fitBounds(L.latLngBounds(polyline), { padding: [50, 50] });
      }
    }, [map]);
    return null;
  };

  if (!L) return <p className="text-center mt-10">Đang load bản đồ...</p>;

  return (
    <div className=" mx-auto p-2 space-y-3">
      {/* <Card> */}
      <p>
        <strong>Điểm đi:</strong> {trip.startAddress}
      </p>
      <p>
        <strong>Điểm đến:</strong> {trip.endAddress}
      </p>
      <p>
        <strong>Khoảng cách:</strong> {trip.distance} m
      </p>
      <p>
        <strong>Thời gian:</strong> {trip.duration} giây
      </p>

      <button
        onClick={() => alert(`Xin đi nhờ chuyến ${trip.id}`)}
        className="w-full py-2 mt-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
      >
        Xin đi nhờ
      </button>

      <div className="h-[500px] w-full">
        <MapContainer
          center={start}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          />
          <Marker position={start}>
            <Popup>Điểm đi: {trip.startAddress}</Popup>
          </Marker>
          <Marker position={end}>
            <Popup>Điểm đến: {trip.endAddress}</Popup>
          </Marker>
          <Polyline positions={polyline} color="blue" />
          <FitBounds />
        </MapContainer>
      </div>
    </div>
  );
}
