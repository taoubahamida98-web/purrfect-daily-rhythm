import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Cat, Gamepad2, UtensilsCrossed } from "lucide-react";
import { AppShell, CheckButton } from "@/components/AppShell";
import { today, useStore } from "@/lib/store";

export const Route = createFileRoute("/hem")({
  head: () => ({ meta: [{ title: "Hem – Kattkompis" }, { name: "description", content: "Dagens aktiviteter för din katt." }, { property: "og:title", content: "Hem – Kattkompis" }, { property: "og:description", content: "Dagens aktiviteter för din katt." }] }),
  component: Hem,
});

function Hem() {
  const { state, toggleFed, toggleReminder } = useStore();
  if (!state) return <AppShell>{null}</AppShell>;
  const fed = state.fed[today()] ?? [];
  const todays = state.reminders.filter((r) => r.date === today()).sort((a, b) => a.time.localeCompare(b.time));
  return (
    <AppShell>
      <h1 className="text-4xl font-black">Hej {state.owner}!</h1>
      <div className="mt-6 flex items-center gap-4 rounded-3xl bg-card p-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent"><Cat className="h-10 w-10" aria-hidden /></div>
        <p className="text-3xl font-black">{state.cat}</p>
      </div>
      <h2 className="mt-8 text-2xl font-bold">Dagens aktiviteter</h2>
      <p className="mt-1 text-muted-foreground">Tryck på knappen när det är gjort.</p>
      <ul className="mt-4 space-y-3">
        {state.meals.map((m) => (
          <li key={m.id} className="flex items-center gap-4 rounded-3xl bg-card p-4">
            <UtensilsCrossed className="h-7 w-7 shrink-0" aria-hidden />
            <div className="flex-1"><p className="text-lg font-bold">{m.name}</p><p className="text-muted-foreground">{m.time} · {m.grams} g</p></div>
            <CheckButton done={fed.includes(m.id)} onClick={() => toggleFed(m.id)} label="Fått mat" />
          </li>
        ))}
        {todays.map((r) => (
          <li key={r.id} className="flex items-center gap-4 rounded-3xl bg-card p-4">
            <Gamepad2 className="h-7 w-7 shrink-0" aria-hidden />
            <div className="flex-1"><p className="text-lg font-bold">{r.title}</p><p className="text-muted-foreground">{r.time}</p></div>
            <CheckButton done={r.doneOn.includes(today())} onClick={() => toggleReminder(r.id)} label="Gjort" />
          </li>
        ))}
      </ul>
      <Link to="/kalender" className="mt-6 flex min-h-14 items-center gap-3 rounded-full bg-card px-5 font-semibold">
        <CalendarDays className="h-6 w-6" aria-hidden /><span className="flex-1">Se hela kalendern</span><ArrowRight className="h-6 w-6" aria-hidden />
      </Link>
    </AppShell>
  );
}
