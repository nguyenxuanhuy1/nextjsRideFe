import { Search, Car, Handshake, ArrowRight, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">
            Quy trình
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Đi chung xe dễ dàng trong 3 bước
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="text-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <Search className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 flex items-center gap-2 justify-center">
              Tìm chuyến
              <ArrowRight className="h-5 w-5 text-emerald-500 rotate-90 md:rotate-0" />
            </h3>

            <p className="mt-2 text-base text-gray-500">
              Tìm kiếm chuyến xe phù hợp với lộ trình và thời gian của bạn.
            </p>
          </div>

          <div className="text-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <Car className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 flex items-center gap-2 justify-center">
              Đặt chỗ{" "}
              <ArrowRight className="h-5 w-5 text-emerald-500 rotate-90 md:rotate-0" />
            </h3>
            <p className="mt-2 text-base text-gray-500">
              Đặt chỗ nhanh chóng, an toàn, minh bạch chi phí miễn phí hoặc có
              thể chia sẻ tiền xăng xe.
            </p>
          </div>

          <div className="text-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <Handshake className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 flex items-center gap-2 justify-center">
              Đi cùng nhau <CheckCircle className="h-6 w-6 text-emerald-500" />
            </h3>
            <p className="mt-2 text-base text-gray-500">
              Gặp gỡ, đi chung và tận hưởng chuyến đi tiết kiệm, thân thiện.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
