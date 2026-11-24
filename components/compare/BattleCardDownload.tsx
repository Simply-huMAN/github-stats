"use client";

import React, { useState, useCallback } from "react";
import { Download, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComparisonNotice } from "./ComparisonNotice";

interface BattleCardDownloadProps {
  arenaRef: React.RefObject<HTMLDivElement>;
  user1: string;
  user2: string;
  className?: string;
}

export function BattleCardDownload({
  arenaRef,
  user1,
  user2,
  className,
}: BattleCardDownloadProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [exportFailed, setExportFailed] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!arenaRef.current) return;

    try {
      setIsExporting(true);
      setExportFailed(false);
      setDownloaded(false);
      await new Promise((resolve) => setTimeout(resolve, 80));

      // Dynamically load html-to-image only when the user requests a download
      const { toPng } = await import("html-to-image");

      const dataUrl = await toPng(arenaRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#070709",
        filter: (node) => {
          if (node instanceof HTMLElement && node.dataset.exportIgnore === "true") {
            return false;
          }
          return true;
        },
      });

      const filename = `${user1.toLowerCase()}-vs-${user2.toLowerCase()}-github-battle.png`;
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } catch (err) {
      console.error("[BattleCardDownload] Export failed:", err);
      setExportFailed(true);
    } finally {
      setIsExporting(false);
    }
  }, [arenaRef, user1, user2]);

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isExporting}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md min-h-[44px]",
          downloaded
            ? "bg-emerald-600 text-white"
            : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold active:scale-95 shadow-amber-500/20",
          isExporting && "opacity-80 cursor-wait",
          className
        )}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
            <span>Generating PNG...</span>
          </>
        ) : downloaded ? (
          <>
            <Check className="w-4 h-4" />
            <span>Downloaded Battle Card!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-zinc-950" />
            <span>{exportFailed ? "Try download again" : "Download Battle Card"}</span>
          </>
        )}
      </button>
      {exportFailed && (
        <ComparisonNotice title="Couldn’t create the image">
          <p>Try the download again or share the matchup link.</p>
        </ComparisonNotice>
      )}
    </div>
  );
}
