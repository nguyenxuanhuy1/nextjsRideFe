import { Users, DollarSign, Leaf, Shield, Zap, MapPin } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Kết nối cộng đồng",
    desc: "Gặp gỡ những người có cùng lộ trình, mở rộng mối quan hệ và xây dựng cộng đồng văn minh.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: DollarSign,
    title: "Tiết kiệm chi phí",
    desc: "Chia sẻ chi phí xăng xe, giảm gánh nặng tài chính cho cả tài xế lẫn hành khách.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Leaf,
    title: "Bảo vệ môi trường",
    desc: "Giảm lượng xe lưu thông, góp phần giảm ùn tắc và lượng khí thải trực tiếp ra môi trường.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    icon: Shield,
    title: "An toàn & tin cậy",
    desc: "Thông tin hành khách và tài xế được xác thực, đảm bảo an toàn cho mỗi chuyến đi.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    icon: Zap,
    title: "Nhanh chóng & tiện lợi",
    desc: "Đặt chuyến chỉ trong vài giây, nhận xác nhận ngay lập tức từ tài xế.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: MapPin,
    title: "Theo dõi lộ trình",
    desc: "Xem lịch trình và lộ trình chi tiết trên bản đồ, dễ dàng tìm điểm đón.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
];

export default function Features() {
  return (
    <section className="section bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-label">Tính năng nổi bật</p>
          <h2 className="section-title">Vì sao nên chọn Chiasechuyendi?</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Nền tảng được thiết kế để mang đến trải nghiệm đi chung xe tốt nhất cho người Việt Nam.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`card-flat border ${feature.border} p-6 group hover:shadow-md transition-all duration-300 stagger-${Math.min(idx + 1, 3)}`}
              >
                <div
                  className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
