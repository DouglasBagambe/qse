/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

const TunnelWithSpinningLogos = () => {
  // Set up our dimensions
  const width = 1728;
  const height = 800;

  // Rectangle dimensions
  const rectangles = [
    { x: 0, y: 1, width: 1728, height: 823 },
    { x: 116.51, y: 56.49, width: 1494.98, height: 712.02 },
    { x: 221.93, y: 106.7, width: 1284.15, height: 611.6 },
    { x: 316.25, y: 151.62, width: 1095.51, height: 521.76 },
    { x: 399.47, y: 191.26, width: 929.06, height: 442.49 },
    { x: 471.59, y: 225.61, width: 784.81, height: 373.78 },
    { x: 532.62, y: 254.67, width: 662.75, height: 315.65 },
    { x: 582.56, y: 278.46, width: 562.89, height: 268.09 },
    { x: 621.39, y: 296.95, width: 485.21, height: 231.09 },
    { x: 649.14, y: 310.17, width: 429.73, height: 204.67 },
    { x: 665.78, y: 318.09, width: 396.44, height: 188.81 },
    { x: 671.33, y: 320.74, width: 385.34, height: 183.53 },
  ];

  // The vanishing points for the four corners
  const topLeft = { x: 0, y: 1 };
  const topRight = { x: width, y: 1 };
  const bottomLeft = { x: 0, y: 824 };
  const bottomRight = { x: width, y: 824 };

  // Generate line points - from inner rectangle corners to outer rectangle corners
  const generateLines = () => {
    const innerRect = rectangles[rectangles.length - 1];
    const outerRect = rectangles[0];

    // Inner rectangle corners
    const innerTopLeft = {
      x: innerRect.x,
      y: innerRect.y + innerRect.height / 2 - innerRect.height / 2,
    };
    const innerTopRight = {
      x: innerRect.x + innerRect.width,
      y: innerRect.y + innerRect.height / 2 - innerRect.height / 2,
    };
    const innerBottomLeft = {
      x: innerRect.x,
      y: innerRect.y + innerRect.height / 2 + innerRect.height / 2,
    };
    const innerBottomRight = {
      x: innerRect.x + innerRect.width,
      y: innerRect.y + innerRect.height / 2 + innerRect.height / 2,
    };

    // Number of lines to draw for each side
    const numLines = 21;
    const lines = [];

    // Left side lines (inner left to outer left)
    for (let i = 0; i < numLines; i++) {
      const t = i / (numLines - 1);
      const y = innerTopLeft.y + t * innerRect.height;
      lines.push({
        x1: innerTopLeft.x,
        y1: y,
        x2: topLeft.x,
        y2: topLeft.y + t * (bottomLeft.y - topLeft.y),
      });
    }

    // Right side lines (inner right to outer right)
    for (let i = 0; i < numLines; i++) {
      const t = i / (numLines - 1);
      const y = innerTopRight.y + t * innerRect.height;
      lines.push({
        x1: innerTopRight.x,
        y1: y,
        x2: topRight.x,
        y2: topRight.y + t * (bottomRight.y - topRight.y),
      });
    }

    // Top side lines (inner top to outer top)
    for (let i = 0; i < numLines; i++) {
      const t = i / (numLines - 1);
      const x = innerTopLeft.x + t * innerRect.width;
      lines.push({
        x1: x,
        y1: innerTopLeft.y,
        x2: topLeft.x + t * (topRight.x - topLeft.x),
        y2: topLeft.y,
      });
    }

    // Bottom side lines (inner bottom to outer bottom)
    for (let i = 0; i < numLines; i++) {
      const t = i / (numLines - 1);
      const x = innerBottomLeft.x + t * innerRect.width;
      lines.push({
        x1: x,
        y1: innerBottomLeft.y,
        x2: bottomLeft.x + t * (bottomRight.x - bottomLeft.x),
        y2: bottomLeft.y,
      });
    }

    return lines;
  };

  const lines = generateLines();

  return (
    <div className="relative w-full h-full">
      {/* White background */}
      <div className="absolute inset-0 bg-white"></div>
      {/* Main SVG with tunnel - now stretched to fill the container */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {/* Draw the concentric rectangles */}
        {rectangles.map((rect, index) => (
          <rect
            key={`rect-${index}`}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill="none"
            stroke="#B3B3B3"
            strokeWidth="1"
          />
        ))}

        {/* Draw the perspective lines */}
        {lines.map((line, index) => (
          <line
            key={`line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#B3B3B3"
            strokeWidth="1"
          />
        ))}
      </svg>
      {/* Top Left Spinning Logo - ONLY ON MEDIUM+ SCREENS */}
      <div
        className="absolute top-10 -left-24 animate-spin hidden md:block"
        style={{
          width: "300px",
          height: "300px",
          backgroundImage: "url(/assets/dainellogo.svg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          animationDuration: "100s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      />

      {/* Bottom Right Spinning Logo - ONLY ON MEDIUM+ SCREENS */}
      <div
        className="absolute bottom-10 -right-24 animate-spin hidden md:block"
        style={{
          width: "300px",
          height: "300px",
          backgroundImage: "url(/assets/dainellogo.svg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          animationDuration: "100s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      />
    </div>
  );
};

export default TunnelWithSpinningLogos;
