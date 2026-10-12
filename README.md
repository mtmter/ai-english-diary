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
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

## 動作確認

- 未ログイン時にはGitHubログインのボタンが表示されます。
- 未ログインで `POST /api/score` を呼ぶと401が返り、採点・保存は実行されません。
- ログイン後、指定表現をすべて使った日記を採点すると、ログインしたユーザーの
  `userId` とともに保存されます。
- 指定表現に `missing` がある日記は保存されません。
- ログアウト後はログイン画面に戻ります。

```bash
npm run lint
npm run build
```

Prismaの設定ファイル名は `prisma7.config.ts` なので、CLI実行時に `--config` を指定します。
