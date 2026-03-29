import { Search, Car, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="hero-gradient">
      <div className="container py-24 md:py-32">
        <div className="text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Nền tảng đi chung xe hàng đầu Việt Nam
          </div>

          {/* Heading */}
          <h1 className="heading-xl text-slate-900 mb-6">
            Chia sẻ chuyến xe{" "}
            <span className="relative inline-block">
              <span className="gradient-text">thông minh</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 10C50 4 100 2 150 6C200 10 250 8 298 4"
                  stroke="url(#underline-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="underline-grad" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br />
            <span className="text-slate-700">Giảm tắc đường Việt Nam</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Kết nối với những người có cùng lộ trình, tiết kiệm chi phí và góp
            phần bảo vệ môi trường một cách thông minh.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search-trip" className="btn btn-primary btn-lg group">
              <Search className="h-5 w-5" />
              Tìm chuyến ngay
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/create-trip" className="btn btn-secondary btn-lg group">
              <Car className="h-5 w-5" />
              Đăng chuyến của bạn
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: "1,200+", label: "Chuyến đi" },
              { value: "500+", label: "Người dùng" },
              { value: "98%", label: "Hài lòng" },
            ].map((stat, i) => (
              <div key={i} className={`stagger-${i + 1} animate-fade-in`}>
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
