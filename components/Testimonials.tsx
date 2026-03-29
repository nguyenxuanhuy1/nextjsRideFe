"use client";
import { viewFeedbback } from "@/api/apiUser";
import { CommentFb } from "@/hooks/interface";
import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";

export default function Testimonials() {
  const [viewFb, setViewFb] = useState<CommentFb[]>([]);

  useEffect(() => {
    const fetchViewfeedback = async () => {
      try {
        const res = await viewFeedbback();
        if (res.status === 200) setViewFb(res.data);
      } catch (error) {
        console.error("Lỗi khi gọi API thông báo:", error);
      }
    };
    fetchViewfeedback();
  }, []);

  if (viewFb.length === 0) return null;

  return (
    <section className="section" style={{ background: "var(--surface-2)" }}>
      <div className="container">
        <div className="text-center mb-14">
          <p className="section-label">Cộng đồng</p>
          <h2 className="section-title">Người dùng nói gì?</h2>
          <p className="text-slate-500 mt-3">Những chia sẻ thực tế từ cộng đồng Chiasechuyendi</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {viewFb.map((fb: CommentFb, idx) => (
            <div
              key={fb.id}
              className={`card p-6 animate-fade-in stagger-${Math.min(idx + 1, 3)}`}
            >
              {/* Quote icon */}
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                <Quote className="w-4 h-4 text-emerald-600" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < fb.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-slate-600 text-sm leading-relaxed italic flex-1">
                "{fb.comment}"
              </p>

              {/* User */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                    {fb.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{fb.userName}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(fb.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star size={12} className="fill-amber-400" />
                  {fb.rating}/5
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
