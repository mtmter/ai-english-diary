"use client";

import React, { useState } from "react";

export default function Home() {
  type Result = {
    score: number;
    feedback: string;
  };

  const [diary, setDiary] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setResult({
      score: 80,
      feedback: `Good job!`,
    });
  }

  return (
    <div>
      <h1>AI Englinsh Diary</h1>

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
        <button>採点する</button>
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
