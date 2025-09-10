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

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <dt>
                <Users className="absolute h-6 w-6 text-emerald-500" />
                <p className="ml-9 text-lg leading-6 font-medium text-gray-900">
                  Kết nối cộng đồng
                </p>
              </dt>
              <dd className="mt-2 ml-9 text-base text-gray-500">
                Gặp gỡ những người có cùng lộ trình, mở rộng mối quan hệ.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <DollarSign className="absolute h-6 w-6 text-emerald-500" />
                <p className="ml-9 text-lg leading-6 font-medium text-gray-900">
                  Tiết kiệm chi phí
                </p>
              </dt>
              <dd className="mt-2 ml-9 text-base text-gray-500">
                Chia sẻ chi phí xăng xe, tiết kiệm cho cả tài xế và hành khách.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <Leaf className="absolute h-6 w-6 text-emerald-500" />
                <p className="ml-9 text-lg leading-6 font-medium text-gray-900">
                  Bảo vệ môi trường
                </p>
              </dt>
              <dd className="mt-2 ml-9 text-base text-gray-500">
                Giảm lượng xe lưu thông, góp phần giảm ùn tắc và khí thải.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
