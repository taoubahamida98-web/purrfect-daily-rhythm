import { useEffect, useState, useCallback } from "react";

export type Meal = { id: string; name: string; time: string; grams: number };
export type Reminder = { id: string; title: string; date: string; time: string; doneOn: string[] };
export type Sitter = { id: string; name: string; email: string };
export type State = {
  owner: string;
  cat: string;
  meals: Meal[];
  fed: Record<string, string[]>; // date -> meal ids
  reminders: Reminder[];
  sitters: Sitter[];
};

const KEY = "kattkompis-v1";
export const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);

const initial = (): State => ({
  owner: "Sara",
  cat: "Dexter",
  meals: [
    { id: "m1", name: "Frukost", time: "07:00", grams: 25 },
    { id: "m2", name: "Lunch", time: "12:00", grams: 25 },
    { id: "m3", name: "Middag", time: "19:00", grams: 25 },
  ],
  fed: {},
  reminders: [
    { id: "r1", title: "Lekstund", date: today(), time: "17:00", doneOn: [] },
  ],
  sitters: [],
});

let listeners: (() => void)[] = [];
let cache: State | null = null;
function load(): State {
  if (cache) return cache;
  try { cache = JSON.parse(localStorage.getItem(KEY) || "") as State; } catch { cache = initial(); }
  return cache!;
}
function save(s: State) {
  cache = s;
  localStorage.setItem(KEY, JSON.stringify(s));
  listeners.forEach((l) => l());
}

export function useStore() {
  const [state, setState] = useState<State | null>(null);
  useEffect(() => {
    const l = () => setState({ ...load() });
    l();
    listeners.push(l);
    return () => { listeners = listeners.filter((x) => x !== l); };
  }, []);
  const update = useCallback((fn: (s: State) => State) => save(fn(load())), []);
  return {
    state,
    toggleFed: (mealId: string, date = today()) =>
      update((s) => {
        const list = s.fed[date] ?? [];
        return { ...s, fed: { ...s.fed, [date]: list.includes(mealId) ? list.filter((x) => x !== mealId) : [...list, mealId] } };
      }),
    toggleReminder: (id: string, date = today()) =>
      update((s) => ({
        ...s,
        reminders: s.reminders.map((r) =>
          r.id !== id ? r : { ...r, doneOn: r.doneOn.includes(date) ? r.doneOn.filter((d) => d !== date) : [...r.doneOn, date] },
        ),
      })),
    addReminder: (r: Omit<Reminder, "id" | "doneOn">) =>
      update((s) => ({ ...s, reminders: [...s.reminders, { ...r, id: uid(), doneOn: [] }] })),
    removeReminder: (id: string) => update((s) => ({ ...s, reminders: s.reminders.filter((r) => r.id !== id) })),
    addSitter: (name: string, email: string) => update((s) => ({ ...s, sitters: [...s.sitters, { id: uid(), name, email }] })),
    removeSitter: (id: string) => update((s) => ({ ...s, sitters: s.sitters.filter((x) => x.id !== id) })),
  };
}
