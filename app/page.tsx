import { connection } from "next/server";
import { auth } from "@/auth";
import DiaryApp from "@/components/DiaryApp";
import { expressions } from "@/data/expressions";
import { pickRandomExpressions } from "@/lib/pickRandomExpressions";

export default async function Home() {
  await connection();

  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main>
        <h1 className="mb-4 text-2xl font-bold">AI English Diaryへようこそ</h1>
        <p>GitHubでログインして、英語の日記を書きましょう。</p>
      </main>
    );
  }

  const selectedExpressions = pickRandomExpressions(expressions, 3);

  return (
    <main>
      <DiaryApp initialExpressions={selectedExpressions} />
    </main>
  );
}
