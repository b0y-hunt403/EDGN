export function QrMark({ size = 156 }: { size?: number }) {
  const cells = [
    [8, 1], [10, 1], [12, 1], [8, 2], [11, 2], [13, 2],
    [8, 3], [9, 3], [12, 3], [14, 3], [9, 4], [11, 4],
    [13, 4], [8, 5], [10, 5], [12, 5], [14, 5], [2, 8],
    [4, 8], [6, 8], [8, 8], [9, 8], [11, 8], [13, 8],
    [15, 8], [1, 9], [3, 9], [7, 9], [10, 9], [12, 9],
    [14, 9], [2, 10], [5, 10], [8, 10], [11, 10], [15, 10],
    [1, 11], [4, 11], [6, 11], [9, 11], [12, 11], [14, 11],
    [2, 12], [5, 12], [8, 12], [10, 12], [13, 12], [15, 12],
    [8, 13], [11, 13], [14, 13], [9, 14], [12, 14], [15, 14],
    [8, 15], [10, 15], [13, 15],
  ];
  const finder = (x: number, y: number) => (
    <g key={x + "-" + y}>
      <rect x={x} y={y} width="6" height="6" fill="#173b53" />
      <rect x={x + 1} y={y + 1} width="4" height="4" fill="white" />
      <rect x={x + 2} y={y + 2} width="2" height="2" fill="#173b53" />
    </g>
  );
  return (
    <svg
      viewBox="0 0 17 17"
      width={size}
      height={size}
      role="img"
      aria-label="Demonstration QR code"
      shapeRendering="crispEdges"
      className="rounded-lg bg-white p-3"
    >
      {finder(1, 1)}
      {finder(10, 1)}
      {finder(1, 10)}
      {cells.map(([x, y], index) => (
        <rect key={index} x={x} y={y} width="1" height="1" fill="#173b53" />
      ))}
    </svg>
  );
}
