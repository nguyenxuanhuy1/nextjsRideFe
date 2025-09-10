import { Search, Car } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="hero-gradient">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Chia sẻ chuyến xe -</span>
            <span className="block text-emerald-600">
              Giảm tắc đường Việt Nam
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-700 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Kết nối với những người có cùng lộ trình, tiết kiệm chi phí và góp
            phần bảo vệ môi trường.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link href="/search-trip" passHref>
              <div className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10">
                <Search className="mx-auto h-12 w-12 text-white" />
                Tìm chuyến ngay
              </div>
            </Link>
            <Link href="/create-trip" passHref>
              <div className="mt-3 sm:mt-0 sm:ml-3 w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-emerald-600 bg-yellow-200 hover:bg-yellow-100 md:py-4 md:text-lg md:px-10">
                <Car className="mx-auto h-12 w-12 text-emerald-500" />
                Tạo chuyến đi
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
