// src/components/RotatingCircleLogo.jsx
import React from "react";
import "./RotatingCircleLogo.css";

const RotatingCircleLogo = ({
  text = "Start Project • Creative Agency •",
  centerText = "Start",
  size = 250,
  gradientColors = ["#0f0f17", "#303050", "#0f0f17"],
  pattern = null,
}) => {
  const circleStyle = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundImage: pattern
      ? `url(${pattern}), linear-gradient(135deg, ${gradientColors.join(",")})`
      : `linear-gradient(135deg, ${gradientColors.join(",")})`,
    backgroundSize: pattern ? `auto, 200% 200%` : `200% 200%`,
    backgroundBlendMode: pattern ? "overlay" : "normal",
  };

  const radius = size / 2 - 20; // adjust text path inside border

  return (
    <div className="rotate-circle" style={circleStyle}>
      {/* Static center content */}
      <div className="circle-center-text">{centerText}</div>

      {/* Rotating circular text */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="circle-text"
        width={size}
        height={size}
      >
        <defs>
          <path
            id="circlePath"
            d={`
              M ${size / 2}, ${size / 2}
              m -${radius}, 0
              a ${radius},${radius} 0 1,1 ${radius * 2},0
              a ${radius},${radius} 0 1,1 -${radius * 2},0
            `}
          />
        </defs>
        <text>
          <textPath
            xlinkHref="#circlePath"
            startOffset="0%"
            textLength={2 * Math.PI * radius}
          >
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default RotatingCircleLogo;
