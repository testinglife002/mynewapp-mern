import React from "react";
import RotatingCircle from "./RotatingCircle";
import scratches from "../assets/imgs/patterns/bg-pattern.png";

function AppCircle() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {/* With gradient + scratches pattern */}
      <RotatingCircle
        text="Start Project"
        size={200}
        gradientColors={["#0f0f17", "#303050", "#0f0f17"]}
        pattern={scratches}
      />

      {/* Another with only gradient */}
      <RotatingCircle
        text="Explore"
        size={150}
        gradientColors={["#1a1a1a", "#444", "#1a1a1a"]}
      />
    </div>
  );
}

export default AppCircle;
