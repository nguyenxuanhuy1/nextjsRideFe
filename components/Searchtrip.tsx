"use client";

import { Table, Tag, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";

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

  // Giả lập fetch từ API
  useEffect(() => {
    const fetchTrips = async () => {
      const data: Trip[] = [
        {
          id: 1,
          from: "Hà Nội",
          to: "Đà Nẵng",
          date: "2025-09-12",
          seats: 3,
          status: "Đang chờ",
        },
        {
          id: 2,
          from: "Sài Gòn",
          to: "Nha Trang",
          date: "2025-09-15",
          seats: 2,
          status: "Đã khởi hành",
        },
        {
          id: 3,
          from: "Hà Nội",
          to: "Sapa",
          date: "2025-09-20",
          seats: 1,
          status: "Hoàn thành",
        },
      ];
      setTrips(data);
    };

    fetchTrips();
  }, []);

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
          //   onClick={() => alert(`Chi tiết chuyến ${record.id}`)}
        >
          Xin đi nhờ.
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Danh sách chuyến đi</h1>

      {/* Desktop Table */}
      <div className="hidden sm:block">
        <Table<Trip>
          columns={columns}
          dataSource={trips}
          rowKey="id"
          scroll={{ x: 800 }} // scroll ngang nếu cần
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
              Xin đi nhờ.
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
