import SearchTripPage from "@/components/Searchtrip";
import { searchTrip } from "@/api/apiUser";

export const metadata = {
  title: "Tìm kiếm chuyến đi | chia sẻ chuyến đi",
  description: "Tìm chuyến đi phù hợp theo điểm xuất phát và điểm đến của bạn.",
};

export default async function SearchTrip() {
  const res = await searchTrip({
    startLat: null,
    startLng: null,
    endLat: null,
    endLng: null,
    page: 0,
    size: 10,
  });

  const initialTrips = res?.data?.data ?? [];
  const initialTotal = res?.data?.total ?? 0;

  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      <SearchTripPage initialTrips={initialTrips} initialTotal={initialTotal} />
    </div>
  );
}
