"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/search-trip", label: "Tìm chuyến" },
    { href: "/create-trip", label: "Tạo chuyến" },
    { href: "/feedback", label: "Gửi phàn nàn" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Car className="text-emerald-500 h-8 w-8" />
            <span className="ml-2 text-xl font-bold text-emerald-600">
              Chiasechuyendi
            </span>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium ${
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-500 hover:text-emerald-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center">
            <button
              onClick={() => {
                window.location.href =
                  "http://localhost:8080/oauth2/authorization/google";
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition duration-300"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
