import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DemoPrivacyNoticeProps {
  className?: string;
  showHelper?: boolean;
  tone?: "dark" | "light";
}

export function DemoPrivacyNotice({
  className,
  showHelper = false,
  tone = "light",
}: DemoPrivacyNoticeProps) {
  const isDark = tone === "dark";

  return (
    <div className={cn("flex flex-col items-start gap-1", className)}>
      <Badge
        variant="neutral"
        title="Diese öffentliche Demo enthält ausschließlich fiktive Beispieldaten."
        className={cn(
          isDark
            ? "bg-white/10 text-white/85"
            : "bg-brand-primary/10 text-brand-primary",
        )}
      >
        Demo-Daten · Keine echten Kundendaten
      </Badge>
      {showHelper ? (
        <span
          className={cn(
            "text-[11px]",
            isDark ? "text-white/55" : "text-muted-foreground",
          )}
        >
          Diese öffentliche Demo enthält ausschließlich fiktive Beispieldaten.
        </span>
      ) : null}
    </div>
  );
}
