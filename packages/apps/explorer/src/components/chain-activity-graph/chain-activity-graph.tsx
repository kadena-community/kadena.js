import React from 'react';

interface ChainActivityGraphProps {
  data: number[];
}

const ChainActivityGraph: React.FC<ChainActivityGraphProps> = ({ data }) => {
  const height = 50;
  const width = 100;
  const padding = 5;

  // Scale points to fit the SVG
  const maxData = Math.max(...data);
  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * (width - 2 * padding) + padding,
    y: height - (value / maxData) * (height - 2 * padding) - padding,
  }));

  // Calculate control points for a smooth bezier curve
  const controlPoints = (
    p0: { x: number; y: number },
    p1: { x: number; y: number },
  ) => {
    const dx = (p1.x - p0.x) * 0.6; // tension factor
    const cp1x = p0.x + dx;
    const cp2x = p1.x - dx;
    return { cp1x, cp1y: p0.y, cp2x, cp2y: p1.y };
  };

  // Build the SVG path data
  let pathData = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const { cp1x, cp1y, cp2x, cp2y } = controlPoints(points[i - 1], points[i]);
    pathData += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i].x},${points[i].y}`;
  }

  return (
    <svg width={width} height={height}>
      <path d={pathData} stroke="black" strokeWidth="2" fill="none" />
    </svg>
  );
};

export default ChainActivityGraph;
