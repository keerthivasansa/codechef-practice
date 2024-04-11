import { Problem } from "@prisma/client";

export function getScore(prob: Problem) {
    const id = prob.contest * 100;
    const diff = prob.difficulty / 100;
    return id + diff + prob.upvotes;
}