import Image from "next/image";

export function BrandMark({ size }: { size: number }) {
  return <Image src="/favicon.svg" alt="" width={size} height={size} unoptimized />;
}
