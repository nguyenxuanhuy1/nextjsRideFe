import { Car, Github, Facebook, Send } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Car className="text-emerald-500 h-8 w-8" />
              <span className="text-xl font-bold text-emerald-600">
                Chiasechuyendi
              </span>
            </div>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed max-w-xs">
              Nền tảng giúp kết nối những người có cùng lộ trình, giúp tiết kiệm chi phí và giảm thiểu ùn tắc giao thông tại Việt Nam.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Khám phá</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/search-trip" className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">Tìm kiếm chuyến đi</Link></li>
              <li><Link href="/create-trip" className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">Đăng tin chuyến đi</Link></li>
              <li><Link href="/feedback" className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">Gửi góp ý</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Liên hệ</h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors"><Github size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors"><Send size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center">
            © 2025 Chiasechuyendi. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm text-center">
            Thiết kế và phát triển bởi <span className="text-emerald-600 font-medium">Nguyễn Xuân Huy</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
