import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FlashlightProvider } from "@/hooks/useFlashlightMode";
import FlashlightEffect from "@/components/FlashlightEffect";
import FlashlightToggle from "@/components/FlashlightToggle";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

const baseUrl = "https://chiasechuyendi.com"; // Consider moving this to env

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Chiasechuyendi - Kết nối chuyến xe, giảm tắc đường",
    template: "%s | Chiasechuyendi",
  },
  description:
    "Chia sẻ chuyến xe, tiết kiệm chi phí, kết nối cộng đồng và bảo vệ môi trường.",
  keywords: [
    "chia sẻ chuyến xe",
    "đi chung xe",
    "tiết kiệm chi phí",
    "bảo vệ môi trường",
    "kết nối cộng đồng",
    "rideshare vietnam",
  ],
  authors: [{ name: "Chiasechuyendi Team" }],
  creator: "Chiasechuyendi Team",
  publisher: "Chiasechuyendi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: baseUrl,
    siteName: "Chiasechuyendi",
    title: "Chiasechuyendi - Kết nối chuyến xe, giảm tắc đường",
    description:
      "Chia sẻ chuyến xe, tiết kiệm chi phí, kết nối cộng đồng và bảo vệ môi trường.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chiasechuyendi - Rideshare Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chiasechuyendi - Kết nối chuyến xe, giảm tắc đường",
    description:
      "Chia sẻ chuyến xe, tiết kiệm chi phí, kết nối cộng đồng và bảo vệ môi trường.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/car.png",
    shortcut: "/car.png",
    apple: "/car.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Chiasechuyendi",
              url: baseUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${baseUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

      <body
        className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}
      >
        <Navbar />
        {/* <main className="flex-1">{children}</main> */}
        <FlashlightProvider>
          {children}
          <FlashlightEffect />
          <FlashlightToggle />
        </FlashlightProvider>
        <Footer />
      </body>
    </html>
  );
}
