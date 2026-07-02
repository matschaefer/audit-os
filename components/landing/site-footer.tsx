export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto max-w-3xl px-6 py-6 text-center text-xs text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Synkro · Internes Tool, nicht für
          die öffentliche Nutzung bestimmt.
        </p>
      </div>
    </footer>
  );
}
