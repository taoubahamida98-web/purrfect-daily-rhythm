import { Link } from "@tanstack/react-router";
import { Home, UtensilsCrossed, CalendarDays, Cat } from "lucide-react";
import type { ReactNode } from "react";

const items = [
  { to: "/hem", label: "Hem", icon: Home },
  { to: "/mat", label: "Mat", icon: UtensilsCrossed },
  { to: "/kalender", label: "Kalender", icon: CalendarDays },
  { to: "/kattvakt", label: "Kattvakt", icon: Cat },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-28">
      <main className="px-5 pt-10">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-input bg-card" aria-label="Huvudmeny">
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex min-h-16 flex-col items-center justify-center gap-1 py-2 text-sm font-semibold text-muted-foreground"
                activeProps={{ className: "text-primary-strong", "aria-current": "page" }}
              >
                <Icon className="h-6 w-6" aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function CheckButton({ done, onClick, label }: { done: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={done}
      className={`min-h-12 shrink-0 rounded-full border-2 border-border px-5 text-base font-bold transition-colors ${done ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
    >
      {done ? "✓ Klart" : label}
    </button>
  );
}
