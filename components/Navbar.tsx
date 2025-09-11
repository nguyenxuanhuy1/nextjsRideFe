"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Car, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userName, setUserName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  // Kiểm tra login
  const checkLogin = () => {
    const token = localStorage.getItem("accessToken");
    const name = localStorage.getItem("refreshToken");
    setUserName(token && name ? name : null);
  };

  useEffect(() => {
    setMounted(true);
    checkLogin();

    // Lắng nghe event khi login xong
    const handleUserLogin = () => checkLogin();
    window.addEventListener("userLogin", handleUserLogin);

    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUserName(null);
  };

  // Skeleton khi chưa mount
  if (!mounted) {
    return (
      <nav className="bg-white shadow-sm h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-full">
          <div className="flex items-center space-x-2">
            <Car className="text-emerald-500 h-8 w-8 animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
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

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {userName ? (
              <>
                {/* Desktop dropdown */}
                <div className="hidden sm:block relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-2 font-medium text-gray-700 hover:text-emerald-600"
                  >
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
                        <span
                          className="font-semibold cursor-pointer text-red-500 hover:text-red-600"
                          onClick={handleLogout}
                        >
                          Đăng xuất
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="sm:hidden">
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
                onClick={handleLogin}
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

            {userName && (
              <div className="px-4 py-2 border-t">
                <span className="font-semibold truncate max-w-[350px] overflow-hidden whitespace-nowrap block">
                  Xin chào, {userName}
                </span>
                <span
                  className="block mt-2 font-semibold cursor-pointer text-red-500 hover:text-red-600"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
