import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2, Plus } from "lucide-react";
import { AppShell, CheckButton } from "@/components/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/kalender")({
  head: () => ({
    meta: [
      { title: "Kalender – Kattkompis" },
      { name: "description", content: "Planerade aktiviteter och påminnelser för din katt." },
      { property: "og:title", content: "Kalender – Kattkompis" },
      { property: "og:description", content: "Planerade aktiviteter och viktiga händelser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Kalender,
});

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const DAYS = ["MÅN", "TIS", "ONS", "TOR", "FRE", "LÖR", "SÖN"];

function Kalender() {
  const { state, addReminder, removeReminder, toggleReminder } = useStore();
  const now = new Date();
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selected, setSelected] = useState(iso(now));
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("17:00");

  const offset = (month.getDay() + 6) % 7;
  const cells = Array.from({ length: 42 }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i - offset + 1));
  const has = new Set(state?.reminders.map((r) => r.date));
  const dayItems = (state?.reminders ?? []).filter((r) => r.date === selected).sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = (state?.reminders ?? []).filter((r) => r.date >= iso(now)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 5);
  const fmt = (d: string) => new Date(d + "T00:00").toLocaleDateString("sv-SE", { day: "numeric", month: "long" });

  return (
    <AppShell>
      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Planering</p>
      <h1 className="mb-2 text-4xl font-black">Kalender</h1>
      <div className="mt-6 card-soft p-4">
        <div className="mb-3 flex items-center justify-between">
          <button type="button" aria-label="Föregående månad" className="flex h-12 w-12 items-center justify-center rounded-full" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft aria-hidden /></button>
          <p className="text-lg font-bold capitalize" aria-live="polite">{month.toLocaleDateString("sv-SE", { month: "long", year: "numeric" })}</p>
          <button type="button" aria-label="Nästa månad" className="flex h-12 w-12 items-center justify-center rounded-full" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight aria-hidden /></button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs font-bold text-muted-foreground">{DAYS.map((d) => <span key={d}>{d}</span>)}</div>
        <div className="mt-2 grid grid-cols-7 gap-y-1">
          {cells.map((d) => {
            const k = iso(d);
            const out = d.getMonth() !== month.getMonth();
            const sel = k === selected;
            return (
              <button
                type="button"
                key={k}
                onClick={() => setSelected(k)}
                aria-pressed={sel}
                aria-label={`${fmt(k)}${has.has(k) ? ", har händelse" : ""}`}
                className={`relative mx-auto flex h-11 w-11 items-center justify-center rounded-full text-base ${sel ? "bg-secondary font-bold text-secondary-foreground" : out ? "font-medium text-muted-foreground" : "font-semibold"} ${k === iso(now) && !sel ? "ring-2 ring-primary-strong" : ""}`}
              >
                {d.getDate()}
                {has.has(k) && <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${sel ? "bg-primary" : "bg-primary-strong"}`} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-bold">{fmt(selected)}</h2>
      <ul className="mt-3 space-y-3">
        {dayItems.length === 0 && <li className="text-muted-foreground">Inget planerat den här dagen.</li>}
        {dayItems.map((r) => (
          <li key={r.id} className="flex items-center gap-3 card-soft p-4">
            <div className="flex-1"><p className="text-lg font-bold">{r.title}</p><p className="text-muted-foreground">kl {r.time}</p></div>
            <CheckButton done={r.doneOn.includes(selected)} onClick={() => toggleReminder(r.id, selected)} label={`Markera ${r.title} som gjord`} />
            <button type="button" aria-label={`Ta bort ${r.title}`} onClick={() => removeReminder(r.id)} className="flex h-12 w-12 items-center justify-center rounded-full text-destructive"><Trash2 aria-hidden /></button>
          </li>
        ))}
      </ul>

      <form className="mt-4 space-y-3 card-soft p-4" onSubmit={(e) => { e.preventDefault(); if (!title.trim()) return; addReminder({ title: title.trim(), date: selected, time }); setTitle(""); }}>
        <p className="font-bold">Ny påminnelse</p>
        <label className="block"><span className="text-sm font-semibold">Vad?</span>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="T.ex. Lekstund, veterinärbesök" className="mt-1 min-h-12 w-full rounded-2xl border-2 border-input bg-background px-4 text-base placeholder:text-muted-foreground focus:border-ring" /></label>
        <label className="block"><span className="text-sm font-semibold">Tid</span>
          <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 min-h-12 w-full rounded-2xl border-2 border-input bg-background px-4 text-base focus:border-ring" /></label>
        <button type="submit" className="flex min-h-14 w-full items-center justify-center gap-2 btn-pop rounded-full bg-primary text-lg font-bold text-primary-foreground"><Plus aria-hidden /> Lägg till</button>
      </form>

      <h2 className="mt-8 text-2xl font-bold">Kommande händelser</h2>
      <ul className="mt-3 space-y-3">
        {upcoming.map((r) => (
          <li key={r.id}><button type="button" onClick={() => setSelected(r.date)} className="w-full card-soft p-4 text-left"><p className="text-lg font-bold">{r.title}</p><p className="text-muted-foreground">{fmt(r.date)} kl {r.time}</p></button></li>
        ))}
      </ul>
    </AppShell>
  );
}
