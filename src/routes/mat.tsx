import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Sun, Moon } from "lucide-react";
import { AppShell, CheckButton } from "@/components/AppShell";
import { today, useStore } from "@/lib/store";

export const Route = createFileRoute("/mat")({
  head: () => ({ meta: [{ title: "Matschema – Kattkompis" }, { name: "description", content: "Se kattens mattider och markera när katten fått mat." }, { property: "og:title", content: "Matschema – Kattkompis" }, { property: "og:description", content: "Kattens mattider på ett ställe." }] }),
  component: Mat,
});

const icons = [Coffee, Sun, Moon];

function Mat() {
  const { state, toggleFed } = useStore();
  const fed = state?.fed[today()] ?? [];
  return (
    <AppShell>
      <h1 className="text-center text-4xl font-black">Matschema</h1>
      <p className="mt-2 text-center text-muted-foreground">{fed.length} av {state?.meals.length ?? 0} måltider idag</p>
      <ul className="mt-8 space-y-4">
        {state?.meals.map((m, i) => {
          const Icon = icons[i % 3];
          const done = fed.includes(m.id);
          return (
            <li key={m.id} className={`flex items-center gap-4 rounded-3xl border-2 p-5 ${done ? "border-primary-strong bg-accent" : "border-transparent bg-card"}`}>
              <Icon className="h-8 w-8 shrink-0" aria-hidden />
              <div className="flex-1"><p className="text-xl font-bold">{m.name} {m.time}</p><p className="font-semibold">{m.grams} g</p></div>
              <CheckButton done={done} onClick={() => toggleFed(m.id)} label="Fått mat" />
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
