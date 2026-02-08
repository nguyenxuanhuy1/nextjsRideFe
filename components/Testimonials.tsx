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

        <div className="mt-12 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {viewFb?.map((fb: CommentFb) => (
            <div
              key={fb.id}
              className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="absolute -top-4 left-8 p-2 bg-emerald-600 rounded-lg shadow-lg">
                <Star className="text-white fill-white" size={20} />
              </div>
              <div className="mt-4">
                <p className="text-gray-700 italic leading-relaxed text-lg">
                  “{fb.comment}”
                </p>
                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="font-bold text-gray-900">
                    {fb.userName}
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < fb.rating ? "fill-yellow-400" : "text-gray-200 fill-gray-200"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
