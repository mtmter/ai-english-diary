import { connection } from "next/server";
import DiaryApp from "@/components/DiaryApp";
import { expressions } from "@/data/expressions";
import { pickRandomExpressions } from "@/lib/pickRandomExpressions";

export default async function Home() {
  // 読み込み時の処理
  await connection();

  // 初期ピック
  const selectedExpressions = pickRandomExpressions(expressions, 3);

  return <DiaryApp initialExpressions={selectedExpressions} />;
}
