import React from "react";
// import RotatingCircle from "./components/RotatingCircle";
import scratches from "../assets/imgs/patterns/bg-pattern.png";
import RotatingCircleLogo from "./RotatingCircleLogo";

function AppCircleLogo() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <RotatingCircleLogo
        text="Creative • Design • Innovation •"
        centerText="Go"
        size={250}
        gradientColors={["#0f0f17", "#505080", "#0f0f17"]}
        pattern={scratches}
      />
    </div>
  );
}

export default AppCircleLogo;
