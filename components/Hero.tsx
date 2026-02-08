import { Search, Car } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="hero-gradient">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
            <span className="block mb-2">Chia sẻ chuyến xe -</span>
            <span className="block text-emerald-600 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              Giảm tắc đường Việt Nam
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl md:mt-8 md:text-2xl leading-relaxed">
            Kết nối với những người có cùng lộ trình, tiết kiệm chi phí và góp
            phần bảo vệ môi trường một cách thông minh và hiện đại.
          </p>
          <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12 gap-4">
            <Link 
              href="/search-trip" 
              className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1 active:scale-95 duration-200"
            >
              <Search className="mr-3 h-6 w-6" />
              Tìm chuyến ngay
            </Link>
            <Link 
              href="/create-trip" 
              className="mt-4 sm:mt-0 w-full flex items-center justify-center px-8 py-4 border-2 border-emerald-50 text-lg font-bold rounded-xl text-emerald-700 bg-white hover:bg-emerald-50 shadow-sm transition-all hover:-translate-y-1 active:scale-95 duration-200"
            >
              <Car className="mr-3 h-6 w-6 text-emerald-500" />
              Tạo chuyến đi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
