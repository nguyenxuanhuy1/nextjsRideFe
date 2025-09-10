"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Cảm ơn bạn đã gửi phản hồi!\nSao: ${rating}\nNội dung: ${feedback}`);
    setFeedback("");
    setRating(0);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Xe trái */}
      <img
        src="/car.png"
        alt="Xe trái"
        className="absolute -top-8 -left-8 h-28 w-28 z-20"
      />
      {/* Xe phải */}
      <img
        src="/carcontainer.png"
        alt="Xe phải"
        className="absolute -top-8 -right-8 h-28 w-28 z-20"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-4 relative z-10"
      >
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Gửi ý kiến của bạn hoặc phàn nàn
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
          placeholder="Nhập nội dung phàn nàn..."
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
