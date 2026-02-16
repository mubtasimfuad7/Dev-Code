import React from "react";

const VerticalContainer = ({ children, className = "" }) => {
  return (
    <div className={`w-full flex flex-wrap ${className}`}>
      {children}
    </div>
  );
};

export default VerticalContainer;
