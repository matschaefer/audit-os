import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  checked,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        className={cn(
          "peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border border-border-subtle bg-white transition-colors checked:border-brand-primary checked:bg-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" />
    </span>
  );
}
