"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/locale/vi_VN";
import { useNotify } from "@/hooks/useNotify";
import { createTrip } from "@/api/apiUser";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { ENV } from "@/api/urlApi";
import Loading from "./Loading";
import * as Leaflet from "leaflet";
import { CreateTripPayload, Suggestion } from "@/hooks/interface";

dayjs.locale("vi");

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

export default function RoutePicker() {
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [startSuggestions, setStartSuggestions] = useState<Suggestion[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<Suggestion[]>([]);
  const debouncedStart = useDebounce(startInput, 400);
  const debouncedEnd = useDebounce(endInput, 400);
  const [vehicleType, setVehicleType] = useState("motorbike");
  const [carSeats, setCarSeats] = useState(1);
  const [startTime, setStartTime] = useState<string>("");
  const { notifyError, notifySuccess, contextHolder } = useNotify();
  const { position, address } = useCurrentLocation();
  const [loading, setLoading] = useState(false);
  const [L, setL] = useState<typeof Leaflet | null>(null);
  const [isSelectingStart, setIsSelectingStart] = useState(false);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    import("leaflet").then((mod) => setL(mod));
  }, []);

  const startIcon = useMemo(() => {
    if (!L) return null;
    return L.icon({
      iconUrl: "/end.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, [L]);

  const endIcon = useMemo(() => {
    if (!L) return null;
    return L.icon({
      iconUrl: "/end.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, [L]);

  const fetchSuggestions = async (query: string, type: "start" | "end") => {
    if (!query) return;
    try {
      const res = await axios.get(
        `${ENV.MAP_URL}/search?format=json&q=${encodeURIComponent(query)}`,
      );
      type === "start"
        ? setStartSuggestions(res.data)
        : setEndSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isSelectingStart) {
      setIsSelectingStart(false);
      return;
    }
    debouncedStart
      ? fetchSuggestions(debouncedStart, "start")
      : setStartSuggestions([]);
  }, [debouncedStart]);

  useEffect(() => {
    if (isSelectingEnd) {
      setIsSelectingEnd(false);
      return;
    }
    debouncedEnd
      ? fetchSuggestions(debouncedEnd, "end")
      : setEndSuggestions([]);
  }, [debouncedEnd]);

  const handleSelect = (item: Suggestion, type: "start" | "end") => {
    const latlng: [number, number] = [
      parseFloat(item.lat),
      parseFloat(item.lon),
    ];
    if (type === "start") {
      setStart(latlng);
      setStartAddress(item.display_name);
      setStartInput(item.display_name);
      setStartSuggestions([]);
      setIsSelectingStart(true);
    } else {
      setEnd(latlng);
      setEndAddress(item.display_name);
      setEndInput(item.display_name);
      setEndSuggestions([]);
      setIsSelectingEnd(true);
    }
  };

  const handleSubmit = async () => {
    if (!start || !end || !startAddress || !endAddress) {
      notifyError("", "Bạn phải chọn điểm đi hợp lệ");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      notifyError("", "Vui lòng đăng nhập trước khi tạo chuyến đi");
      return;
    }
    if (!startTime) {
      notifyError("", "Bạn phải chọn thời gian xuất phát");
      return;
    }
    if (vehicleType === "car" && (!carSeats || carSeats < 1)) {
      notifyError("", "Bạn phải nhập số chỗ ngồi hợp lệ");
      return;
    }
    const payload: CreateTripPayload = {
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
      setLoading(true);
      const res = await createTrip(payload);
      if (res.status === 200) {
        notifySuccess("", `${res?.data}`);
        setStart(null);
        setEnd(null);
        setStartInput("");
        setEndInput("");
        setStartAddress("");
        setEndAddress("");
        setStartTime("");
        setCarSeats(1);
        setVehicleType("motorbike");
      }
    } catch {
      notifyError("", "Vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = startInput && endInput && startTime;

  // return (
  //   <div className="min-h-screen w-full flex flex-col lg:flex-row">
  //     {/* Sidebar */}
  //     <div className="w-1/2 lg:w-[420px] bg-red-500 flex-shrink-0">Sidebar</div>

  //     {/* Map */}
  //     <div className="w-1/2 lg:flex-1 bg-blue-500">Map Area</div>
  //   </div>
  // );
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {contextHolder}
      {loading && <Loading />}

      {/* Sidebar - Modern Design */}
      <div className="w-full lg:w-[420px] lg:h-screen border-r border-slate-200/50 overflow-y-auto bg-white/80 backdrop-blur-xl flex-shrink-0 shadow-2xl lg:shadow-none">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex items-center justify-center lg:justify-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Tạo chuyến đi
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Chia sẻ hành trình của bạn
                </p>
              </div>
            </div>
          </div>

          {/* Route Input Section */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/50">
            <div className="flex items-start gap-3">
              {/* Timeline Icon */}
              <div className="flex flex-col items-center pt-4">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-4 border-emerald-100 shadow-lg shadow-emerald-500/30 relative z-10">
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                </div>
                <div className="w-1 h-28 bg-gradient-to-b from-emerald-400 via-blue-400 to-rose-400 rounded-full my-1 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 border-4 border-rose-100 shadow-lg shadow-rose-500/30 relative z-10">
                  <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-75"></div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="flex-1 space-y-4">
                {/* Start Location */}
                <div className="relative group">
                  <label className=" text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Điểm xuất phát
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Tìm kiếm địa điểm..."
                        value={startInput}
                        onChange={(e) => {
                          setStartInput(e.target.value);
                          setStart(null);
                          setStartAddress("");
                        }}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm font-medium placeholder:text-slate-400 shadow-sm"
                      />
                      <svg
                        className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (position && address) {
                          setStart(position);
                          setStartInput(address);
                          setStartAddress(address);
                        } else {
                          notifyError(
                            "",
                            "Chưa thể lấy vị trí hiện tại. Vui lòng thử lại hoặc cấp quyền định vị",
                          );
                        }
                      }}
                      className="px-4 py-3.5 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all flex-shrink-0 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95"
                      title="Vị trí hiện tại"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  {startSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl max-h-56 overflow-auto z-30 backdrop-blur-xl">
                      {startSuggestions.map((s, idx) => (
                        <div
                          key={s.place_id}
                          className={`px-4 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 cursor-pointer transition-all border-b border-slate-100 last:border-0 ${idx === 0 ? "rounded-t-xl" : ""} ${idx === startSuggestions.length - 1 ? "rounded-b-xl" : ""}`}
                          onClick={() => handleSelect(s, "start")}
                        >
                          <div className="flex items-start gap-3">
                            <svg
                              className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                            </svg>
                            <p className="text-sm text-slate-700 font-medium line-clamp-2">
                              {s.display_name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* End Location */}
                <div className="relative">
                  <label className=" text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Điểm đến
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm đích đến..."
                      value={endInput}
                      onChange={(e) => {
                        setEndInput(e.target.value);
                        setEnd(null);
                        setEndAddress("");
                      }}
                      className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all text-sm font-medium placeholder:text-slate-400 shadow-sm"
                    />
                    <svg
                      className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {endSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl max-h-56 overflow-auto z-30 backdrop-blur-xl">
                      {endSuggestions.map((s, idx) => (
                        <div
                          key={s.place_id}
                          className={`px-4 py-3 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 cursor-pointer transition-all border-b border-slate-100 last:border-0 ${idx === 0 ? "rounded-t-xl" : ""} ${idx === endSuggestions.length - 1 ? "rounded-b-xl" : ""}`}
                          onClick={() => handleSelect(s, "end")}
                        >
                          <div className="flex items-start gap-3">
                            <svg
                              className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                            </svg>
                            <p className="text-sm text-slate-700 font-medium line-clamp-2">
                              {s.display_name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Type Selection */}
          <div className="space-y-3">
            <label className=" text-sm font-bold text-slate-700 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              Phương tiện di chuyển
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  value: "motorbike",
                  label: "Xe máy",
                  icon: "🏍️",
                  color: "from-blue-400 to-blue-500",
                },
                {
                  value: "bicycle",
                  label: "Xe đạp",
                  icon: "🚴",
                  color: "from-green-400 to-green-500",
                },
                {
                  value: "car",
                  label: "Ô tô",
                  icon: "🚗",
                  color: "from-purple-400 to-purple-500",
                },
              ].map((vehicle) => (
                <button
                  key={vehicle.value}
                  type="button"
                  onClick={() => setVehicleType(vehicle.value)}
                  className={`relative px-3 py-4 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 active:scale-95 ${
                    vehicleType === vehicle.value
                      ? `bg-gradient-to-br ${vehicle.color} text-white shadow-lg`
                      : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
                  }`}
                >
                  <div className="text-2xl mb-1.5">{vehicle.icon}</div>
                  <div className="text-xs">{vehicle.label}</div>
                  {vehicleType === vehicle.value && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                      <svg
                        className="w-3 h-3 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Car Seats Selection */}
          {vehicleType === "car" && (
            <div className="space-y-3 animate-fade-in">
              <label className=" text-sm font-bold text-slate-700 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Số ghế cho đi nhờ
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCarSeats(num)}
                    className={`relative px-3 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 ${
                      carSeats === num
                        ? "bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-lg"
                        : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
                    }`}
                  >
                    {num}
                    {carSeats === num && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-purple-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Time Picker */}
          <div className="space-y-3">
            <label className=" text-sm font-bold text-slate-700 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Thời gian khởi hành
            </label>
            <div className="relative">
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                placeholder="Chọn ngày và giờ khởi hành"
                className="w-full"
                getPopupContainer={(trigger) => trigger.closest(".relative")!}
                locale={locale.DatePicker}
                value={startTime ? dayjs(startTime) : null}
                onChange={(date) => {
                  if (date) {
                    setStartTime(date.format("YYYY-MM-DDTHH:mm"));
                  } else {
                    setStartTime("");
                  }
                }}
                disabledDate={(current) => {
                  return current && current < dayjs().startOf("day");
                }}
                style={{
                  borderRadius: "0.75rem",
                  height: "52px",
                  borderWidth: "2px",
                  borderColor: "#e2e8f0",
                }}
              />
              <svg
                className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-bold text-base shadow-xl transition-all transform relative overflow-hidden group ${
              isFormValid
                ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white hover:shadow-2xl hover:shadow-emerald-500/50 active:scale-[0.98]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isFormValid && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isFormValid ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Tạo chuyến đi ngay
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Vui lòng điền đầy đủ thông tin
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Map - Modern with overlay effects */}
      <div className="flex-1 w-full min-h-[400px]   lg:min-h-screen relative">
        {L && startIcon && endIcon && position ? (
          <div className="w-full h-full">
            <MapContainer
              key={`map-${mapKey}`}
              center={position}
              zoom={12}
              scrollWheelZoom={true}
              attributionControl={false}
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" />
              {start && startIcon && (
                <Marker position={start} icon={startIcon}>
                  <Popup>
                    <div className="text-sm p-1">
                      <p className="font-bold text-emerald-600 mb-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Điểm xuất phát
                      </p>
                      <p className="text-slate-600 text-xs">{startAddress}</p>
                    </div>
                  </Popup>
                </Marker>
              )}
              {end && endIcon && (
                <Marker position={end} icon={endIcon}>
                  <Popup>
                    <div className="text-sm p-1">
                      <p className="font-bold text-rose-600 mb-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Điểm đến
                      </p>
                      <p className="text-slate-600 text-xs">{endAddress}</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>

            {/* Map Overlay Info */}
            {/* {(start || end) && (
              <div className="absolute top-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 z-[1000] border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Thông tin hành trình
                </h3>
                {start && (
                  <div className="mb-2 pb-2 border-b border-slate-200">
                    <p className="text-xs font-semibold text-emerald-600 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Xuất phát
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 pl-3.5">
                      {startAddress}
                    </p>
                  </div>
                )}
                {end && (
                  <div>
                    <p className="text-xs font-semibold text-rose-600 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      Đích đến
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 pl-3.5">
                      {endAddress}
                    </p>
                  </div>
                )}
              </div>
            )} */}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-slate-600 font-semibold mb-1">
                {position
                  ? "Đang khởi tạo bản đồ..."
                  : "Đang xác định vị trí..."}
              </p>
              <p className="text-xs text-slate-500">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
