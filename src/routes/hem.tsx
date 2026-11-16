import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, UtensilsCrossed, Gamepad2, CalendarDays } from "lucide-react";
import { AppShell, CheckButton, ProgressRing } from "@/components/AppShell";
import { today, useStore } from "@/lib/store";
import avatar from "@/assets/cat-avatar.jpg";

export const Route = createFileRoute("/hem")({
  head: () => ({ meta: [{ title: "Hem – Kattkompis" }, { name: "description", content: "Dagens aktiviteter för din katt." }, { property: "og:title", content: "Hem – Kattkompis" }, { property: "og:description", content: "Dagens aktiviteter för din katt." }] }),
  component: Hem,
});

function greeting() {
  const h = new Date().getHours();
  return h < 10 ? "God morgon" : h < 17 ? "Hej" : "God kväll";
}

function Hem() {
  const { state, toggleFed, toggleReminder } = useStore();
  if (!state) return <AppShell>{null}</AppShell>;
  const fed = state.fed[today()] ?? [];
  const todays = state.reminders.filter((r) => r.date === today());
  const tasks = [
    ...state.meals.map((m) => ({ id: m.id, kind: "mat" as const, title: m.name, sub: `${m.time} · ${m.grams} g`, time: m.time, done: fed.includes(m.id), toggle: () => toggleFed(m.id) })),
    ...todays.map((r) => ({ id: r.id, kind: "lek" as const, title: r.title, sub: r.time, time: r.time, done: r.doneOn.includes(today()), toggle: () => toggleReminder(r.id) })),
  ].sort((a, b) => a.time.localeCompare(b.time));
  const doneCount = tasks.filter((t) => t.done).length;
  const next = tasks.find((t) => !t.done);
  const dateStr = new Date().toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <AppShell>
      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{dateStr}</p>
      <h1 className="text-4xl font-black">{greeting()} {state.owner}!</h1>

      <section className="card-sky relative mt-6 overflow-hidden p-5">
        <div className="flex items-center gap-4">
          <img src={avatar} alt={`Profilbild för ${state.cat}`} width={816} height={816} className="h-20 w-20 rounded-[1.5rem] border-2 border-border object-cover" />
          <div className="flex-1">
            <p className="font-display text-3xl font-black">{state.cat}</p>
            <p className="font-semibold">
              {doneCount === tasks.length ? "Allt klart idag – nöjd katt! 🐾" : next ? `Nästa: ${next.title} ${next.time}` : ""}
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-4 rounded-3xl bg-cream/80 p-4">
          <ProgressRing value={doneCount} total={tasks.length} />
          <p className="text-base font-semibold">
            {doneCount === 0 ? "Dagen har precis börjat. Tryck på cirkeln när något är gjort." : `Bra jobbat! ${tasks.length - doneCount} kvar idag.`}
          </p>
        </div>
      </section>

      <div className="mt-8 flex items-end justify-between">
        <h2 className="text-2xl font-black">Dagens att-göra</h2>
        <Sparkles className="h-6 w-6" aria-hidden />
      </div>
      <ul className="mt-4 space-y-3">
        {tasks.map((t) => {
          const Icon = t.kind === "mat" ? UtensilsCrossed : Gamepad2;
          return (
            <li key={t.id} className={`card-soft flex items-center gap-4 p-4 transition-opacity ${t.done ? "opacity-60" : ""}`}>
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${t.kind === "mat" ? "bg-sky" : "bg-muted"}`}>
                <Icon className="h-7 w-7" aria-hidden />
              </div>
              <div className="flex-1">
                <p className={`text-lg font-bold ${t.done ? "line-through" : ""}`}>{t.title}</p>
                <p className="text-muted-foreground">{t.sub}</p>
              </div>
              <CheckButton done={t.done} onClick={t.toggle} label={t.kind === "mat" ? `Markera ${t.title} som given` : `Markera ${t.title} som gjord`} />
            </li>
          );
        })}
      </ul>

      <Link to="/kalender" className="btn-pop mt-6 flex min-h-14 items-center gap-3 rounded-full bg-card px-5 font-bold">
        <CalendarDays className="h-6 w-6" aria-hidden /><span className="flex-1">Se hela kalendern</span><ArrowRight className="h-6 w-6" aria-hidden />
      </Link>
    </AppShell>
  );
}
