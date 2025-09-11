import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Chiasechuyendi - Kết nối chuyến xe, giảm tắc đường",
  description:
    "Chia sẻ chuyến xe, tiết kiệm chi phí, kết nối cộng đồng và bảo vệ môi trường.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/car.png" />
      </head>
      <body className="bg-gray-50">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
