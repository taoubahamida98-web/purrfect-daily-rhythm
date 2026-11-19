import { describe, expect, it } from "vitest";
import { createInitialState, normalizeState } from "@/lib/store";

describe("Matschema", () => {
  it("innehåller endast frukost och middag för en ny användare", () => {
    expect(createInitialState().meals.map((meal) => meal.name)).toEqual(["Frukost", "Middag"]);
  });

  it("tar bort lunch och dess markeringar från ett tidigare sparat schema", () => {
    const saved = createInitialState();
    saved.meals.splice(1, 0, { id: "m2", name: "Lunch", time: "12:00", grams: 25 });
    saved.fed["2026-11-19"] = ["m1", "m2", "m3"];

    const normalized = normalizeState(saved);

    expect(normalized.meals.map((meal) => meal.name)).toEqual(["Frukost", "Middag"]);
    expect(normalized.fed["2026-11-19"]).toEqual(["m1", "m3"]);
  });
});
