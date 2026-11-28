"use client";

import React, { useState, useCallback } from "react";
import { Download, Loader2, Check } from "lucide-react";
import { ComparisonNotice } from "./ComparisonNotice";

interface BattleCardDownloadProps {
  arenaRef: React.RefObject<HTMLDivElement>;
  user1: string;
  user2: string;
}

export function BattleCardDownload({
  arenaRef,
  user1,
  user2,
}: BattleCardDownloadProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [exportFailed, setExportFailed] = useState(false);

  const handleDownload = useCallback(async () => {
    const arena = arenaRef.current;
    if (!arena) return;

    try {
      setIsExporting(true);
      setExportFailed(false);
      setDownloaded(false);
      await new Promise((resolve) => setTimeout(resolve, 80));

      // Dynamically load html-to-image only when the user requests a download
      const { toPng } = await import("html-to-image");

      const dataUrl = await toPng(arena, {
        cacheBust: true,
        includeQueryParams: true,
        skipFonts: true,
        pixelRatio: 2,
        backgroundColor: getComputedStyle(arena).backgroundColor,
        imagePlaceholder:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E",
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
      document.body.appendChild(link);
      link.click();
      link.remove();

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
    <div className="flex min-w-0 flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isExporting}
        className="site-button min-h-11"
      >
        {isExporting ? (
          <>
            <Loader2 size={15} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
            <span>Exporting PNG…</span>
          </>
        ) : downloaded ? (
          <>
            <Check size={15} className="text-site-green" aria-hidden="true" />
            <span aria-live="polite">Downloaded</span>
          </>
        ) : (
          <>
            <Download size={15} aria-hidden="true" />
            <span>{exportFailed ? "Retry download" : "Download PNG"}</span>
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
