interface Problem {
    code: string;
    name: string;
    difficulty: number;
    score: number;
    upvotes: number;
    contest: number;
    completed: boolean;
}

interface Filter {
    startRating: number;
    endRating: number;
    tags: string[]
}

export type { Problem, Filter };