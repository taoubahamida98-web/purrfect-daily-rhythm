import { Link } from "@tanstack/react-router";
import { Home, UtensilsCrossed, CalendarDays, Cat, Check } from "lucide-react";
import type { ReactNode } from "react";

const items = [
  { to: "/hem", label: "Hem", icon: Home },
  { to: "/mat", label: "Mat", icon: UtensilsCrossed },
  { to: "/kalender", label: "Kalender", icon: CalendarDays },
  { to: "/kattvakt", label: "Kattvakt", icon: Cat },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-md bg-background pb-32">
      <main className="px-5 pt-8">{children}</main>
      <nav className="fixed inset-x-0 bottom-4 z-10 px-4" aria-label="Huvudmeny">
        <ul className="mx-auto grid max-w-md grid-cols-4 gap-1 rounded-full bg-secondary p-2 shadow-[var(--shadow-soft)]">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-full text-xs font-bold text-secondary-foreground/75 transition-colors"
                activeProps={{ className: "bg-primary !text-primary-foreground", "aria-current": "page" }}
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

export function PageHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header className="mb-6">
      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{kicker}</p>
      <h1 className="text-4xl font-black leading-tight">{title}</h1>
    </header>
  );
}

/** Stor rund bock – tydlig markering av "klart". */
export function CheckButton({ done, onClick, label }: { done: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={done}
      aria-label={done ? `${label} – klart, tryck för att ångra` : label}
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-border transition-colors ${done ? "bg-primary" : "bg-cream"}`}
    >
      {done ? <Check key="d" className="h-7 w-7 animate-pop" strokeWidth={3} aria-hidden /> : <span className="h-5 w-5 rounded-full border-2 border-dashed border-muted-foreground" aria-hidden="true" />}
    </button>
  );
}

export function ProgressRing({ value, total }: { value: number; total: number }) {
  const r = 34, c = 2 * Math.PI * r, p = total ? value / total : 0;
  return (
    <div className="relative h-24 w-24 shrink-0" role="img" aria-label={`${value} av ${total} aktiviteter klara`}>
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--cream)" strokeWidth="9" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--foreground)" strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} style={{ transition: "stroke-dashoffset .5s" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none" aria-hidden="true">
        <span className="font-display text-2xl font-black">{value}/{total}</span>
        <span className="text-xs font-bold">klart</span>
      </div>
    </div>
  );
}
