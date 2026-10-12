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
      <h1>AI English Diary</h1>

      <h2>Today's expressions</h2>
      <ul>
        {initialExpressions.map((expression) => (
          <li key={expression.id}>
            {expression.phrase}: {expression.meaning}
          </li>
        ))}
      </ul>

      {!isCompleted ? (
        <div>
          <h2>Write your diary ↓</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              rows={5}
              cols={80}
              value={diary}
              onChange={(e) => setDiary(e.target.value)}
            />
            <button disabled={isLoading || diary.trim() === ""}>
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
