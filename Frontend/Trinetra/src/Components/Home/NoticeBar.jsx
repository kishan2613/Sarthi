import { useState, useRef, useEffect } from "react";

const headlines = [
  "Maha Kumbh Mela 2025: Over 50 million pilgrims expected - plan your journey in advance.",
  "Digital passes now mandatory for Maha Kumbh - apply online before September 30th, 2025."
];


export default function NoticeBar() {
  const [isPlaying, setIsPlaying] = useState(true);
  const tickerRef = useRef(null);
  const scrollPos = useRef(0);
  const requestId = useRef(null);
  const speed = 1; // pixels per frame

  useEffect(() => {
    const ticker = tickerRef.current;

    const step = () => {
      if (!ticker || !isPlaying) return;

      scrollPos.current += speed;
      if (scrollPos.current >= ticker.scrollWidth / 2) {
        scrollPos.current = 0;
      }
      ticker.style.transform = `translateX(-${scrollPos.current}px)`;
      requestId.current = requestAnimationFrame(step);
    };

    if (isPlaying) {
      requestId.current = requestAnimationFrame(step);
    } else if (requestId.current) {
      cancelAnimationFrame(requestId.current);
    }

    return () => cancelAnimationFrame(requestId.current);
  }, [isPlaying]);

  // Controls pause/play toggle only
  const togglePlay = () => setIsPlaying(p => !p);

  return (
    <section
      style={{
        height: "38px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(to right,#F4A391,#E0B9C2,#EACDC6)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      {/* Disclaimer Label with Arrow Shape */}
      <div
        style={{
          background: "#5B2A8A",
          color: "#fff",
          fontWeight: "bold",
          height: "100%",
          minWidth: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: "24px",
          fontSize: "1.15rem",
          clipPath: "polygon(0 0,95% 0,100% 50%,95% 100%,0 100%)",
          userSelect: "none"
        }}
      >
        Disclaimer
      </div>
      {/* Ticker */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          height: "100%"
        }}
      >
        <ul
          ref={tickerRef}
          style={{
            display: "inline-flex",
            padding: 0,
            margin: 0,
            listStyle: "none",
            minWidth: "200%", // enough width for seamless scroll
            userSelect: "none",
            willChange: "transform"
          }}
        >
          {[...headlines, ...headlines].map((headline, idx) => (
            <li
              key={idx}
              style={{
                padding: "0 3rem",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "default",
                textShadow: "0 0 5px rgba(0,0,0,0.3)"
              }}
            >
              {headline}
            </li>
          ))}
        </ul>
      </div>
      {/* Controls */}
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#fff",
          color: "#5B2A8A",
          fontSize: "1.5rem",
          padding: "0 10px",
          marginLeft: "10px",
          borderRadius: "4px",
          boxShadow: "0 0 5px rgb(135 11 143 / 0.5)"
        }}
      >
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause ticker" : "Play ticker"}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#5B2A8A",
            fontWeight: "bold",
            fontSize: "1.5rem",
            margin: '0 8px',
            userSelect: "none",
            transition: "color 0.3s"
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#BA4A87")}
          onMouseLeave={e => (e.currentTarget.style.color = "#5B2A8A")}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      </div>
    </section>
  );
}
