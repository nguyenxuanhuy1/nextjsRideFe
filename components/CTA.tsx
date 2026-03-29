import Link from "next/link";
import { ArrowRight, Car, Search } from "lucide-react";

export default function CTA() {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 p-10 md:p-16">
          {/* Decorative */}
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(-30%, 30%)" }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-4">
                Sẵn sàng khám phá <br />
                hành trình mới?
              </h2>
              <p className="text-emerald-100 text-lg leading-relaxed max-w-lg">
                Đừng để ghế trống lãng phí. Cùng nhau chia sẻ, tiết kiệm và bảo vệ môi trường ngay hôm nay.
              </p>

              {/* Mini stats */}
              <div className="flex gap-8 mt-6">
                {[
                  { label: "Chuyến đi", value: "1,200+" },
                  { label: "Tiết kiệm", value: "60%" },
                  { label: "CO₂ giảm", value: "2 tấn" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-emerald-200 text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/search-trip"
                className="flex items-center gap-2 justify-center px-6 py-3.5 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all hover:-translate-y-0.5 shadow-xl group"
              >
                <Search className="w-4 h-4" />
                Tìm chuyến đi
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/create-trip"
                className="flex items-center gap-2 justify-center px-6 py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-all hover:-translate-y-0.5 border border-emerald-400/50"
              >
                <Car className="w-4 h-4" />
                Tạo chuyến ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
