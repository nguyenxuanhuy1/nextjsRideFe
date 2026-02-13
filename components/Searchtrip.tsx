"use client";

import { Table, Tag, Button, Tooltip, Pagination } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
import { searchTrip } from "@/api/apiUser";
import axios from "axios";
import debounce from "lodash.debounce";
import Loading from "./Loading";
import { Car, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { RequestRidePopover } from "./RequestRidePopover";
import { ENV } from "@/api/urlApi";
import { Suggestion, Trip } from "@/hooks/interface";

export default function SearchTripPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [startSuggestions, setStartSuggestions] = useState<Suggestion[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<Suggestion[]>([]);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const statusMap: Record<Trip["status"], { text: string; color: string }> = {
    0: { text: "Mới tạo", color: "#3b82f6" },
    1: { text: "Đang mở", color: "#22c55e" },
    2: { text: "Đầy chỗ", color: "#ef4444" },
    3: { text: "Đang di chuyển", color: "#eab308" },
    4: { text: "Hoàn thành", color: "#6b7280" },
  };
  // fetch gợi ý địa chỉ
  const fetchSuggestions = useCallback(
    debounce(async (query: string, type: "start" | "end") => {
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
    }, 400),
    [],
  );

  const handleSelect = (item: Suggestion, type: "start" | "end") => {
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

  const handleSearch = async (pageNum = page, sizeNum = pageSize) => {
    // if (!start || !end) return;
    const payload: {
      startLat: number | null;
      startLng: number | null;
      endLat: number | null;
      endLng: number | null;
      page: number;
      size: number;
    } = {
      startLat: start?.[0] ?? null,
      startLng: start?.[1] ?? null,
      endLat: end?.[0] ?? null,
      endLng: end?.[1] ?? null,
      page: pageNum - 1,
      size: sizeNum,
    };
    try {
      setLoading(true);
      const res = await searchTrip(payload);
      if (res.status === 200) {
        setTrips(res.data.data);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleSearch();
  }, [page, pageSize]);

  const columns: ColumnsType<Trip> = [
    {
      title: "Hành trình",
      key: "route",
      render: (_: unknown, record: Trip) => (
        <Tooltip title={`${record.startAddress} → ${record.endAddress}`}>
          <div className="flex items-center gap-1 max-w-[380px]">
            {/* Điểm đi */}
            <span className="inline-block max-w-[190px] truncate">
              {record.startAddress}
            </span>

            <span className="mx-1">→</span>

            {/* Điểm đến */}
            <span className="inline-block max-w-[190px] truncate">
              {record.endAddress}
            </span>
          </div>
        </Tooltip>
      ),
    },
    { title: "Số ghế trống", dataIndex: "capacity", key: "capacity" },
    { title: "Quãng đường", dataIndex: "distance", key: "distance" },
    { title: "Thời gian khởi hành", dataIndex: "startTime", key: "startTime" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: Trip["status"]) => {
        const info = statusMap[status];
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },

    {
      title: "Bạn muốn",
      key: "action",
      align: "center",
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Button
            type="link"
            className="flex items-center gap-1 text-blue-500"
            onClick={() => router.push(`/detail-trip/${record.id}`)}
          >
            <Eye className="w-4 h-4" />
            Xem chi tiết
          </Button>
          {record.status === 1 ||
            (record.status === 0 && (
              <RequestRidePopover
                id={record?.id}
                buttonText={
                  <span className="flex items-center gap-1 text-emerald-500">
                    <Car className="w-5 h-5" />
                    Xin
                  </span>
                }
              />
            ))}
        </div>
      ),
    },
  ];
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loading />
      </div>
    );
  }
  return (
    <div className="p-4">
      {loading && <Loading />}
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
              {startSuggestions?.map((s) => (
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
              {endSuggestions?.map((s) => (
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

        <button
          onClick={() => handleSearch(1, pageSize)}
          disabled={!startInput || !endInput}
          className={`w-full py-2 rounded text-white ${
            !startInput || !endInput
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600"
          }`}
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
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (p, size) => {
              setPage(p);
              setPageSize(size || 10);
            },
          }}
          scroll={{ x: 800 }}
        />
      </div>

      {/* Mobile Card view */}
      <div className="sm:hidden space-y-4">
        {trips?.map((trip) => {
          const info = statusMap[trip.status];

          return (
            <div
              key={trip.id}
              className="border rounded-lg p-4 shadow-sm bg-white relative"
            >
              {/* Border top + chữ chèn */}
              <div className="absolute -top-3 left-4 bg-white px-2 text-sm font-bold text-emerald-600">
                Chuyến đi
              </div>

              {/* Nội dung chuyến */}
              <p className="font-semibold truncate mt-2">
                {trip.startAddress} → {trip.endAddress}
              </p>
              <p className="text-sm text-gray-600">
                Ngày đi - giờ đi: {new Date(trip.startTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Số ghế trống: {trip.capacity}
              </p>
              <p className="text-sm text-gray-600">
                Quãng đường ước tính:{" "}
                {trip.distance >= 1000
                  ? `${(trip.distance / 1000).toFixed(1)} km`
                  : `${trip.distance} m`}
              </p>
              <p className="text-sm text-gray-600">
                Trạng thái:
                <span
                  style={{ backgroundColor: info.color }}
                  className="ml-1 px-2 py-0.5 rounded-full text-white text-xs"
                >
                  {info.text}
                </span>
              </p>

              <div className="flex justify-between items-center">
                <Button
                  type="link"
                  icon={<Eye className="w-4 h-4 text-emerald-500" />}
                  className="mt-2 p-0 text-emerald-500"
                  onClick={() => router.push(`/detail-trip/${trip.id}`)}
                >
                  Xem chi tiết
                </Button>

                <RequestRidePopover
                  id={trip?.id}
                  buttonText={
                    <span className="flex items-center gap-1 text-emerald-500">
                      <Car className="w-5 h-5" />
                      Xin đi nhờ
                    </span>
                  }
                />
              </div>
            </div>
          );
        })}
        <div className="mt-4 flex justify-center">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger={false}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </div>
  );
}
