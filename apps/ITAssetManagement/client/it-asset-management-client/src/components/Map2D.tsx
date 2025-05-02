import React, { useRef, useState, useEffect } from "react";

export const Map2D = ({
  marker,
  onMapClick,
  imageUrl,
}: {
  marker?: { x: number; y: number }; // absolute x/y in %
  onMapClick?: (pos: { x: number; y: number }) => void;
  imageUrl: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(marker || null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
    if (onMapClick) onMapClick({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        width: "100%",
        height: "400px",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "contain", // giữ tỷ lệ ảnh
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        position: "relative",
        border: "1px solid #ccc",
        cursor: "crosshair",
      }}
    >
      {position && (
        <div
          style={{
            position: "absolute",
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "green",
              borderRadius: "50%",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                width: 40,
                height: 40,
                top: "-10px",
                left: "-10px",
                borderRadius: "50%",
                border: "2px solid green",
                animation: "ping 1.5s infinite",
              }}
            ></span>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes ping {
            0% {
              transform: scale(0.6);
              opacity: 1;
            }
            100% {
              transform: scale(1.8);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};
