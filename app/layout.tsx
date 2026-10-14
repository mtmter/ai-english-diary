import "./globals.css";
import Link from "next/link";
import { Patrick_Hand, Yomogi } from "next/font/google";
import { auth, signIn, signOut } from "@/auth";

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-patrick-hand",
});

const yomogi = Yomogi({
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-yomogi",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={`${patrickHand.variable} ${yomogi.variable}`}>
      <body>
        <header className="border-b border-blue-200">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="text-xl font-bold">
              AI English Diary
            </Link>

            <nav aria-label="メインナビゲーション" className="flex flex-wrap items-center gap-4">
              {session?.user?.id ? (
                <>
                  <span className="text-sm">
                    {session.user.name ?? "ユーザー"} としてログイン中
                  </span>
                  <Link href="/diaries">履歴</Link>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button type="submit" className="rounded border px-3 py-1">
                      ログアウト
                    </button>
                  </form>
                </>
              ) : (
                <form
                  action={async () => {
                    "use server";
                    await signIn("github", { redirectTo: "/" });
                  }}
                >
                  <button type="submit" className="rounded border px-3 py-1">
                    GitHubでログイン
                  </button>
                </form>
              )}
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
