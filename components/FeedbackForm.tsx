"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { feedBack } from "@/api/apiUser";
import Loading from "@/components/Loading";
import { useNotify } from "@/hooks/useNotify";

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const { notifySuccess, contextHolder } = useNotify();
  const handleSubmit = async (e: React.FormEvent) => {
    debugger;
    e.preventDefault();
    setLoading(true);

    try {
      const body = {
        rating,
        comment: feedback,
      };

      const res = await feedBack(body);
      if (res.status === 200) {
        notifySuccess("", res.data);
        setFeedback("");
        setRating(5);
      }
    } catch (error) {
      notifySuccess("", "Tạm thời có lỗi hãy quay lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {contextHolder}
      {loading && <Loading />}
      {/* Xe trái */}
      <img
        src="/car.png"
        alt="Xe trái"
        className="absolute -top-8 -left-8 h-28 w-28 z-20"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-4 relative z-10"
      >
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Gửi ý kiến của bạn hoặc đánh giá số sao!
        </h1>

        {/* Star rating */}
        <div className="flex justify-center mb-4">
          {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
            <Star
              key={star}
              className={`h-8 w-8 cursor-pointer transition-colors ${
                (hoverRating || rating) >= star
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <textarea
          placeholder="Nhập nội dung đánh giá..."
          className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={5}
          maxLength={300}
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}
