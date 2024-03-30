import { createProblem } from "@/app/lib/actions";

export async function GET(req: Request) {
    const prob = await createProblem();
    console.log({ prob })
    return Response.json(prob);   
}