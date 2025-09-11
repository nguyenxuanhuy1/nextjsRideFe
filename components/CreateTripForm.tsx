"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { useNotify } from "@/hooks/useNotify";
import { createTrip } from "@/api/apiUser";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

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

export default function RoutePicker() {
  // Toạ độ
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);

  // Input người dùng gõ
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  // Giá trị được chọn (chính thức)
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");

  const [startSuggestions, setStartSuggestions] = useState<any[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<any[]>([]);

  const debouncedStart = useDebounce(startInput, 300);
  const debouncedEnd = useDebounce(endInput, 300);

  const [vehicleType, setVehicleType] = useState("motorbike");
  const [carSeats, setCarSeats] = useState(1);
  const [startTime, setStartTime] = useState<string>("");

  const { notifyError, contextHolder } = useNotify();

  const [position, setPosition] = useState<[number, number] | undefined>(
    undefined
  );

  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((mod) => setL(mod));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          setPosition([21.03, 105.85]);
        }
      );
    } else {
      setPosition([21.03, 105.85]);
    }
  }, []);

  const startIcon = useMemo(() => {
    if (!L) return null;
    return L.icon({
      iconUrl: "/motorcycle.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, [L]);

  const endIcon = useMemo(() => {
    if (!L) return null;
    return L.icon({
      iconUrl: "/location.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, [L]);

  const fetchSuggestions = async (query: string, type: "start" | "end") => {
    if (!query) return;
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5&countrycodes=vn`
      );
      type === "start"
        ? setStartSuggestions(res.data)
        : setEndSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    debouncedStart
      ? fetchSuggestions(debouncedStart, "start")
      : setStartSuggestions([]);
  }, [debouncedStart]);

  useEffect(() => {
    debouncedEnd
      ? fetchSuggestions(debouncedEnd, "end")
      : setEndSuggestions([]);
  }, [debouncedEnd]);

  const handleSelect = (item: any, type: "start" | "end") => {
    const latlng: [number, number] = [
      parseFloat(item.lat),
      parseFloat(item.lon),
    ];
    if (type === "start") {
      setStart(latlng);
      setStartAddress(item.display_name); // giá trị chính thức
      setStartInput(item.display_name); // hiển thị trong input
      setStartSuggestions([]);
    } else {
      setEnd(latlng);
      setEndAddress(item.display_name);
      setEndInput(item.display_name);
      setEndSuggestions([]);
    }
  };

  const handleSubmit = async () => {
    if (!start || !end || !startAddress || !endAddress) {
      notifyError("", "Bạn phải chọn điểm đi hợp lệ");
      return;
    }

    const payload = {
      startLat: start[0],
      startLng: start[1],
      endLat: end[0],
      endLng: end[1],
      startAddress,
      endAddress,
      capacity: vehicleType === "car" ? carSeats : 1,
      startTime,
    };

    try {
      const res = await createTrip(payload);
      if (res.status === 200) {
        notifyError("", `${res?.data}`);
      }
    } catch (err: any) {
      notifyError("", "Vui lòng thử lại sau");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {contextHolder}
      <div className="md:w-80 w-full p-4 md:p-6 md:pb-6 pb-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">
          Chọn Điểm xuất phát / Điểm đến
        </h3>

        <div className="flex items-center mb-3 space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Điểm xuất phát"
              value={startInput}
              onChange={(e) => {
                setStartInput(e.target.value);
                setStart(null);
                setStartAddress("");
              }}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {startSuggestions.length > 0 && (
              <div className="absolute bg-white z-20 w-full border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
                {startSuggestions.map((s) => (
                  <div
                    key={s.place_id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(s, "start")}
                  >
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Button lấy vị trí */}
          <button
            type="button"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setStart([latitude, longitude]);
                    setStartInput("Vị trí hiện tại");
                    setStartAddress("Vị trí hiện tại của bạn");
                  },
                  (err) => {
                    notifyError("", "Chưa được cấp quyền truy cập vị trí");
                  }
                );
              } else {
                alert("Trình duyệt không hỗ trợ định vị!");
              }
            }}
            className="px-3 py-2   text-white rounded transition"
          >
            📍
          </button>
        </div>
        {/* Điểm đến */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Điểm đến"
            value={endInput}
            onChange={(e) => {
              setEndInput(e.target.value);
              setEnd(null);
              setEndAddress("");
            }}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {endSuggestions.length > 0 && (
            <div className="absolute bg-white z-20 w-full border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
              {endSuggestions.map((s) => (
                <div
                  key={s.place_id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(s, "end")}
                >
                  {s.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loại xe */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Bạn đi xe?</label>
          <select
            value={vehicleType}
            required
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="motorbike">Xe máy</option>
            <option value="bicycle">Xe đạp</option>
            <option value="car">Ô tô</option>
          </select>
        </div>

        {/* Ghế */}
        {vehicleType === "car" && (
          <div className="mb-3">
            <label className="block mb-1 font-medium">Chọn số lượng ghế</label>
            <select
              value={carSeats}
              onChange={(e) => setCarSeats(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Cho đi nhờ {num} ghế
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Thời gian */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Thời gian khởi hành</label>
          <input
            type="datetime-local"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 mt-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
        >
          Tạo chuyến đi
        </button>
      </div>

      {/* Bản đồ */}
      {L && startIcon && endIcon && (
        <div className="flex-1">
          {position ? (
            <MapContainer center={position} zoom={12} className="w-full h-full">
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
              />
              {start && startIcon && (
                <Marker position={start} icon={startIcon}>
                  <Popup>Điểm xuất phát: {startAddress}</Popup>
                </Marker>
              )}
              {end && endIcon && (
                <Marker position={end} icon={endIcon}>
                  <Popup>Điểm đến: {endAddress}</Popup>
                </Marker>
              )}
            </MapContainer>
          ) : (
            <p className="text-center p-4">Đang lấy vị trí của bạn...</p>
          )}
        </div>
      )}
    </div>
  );
}
