import React from 'react';

const EllipticCurve = () => {
  // Elliptic curve parameters (y^2 = x^3 + ax + b)
  const a = -7;
  const b = 10;

  // Plotting parameters
  const minX = -105;
  const maxX = 105;
  const step = 0.1;
  const strokeWidth = 2;
  const strokeColor = 'black';

  // Calculate the points on the curve
  const points = [];
  for (let x = minX; x <= maxX; x += step) {
    const ySquared = Math.pow(x, 3) + a * x + b;
    const y = Math.sqrt(Math.abs(ySquared));
    points.push({ x, y });
    points.push({ x, y: -y });
  }

  // Calculate the path for the curve
  const path = points.map((p, i) => {
    const command = i === 0 ? 'M' : 'L';
    return `${command} ${p.x} ${p.y}`;
  }).join(' ');

  return (
    <svg height="900" width="900">
      <path d={path} stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
      <circle cx="150" cy="150" r="3" fill="red" />
    </svg>
  );
};

export default EllipticCurve;

