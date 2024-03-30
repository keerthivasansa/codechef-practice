import { fetchContestProblems, fetchLatestContest } from "@/app/lib/actions";
import { Problem } from "@prisma/client";
import { NextRequest } from "next/server";


export const GET = async (req: NextRequest) => {
    const latestContest = await fetchLatestContest();
    const threshold = 50;
    const oldestContest = latestContest - threshold;

    const problems: Promise<Problem[]>[] = [];

    for (let c = oldestContest; c <= latestContest; c++) {
        problems.concat(fetchContestProblems(c));
    }

    const allProbs = await Promise.all(problems);
    const probs = allProbs.flat();

    console.log(probs[0]);

    return Response.json({ 
        last_fetch: new Date().toString(), 
        fetchFrom: oldestContest, 
        fetchTill: latestContest, 
        problemCount: probs.length,
        probs
    });
}