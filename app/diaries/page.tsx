import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export default async function DiariesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=%2Fdiaries");
  }

  const diaries = await prisma.diary.findMany({
    where: { userId: session.user.id },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      text: true,
      correctedDiary: true,
      grammarScore: true,
      naturalnessScore: true,
      createdAt: true,
    },
  });

  return (
    <main>
      <h1>日記の履歴</h1>
      <p>
        <Link href="/">日記を書く</Link>
      </p>

      {diaries.length === 0 ? (
        <p>保存された日記はまだありません。</p>
      ) : (
        diaries.map((diary) => (
          <article key={diary.id}>
            <h2>
              <time dateTime={diary.createdAt.toISOString()}>
                {diary.createdAt.toLocaleString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })}
              </time>
            </h2>
            <h3>書いた日記</h3>
            <p>{diary.text}</p>
            <p>Grammar: {diary.grammarScore} / 5</p>
            <p>Naturalness: {diary.naturalnessScore} / 5</p>
            <h3>修正後の日記</h3>
            <p>{diary.correctedDiary}</p>
          </article>
        ))
      )}
    </main>
  );
}
