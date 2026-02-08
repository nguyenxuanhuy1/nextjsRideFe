import { Users, DollarSign, Leaf } from "lucide-react";

export default function Features() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">
            Lợi ích
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Vì sao nên chọn đi chung xe?
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Kết nối cộng đồng",
                desc: "Gặp gỡ những người có cùng lộ trình, mở rộng mối quan hệ và tạo dựng cộng đồng văn minh."
              },
              {
                icon: DollarSign,
                title: "Tiết kiệm chi phí",
                desc: "Chia sẻ chi phí xăng xe, giúp giảm gánh nặng tài chính cho cả tài xế và hành khách."
              },
              {
                icon: Leaf,
                title: "Bảo vệ môi trường",
                desc: "Giảm lượng xe lưu thông, góp phần giảm ùn tắc và lượng khí thải trực tiếp ra môi trường."
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed italic">
                  &ldquo;{feature.desc}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
