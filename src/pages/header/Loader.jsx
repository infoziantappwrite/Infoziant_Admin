import React from "react";
import logo from "../../Images/logobig.png";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="relative flex justify-center items-center ">
        {/* Gradient Circle Loader */}
        <div className="circle-loader"></div>

        {/* Logo inside the spinner */}
        <img
          src={logo}
          alt="SMI Logo"
          className="absolute w-32 h-auto drop-shadow-lg m-10"
        />
      </div>
    </div>
  );
};

export default Loader;
