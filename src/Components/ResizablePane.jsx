import React, { useState, useRef } from "react";

const ResizablePane = ({
  children,
  initial_width = 300,
  min_width = 200,
  max_width = 500,
}) => {
  // Set initial width (in pixels)
  const [leftWidth, setLeftWidth] = useState(initial_width);
  const containerRef = useRef(null);

  const startResizing = (mouseDownEvent) => {
    const startX = mouseDownEvent.clientX;
    const startWidth = leftWidth;

    const onMouseMove = (mouseMoveEvent) => {
      const newWidth = startWidth + mouseMoveEvent.clientX - startX;

      // Apply constraints
      if (newWidth > min_width && newWidth < max_width) {
        setLeftWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      ref={containerRef}
      style={{ width: `${leftWidth}px` }}
      className="h-full relative border-gray-300"
    >
      <div className="h-full w-full bg-red-500">{children}</div>

      <div
        onMouseDown={startResizing}
        className="w-1 h-full hover:bg-blue-500 cursor-col-resize transition-colors absolute top-0 right-0"
      />
    </div>
  );
};

export default ResizablePane;
