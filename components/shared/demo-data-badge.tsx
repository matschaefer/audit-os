import { FlaskConical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DemoDataBadgeProps {
  className?: string;
}

/** Marks content sourced from the seeded demo dataset rather than a real client. */
export function DemoDataBadge({ className }: DemoDataBadgeProps) {
  return (
    <Badge variant="neutral" className={cn(className)}>
      <FlaskConical className="h-3 w-3" />
      Demo-Daten
    </Badge>
  );
}
