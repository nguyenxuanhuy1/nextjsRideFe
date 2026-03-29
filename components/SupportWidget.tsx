"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Phone,
  Mail,
  Facebook,
  Send,
  ChevronRight,
} from "lucide-react";

const CONTACTS = [
  {
    id: "zalo",
    icon: "💬",
    label: "Zalo",
    sub: "Chat trực tiếp",
    href: "https://zalo.me/0394566622",
    color: "#0068FF",
    bg: "#EFF6FF",
  },
 
  {
    id: "telegram",
    icon: null,
    label: "Telegram",
    sub: "@xhuy002",
    href: "https://t.me/xhuy002",
    color: "#0088CC",
    bg: "#EFF6FF",
    LucideIcon: Send,
  },
];

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [ping, setPing] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  // Tắt ping dot sau 6s
  useEffect(() => {
    const t = setTimeout(() => setPing(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Đóng khi click bên ngoài
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Đóng khi bấm ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-3"
    >
      {/* Panel */}
      {open && (
        <div
          className="w-72 rounded-2xl overflow-hidden shadow-2xl border border-slate-100 animate-slide-up"
          style={{ background: "#ffffff" }}
        >
          {/* Header */}
          <div
            className="px-4 py-4 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
            }}
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
              🎧
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm">Chăm sóc khách hàng</p>
              <p className="text-emerald-100 text-xs mt-0.5">
                Chúng tôi luôn sẵn lòng hỗ trợ bạn!
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Online indicator */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border-b border-emerald-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-700">
              Đang trực tuyến — Phản hồi trong vài phút
            </span>
          </div>

          {/* Contact list */}
          <div className="divide-y divide-slate-50">
            {CONTACTS.map((c) => {
              const Icon = c.LucideIcon;
              return (
                <a
                  key={c.id}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
                >
                  {/* Icon container */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: c.bg }}
                  >
                    {c.icon ? (
                      <span>{c.icon}</span>
                    ) : Icon ? (
                      <Icon className="w-4 h-4" style={{ color: c.color }} />
                    ) : null}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      {c.label}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{c.sub}</p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                  />
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-center text-xs text-slate-400">
              ⏰ Hỗ trợ: Thứ 2 – Chủ nhật · 8:00 – 22:00
            </p>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        id="support-widget-btn"
        onClick={() => {
          setOpen(!open);
          setPing(false);
        }}
        aria-label="Mở hỗ trợ khách hàng"
        className={`relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 active:scale-95 ${
          open
            ? "bg-slate-700 rotate-0"
            : "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 hover:scale-110"
        }`}
      >
        {/* Ripple glow */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25" />
        )}

        {/* Icon */}
        {open ? (
          <X className="w-6 h-6 text-white transition-transform" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}

        {/* Ping dot */}
        {ping && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">!</span>
          </span>
        )}
      </button>
    </div>
  );
}
