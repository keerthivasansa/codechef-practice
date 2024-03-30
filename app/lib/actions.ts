'use server';

import type { Filter } from "../types";
import prisma from "./prisma";
import { getScore } from "./utils";
import type { GlobalFilter } from "@prisma/client";

export async function fetchTags() {
    const tags: [{ array: string[] }] = await prisma.$queryRaw`SELECT array(SELECT DISTINCT UNNEST(tags) FROM "Problem");`;
    return tags[0]['array'];
}

export async function fetchProblems(filters: Partial<Filter>) {
    const ratingLow = filters.startRating ?? 0;
    const ratingHigh = filters.endRating ?? 4000;
    const tags = filters.tags || [];

    const problems = await prisma.problem.findMany({
        where: {
            difficulty: {
                gte: ratingLow,
                lte: ratingHigh
            }
        }
    })

    problems.sort((a, b) => getScore(b) - getScore(a));

    return problems;
}

function parseProblem(probData: Record<string, any>) {
    const tags = (probData['user_tags'] || []).concat(probData['computed_tags'] || []);
    const contest = Number(probData['intended_contest_code'].substring(5))
    return {
        name: probData['problem_name'],
        code: probData['problem_code'],
        upvotes: probData['votes_data']['ProblemStatementVoteData']['upvote_count'],
        difficulty: Number(probData['difficulty_rating']),
        tags,
        contest,
        score: 0
    }
}

export async function fetchProblem(code: string) {
    const cacheProb = await prisma.problem.findUnique({ where: { code } });
    if (cacheProb) {
        return cacheProb;
    }
    const url = `https://www.codechef.com/api/contests/PRACTICE/problems/${code}`;
    const resp = await fetch(url);
    const probData = await resp.json();
    const parsedProb = parseProblem(probData);
    const prob = await prisma.problem.create({
        data: parsedProb
    })

    return prob;
}

export async function syncGlobalSettings(setting: GlobalFilter) {
    return prisma.globalFilter.update({
        where: {
            settingId: setting.settingId,
        },
        data: setting
    })
}

export async function fetchGlobalSettings() {
    const setting = await prisma.globalFilter.findUnique({
        where: {
            settingId: 1
        }
    });
    if (setting)
        return setting;
    return prisma.globalFilter.create({
        data: {
            startRating: 0,
            endRating: 4000,
            settingId: 1,
            filterTags: []
        }
    })
}

export async function fetchLatestContest() {
    const url = 'https://www.codechef.com/api/list/problems/recent?page=0&limit=1'
    const resp = await fetch(url);
    const data = (await resp.json())['data'];
    const contestCode = data[0].contest_code;
    const contest = Number(contestCode.substring(5));
    return contest;
}

export async function fetchContestProblems(contest: number) {
    const cachedProbs = await prisma.problem.findMany({
        where: {
            contest
        }
    })

    if (cachedProbs.length > 0)
        return cachedProbs;

    const url = `https://www.codechef.com/api/contests/START${contest}B`;
    const resp = await fetch(url);
    const data = await resp.json();
    const contestProbs: Record<string, string>[] = Object.values(data['problems']);
    const problems = contestProbs.map(prob => fetchProblem(prob['code']));
    // console.log(problems.length);
    const probs = await Promise.all(problems);
    console.log(probs[0]);
    return probs;
}