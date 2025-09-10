import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CreateTripForm from "@/components/CreateTripForm";

export default function CreateTripPage() {
  return (
    <>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Tạo chuyến đi mới</h1>
        <CreateTripForm />
      </main>
    </>
  );
}
