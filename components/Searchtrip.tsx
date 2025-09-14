"use client";

import { Table, Tag, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback, useState } from "react";
import { searchTrip } from "@/api/apiUser";
import axios from "axios";
import debounce from "lodash.debounce";

interface Trip {
  id: number;
  from: string;
  to: string;
  date: string;
  seats: number;
  status: "Đang chờ" | "Đã khởi hành" | "Hoàn thành";
}

export default function SearchTripPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [startSuggestions, setStartSuggestions] = useState<any[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<any[]>([]);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [startTime, setStartTime] = useState("");

  // fetch gợi ý địa chỉ
  const fetchSuggestions = useCallback(
    debounce(async (query: string, type: "start" | "end") => {
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
    }, 200),
    []
  );

  const handleSelect = (item: any, type: "start" | "end") => {
    const latlng: [number, number] = [
      parseFloat(item.lat),
      parseFloat(item.lon),
    ];
    if (type === "start") {
      setStart(latlng);
      setStartInput(item.display_name);
      setStartSuggestions([]);
    } else {
      setEnd(latlng);
      setEndInput(item.display_name);
      setEndSuggestions([]);
    }
  };

  const handleSearch = async () => {
    if (!start || !end) return;
    const payload = {
      startLat: start[0],
      startLng: start[1],
      endLat: end[0],
      endLng: end[1],
      startTime: startTime || null,
    };
    try {
      const res = await searchTrip(payload);
      if (res.status === 200) {
        setTrips(res.data); // backend trả list
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const columns: ColumnsType<Trip> = [
    { title: "Từ", dataIndex: "from", key: "from" },
    { title: "Đến", dataIndex: "to", key: "to" },
    { title: "Thời gian khởi hành", dataIndex: "date", key: "date" },
    { title: "Số ghế trống", dataIndex: "seats", key: "seats" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        switch (status) {
          case "Đang chờ":
            color = "gold";
            break;
          case "Đã khởi hành":
            color = "green";
            break;
          case "Hoàn thành":
            color = "gray";
            break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => alert(`Xin đi nhờ chuyến ${record.id}`)}
        >
          Xin đi nhờ
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Tìm kiếm chuyến đi</h1>

      {/* Form tìm kiếm */}
      <div className="mb-6 space-y-3">
        {/* Điểm xuất phát */}
        <div className="relative">
          <input
            type="text"
            placeholder="Điểm xuất phát"
            value={startInput}
            onChange={(e) => {
              setStartInput(e.target.value);
              fetchSuggestions(e.target.value, "start");
            }}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {startSuggestions.length > 0 && (
            <div className="absolute bg-white border w-full max-h-40 overflow-auto z-10">
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

        {/* Điểm đến */}
        <div className="relative">
          <input
            type="text"
            placeholder="Điểm đến"
            value={endInput}
            onChange={(e) => {
              setEndInput(e.target.value);
              fetchSuggestions(e.target.value, "end");
            }}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {endSuggestions.length > 0 && (
            <div className="absolute bg-white border w-full max-h-40 overflow-auto z-10">
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

        {/* Thời gian khởi hành */}
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <button
          onClick={handleSearch}
          className="w-full py-2 bg-emerald-500 text-white rounded"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block">
        <Table<Trip>
          columns={columns}
          dataSource={trips}
          rowKey="id"
          scroll={{ x: 800 }}
        />
      </div>

      {/* Mobile Card view */}
      <div className="sm:hidden space-y-4">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <p className="font-semibold truncate">
              {trip.from} → {trip.to}
            </p>
            <p className="text-sm text-gray-600">Ngày đi: {trip.date}</p>
            <p className="text-sm text-gray-600">Số ghế trống: {trip.seats}</p>
            <p className="text-sm text-gray-600">
              Trạng thái:
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-white text-xs 
                ${
                  trip.status === "Đang chờ"
                    ? "bg-yellow-400"
                    : trip.status === "Đã khởi hành"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              >
                {trip.status}
              </span>
            </p>
            <Button
              type="link"
              className="mt-2 p-0 text-emerald-500"
              onClick={() => alert(`Chi tiết chuyến ${trip.id}`)}
            >
              Xin đi nhờ
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
