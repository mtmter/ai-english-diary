import { z } from "zod";

// 評価基準に対する採点
const CriterionSchema = z.object({
  score: z.number().int().min(0).max(5), // 5点満点
  feedback: z.string(),
});

// お題表現を使えているかの採点
const ExpressionResultSchema = z.object({
  id: z.string(),
  status: z.enum(["correct", "incorrect", "missing"]),
  feedback: z.string(),
});

// 最終的に出力される評価のスキーマ
export const EvaluationSchema = z.object({
  grammar: CriterionSchema,
  naturalness: CriterionSchema,
  expressionResults: z.array(ExpressionResultSchema),
  correctedDiary: z.string(),
});

// スキーマから型を生成できる！！！
export type Evaluation = z.infer<typeof EvaluationSchema>;
