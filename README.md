# AI English Diary

指定された英語表現を使って日記を書き、文法と自然さを採点するアプリです。
GitHubでログインしたユーザーの日記をPostgreSQLへ保存します。
指定表現に `missing` がある場合は保存しません。

## ローカルで起動する

`npm install` で依存パッケージをインストールし、`.env` にローカルDBの
`DATABASE_URL` を設定してください。`.env.local` には以下を設定します。
秘密情報はGitへコミットしないでください。

```env
OPENAI_API_KEY=...
AUTH_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
```

`AUTH_SECRET` は `npx auth secret` で生成できます。
[GitHub OAuth App](https://github.com/settings/developers) を作成し、
Homepage URL を `http://localhost:3000`、Authorization callback URL を
`http://localhost:3000/api/auth/callback/github` に設定してください。
Client IDとClient secretを `.env.local` に記入します。

DBへマイグレーションを適用し、Prisma Clientを生成して起動します。

```bash
npm run db:migrate:deploy
npm run db:generate
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

## 動作確認

- 未ログイン時にはGitHubログインのボタンが表示されます。
- 未ログインで `POST /api/score` を呼ぶと401が返り、採点・保存は実行されません。
- ログイン後、指定表現をすべて使った日記を採点すると、ログインしたユーザーの
  `userId` とともに保存されます。
- 指定表現に `missing` がある日記は保存されません。
- 「日記の履歴を見る」から `/diaries` を開くと、自分の日記だけが新しい順で表示されます。
  作成日時（日本時間）、元の日記、文法・自然さの点数、修正後の日記を確認できます。
- 日記がない場合は「保存された日記はまだありません。」と表示されます。
- 未ログインで `/diaries` を開くとログイン画面へ移動し、ログイン後は履歴へ戻ります。
- ログアウト後はログイン画面に戻ります。

```bash
npm run lint
npm run build
```

Prismaの設定ファイル名は `prisma7.config.ts` なので、CLI実行時に `--config` を指定します。

## Vercelへのデプロイ

`npm install` / `npm ci` の後に `postinstall` がPrisma Clientを自動生成します。
VercelのBuild Commandは `npm run build` を使います。

1. VercelにGitHubリポジトリをインポートします。
2. Vercel MarketplaceのPrisma Postgresを作成し、このプロジェクトへ接続します。
   接続済みのDBがある場合は再利用してください。`DATABASE_URL` は接続時に設定されます。
   ローカルの `localhost:51214` のDBはVercelから接続できません。
3. VercelのProduction環境に `OPENAI_API_KEY`、`AUTH_SECRET`、
   `AUTH_GITHUB_ID`、`AUTH_GITHUB_SECRET` を設定します。
4. 本番用のGitHub OAuth Appを作成し、Homepage URLを本番URL、
   Authorization callback URLを `https://本番ドメイン/api/auth/callback/github` に設定します。
   手順3のGitHub設定値には、この本番用Appの値を使ってください。
5. 本番の `DATABASE_URL` を環境変数に設定したターミナルで、以下を実行します。
   接続先が本番DBであることを確認してください。CLIは `.env` を読み込みますが、
   シェルで設定した `DATABASE_URL` が優先されます。

   ```bash
   npm run db:migrate:deploy
   ```

6. Vercelでデプロイし、本番URLでログイン、日記の保存、履歴表示を確認します。

マイグレーションはデプロイ前に別途適用します。`postinstall` と `build` はDBを変更しません。
DBやOAuthの秘密情報はGitへコミットしないでください。

参考: [Prisma ORM 7のVercel設定](https://www.prisma.io/docs/guides/postgres/vercel)、
[Auth.jsのGitHub OAuth設定](https://authjs.dev/guides/configuring-github)。
