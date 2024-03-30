"use client";

import { useEffect, useState } from "react";
import {
  fetchGlobalSettings,
  fetchProblems,
} from "./lib/actions";
import { GlobalFilter, Problem } from "@prisma/client";
import Head from "next/head";

export default function Home() {
  const [dispProbs, setDispProbs] = useState<Problem[]>([]);
  const [allProbs, setAllProbs] = useState<Problem[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [initialized, setInit] = useState(false);
  const [globalSetting, setGlobalSetting] = useState<GlobalFilter>({
    startRating: 0,
    endRating: 4000,
    filterTags: [],
    settingId: 1,
  });

  
  async function fetchUserCompleted() {
    const userCompleted = await fetch("/api/problems/user")
    return await userCompleted.json() as string[];
}

  async function init() {
    // Update the backend with latest data.
    await fetch("/api/problems/update");

    const probFetch = fetchProblems({});
    const completedFetch = fetchUserCompleted();
    const settingFetch = fetchGlobalSettings();

    const [problems, completedProbs, settings] = await Promise.all([
      probFetch,
      completedFetch,
      settingFetch,
    ]);

    setAllProbs(problems);
    setCompleted(completedProbs);
    setGlobalSetting(settings);
    setInit(true);
  }

  async function updateSetting() {
    await fetch("/api/filter", {
      method: "POST",
      body: JSON.stringify(globalSetting),
    });
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    updateSetting();
    setDispProbs(
      allProbs.filter((prob) => {
        globalSetting.filterTags.forEach((tag) => {
          if (!prob.tags.includes(tag)) return false;
        });
        return (
          prob.difficulty >= globalSetting.startRating &&
          prob.difficulty <= globalSetting.endRating
        );
      })
    );
  }, [allProbs, globalSetting, initialized]);

  return (
    <>
      <Head>
        <title>Codechef Practice</title>
      </Head>
      <main className="p-8">
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
            {dispProbs.filter((prob) => completed.includes(prob.code)).length}
          </b>
        </p>
        {dispProbs.map((p) => (
          <a href={`https://www.codechef.com/problems/${p.code}`} key={p.code}>
            <div
              className={`${
                completed.includes(p.code) ? "bg-green-200" : "bg-gray-300"
              } px-4 py-2 my-3 rounded-lg`}
            >
              <span className="mr-4">
                <b>{p.difficulty}</b>
              </span>
              <h5>{p.name}</h5>
              <p>
                <small className="text-xs">
                  {p.contest} x {p.upvotes}
                </small>
              </p>
            </div>
          </a>
        ))}
      </main>
    </>
  );
}
