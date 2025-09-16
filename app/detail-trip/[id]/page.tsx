"use client";
import React from "react";
import { useParams } from "next/navigation";
import TripDetailPage from "@/components/TripDetail";

export default function DetailTripPage() {
  const { id } = useParams();

  if (!id) return <p>Không tìm thấy chuyến</p>;

  return (
    <main className="max-w-7xl mx-auto p-4 min-h-screen">
      <TripDetailPage tripId={Number(id)} />
    </main>
  );
}
