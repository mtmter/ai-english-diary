import { connection } from "next/server";
import { auth, signIn, signOut } from "@/auth";
import DiaryApp from "@/components/DiaryApp";
import { expressions } from "@/data/expressions";
import { pickRandomExpressions } from "@/lib/pickRandomExpressions";

export default async function Home() {
  // 読み込み時の処理
  await connection();

  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main>
        <h1>AI English Diary</h1>
        <p>GitHubでログインして、英語の日記を書きましょう。</p>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/" });
          }}
        >
          <button type="submit">GitHubでログイン</button>
        </form>
      </main>
    );
  }

  // 初期ピック
  const selectedExpressions = pickRandomExpressions(expressions, 3);

  return (
    <main>
      <p>{session.user.name ?? "ユーザー"} としてログイン中</p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit">ログアウト</button>
      </form>
      <DiaryApp initialExpressions={selectedExpressions} />
    </main>
  );
}
