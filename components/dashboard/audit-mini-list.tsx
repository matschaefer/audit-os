import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface AuditMiniListItem {
  id: string;
  title: string;
  subtitle: string;
  trailing?: ReactNode;
  href: string;
}

interface AuditMiniListProps {
  title: string;
  description?: string;
  items: AuditMiniListItem[];
  emptyLabel: string;
}

/** Compact list of audits used across the workspace pipeline sections. */
export function AuditMiniList({
  title,
  description,
  items,
  emptyLabel,
}: AuditMiniListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-brand-dark">
                    {item.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {item.trailing}
                  <Button href={item.href} variant="ghost" size="sm">
                    Öffnen
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
