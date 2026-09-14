import React, { useRef, useState, useEffect } from "react";
import introVid from "../assets/intro.mp4"; // Video file path

export default function IntroVideo({ onComplete }) {
  const videoRef = useRef(null);
  const [needTouchForSound, setNeedTouchForSound] = useState(false);

  // 1. Direct Sound Autoplay Attempt
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false; // Sound ON
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Browser auto-sound block safety fallback
          setNeedTouchForSound(true);
        });
      }
    }
  }, []);

  const handleUserTapToStartSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setNeedTouchForSound(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000000",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* FULLSCREEN INTRO VIDEO */}
      <video
        ref={videoRef}
        src={introVid}
        autoPlay
        playsInline
        onEnded={onComplete}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* APPLE STYLE SOUND START OVERLAY (AGAR BROWSER AUTO-SOUND BLOCK KARE) */}
      {needTouchForSound && (
        <div
          onClick={handleUserTapToStartSound}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000001,
            cursor: "pointer",
            color: "#FFFFFF",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontSize: "28px", marginLeft: "4px" }}>▶</span>
          </div>
          <p
            style={{
              fontSize: "15px",
              fontWeight: "500",
              letterSpacing: "0.5px",
              opacity: 0.9,
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            Tap anywhere to play with sound
          </p>
        </div>
      )}

      {/* CENTER-RIGHT SKIP ARROW BUTTON (PURE ICON - NO TEXT) */}
      <button
        onClick={onComplete}
        aria-label="Skip Intro"
        style={{
          position: "absolute",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "54px",
          height: "54px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 1000000,
          outline: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  );
}