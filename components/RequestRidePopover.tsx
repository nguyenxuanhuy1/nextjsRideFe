"use client";

import React, { useState, useRef, useEffect } from "react";
import { Car, X, Send } from "lucide-react";
import { joinTrip } from "@/api/apiUser";
import { useNotify } from "@/hooks/useNotify";
import { AxiosErrorResponse } from "@/hooks/interface";

interface RequestRidePopoverProps {
  id: number;
  buttonText?: React.ReactNode;
  onSuccess?: () => void;
}

export function RequestRidePopover({
  id,
  buttonText,
  onSuccess,
}: RequestRidePopoverProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { notifyError, notifySuccess, contextHolder } = useNotify();

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const hitchhike = async () => {
    if (!note.trim()) {
      notifyError("", "Vui lòng nhập thông tin liên hệ!");
      return;
    }
    setLoading(true);
    try {
      const res = await joinTrip(id, note);
      if (res.status === 200) {
        setNote("");
        setOpen(false);
        if (onSuccess) onSuccess();
        notifySuccess("Gửi yêu cầu thành công! Chờ tài xế xác nhận.");
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

  return (
    <>
      {contextHolder}

      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary btn-sm"
      >
        <Car className="w-4 h-4" />
        {buttonText ?? "Xin đi nhờ"}
      </button>

      {/* Modal */}
      {open && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="modal-box">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Car className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Xin đi nhờ</h2>
                  <p className="text-xs text-slate-500">Tài xế sẽ liên hệ với bạn</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <label className="label mb-2">Thông tin liên hệ của bạn</label>
              <textarea
                rows={4}
                className="input resize-none"
                placeholder="Nhập số điện thoại, Zalo hoặc lời nhắn cho tài xế..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-1.5">
                💡 Ví dụ: "SĐT: 0912345678 - Zalo cùng số"
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => setOpen(false)}
                className="btn btn-ghost flex-1 border border-slate-200"
              >
                Hủy
              </button>
              <button
                onClick={hitchhike}
                disabled={loading || !note.trim()}
                className="btn btn-primary flex-1"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Gửi yêu cầu
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
