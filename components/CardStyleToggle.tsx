import type { CardStyle } from "@/types/builder";

const styles = [
  { value: "minimal", label: "Minimal" },
  { value: "showcase", label: "Showcase" },
] as const;

export function CardStyleToggle({ value, onChange }: {
  value: CardStyle;
  onChange: (style: CardStyle) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Card style"
      className="inline-flex shrink-0 gap-0.5 rounded-md border border-site-line bg-site-inset p-0.5"
    >
      {styles.map((style) => (
        <button
          key={style.value}
          type="button"
          aria-pressed={value === style.value}
          onClick={() => onChange(style.value)}
          className="min-h-7 rounded px-2.5 font-mono text-xs text-site-muted hover:text-foreground aria-pressed:bg-foreground aria-pressed:text-background"
        >
          {style.label}
        </button>
      ))}
    </div>
  );
}
