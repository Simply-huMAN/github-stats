"use client";

import React, { useState, useCallback } from "react";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { toPng } from "html-to-image";
import { cn } from "@/lib/utils";

export interface DownloadButtonProps {
  cardRef: React.RefObject<HTMLDivElement>;
  username: string;
  tier?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}

export function DownloadButton({
  cardRef,
  username,
  tier = "tier",
  className,
  onSuccess,
  onError,
}: DownloadButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [hasExported, setHasExported] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) {
      console.error("[DownloadButton] Target card DOM ref is not attached.");
      return;
    }

    try {
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const sanitizedUsername = username.replace(/[^a-zA-Z0-9_-]/g, "");
      const outputFilename = `${sanitizedUsername}-github-${tier.toLowerCase()}-card.png`;

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 1,
        skipFonts: false,
        backgroundColor: "transparent",
      });

      const downloadLink = document.createElement("a");
      downloadLink.download = outputFilename;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setHasExported(true);
      setTimeout(() => setHasExported(false), 2500);
      onSuccess?.();
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error("Failed to export PNG");
      console.error("[DownloadButton] Error generating card image:", errorObj);
      onError?.(errorObj);
    } finally {
      setIsExporting(false);
    }
  }, [cardRef, username, tier, onSuccess, onError]);

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isExporting}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 select-none",
        "bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white backdrop-blur-sm border border-white/20 shadow-lg",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
        hasExported && "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
        className
      )}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-zinc-300" />
          <span>Generating High-Res PNG...</span>
        </>
      ) : hasExported ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Downloaded Card!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-zinc-300" />
          <span>Download Card PNG</span>
        </>
      )}
    </button>
  );
}
