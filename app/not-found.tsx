import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Trang không tồn tại</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Quay lại trang chủ
      </Link>
    </div>
  )
}
