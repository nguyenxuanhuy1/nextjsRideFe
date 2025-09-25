"use client";
import { viewFeedbback } from "@/api/apiUser";
import { CommentFb } from "@/hooks/interface";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function Testimonials() {
  const [viewFb, setViewFb] = useState<CommentFb[]>([]);

  useEffect(() => {
    const fetchViewfeedback = async () => {
      try {
        const res = await viewFeedbback();
        if (res.status === 200) {
          setViewFb(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API thông báo:", error);
      }
    };

    fetchViewfeedback();
  }, []);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase text-center">
          Trải nghiệm
        </h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center">
          Người dùng nói gì?
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {viewFb?.map((fb: CommentFb) => (
            <div
              key={fb.id}
              className="bg-gray-50 p-6 rounded-lg shadow flex flex-col"
            >
              {/* Tên + sao */}
              <div className="flex items-center gap-2 font-semibold text-emerald-600">
                {fb.userName}
                <span className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < fb.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </span>
              </div>
              <p className="mt-3 text-gray-700">“{fb.comment}”</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
