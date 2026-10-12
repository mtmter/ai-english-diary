import { connection } from "next/server";
import DiaryApp from "@/components/DiaryApp";
import { expressions } from "@/data/expressions";
import { pickRandomExpressions } from "@/lib/pickRandomExpressions";

export default async function Home() {
  await connection();

  const selectedExpressions = pickRandomExpressions(expressions, 3);

  return <DiaryApp initialExpressions={selectedExpressions} />;
}
