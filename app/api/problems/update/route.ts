import { fetchContestProblems, fetchLatestContest } from "@/app/lib/actions";
import { Problem } from "@prisma/client";
import { NextRequest } from "next/server";


export const GET = async () => {
    const latestContest = await fetchLatestContest();
    const threshold = 75;
    const oldestContest = latestContest - threshold;

    console.log(new Date().toString());
    
    const problems: Promise<Problem[]>[] = [];

    for (let c = oldestContest; c <= latestContest; c++) {
        problems.concat(fetchContestProblems(c));
    }

    const allProbs = await Promise.all(problems);
    const probs = allProbs.flat();

    console.log("updated contests from", oldestContest, "to", latestContest);

    return Response.json({ 
        last_fetch: new Date().toString(), 
        fetchFrom: oldestContest, 
        fetchTill: latestContest, 
        problemCount: probs.length,
        probs
    });
}