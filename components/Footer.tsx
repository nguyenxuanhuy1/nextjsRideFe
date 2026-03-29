"use client";

import { Car, Github, Facebook, Send, Heart, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

const links = {
  product: [
    { label: "Tìm chuyến đi", href: "/search-trip" },
    { label: "Tạo chuyến mới", href: "/create-trip" },
    { label: "Chuyến của tôi", href: "/My-trip" },
    { label: "Gửi phản hồi", href: "/feedback" },
  ],
  explore: [
    { label: "Cộng đồng ôn thi", href: "https://congdongonthi.online/", external: true },
  ],
  social: [
    { Icon: Facebook, label: "Facebook", href: "#" },
    { Icon: Github, label: "GitHub", href: "#" },
    { Icon: Send, label: "Telegram", href: "#" },
  ],
};


export default function Footer() {
  return (
    <footer className="footer-wrap">
      {/* ── Sky gradient layer ── */}
      <div className="footer-sky" />

      {/* ── Stars ── */}
      <div className="footer-stars" aria-hidden>
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${(Math.random() * 3).toFixed(2)}s`,
              width: Math.random() > 0.7 ? "2px" : "1px",
              height: Math.random() > 0.7 ? "2px" : "1px",
            }}
          />
        ))}
      </div>

      {/* ── Mountain silhouette ── */}
      <div className="footer-mountains" aria-hidden>
        <svg viewBox="0 0 1440 180" fill="none" preserveAspectRatio="none">
          {/* Far mountains */}
          <path
            d="M0 180 L120 80 L240 130 L380 50 L520 110 L660 30 L780 100 L900 55 L1020 120 L1160 45 L1300 105 L1440 60 L1440 180Z"
            fill="rgba(30,41,59,0.6)"
          />
          {/* Near mountains */}
          <path
            d="M0 180 L80 120 L180 155 L300 90 L420 140 L560 70 L680 130 L800 80 L920 150 L1060 85 L1180 140 L1310 95 L1440 125 L1440 180Z"
            fill="rgba(15,23,42,0.85)"
          />
        </svg>
      </div>

      {/* ── Streetlights ── */}
      <div className="footer-streetlights" aria-hidden>
        {[8, 22, 38, 56, 72, 88].map((pct, i) => (
          <div key={i} className="streetlight" style={{ left: `${pct}%` }}>
            <div className="sl-pole" />
            <div className="sl-arm" />
            <div className="sl-glow" />
          </div>
        ))}
      </div>


      {/* ── Main content ── */}
      <div className="footer-content">
        <div className="container">
          {/* Top: brand + links */}
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="brand-logo">
                <div className="brand-icon">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="brand-name">
                  <span style={{ color: "#34d399" }}>Chiase</span>
                  <span>chuyendi</span>
                </span>
              </div>
              <p className="brand-desc">
                Nền tảng kết nối những người có cùng lộ trình — tiết kiệm chi phí, giảm ùn tắc, bảo vệ môi trường Việt Nam.
              </p>

              {/* Social */}
              <div className="social-row">
                {links.social.map(({ Icon, label, href }) => (
                  <a key={label} href={href} aria-label={label} className="social-btn">
                    <Icon size={15} />
                  </a>
                ))}
              </div>

              {/* Journey stat */}
              <div className="journey-stat">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hơn <strong>1,200</strong> chuyến xe đã khởi hành</span>
              </div>
            </div>

            {/* Product links */}
            <div>
              <h3 className="footer-heading">Sản phẩm</h3>
              <ul className="footer-links">
                {links.product.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="footer-link">
                      <ArrowRight className="w-3 h-3" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore + contact */}
            <div>
              <h3 className="footer-heading">Khám phá</h3>
              <ul className="footer-links">
                {links.explore.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>

              <h3 className="footer-heading" style={{ marginTop: "1.5rem" }}>Liên hệ</h3>
              <div className="contact-info">
                <p>📞 0912 345 678</p>
                <p>📧 support@chiasechuyendi.online</p>
                <p>⏰ Thứ 2 – CN · 8:00 – 22:00</p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p className="footer-copy">© 2025 Chiasechuyendi. All rights reserved.</p>
            <p className="footer-credit">
              Thiết kế với <Heart className="w-3.5 h-3.5 inline text-rose-400 fill-rose-400 mx-0.5" /> bởi{" "}
              <span style={{ color: "#34d399", fontWeight: 600 }}>Nguyễn Xuân Huy</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Wrap ── */
        .footer-wrap {
          position: relative;
          overflow: hidden;
          background: #060d1a;
        }

        /* ── Sky ── */
        .footer-sky {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            #0a1628 0%,
            #0e1f3d 30%,
            #0f2847 55%,
            #111827 80%,
            #060d1a 100%
          );
        }

        /* ── Stars ── */
        .footer-stars {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: twinkle 3.5s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }

        /* ── Mountains ── */
        .footer-mountains {
          position: absolute;
          bottom: 120px;
          left: 0; right: 0;
          height: 180px;
          pointer-events: none;
        }
        .footer-mountains svg {
          width: 100%;
          height: 100%;
        }

        /* ── Streetlights ── */
        .footer-streetlights {
          position: absolute;
          bottom: 118px;
          left: 0; right: 0;
          height: 130px;
          pointer-events: none;
        }
        .streetlight {
          position: absolute;
          bottom: 0;
          transform: translateX(-50%);
        }
        .sl-pole {
          width: 2px;
          height: 100px;
          background: linear-gradient(to top, #374151, #6b7280);
          margin: 0 auto;
        }
        .sl-arm {
          width: 20px;
          height: 2px;
          background: #6b7280;
          margin-left: -10px;
          margin-top: -2px;
        }
        .sl-glow {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: radial-gradient(circle, #fef08a 0%, #fde047 40%, transparent 70%);
          margin-left: -8px;
          margin-top: -10px;
          box-shadow: 0 0 16px 6px rgba(253,224,71,0.5);
          animation: lamp-pulse 2.5s ease-in-out infinite;
        }
        @keyframes lamp-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 12px 4px rgba(253,224,71,0.45); }
          50% { opacity: 0.85; box-shadow: 0 0 18px 6px rgba(253,224,71,0.3); }
        }


        /* ── Content ── */
        .footer-content {
          position: relative;
          z-index: 10;
          padding-top: 3.5rem;
          padding-bottom: 5rem;
        }

        /* ── Grid ── */
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1.8fr 1fr 1.2fr;
          }
        }

        /* ── Brand ── */
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 1rem;
        }
        .brand-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(16,185,129,0.35);
        }
        .brand-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -0.02em;
        }
        .brand-desc {
          font-size: 0.85rem;
          line-height: 1.65;
          color: #64748b;
          max-width: 300px;
          margin-bottom: 1.25rem;
        }

        /* Social */
        .social-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .social-btn {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: #94a3b8;
          transition: all 0.2s;
        }
        .social-btn:hover {
          background: rgba(16,185,129,0.15);
          border-color: rgba(16,185,129,0.3);
          color: #34d399;
          transform: translateY(-2px);
        }

        /* Journey stat */
        .journey-stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          color: #475569;
        }
        .journey-stat strong {
          color: #34d399;
        }

        /* ── Footer links ── */
        .footer-heading {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 0.875rem;
        }
        .footer-links {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-link {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.85rem;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s;
        }
        .footer-link svg {
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s;
          color: #34d399;
        }
        .footer-link:hover {
          color: #94a3b8;
          padding-left: 4px;
        }
        .footer-link:hover svg {
          opacity: 1;
          transform: translateX(0);
        }

        /* Contact info */
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .contact-info p {
          font-size: 0.8rem;
          color: #64748b;
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
        }
        @media (min-width: 640px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }
        .footer-copy, .footer-credit {
          font-size: 0.78rem;
          color: #334155;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .footer-mountains { display: none; }
          .footer-streetlights { display: none; }
          .footer-content { padding-bottom: 3rem; }
        }
      `}</style>
    </footer>
  );
}
