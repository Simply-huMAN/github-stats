import Image from "next/image";

const cells = [".###.", "#....", "#.###", "#...#", ".###."];

export function BrandMark({ size, color }: { size: number; color?: string }) {
  if (!color) return <Image src="/favicon.svg" alt="" width={size} height={size} unoptimized />;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="-2 -2 53 53"
      fill={color}
      aria-hidden="true"
    >
      {cells.flatMap((row, y) => row.split("").map((cell, x) => cell === "#" && (
        <rect key={`${x},${y}`} x={x * 10} y={y * 10} width="9" height="9" rx="1.5" />
      )))}
    </svg>
  );
}
