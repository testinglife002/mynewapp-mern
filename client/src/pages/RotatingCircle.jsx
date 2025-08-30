// src/components/RotatingCircle.jsx
import React from "react";
import "./RotatingCircle.css";

const RotatingCircle = ({ 
  text = "Start Project", 
  size = 180, 
  gradientColors = ["#1e1e2f", "#3a3a5a", "#1e1e2f"], 
  pattern = null 
}) => {
  
  const circleStyle = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${size / 12}px`,
    backgroundImage: pattern
      ? `url(${pattern}), linear-gradient(135deg, ${gradientColors.join(",")})`
      : `linear-gradient(135deg, ${gradientColors.join(",")})`,
    backgroundSize: pattern ? `auto, 200% 200%` : `200% 200%`,
    backgroundBlendMode: pattern ? "overlay" : "normal",
  };

  return (
    <div className="rotate-circle" style={circleStyle}>
      <span>{text}</span>
    </div>
  );
};

export default RotatingCircle;
