export default function Testimonials() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase text-center">
          Trải nghiệm
        </h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center">
          Người dùng nói gì?
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <p className="text-gray-700">
              “Đi chung xe giúp tôi tiết kiệm được khá nhiều chi phí đi lại và
              còn quen thêm nhiều bạn mới.”
            </p>
            <p className="mt-4 font-semibold text-emerald-600">Nguyễn Minh</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <p className="text-gray-700">
              “Ứng dụng rất tiện lợi, dễ sử dụng. Tôi cảm thấy an toàn và vui vẻ
              khi đi chung xe.”
            </p>
            <p className="mt-4 font-semibold text-emerald-600">Trần Lan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
