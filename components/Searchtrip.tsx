"use client";

import { Table, Tooltip, Pagination } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState, useMemo } from "react";
import { searchTrip } from "@/api/apiUser";
import axios from "axios";
import debounce from "lodash.debounce";
import Loading from "./Loading";
import {
  MapPin, Eye, Car, Search, Clock, Users, Ruler,
  ChevronRight, SlidersHorizontal, X, ArrowUpDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { RequestRidePopover } from "./RequestRidePopover";
import { ENV } from "@/api/urlApi";
import { Suggestion, Trip } from "@/hooks/interface";

const statusConfig: Record<Trip["status"], { text: string; cls: string }> = {
  0: { text: "Mới tạo", cls: "badge badge-new" },
  1: { text: "Đang mở", cls: "badge badge-open" },
  2: { text: "Đầy chỗ", cls: "badge badge-full" },
  3: { text: "Đang đi", cls: "badge badge-moving" },
  4: { text: "Hoàn thành", cls: "badge badge-done" },
};

function formatDistance(d: number) {
  return d >= 1000 ? `${(d / 1000).toFixed(1)} km` : `${d} m`;
}
function formatTime(t: string) {
  return new Date(t).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

type SortKey = "time_asc" | "time_desc" | "dist_asc" | "dist_desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "time_asc", label: "Sớm nhất" },
  { value: "time_desc", label: "Muộn nhất" },
  { value: "dist_asc", label: "Gần nhất" },
  { value: "dist_desc", label: "Xa nhất" },
];

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
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  // ── Filters ──
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<number | null>(null);
  const [filterMinCap, setFilterMinCap] = useState<number>(0);
  const [filterMaxDist, setFilterMaxDist] = useState<number>(0); // 0 = all
  const [sortKey, setSortKey] = useState<SortKey>("time_asc");

  const fetchSuggestions = useCallback(
    debounce(async (query: string, type: "start" | "end") => {
      if (!query) return;
      try {
        const res = await axios.get(`${ENV.MAP_URL}/search?format=json&q=${encodeURIComponent(query)}`);
        type === "start" ? setStartSuggestions(res.data) : setEndSuggestions(res.data);
      } catch (err) { console.error(err); }
    }, 400), []
  );

  const handleSelect = (item: Suggestion, type: "start" | "end") => {
    const latlng: [number, number] = [parseFloat(item.lat), parseFloat(item.lon)];
    if (type === "start") {
      setStart(latlng); setStartInput(item.display_name); setStartSuggestions([]);
    } else {
      setEnd(latlng); setEndInput(item.display_name); setEndSuggestions([]);
    }
  };

  const handleSearch = async (pageNum = page, sizeNum = pageSize) => {
    try {
      setLoading(true);
      const res = await searchTrip({
        startLat: start?.[0] ?? null, startLng: start?.[1] ?? null,
        endLat: end?.[0] ?? null, endLng: end?.[1] ?? null,
        page: pageNum - 1, size: sizeNum,
      });
      if (res.status === 200) {
        setTrips(res.data.data);
        setTotal(res.data.total);
      }
    } catch (err) { console.error("Search failed", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { handleSearch(); }, [page, pageSize]);

  // ── Client-side filter + sort ──
  const displayedTrips = useMemo(() => {
    let result = [...trips];
    if (filterStatus !== null) result = result.filter(t => t.status === filterStatus);
    if (filterMinCap > 0) result = result.filter(t => t.capacity >= filterMinCap);
    if (filterMaxDist > 0) result = result.filter(t => t.distance <= filterMaxDist * 1000);
    result.sort((a, b) => {
      if (sortKey === "time_asc") return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      if (sortKey === "time_desc") return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      if (sortKey === "dist_asc") return a.distance - b.distance;
      if (sortKey === "dist_desc") return b.distance - a.distance;
      return 0;
    });
    return result;
  }, [trips, filterStatus, filterMinCap, filterMaxDist, sortKey]);

  const activeFilterCount = [
    filterStatus !== null, filterMinCap > 0, filterMaxDist > 0,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilterStatus(null); setFilterMinCap(0); setFilterMaxDist(0); setSortKey("time_asc");
  };

  const columns: ColumnsType<Trip> = [
    {
      title: "Hành trình", key: "route",
      render: (_, record: Trip) => (
        <Tooltip title={`${record.startAddress} → ${record.endAddress}`}>
          <div style={{ maxWidth: 380 }}>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="truncate text-slate-700 font-medium">{record.startAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              <span className="truncate text-slate-500">{record.endAddress}</span>
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Chỗ trống", dataIndex: "capacity", key: "capacity",
      render: (v) => <span className="flex items-center gap-1 text-sm text-slate-700"><Users className="w-3.5 h-3.5 text-slate-400" /> {v}</span>,
    },
    {
      title: "Khoảng cách", dataIndex: "distance", key: "distance",
      render: (v) => <span className="flex items-center gap-1 text-sm text-slate-700"><Ruler className="w-3.5 h-3.5 text-slate-400" /> {formatDistance(v)}</span>,
    },
    {
      title: "Khởi hành", dataIndex: "startTime", key: "startTime",
      render: (v) => <span className="flex items-center gap-1 text-sm text-slate-700"><Clock className="w-3.5 h-3.5 text-slate-400" /> {formatTime(v)}</span>,
    },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (status: Trip["status"]) => { const s = statusConfig[status]; return <span className={s.cls}>{s.text}</span>; },
    },
    {
      title: "", key: "action", align: "right", width: 180,
      render: (_, record) => (
        <div className="flex items-center gap-2 justify-end">
          <button onClick={() => router.push(`/detail-trip/${record.id}`)} className="btn btn-ghost btn-sm">
            <Eye className="w-3.5 h-3.5" /> Xem
          </button>
          {(record.status === 1 || record.status === 0) && (
            <RequestRidePopover id={record.id} buttonText="Xin đi nhờ" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-lg text-slate-900 mb-2">Tìm chuyến đi</h1>
          <p className="text-slate-500">Nhập điểm đi và điểm đến để tìm chuyến phù hợp với bạn</p>
        </div>

        {/* Search Panel */}
        <div className="card-flat p-5 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Start */}
            <div className="relative">
              <label className="label">📍 Điểm xuất phát</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                <input
                  type="text" placeholder="Nhập điểm đi..."
                  value={startInput}
                  onChange={(e) => { setStartInput(e.target.value); setStart(null); fetchSuggestions(e.target.value, "start"); }}
                  className="input" style={{ paddingLeft: "2.5rem" }}
                />
              </div>
              {startSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-auto z-20">
                  {startSuggestions.map((s) => (
                    <button key={s.place_id} onClick={() => handleSelect(s, "start")}
                      className="flex items-start gap-2.5 w-full px-3 py-2.5 hover:bg-emerald-50 transition-colors text-left border-b border-slate-50 last:border-0">
                      <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 line-clamp-2">{s.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* End */}
            <div className="relative">
              <label className="label">🏁 Điểm đến</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  type="text" placeholder="Nhập điểm đến..."
                  value={endInput}
                  onChange={(e) => { setEndInput(e.target.value); setEnd(null); fetchSuggestions(e.target.value, "end"); }}
                  className="input" style={{ paddingLeft: "2.5rem" }}
                />
              </div>
              {endSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-auto z-20">
                  {endSuggestions.map((s) => (
                    <button key={s.place_id} onClick={() => handleSelect(s, "end")}
                      className="flex items-start gap-2.5 w-full px-3 py-2.5 hover:bg-blue-50 transition-colors text-left border-b border-slate-50 last:border-0">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 line-clamp-2">{s.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action row */}
          <div className="flex flex-wrap gap-3 items-center">
            <button onClick={() => { setPage(1); handleSearch(1, pageSize); }} className="btn btn-primary">
              <Search className="w-4 h-4" />Tìm kiếm
            </button>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                showFilter || activeFilterCount > 0
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Bộ lọc
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Filter panel */}
          {showFilter && (
            <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-700">Bộ lọc nâng cao</p>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium">
                    <X className="w-3.5 h-3.5" />Xóa bộ lọc
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Status filter */}
                <div>
                  <label className="label">Trạng thái chuyến</label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <button
                      onClick={() => setFilterStatus(null)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${filterStatus === null ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                    >Tất cả</button>
                    {([0, 1, 2, 3, 4] as Trip["status"][]).map(s => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${filterStatus === s ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200 hover:border-emerald-200"}`}
                      >{statusConfig[s].text}</button>
                    ))}
                  </div>
                </div>

                {/* Min seats */}
                <div>
                  <label className="label">Chỗ trống tối thiểu: <strong>{filterMinCap || "Bất kỳ"}</strong></label>
                  <input
                    type="range" min={0} max={8} step={1} value={filterMinCap}
                    onChange={e => setFilterMinCap(Number(e.target.value))}
                    className="w-full accent-emerald-600 mt-2"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                    <span>0</span><span>8+</span>
                  </div>
                </div>

                {/* Max distance */}
                <div>
                  <label className="label">Khoảng cách tối đa: <strong>{filterMaxDist ? `${filterMaxDist} km` : "Bất kỳ"}</strong></label>
                  <input
                    type="range" min={0} max={100} step={5} value={filterMaxDist}
                    onChange={e => setFilterMaxDist(Number(e.target.value))}
                    className="w-full accent-emerald-600 mt-2"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                    <span>0</span><span>100 km</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Result count */}
        {!loading && (
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-sm text-slate-500">
              Tìm thấy <span className="font-bold text-slate-800">{displayedTrips.length}</span> chuyến
              {activeFilterCount > 0 && <span className="text-emerald-600"> (đã lọc)</span>}
            </p>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-24"><Loading /></div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block card-flat p-1">
              <Table<Trip>
                columns={columns}
                dataSource={displayedTrips}
                rowKey="id"
                pagination={false}
                scroll={{ x: 800 }}
                locale={{ emptyText: <div className="py-12 text-center text-slate-400"><Car className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>Không tìm thấy chuyến phù hợp</p></div> }}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {displayedTrips.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Không tìm thấy chuyến đi nào</p>
                  <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc điểm tìm kiếm</p>
                </div>
              )}
              {displayedTrips.map((trip) => {
                const s = statusConfig[trip.status];
                return (
                  <div key={trip.id} className="trip-card">
                    <div className="flex gap-3 mb-3">
                      <div className="route-line mt-1">
                        <div className="route-dot-start" />
                        <div className="route-connector" />
                        <div className="route-dot-end" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1 mb-2">{trip.startAddress}</p>
                        <p className="text-sm text-slate-500 line-clamp-1">{trip.endAddress}</p>
                      </div>
                      <span className={s.cls}>{s.text}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 border-t border-slate-50 pt-3 mb-3">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatTime(trip.startTime)}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{trip.capacity} chỗ</span>
                      <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" />{formatDistance(trip.distance)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/detail-trip/${trip.id}`)} className="flex-1 btn btn-ghost btn-sm border border-slate-200">
                        <Eye className="w-3.5 h-3.5" />Chi tiết<ChevronRight className="w-3.5 h-3.5 ml-auto" />
                      </button>
                      {(trip.status === 1 || trip.status === 0) && (
                        <RequestRidePopover id={trip.id} buttonText="Xin đi nhờ" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {total > 0 && (
              <div className="mt-6 flex justify-center">
                <Pagination current={page} pageSize={pageSize} total={total} showSizeChanger
                  onChange={(p, size) => { setPage(p); setPageSize(size || 10); }} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
