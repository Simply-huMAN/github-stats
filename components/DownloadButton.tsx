"use client";

import React, { useState, useCallback } from "react";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { toPng } from "html-to-image";
import { cn } from "@/lib/utils";

export interface DownloadButtonProps {
  /**
   * React ref referencing the card container DOM node
   */
  cardRef: React.RefObject<HTMLDivElement>;
  /**
   * GitHub handle for naming the downloaded PNG
   */
  username: string;
  /**
   * Assigned tier for the badge/filename
   */
  tier?: string;
  /**
   * Opaque base background color for browser-agnostic canvas rendering (prevents Brave washed-out transparency)
   */
  baseBgColor?: string;
  /**
   * Additional Tailwind classes for the button
   */
  className?: string;
  /**
   * Callback fired on successful export
   */
  onSuccess?: () => void;
  /**
   * Callback fired on error
   */
  onError?: (err: Error) => void;
}

export function DownloadButton({
  cardRef,
  username,
  tier = "tier",
  baseBgColor,
  className,
  onSuccess,
  onError,
}: DownloadButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [hasExported, setHasExported] = useState(false);

  const handleDownload = useCallback(async () => {
    const card = cardRef.current;
    if (!card) {
      console.error("[DownloadButton] Target card DOM ref is not attached.");
      return;
    }

    try {
      setIsExporting(true);

      // Microtask to let browser finish any pending layout or theme changes
      await new Promise((resolve) => setTimeout(resolve, 120));

      const sanitizedUsername = username.replace(/[^a-zA-Z0-9_-]/g, "");
      const outputFilename = `${sanitizedUsername}-github-${tier.toLowerCase()}-card.png`;

      // Export high-resolution PNG using html-to-image
      // Setting skipFonts to true prevents Brave Shields / ad blockers from stalling or blocking font requests
      // Setting explicit solid backgroundColor guarantees the PNG is 100% opaque across all browsers and image viewers
      // Setting includeQueryParams to true ensures html-to-image does NOT strip avatar query params and cross-contaminate users' avatars
      const dataUrl = await toPng(card, {
        cacheBust: true,
        includeQueryParams: true,
        pixelRatio: 3, // 3x crisp export for retina/print quality
        quality: 1,
        skipFonts: true,
        backgroundColor: baseBgColor ?? getComputedStyle(card).backgroundColor,
        imagePlaceholder:
          "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%2318181b'/%3E%3C/svg%3E",
      });

      // Trigger automatic browser download
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
  }, [cardRef, username, tier, baseBgColor, onSuccess, onError]);

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isExporting}
      className={cn(
        "site-button site-button-primary",
        className
      )}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span>Exporting PNG…</span>
        </>
      ) : hasExported ? (
        <>
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          <span>Downloaded</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Download PNG</span>
        </>
      )}
    </button>
  );
}
