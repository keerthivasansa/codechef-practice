import { NextRequest } from "next/server";
import { load } from "cheerio"

export const GET = async (req: NextRequest) => {
    const username = "keerthivasansa";

    const html = await fetch(`https://www.codechef.com/users/${username}`);
    const $ = load(await html.text());
    const section = $("section.problems-solved").first();
    const problemElems = $(section).find("span > a");
    const problems = problemElems.map((i, el) => {
        const link = el.attribs['href'];
        const code = link.split("/").at(-1);
        return code;
    }).toArray();
    return Response.json(problems);
}
