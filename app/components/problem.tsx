import { Problem } from "@prisma/client";

interface IProblemProps {
  problem: Problem;
  toggleFn: (code: string) => void;
}

function ProblemDisp(props: IProblemProps) {
  const { problem, toggleFn } = props;

  return (
    <a
      href={`https://www.codechef.com/problems/${problem.code}`}
      target="_blank"
      key={problem.code}
    >
      <div
        className={`${
          problem.completed ? "bg-green-200" : "bg-gray-300"
        } px-4 py-2 my-3 rounded-lg flex w-full flex-row justify-between items-center`}
      >
        <div>
          <span className="mr-4">
            <b>{problem.difficulty}</b>
          </span>
          <h5>{problem.name}</h5>
          <p>
            <small className="text-xs">
              {problem.contest} x {problem.upvotes}
            </small>
          </p>
        </div>
        <div>
          <input type="checkbox" checked={problem.completed} onInput={(e) => toggleFn(problem.code)} className="w-6 h-6"/>
        </div>
      </div>
    </a>
  );
}

export default ProblemDisp;
