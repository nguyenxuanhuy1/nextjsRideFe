import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SupportWidget from "@/components/SupportWidget";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = "https://chiasechuyendi.online"; // Consider moving this to env

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Chiasechuyendi - Chia sẻ chuyến đi, tiết kiệm chi phí",
    template: "%s | Chiasechuyendi.online",
  },
  description:
    "Nền tảng chia sẻ chuyến đi hàng đầu Việt Nam. Tìm & đăng chuyến đi chung, tiết kiệm chi phí, kết nối cộng đồng và bảo vệ môi trường.",
  keywords: [
    "chia sẻ chuyến đi",
    "đi chung chuyến",
    "tìm chuyến đi",
    "đăng chuyến đi",
    "đi chung xe",
    "carpool việt nam",
    "rideshare vietnam",
    "chia sẻ xe ô tô",
    "tiết kiệm chi phí đi lại",
    "chuyến đi cùng chiều",
    "chiasechuyendi",
    "chiasechuyendi.online",
  ],
  authors: [{ name: "Chiasechuyendi Team", url: baseUrl }],
  creator: "Chiasechuyendi Team",
  publisher: "Chiasechuyendi",
  category: "Travel & Transportation",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: baseUrl,
    siteName: "Chiasechuyendi.online",
    title: "Chiasechuyendi - Chia sẻ chuyến đi, giảm tắc đường Việt Nam",
    description:
      "Tìm & đăng chuyến đi chung dễ dàng. Tiết kiệm chi phí, kết nối cộng đồng và góp phần giảm ùn tắc giao thông tại Việt Nam.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chiasechuyendi - Nền tảng chia sẻ chuyến đi Việt Nam",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chiasechuyendi - Chia sẻ chuyến đi, giảm tắc đường Việt Nam",
    description:
      "Tìm & đăng chuyến đi chung dễ dàng. Tiết kiệm chi phí, kết nối cộng đồng và góp phần giảm ùn tắc giao thông tại Việt Nam.",
    images: ["/og-image.png"],
    site: "@chiasechuyendi",
    creator: "@chiasechuyendi",
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
  verification: {
    google: "", // Điền Google Search Console verification code ở đây
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
        {/* Schema.org: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Chiasechuyendi",
              alternateName: "Chiasechuyendi.online",
              url: baseUrl,
              description:
                "Nền tảng chia sẻ chuyến đi hàng đầu Việt Nam. Tìm & đăng chuyến đi chung, tiết kiệm chi phí, bảo vệ môi trường.",
              inLanguage: "vi",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${baseUrl}/search-trip?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* Schema.org: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Chiasechuyendi",
              url: baseUrl,
              logo: `${baseUrl}/car.png`,
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+84-912-345-678",
                contactType: "customer service",
                availableLanguage: "Vietnamese",
                hoursAvailable: "Mo-Su 08:00-22:00",
              },
              sameAs: [
                "https://facebook.com/chiasechuyendi",
              ],
            }),
          }}
        />
      </head>

      <body
        className={`${inter.variable} ${inter.className} bg-gray-50 min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <SupportWidget />
        <Footer />
      </body>
    </html>
  );
}
