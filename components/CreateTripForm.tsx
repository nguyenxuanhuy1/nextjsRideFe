"use client";

import React, { useState } from "react";

export default function CreateTripForm() {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    seats: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dữ liệu chuyến đi:", form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block font-medium">Đi từ</label>
        <input
          name="from"
          value={form.from}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          placeholder="Nhập điểm xuất phát"
        />
      </div>
      <div>
        <label className="block font-medium">Đến</label>
        <input
          name="to"
          value={form.to}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          placeholder="Nhập điểm đến"
        />
      </div>
      <div>
        <label className="block font-medium">Ngày đi</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
        />
      </div>
      <div>
        <label className="block font-medium">Số chỗ</label>
        <input
          type="number"
          name="seats"
          value={form.seats}
          onChange={handleChange}
          min={1}
          max={10}
          className="w-full border rounded-md p-2"
        />
      </div>
      <button
        type="submit"
        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
      >
        Tạo chuyến đi
      </button>
    </form>
  );
}
