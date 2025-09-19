"use client";

import React, { useState, useRef, useEffect } from "react";
import { Car } from "lucide-react";
import { createPortal } from "react-dom";
import { joinTrip } from "@/api/apiUser";
import { useNotify } from "@/hooks/useNotify";

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
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const { notifyError, notifySuccess, contextHolder } = useNotify();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Đóng popover khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gửi yêu cầu xin đi nhờ
  const hitchhike = async () => {
    if (!note.trim()) {
      notifyError("", "Vui lòng nhập nội dung!");
      return;
    }
    setLoading(true);
    try {
      const res = await joinTrip(id, note);
      if (res.status === 200) {
        setNote("");
        setOpen(false);
        if (onSuccess) onSuccess();
        notifySuccess("Gửi yêu cầu thành công!");
      }
    } catch (err: any) {
      if (err) {
        notifyError(err.response.data.message);
      } else {
        notifyError("Gửi thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật vị trí popover
  const togglePopover = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popoverWidth = 256;
      const popoverHeight = 150;

      let top = rect.bottom + 8;
      let left = rect.left + rect.width / 2 - popoverWidth / 2;
      if (top + popoverHeight > window.innerHeight) {
        top = rect.top - 8 - popoverHeight;
      }

      left = Math.max(8, Math.min(left, window.innerWidth - popoverWidth - 8));
      setPosition({ top, left });
    }
    setOpen((prev) => !prev);
  };

  const popover = open
    ? createPortal(
        <div
          ref={popoverRef}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: 256,
            zIndex: 9999,
          }}
          className="bg-white border rounded shadow-lg p-3"
        >
          <textarea
            rows={4}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-emerald-300"
            placeholder="Nhập thông liên hệ với bạn... VD: Số điện thoại hay zalo..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            onClick={hitchhike}
            disabled={loading}
            className={`mt-2 w-full px-3 py-2 text-white rounded ${
              loading ? "bg-gray-400" : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {contextHolder}
      <button
        ref={buttonRef}
        onClick={togglePopover}
        className=" h-9 px-3 text-emerald-500 flex items-center gap-1 border border-emerald-500 rounded hover:bg-emerald-50 transition"
      >
        {buttonText}
      </button>
      {popover}
    </>
  );
}
