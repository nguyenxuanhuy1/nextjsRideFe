"use client";

import { useState } from "react";
import { Star, Send, MessageSquare } from "lucide-react";
import { feedBack } from "@/api/apiUser";
import Loading from "@/components/Loading";
import { useNotify } from "@/hooks/useNotify";
import { AxiosErrorResponse } from "@/hooks/interface";

const ratingLabels: Record<number, string> = {
  1: "Rất tệ",
  2: "Tệ",
  3: "Bình thường",
  4: "Tốt",
  5: "Tuyệt vời!",
};

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { notifySuccess, notifyError, contextHolder } = useNotify();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      notifyError("", "Vui lòng nhập nội dung đánh giá");
      return;
    }
    setLoading(true);
    try {
      const res = await feedBack({ rating, comment: feedback });
      if (res.status === 200) {
        setSubmitted(true);
        notifySuccess("", "Cảm ơn bạn đã gửi đánh giá!");
        setFeedback("");
        setRating(5);
        setTimeout(() => setSubmitted(false), 4000);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      notifyError(
        "",
        axiosError?.response?.data?.message || "Tạm thời có lỗi, hãy quay lại sau"
      );
    } finally {
      setLoading(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="section">
      {contextHolder}
      <div className="container" style={{ maxWidth: 560 }}>
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <h1 className="heading-lg text-slate-900 mb-2">Chia sẻ trải nghiệm</h1>
          <p className="text-slate-500">
            Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn
          </p>
        </div>

        {submitted ? (
          <div className="card p-10 text-center animate-fade-in">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="heading-md text-slate-900 mb-2">Cảm ơn bạn!</h2>
            <p className="text-slate-500">
              Đánh giá của bạn đã được ghi nhận thành công.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 animate-fade-in">
            {loading && <Loading />}

            {/* Star Rating */}
            <div className="mb-6">
              <label className="label mb-3">Mức độ hài lòng</label>
              <div className="flex gap-2 items-center justify-center">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform hover:scale-110 active:scale-95"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-10 w-10 transition-colors ${
                        activeRating >= star
                          ? "text-amber-400 drop-shadow-sm"
                          : "text-slate-200"
                      }`}
                      fill={activeRating >= star ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
              {activeRating > 0 && (
                <p className="text-center text-sm font-semibold mt-2 text-amber-600">
                  {ratingLabels[activeRating]}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="label">Nội dung đánh giá</label>
              <textarea
                placeholder="Chia sẻ trải nghiệm của bạn về ứng dụng, giao diện, hoặc tính năng..."
                className="input resize-none"
                style={{ minHeight: 120 }}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                maxLength={300}
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-slate-400">
                  {feedback.length === 0
                    ? "Tối đa 300 ký tự"
                    : `${feedback.length}/300`}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg"
            >
              <Send className="w-4 h-4" />
              {loading ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
