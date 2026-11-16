import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Sun, Moon } from "lucide-react";
import { AppShell, CheckButton, PageHeader } from "@/components/AppShell";
import { today, useStore } from "@/lib/store";
import bowl from "@/assets/food-bowl.jpg";

export const Route = createFileRoute("/mat")({
  head: () => ({ meta: [{ title: "Matschema – Kattkompis" }, { name: "description", content: "Se kattens mattider och markera när katten fått mat." }, { property: "og:title", content: "Matschema – Kattkompis" }, { property: "og:description", content: "Kattens mattider på ett ställe." }] }),
  component: Mat,
});

const icons = [Coffee, Sun, Moon];

function Mat() {
  const { state, toggleFed } = useStore();
  const meals = state?.meals ?? [];
  const fed = state?.fed[today()] ?? [];
  const grams = meals.filter((m) => fed.includes(m.id)).reduce((s, m) => s + m.grams, 0);
  const total = meals.reduce((s, m) => s + m.grams, 0);
  return (
    <AppShell>
      <PageHeader kicker={state?.cat ?? "Din katt"} title="Matschema" />
      <section className="card-sky flex items-center gap-3 p-5">
        <div className="flex-1">
          <p className="font-display text-5xl font-black leading-none">{grams}<span className="text-2xl"> / {total} g</span></p>
          <p className="mt-2 font-semibold">{fed.length} av {meals.length} måltider givna idag</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-border bg-cream">
            <div className="h-full bg-secondary transition-all" style={{ width: `${total ? (grams / total) * 100 : 0}%` }} />
          </div>
        </div>
        <img src={bowl} alt="Matskål" width={816} height={816} className="animate-floaty h-28 w-28 rounded-full border-2 border-border object-cover" />
      </section>

      <h2 className="mt-8 text-2xl font-black">Dagens tider</h2>
      <ol className="relative mt-4 space-y-4 border-l-2 border-dashed border-border pl-6">
        {meals.map((m, i) => {
          const Icon = icons[i % 3] ?? Coffee;
          const done = fed.includes(m.id);
          return (
            <li key={m.id} className="relative">
              <span className={`absolute -left-[2.15rem] top-6 h-4 w-4 rounded-full border-2 border-border ${done ? "bg-primary" : "bg-cream"}`} />
              <div className={`card-soft flex items-center gap-4 p-4 ${done ? "ring-2 ring-primary-strong" : ""}`}>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky"><Icon className="h-7 w-7" aria-hidden /></div>
                <div className="flex-1">
                  <p className="font-display text-2xl font-black">{m.time}</p>
                  <p className="text-lg font-semibold">{m.name} · {m.grams} g</p>
                  <p className="text-sm text-muted-foreground">{done ? "Har fått mat ✓" : "Inte given än"}</p>
                </div>
                <CheckButton done={done} onClick={() => toggleFed(m.id)} label={`Markera ${m.name} som given`} />
              </div>
            </li>
          );
        })}
      </ol>
    </AppShell>
  );
}
