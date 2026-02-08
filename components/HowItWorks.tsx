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

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Tìm chuyến",
              desc: "Tìm kiếm các chuyến xe phù hợp với lộ trình và thời gian của bạn chỉ trong vài giây.",
              step: "01",
            },
            {
              icon: Car,
              title: "Đặt chỗ",
              desc: "Đặt chỗ nhanh chóng và an toàn. Bạn có thể chọn chuyến miễn phí hoặc chia sẻ chi phí.",
              step: "02",
            },
            {
              icon: Handshake,
              title: "Vivi vu cùng nhau",
              desc: "Gặp gỡ, đi chung và tận hưởng hành trình tiết kiệm, thân thiện và an toàn.",
              step: "03",
            },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 text-4xl font-black text-emerald-50/50 group-hover:text-emerald-100 transition-colors">
                {item.step}
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-600 transition-colors duration-300">
                  <item.icon className="h-8 w-8 text-emerald-600 group-hover:text-white" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
