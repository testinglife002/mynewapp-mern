import React from "react";
// import RotatingCircle from "./components/RotatingCircle";
import scratches from "../assets/imgs/patterns/bg-pattern.png";
import RotatingCirclePath from "./RotatingCirclePath";

function AppCirclePath() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <RotatingCirclePath
        text="Start Project • Creative Agency •"
        size={250}
        gradientColors={["#0f0f17", "#505080", "#0f0f17"]}
        pattern={scratches}
      />
    </div>
  );
}

export default AppCirclePath;
