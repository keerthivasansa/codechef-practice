import { NextRequest } from "next/server";


export const GET = async (req: NextRequest) => {
    const code = req.nextUrl.searchParams.get("code")
    const url = `https://www.codechef.com/api/contests/PRACTICE/problems/${code}`;
    const resp = await fetch(url);
    const prob = await resp.json();
    const tags = (prob['user_tags'] || []).concat(prob['computed_tags'] || []);
    const contest = Number(prob['intended_contest_code'].substring(5))

    const t = {
        name: prob['problem_name'],
        code: prob['problem_code'],
        upvotes: prob['votes_data']['ProblemStatementVoteData']['upvote_count'],
        difficulty: Number(prob['difficulty_rating']),
        tags,
        contest,
    };

    return Response.json({ transformed: t, og: prob});
}