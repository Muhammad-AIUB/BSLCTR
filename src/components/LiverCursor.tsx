"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Liver cursor — uses /public/liver-cursor.png as the visual.

   👉 Save your liver image to:
      E:\BSLCTR-main\public\liver-cursor.png

   If the file is not found, an SVG liver is rendered as fallback.
   ───────────────────────────────────────────────────────────── */

function LiverFallbackSVG() {
    /* Anatomical liver silhouette — single curved organ shape, as in medical diagrams.
       Wide horizontal teardrop/comma shape. Right side larger, left side tapers. */
    return (
        <svg width="64" height="44" viewBox="0 0 140 88" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="lvBody" cx="65%" cy="40%" r="60%">
                    <stop offset="0%"   stopColor="#D85A48" />
                    <stop offset="50%"  stopColor="#9E2618" />
                    <stop offset="100%" stopColor="#5A0E08" />
                </radialGradient>
                <radialGradient id="lvGloss" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="rgba(255,200,190,0.5)" />
                    <stop offset="100%" stopColor="rgba(255,150,140,0)" />
                </radialGradient>
                <radialGradient id="lvGB" cx="35%" cy="30%" r="70%">
                    <stop offset="0%"   stopColor="#7AE048" />
                    <stop offset="60%"  stopColor="#2E9818" />
                    <stop offset="100%" stopColor="#145008" />
                </radialGradient>
            </defs>
            {/* Single unified liver silhouette — a wide curved organ shape.
               Going clockwise from far-left tapered tip:
                 Left tip (5,46) → top arch up to right peak (95,12) →
                 right border down (132,42) → bottom-right curve (118,72) →
                 gallbladder area (76,76) → bottom-left (40,68) →
                 back up the left side to the tip. */}
            <path
                d="
                  M 5,46
                  C 4,38  10,26  22,20
                  C 36,13  55,10  74,11
                  C 92,12 110,16 122,26
                  C 132,34 136,46 132,58
                  C 128,68 118,75 105,76
                  C 96,77  88,74  82,72
                  C 78,71  73,76  66,77
                  C 56,78  44,75  34,70
                  C 22,64  12,56   8,50
                  C 6,48   5,47    5,46 Z
                "
                fill="url(#lvBody)"
                stroke="#3A0808"
                strokeWidth="0.8"
            />
            {/* Top gloss along the upper arc */}
            <ellipse cx="80" cy="28" rx="42" ry="10" fill="url(#lvGloss)" />
            {/* Gallbladder peeking from inferior surface */}
            <ellipse cx="74" cy="79" rx="6" ry="4" fill="url(#lvGB)" />
        </svg>
    );
}

export default function LiverCursor() {
    const wrapRef   = useRef<HTMLDivElement>(null);
    const firstMove = useRef(false);

    const [hovering, setHovering] = useState(false);
    const [clicking, setClicking] = useState(false);
    // Start with image disabled — only enable if preload succeeds.
    // This prevents the broken-image icon from ever flashing.
    const [imgFailed, setImgFailed] = useState(true);

    // Preload check: if /liver-cursor.png loads, switch to it
    useEffect(() => {
        const img = new window.Image();
        img.onload  = () => setImgFailed(false);
        img.onerror = () => setImgFailed(true);
        img.src = "/liver-cursor.png";
    }, []);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        const onMove = (e: MouseEvent) => {
            wrap.style.transform =
                `translate(${e.clientX - 32}px, ${e.clientY - 24}px)`;

            if (!firstMove.current) {
                firstMove.current = true;
                wrap.style.opacity = "1";
            }

            const t = e.target as HTMLElement;
            setHovering(
                !!t.closest('a, button, [role="button"], input, select, textarea, label, [tabindex]:not([tabindex="-1"])')
            );
        };

        const onDown  = () => setClicking(true);
        const onUp    = () => setClicking(false);
        const onLeave = () => { wrap.style.opacity = "0"; };
        const onEnter = () => { if (firstMove.current) wrap.style.opacity = "1"; };

        window.addEventListener("mousemove",  onMove,  { passive: true });
        window.addEventListener("mousedown",  onDown);
        window.addEventListener("mouseup",    onUp);
        document.documentElement.addEventListener("mouseleave", onLeave);
        document.documentElement.addEventListener("mouseenter", onEnter);

        return () => {
            window.removeEventListener("mousemove",  onMove);
            window.removeEventListener("mousedown",  onDown);
            window.removeEventListener("mouseup",    onUp);
            document.documentElement.removeEventListener("mouseleave", onLeave);
            document.documentElement.removeEventListener("mouseenter", onEnter);
        };
    }, []);

    return (
        <>
            <style>{`*, *::before, *::after { cursor: none !important; }`}</style>

            <div
                ref={wrapRef}
                style={{
                    position:      "fixed",
                    top:           0,
                    left:          0,
                    width:         64,
                    height:        48,
                    opacity:       0,
                    pointerEvents: "none",
                    zIndex:        99999,
                    willChange:    "transform",
                }}
            >
                <div
                    style={{
                        width:           "100%",
                        height:          "100%",
                        transform:       `scale(${clicking ? 0.72 : hovering ? 1.22 : 1})`,
                        transition:      "transform 0.15s cubic-bezier(0.34,1.56,0.64,1), filter 0.2s ease",
                        transformOrigin: "center center",
                        filter: hovering
                            ? "drop-shadow(0 0 6px #00C8E0) drop-shadow(0 0 12px rgba(0,200,224,0.6))"
                            : "drop-shadow(0 3px 4px rgba(80,0,0,0.45))",
                    }}
                >
                    {!imgFailed ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src="/liver-cursor.png"
                            alt=""
                            width={64}
                            height={48}
                            draggable={false}
                            onError={() => setImgFailed(true)}
                            style={{
                                width:         "100%",
                                height:        "100%",
                                objectFit:     "contain",
                                userSelect:    "none",
                                pointerEvents: "none",
                                display:       "block",
                            }}
                        />
                    ) : (
                        <LiverFallbackSVG />
                    )}
                </div>
            </div>
        </>
    );
}
