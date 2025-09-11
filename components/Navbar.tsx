"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const navItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/search-trip", label: "Tìm chuyến" },
    { href: "/create-trip", label: "Tạo chuyến" },
    { href: "/feedback", label: "Gửi phàn nàn" },
  ];

  const trips = [
    { id: 1, name: "Chuyến đi Hà Nội - Đà Nẵng" },
    { id: 2, name: "Chuyến đi Sài Gòn - Nha Trang" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const name = localStorage.getItem("refreshToken");
    if (token && name) setUserName(name);
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className="flex items-center space-x-2"
            onClick={() => router.push("/")}
          >
            <Car className="text-emerald-500 h-8 w-8" />
            <span className="text-xl font-bold text-emerald-600">
              Chiasechuyendi
            </span>
          </div>

          {/* Menu desktop */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
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

          {/* Right side: user / login / mobile menu */}
          <div className="flex items-center space-x-4">
            {userName ? (
              <>
                {/* Desktop dropdown */}
                <div className="hidden sm:block relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-2 font-medium text-gray-700 hover:text-emerald-600"
                  >
                    {/* <span className="truncate">{userName}</span>{" "} */}
                    <Menu className="h-7 w-7" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-[401]">
                      <div className="p-4 border-b">
                        <span className="font-semibold truncate max-w-[250px] overflow-hidden whitespace-nowrap block">
                          Xin chào, {userName}
                        </span>
                      </div>
                      <div className="p-4 border-b">
                        <span className="font-semibold">
                          Các chuyến đã tạo:
                        </span>
                        <ul className="mt-2 space-y-1">
                          {trips.map((trip) => (
                            <li
                              key={trip.id}
                              className="text-gray-600 hover:text-emerald-600"
                            >
                              {trip.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4">
                        <span className="font-semibold">Thông báo:</span>
                        <ul className="mt-2 space-y-1">
                          <li className="text-gray-600 hover:text-emerald-600">
                            Bạn có 2 chuyến sắp tới
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="sm:hidden ">
                  <button onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8080/oauth2/authorization/google")
                }
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition duration-300"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden mt-2 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {item.label}
              </Link>
            ))}

            {/* Nếu đăng nhập, show thêm thông tin user + trips */}
            {userName && (
              <div className="px-4 py-2 border-t">
                <span className="font-semibold truncate max-w-[350px] overflow-hidden whitespace-nowrap block">
                  Xin chào, {userName}
                </span>
                <span className="block mt-2 font-semibold">
                  Các chuyến đã tạo:
                </span>
                <ul className="mt-1 space-y-1">
                  {trips.map((trip) => (
                    <li
                      key={trip.id}
                      className="text-gray-600 hover:text-emerald-600"
                    >
                      {trip.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
