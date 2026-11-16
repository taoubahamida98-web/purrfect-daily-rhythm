import { createFileRoute, Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import cat from "@/assets/sleeping-cat.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kattkompis – håll koll på din katts rutiner" },
      { name: "description", content: "Matschema, påminnelser, kalender och kattvakt – allt för din katt på ett ställe." },
      { property: "og:title", content: "Kattkompis" },
      { property: "og:description", content: "Håll koll på din katts rutiner enkelt på ett ställe." },
    ],
  }),
  component: Start,
});

function Start() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center px-6 py-12 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-card">
        <PawPrint className="h-12 w-12" aria-hidden />
      </div>
      <h1 className="mt-6 text-5xl font-black">Kattkompis</h1>
      <div className="mt-8 overflow-hidden rounded-[3rem] bg-card p-4">
        <img src={cat} alt="Tecknad sovande katt" width={816} height={816} className="h-64 w-64 object-contain" />
      </div>
      <p className="mt-8 text-xl">Håll koll på din katts rutiner enkelt på ett ställe</p>
      <Link to="/hem" className="mt-8 flex min-h-14 w-full items-center justify-center rounded-full border-2 border-border bg-primary text-lg font-bold text-primary-foreground shadow-[var(--shadow-card)]">
        Kom igång
      </Link>
      <Link to="/hem" className="mt-6 min-h-12 text-lg font-semibold underline underline-offset-4">Logga in</Link>
    </div>
  );
}
