import React, { useContext, useState, useRef, useEffect } from "react";
import { appContext } from "../../appContext";
import { MdClose } from "react-icons/md";

const Preview = ({ showPreview, setShowPreview }) => {
  const { previewUrl } = useContext(appContext);

  // 1. Initial Position and Size
  const [dims, setDims] = useState({
    width: 600,
    height: 400,
    x: 100,
    y: 100,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  // 2. Drag Logic (The Title Bar)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - dims.x,
      y: e.clientY - dims.y,
    };
  };

  // 3. Resize Logic (The Corner Handle)
  const handleResizeDown = (e) => {
    e.stopPropagation(); // Don't trigger dragging
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setDims((prev) => ({
          ...prev,
          x: e.clientX - offsetRef.current.x,
          y: e.clientY - offsetRef.current.y,
        }));
      }
      if (isResizing) {
        setDims((prev) => ({
          ...prev,
          width: Math.max(300, e.clientX - prev.x), // Min-width: 300
          height: Math.max(200, e.clientY - prev.y), // Min-height: 200
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing]);

  if (!showPreview) return null;

  return (
    <div
      style={{
        width: dims.width,
        height: dims.height,
        transform: `translate(${dims.x}px, ${dims.y}px)`,
        position: "fixed",
        top: 0,
        left: 0,
      }}
      className="z-50 shadow-2xl rounded-lg overflow-hidden border border-gray-700 bg-[#1e1e1e] flex flex-col"
    >
      {/* Drag Handle / Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="bg-gray-800 p-2 cursor-move flex items-center justify-between text-xs text-gray-400 select-none"
      >
        <span>Project Preview</span>
        <div
          className="w-7 h-7 cursor-pointer hover:bg-gray-600 rounded-full flex items-center justify-center"
          onClick={() => setShowPreview(false)}
        >
          <MdClose className="text-white text-lg" />
        </div>
      </div>

      {/* The Iframe Content */}
      <div className="flex-1 w-full relative bg-white">
        {/* Overlay prevents iframe from stealing mouse events during drag/resize */}
        {(isDragging || isResizing) && (
          <div className="absolute inset-0 z-10 bg-transparent" />
        )}
        <iframe
          src={previewUrl}
          className="w-full h-full border-none"
          title="SouthStack Preview"
        />
      </div>

      {/* Resize Handle (Bottom Right Corner) */}
      <div
        onMouseDown={handleResizeDown}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize bg-gray-600/30 hover:bg-blue-500 rounded-tl-md transition-colors"
      />
    </div>
  );
};

export default Preview;
