import type { Expression } from "@/data/expressions";

export function pickRandomExpressions(
  pool: Expression[],
  count: number,
): Expression[] {
  const unused = [...pool];
  const selected: Expression[] = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * unused.length);
    const picked = unused.splice(index, 1)[0];
    selected.push(picked);
  }
  return selected;
}
