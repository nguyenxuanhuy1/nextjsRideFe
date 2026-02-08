import Link from "next/link";

export default function CTA() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-emerald-600 rounded-3xl p-8 md:p-16 overflow-hidden shadow-2xl shadow-emerald-200">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500 rounded-full opacity-20" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 h-48 bg-emerald-700 rounded-full opacity-20" />

          <div className="relative z-10 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                Sẵn sàng khám phá <br /> hành trình mới?
              </h2>
              <p className="mt-6 text-emerald-50 text-xl leading-relaxed">
                Đừng để ghế trống lãng phí. Cùng nhau chia sẻ, tiết kiệm và bảo vệ môi trường ngay hôm nay.
              </p>
            </div>
            <div className="mt-10 lg:mt-0 flex flex-col sm:flex-row gap-4">
              <Link
                href="/search-trip"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-emerald-600 bg-white hover:bg-emerald-50 shadow-xl transition-all hover:-translate-y-1 active:scale-95 duration-200"
              >
                Tìm chuyến đi
              </Link>
              <Link
                href="/create-trip"
                className="inline-flex items-center justify-center px-8 py-4 border border-emerald-500 text-lg font-bold rounded-xl text-white bg-emerald-500 hover:bg-emerald-400 shadow-xl transition-all hover:-translate-y-1 active:scale-95 duration-200"
              >
                Tạo chuyến mới
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
