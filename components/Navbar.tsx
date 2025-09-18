"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Car, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { notification } from "@/api/apiUser";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [totalNoti, setTotalNoti] = useState<any>(null);

  // useEffect(() => {
  //   const fetchNotification = async () => {
  //     try {
  //       const res = await notification();
  //       if (res.status === 200) {
  //         setTotalNoti(res.data.totalPending);
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi gọi API thông báo:", error);
  //     }
  //   };

  //   fetchNotification();
  // }, []);
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await notification();
        if (res.status === 200) {
          setTotalNoti(res.data.totalPending);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API thông báo:", error);
      }
    };

    // Lần đầu load
    fetchNotification();

    // Lắng nghe custom event
    const handleUpdate = () => {
      fetchNotification();
    };

    window.addEventListener("updateNotification", handleUpdate);

    return () => {
      window.removeEventListener("updateNotification", handleUpdate);
    };
  }, []);

  const navItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/search-trip", label: "Tìm chuyến" },
    { href: "/create-trip", label: "Tạo chuyến" },
    { href: "/feedback", label: "Gửi phàn nàn" },
  ];

  const checkLogin = () => {
    const token = localStorage.getItem("accessToken");
    const userInfoString = localStorage.getItem("userInfo");

    if (token && userInfoString) {
      try {
        setUserInfo(JSON.parse(userInfoString));
      } catch (err) {
        console.error("Lỗi parse userInfo:", err);
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkLogin();

    const handleUserLogin = (event: any) => {
      const userInfoString = event?.detail || localStorage.getItem("userInfo");
      if (userInfoString) {
        try {
          setUserInfo(JSON.parse(userInfoString));
        } catch (err) {
          console.error(err);
          setUserInfo(null);
        }
      }
    };

    window.addEventListener("userLogin", handleUserLogin);
    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserInfo(null);
    router.replace("/");
  };

  useEffect(() => {
    checkLogin();
  }, [pathname]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium ${
                  pathname === item.href
                    ? "text-emerald-600"
                    : "text-gray-500 hover:text-emerald-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {userInfo && (
              <div
                className="relative cursor-pointer"
                onClick={() => {
                  router.push(`/My-trip`);
                }}
              >
                <Bell className="h-6 w-6 text-gray-600 hover:text-emerald-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {totalNoti}
                </span>
              </div>
            )}

            {userInfo?.name ? (
              <>
                {/* Desktop */}
                <div className="hidden sm:block relative group">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <img
                      src={userInfo.avatarUrl}
                      alt={userInfo.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-700 hover:text-emerald-600">
                      {userInfo.name}
                    </span>
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <span
                      className="block p-2 text-red-500 cursor-pointer hover:text-red-600"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </span>
                  </div>
                </div>

                {/* Mobile menu button */}
                <div className="sm:hidden">
                  <button onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? (
                      <X className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <Menu className="h-6 w-6 text-emerald-600" />
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
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {userInfo?.name && (
              <div className="px-4 py-2 border-t">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={userInfo.avatarUrl}
                      alt={userInfo.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold truncate max-w-[150px] overflow-hidden whitespace-nowrap block">
                      {userInfo?.name}
                    </span>
                  </div>
                  <span
                    className="font-semibold cursor-pointer text-red-500 hover:text-red-600"
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                  >
                    Đăng xuất
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
