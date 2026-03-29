"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="not-found-wrap">
      {/* Stars */}
      <div className="nf-stars" aria-hidden>
        {mounted &&
          Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className="nf-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${(Math.random() * 4).toFixed(2)}s`,
                width: Math.random() > 0.7 ? "2px" : "1px",
                height: Math.random() > 0.7 ? "2px" : "1px",
              }}
            />
          ))}
      </div>

      {/* Road */}
      <div className="nf-road" aria-hidden>
        <div className="nf-road-stripe" />
        <div className="nf-road-stripe" />
        <div className="nf-road-stripe" />
        <div className="nf-car">🚗</div>
        <div className="nf-question q1">?</div>
        <div className="nf-question q2">?</div>
        <div className="nf-question q3">?</div>
      </div>

      {/* Content */}
      <div className="nf-content">
        <div className="nf-badge">404</div>
        <h1 className="nf-title">Ôi! Chuyến xe bị lạc đường 🗺️</h1>
        <p className="nf-desc">
          Trang bạn đang tìm không tồn tại hoặc đã được di chuyển đến nơi khác. Hãy quay lại và tiếp tục hành trình nhé!
        </p>

        <div className="nf-actions">
          <Link href="/" className="btn btn-primary">
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
          <Link href="/search-trip" className="btn btn-secondary">
            <Search className="w-4 h-4" />
            Tìm chuyến đi
          </Link>
        </div>

        <div className="nf-quick">
          <p className="nf-quick-label">Có thể bạn đang tìm:</p>
          <div className="nf-quick-links">
            {[
              { href: "/create-trip", label: "Tạo chuyến" },
              { href: "/My-trip", label: "Chuyến của tôi" },
              { href: "/feedback", label: "Gửi phản hồi" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="nf-quick-link">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .not-found-wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f2847 100%);
          padding: 2rem 1rem;
        }
        .nf-stars { position: absolute; inset: 0; pointer-events: none; }
        .nf-star {
          position: absolute; background: white; border-radius: 50%;
          opacity: 0; animation: nf-twinkle 4s ease-in-out infinite;
        }
        @keyframes nf-twinkle { 0%,100%{opacity:0} 50%{opacity:.9} }

        .nf-road {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 110px;
          background: linear-gradient(to bottom, #1e293b, #111827);
          border-top: 2px solid #334155;
          display: flex; align-items: center; justify-content: center;
          gap: 60px; overflow: hidden;
        }
        .nf-road-stripe { width: 60px; height: 4px; background: #f8fafc; border-radius: 2px; opacity: 0.5; }
        .nf-car {
          font-size: 2.5rem; position: absolute;
          animation: car-lost 3s ease-in-out infinite;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
        }
        @keyframes car-lost {
          0%  { transform: translateX(-60px) rotate(-5deg); }
          30% { transform: translateX(0px) rotate(3deg); }
          60% { transform: translateX(40px) rotate(-3deg); }
          100%{ transform: translateX(-60px) rotate(-5deg); }
        }
        .nf-question {
          position: absolute; font-size: 1.5rem; font-weight: 900; color: #fbbf24;
          animation: q-float 2s ease-in-out infinite;
          text-shadow: 0 0 12px rgba(251,191,36,0.6);
        }
        .q1{right:28%;top:15px;animation-delay:0s}
        .q2{right:22%;top:45px;animation-delay:.5s;font-size:1rem;opacity:.7}
        .q3{right:34%;top:30px;animation-delay:1s;font-size:1.2rem;opacity:.8}
        @keyframes q-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        .nf-content {
          position: relative; z-index: 10;
          text-align: center; max-width: 520px; margin-bottom: 7rem;
        }
        .nf-badge {
          display: inline-block; font-size: 6rem; font-weight: 900; line-height: 1;
          background: linear-gradient(135deg, #10b981, #0ea5e9);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          letter-spacing: -0.05em; margin-bottom: 0.5rem;
          animation: badge-pulse 2s ease-in-out infinite;
        }
        @keyframes badge-pulse { 0%,100%{opacity:1} 50%{opacity:.85} }
        .nf-title { font-size:1.5rem; font-weight:800; color:#f1f5f9; margin-bottom:1rem; line-height:1.3; }
        .nf-desc { font-size:.95rem; color:#64748b; line-height:1.7; margin-bottom:2rem; }
        .nf-actions { display:flex; gap:.75rem; justify-content:center; flex-wrap:wrap; margin-bottom:2rem; }
        .nf-quick-label {
          font-size:.75rem; color:#475569; margin-bottom:.75rem;
          text-transform:uppercase; letter-spacing:.08em; font-weight:600;
        }
        .nf-quick-links { display:flex; gap:.5rem; justify-content:center; flex-wrap:wrap; }
        .nf-quick-link {
          padding:.375rem .875rem; border-radius:999px;
          border:1px solid rgba(255,255,255,0.1); font-size:.8rem; color:#94a3b8;
          transition:all .2s; text-decoration:none;
        }
        .nf-quick-link:hover {
          border-color:rgba(16,185,129,0.4); color:#34d399; background:rgba(16,185,129,0.08);
        }
      `}</style>
    </div>
  );
}
