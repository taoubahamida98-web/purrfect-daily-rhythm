import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/kattvakt")({
  head: () => ({ meta: [{ title: "Kattvakt – Kattkompis" }, { name: "description", content: "Bjud in partner eller kattvakt att följa kattens rutiner." }, { property: "og:title", content: "Kattvakt – Kattkompis" }, { property: "og:description", content: "Dela kattens rutiner med den som passar katten." }] }),
  component: Kattvakt,
});

function Kattvakt() {
  const { state, addSitter, removeSitter } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <AppShell>
      <h1 className="text-4xl font-black">Kattvakt</h1>
      <p className="mt-2 text-lg">Bjud in en partner, familjemedlem eller kattvakt så kan de se och bocka av kattens rutiner.</p>
      <form className="mt-6 space-y-3 rounded-3xl bg-card p-4" onSubmit={(e) => { e.preventDefault(); if (!name.trim() || !email.includes("@")) return; addSitter(name.trim(), email.trim()); setName(""); setEmail(""); }}>
        <label className="block"><span className="text-sm font-semibold">Namn</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 min-h-12 w-full rounded-2xl border-2 border-input bg-background px-4 text-base focus:border-ring focus:outline-none" /></label>
        <label className="block"><span className="text-sm font-semibold">E-post</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 min-h-12 w-full rounded-2xl border-2 border-input bg-background px-4 text-base focus:border-ring focus:outline-none" /></label>
        <button className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-primary text-lg font-bold text-primary-foreground"><UserPlus aria-hidden /> Bjud in</button>
      </form>
      <h2 className="mt-8 text-2xl font-bold">Inbjudna</h2>
      <ul className="mt-3 space-y-3">
        {state?.sitters.length === 0 && <li className="text-muted-foreground">Ingen inbjuden ännu.</li>}
        {state?.sitters.map((s) => (
          <li key={s.id} className="flex items-center gap-3 rounded-3xl bg-card p-4">
            <div className="flex-1"><p className="text-lg font-bold">{s.name}</p><p className="text-muted-foreground">{s.email} · Inbjudan väntar</p></div>
            <button aria-label={`Ta bort ${s.name}`} onClick={() => removeSitter(s.id)} className="flex h-12 w-12 items-center justify-center rounded-full text-destructive"><Trash2 /></button>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex gap-3 rounded-3xl bg-accent p-4">
        <ShieldCheck className="h-6 w-6 shrink-0" aria-hidden />
        <p>Dina uppgifter och bilder delas bara med personer du själv bjuder in – aldrig med AI-tjänster.</p>
      </div>
    </AppShell>
  );
}
