"use client";

import React, { useState } from "react";

type Result = {
  score: number;
  feedback: string;
};

export default function Home() {
  const [diary, setDiary] = useState("");
  const [result, setResult] = useState<Result | null>(null);
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
        body: JSON.stringify({ diary }),
      });

      if (!response.ok) {
        throw new Error("採点に失敗しました...");
      }

      const data: Result = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("採点に失敗しました...");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1>AI English Diary</h1>

      <h2>Today's expressions</h2>
      <ul>
        <li>look forward to</li>
        <li>be interested in</li>
        <li>instead of</li>
      </ul>

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

      {result !== null && (
        <div>
          <p>Score: {result.score}</p>
          <p>Feedback: {result.feedback}</p>
        </div>
      )}
    </div>
  );
}
