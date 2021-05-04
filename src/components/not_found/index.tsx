import React from "react";
import Lottie from "react-lottie";
import animationData from "../../constants/lottie/not_found.json";

const NotFound = () => {
  return (
    <div style={{ justifyContent: "center", alignItems: "center" }}>
      <Lottie
        width={500}
        height={500}
        options={{
          animationData: animationData,
          autoplay: true,
          loop: true,
        }}
      />
    </div>
  );
};
export default NotFound;
