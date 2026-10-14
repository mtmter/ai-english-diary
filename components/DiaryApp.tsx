"use client";

import React, { useState } from "react";
import type { Expression } from "@/data/expressions";
import type { Evaluation } from "@/lib/evaluation";

type Props = {
  initialExpressions: Expression[];
};

export default function DiaryApp({ initialExpressions }: Props) {
  const [diary, setDiary] = useState("");
  const [result, setResult] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diary,
          expressionIds: initialExpressions.map((expression) => expression.id),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("ログインの有効期限が切れました。もう一度ログインしてください。");
          return;
        }
        throw new Error("採点に失敗しました...");
      }

      const data: Evaluation = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("採点に失敗しました...");
    } finally {
      setIsLoading(false);
    }
  }

  const hasMissing =
    result?.expressionResults.some(
      (expression) => expression.status === "missing",
    ) ?? false;

  const isCompleted = result !== null && !hasMissing;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Today&apos;s expressions</h1>
      <ul className="list-disc space-y-1 pl-6">
        {initialExpressions.map((expression) => (
          <li key={expression.id}>
            {expression.phrase}: {expression.meaning}
          </li>
        ))}
      </ul>

      {!isCompleted ? (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Write your diary ↓</h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-start gap-4">
            <textarea
              rows={5}
              className="w-full rounded border border-blue-300 bg-white p-3"
              placeholder="Write your diary here..."
              value={diary}
              onChange={(e) => setDiary(e.target.value)}
            />
            <button
              type="submit"
              className="rounded border px-4 py-2 disabled:opacity-50"
              disabled={isLoading || diary.trim() === ""}
            >
              {isLoading ? "ちょっと待ってね" : "採点する"}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Your diary</h2>
          <p>{diary}</p>
        </div>
      )}

      {result !== null && (
        <div>
          <h2>Expressions</h2>

          <ul>
            {result.expressionResults.map((expression) => (
              <li key={expression.id}>
                {expression.id}: {expression.status}
                <p>{expression.feedback}</p>
              </li>
            ))}
          </ul>

          {!hasMissing && (
            <>
              <h2>Evaluation</h2>

              <h3>Grammar: {result.grammar.score} / 5</h3>
              <p>{result.grammar.feedback}</p>

              <h3>Naturalness: {result.naturalness.score} / 5</h3>
              <p>{result.naturalness.feedback}</p>

              <h3>Corrected diary</h3>
              <p>{result.correctedDiary}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
