"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Car, LogOut, Menu, X, MapPin, Plus, MessageSquare, Home, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { notification } from "@/api/apiUser";
import { ENV } from "@/api/urlApi";
import { User } from "@/hooks/interface";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [totalNoti, setTotalNoti] = useState<number>(0);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    {
      href: "/",
      label: "Trang chủ",
      icon: Home,
      description: "Đây là màn hình chính của trang chủ.",
    },
    {
      href: "/search-trip",
      label: "Tìm chuyến",
      icon: MapPin,
      description: "Tìm kiếm chuyến đi cùng với lộ trình của bạn.",
    },
    {
      href: "/create-trip",
      label: "Tạo chuyến",
      icon: Plus,
      description: "Đăng chuyến mới nếu bạn có chuyến đi muốn chia sẻ.",
    },
    {
      href: "/feedback",
      label: "Phản hồi",
      icon: MessageSquare,
      description: "Gửi góp ý, đánh giá để chúng tôi cải thiện.",
    },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        const res = await notification();
        if (res.status === 200) {
          setTotalNoti(res.data.totalPending);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API thông báo:", error);
      }
    };

    fetchNotification();
    window.addEventListener("updateNotification", fetchNotification);
    window.addEventListener("userLogin", fetchNotification);
    return () => {
      window.removeEventListener("updateNotification", fetchNotification);
      window.removeEventListener("userLogin", fetchNotification);
    };
  }, []);

  const checkLogin = () => {
    const token = localStorage.getItem("accessToken");
    const userInfoString = localStorage.getItem("userInfo");
    if (token && userInfoString) {
      try {
        setUserInfo(JSON.parse(userInfoString));
      } catch {
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkLogin();

    const handleUserLogin = (event: CustomEvent<string>) => {
      const userInfoString = event?.detail || localStorage.getItem("userInfo");
      if (userInfoString) {
        try {
          setUserInfo(JSON.parse(userInfoString));
        } catch {
          setUserInfo(null);
        }
      }
    };

    window.addEventListener("userLogin", handleUserLogin as EventListener);
    return () => {
      window.removeEventListener("userLogin", handleUserLogin as EventListener);
    };
  }, []);

  useEffect(() => {
    checkLogin();
  }, [pathname]);

  const handleLogin = () => {
    window.location.href = `${ENV.API_URL}/oauth2/authorization/google`;
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserInfo(null);
    router.replace("/");
  };

  const startTour = () => {
    const tour = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      nextBtnText: "Tiếp →",
      prevBtnText: "← Quay lại",
      doneBtnText: "✓ Hoàn tất",
      steps: navItems.map((item, index) => ({
        element: `#nav-item-${index}`,
        popover: {
          title: item.label,
          description: item.description,
        },
      })),
    });
    tour.drive();
  };

  if (!mounted) {
    return (
      <nav className="navbar h-16">
        <div className="container flex items-center h-full justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 animate-pulse" />
            <div className="w-32 h-5 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Car className="text-white h-5 w-5" />
            </div>
            <span className="text-lg font-bold">
              <span className="gradient-text">Chiase</span>
              <span className="text-slate-700">chuyendi</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  id={`nav-item-${index}`}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Tour Button */}
            <button
              onClick={startTour}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors border border-emerald-100"
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Hướng dẫn
            </button>

            {/* Notification Bell */}
            {userInfo && (
              <button
                onClick={() => router.push("/My-trip")}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                title="Thông báo chuyến"
              >
                <Bell className="h-5 w-5" />
                {totalNoti > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                    {totalNoti > 99 ? "99+" : totalNoti}
                  </span>
                )}
              </button>
            )}

            {/* User Menu */}
            {userInfo?.name ? (
              <>
                {/* Desktop dropdown */}
                <div className="hidden md:block relative group">
                  <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all">
                    <img
                      src={userInfo.avatarUrl}
                      alt={userInfo.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-200"
                    />
                    <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                      {userInfo.name}
                    </span>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-1 w-52 card py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Đăng nhập với</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{userInfo.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors mt-1"
                    >
                      <UserIcon size={15} />
                      Trang cá nhân
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Đăng xuất
                    </button>
                  </div>
                </div>

                {/* Mobile menu button */}
                <button
                  className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-50"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <X className="h-5 w-5 text-emerald-600" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="btn btn-primary btn-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748z" />
                </svg>
                Đăng nhập
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 animate-fade-in">
            <div className="space-y-1 mb-3">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    id={`nav-item-mobile-${index}`}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {userInfo?.name && (
              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={userInfo.avatarUrl}
                      alt={userInfo.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-200"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{userInfo.name}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[150px]">{userInfo.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
