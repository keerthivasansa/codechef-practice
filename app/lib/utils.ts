import { Problem } from "@prisma/client";

export function getScore(prob: Problem) {
    return (prob.upvotes * 25) + (prob.difficulty / 150) + (prob.contest * 10);
}