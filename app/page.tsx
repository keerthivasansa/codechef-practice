"use client";

import { useEffect, useState } from "react";
import { fetchGlobalSettings, fetchProblems, fetchTags } from "./lib/actions";
import { GlobalFilter, Problem } from "@prisma/client";
import Head from "next/head";
import { Multiselect } from "react-widgets/cjs";
import ProblemDisp from "./components/problem";

export default function Home() {
  const [dispProbs, setDispProbs] = useState<Problem[]>([]);
  const [allProbs, setAllProbs] = useState<Problem[]>([]);
  const [initialized, setInit] = useState(false);
  const [globalSetting, setGlobalSetting] = useState<GlobalFilter>({
    startRating: 0,
    endRating: 4000,
    filterTags: [],
    settingId: 1,
  });
  const [tags, setTags] = useState<string[]>([]);

  const setFilterTags = (arr: string[]) =>
    setGlobalSetting({ ...globalSetting, filterTags: arr });

  async function init() {
    // Update the backend with latest data.
    await fetch("/api/problems/update", {
      next: {
        revalidate: 3600 * 2, // 2 hours
      },
    });

    const probFetch = fetchProblems({});
    const settingFetch = fetchGlobalSettings();
    const tagFetch = fetchTags();

    const [problems, settings, availableTags] = await Promise.all([
      probFetch,
      settingFetch,
      tagFetch,
    ]);

    setAllProbs(problems);
    setGlobalSetting(settings);
    setTags(availableTags);
    setInit(true);
  }

  async function updateSetting() {
    await fetch("/api/filter", {
      method: "POST",
      body: JSON.stringify(globalSetting),
    });
  }

  function toggleProblem(code: string) {
    const newProbs = allProbs.map((p) => {
      if (p.code != code) return p;
      p.completed = !p.completed;
      return p;
    });

    setAllProbs(newProbs);

    fetch(`/api/problems/toggle?code=${code}`);
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const tags = globalSetting.filterTags.map((t) => t.toLowerCase());
    const st = globalSetting.startRating;
    const ed = globalSetting.endRating;
    updateSetting();
    setDispProbs(
      allProbs.filter((prob) => {
        const probTags = prob.tags.map((t) => t.toLowerCase());
        for (const tag of tags) {
          if (!probTags.includes(tag)) return false;
        }
        if (st > 0 && prob.difficulty < st) return false;
        if (ed > 0 && prob.difficulty > ed) return false;
        return true;
      })
    );
  }, [allProbs, globalSetting, initialized]);

  return (
    <>
      <main className="p-8">
        <Head>
          <title>Codechef Practice</title>
        </Head>
        <h1 className="font-sans font-bold text-4xl">Codechef Practice</h1>
        <div className="py-6">
          <p>Rating:</p>
          <span>
            Start:{" "}
            <input
              type="number"
              placeholder="0"
              value={globalSetting.startRating}
              onInput={(e) =>
                setGlobalSetting({
                  ...globalSetting,
                  startRating: Number(e.currentTarget.value),
                })
              }
            />
          </span>
          <span>
            End :{" "}
            <input
              type="number"
              placeholder="4000"
              value={globalSetting.endRating}
              onInput={(e) =>
                setGlobalSetting({
                  ...globalSetting,
                  endRating: Number(e.currentTarget.value),
                })
              }
            />
          </span>
        </div>
        <p>
          Total problems found:<b> {dispProbs.length}</b>
        </p>

        <p>
          Completed:{" "}
          <b className="text-green-800">
            {dispProbs.filter((prob) => prob.completed).length}
          </b>
        </p>
        <br />

        <p>Tags: Choose tags </p>
        <Multiselect
          data={tags as any}
          value={globalSetting.filterTags}
          onChange={setFilterTags}
        />
        {dispProbs.map((p) => (
          <ProblemDisp problem={p} toggleFn={toggleProblem} key={p.code} />
        ))}
        <p>
          {allProbs.length > 0 && (
            <small>
              Latest Contest: {allProbs[0].contest}, Oldest Contest:{" "}
              {allProbs.at(-1)!.contest}
            </small>
          )}
        </p>
      </main>
    </>
  );
}
