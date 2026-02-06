"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Fadeup from "../ui/fadeup";
import { ExternalLink } from "lucide-react";

import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { fetchLeetCodeData, LeetCodeProblem, LeetCodeSubmission } from "@/utils/api/leetcode";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const username = "sandeshlawhale";
const CACHE_KEY = "leetcode_data";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const HeroLeetCode = () => {
    const [submission, setSubmission] = useState<LeetCodeSubmission | null>(null);
    const [problem, setProblem] = useState<LeetCodeProblem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check cache first
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const { submission, problem, timestamp } = JSON.parse(cachedData);
                    const isExpired = Date.now() - timestamp > CACHE_DURATION;

                    if (submission && problem) {
                        setSubmission(submission);
                        setProblem(problem);
                        setLoading(false);
                        if (!isExpired) return;
                    }
                }

                // Fetch new data
                const data = await fetchLeetCodeData(username);

                if (data) {
                    setSubmission(data.submission);
                    setProblem(data.problem);

                    // Update cache
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        submission: data.submission,
                        problem: data.problem,
                        timestamp: Date.now()
                    }));
                    setError(false);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const isSolvedToday = (timestamp: string) => {
        const submissionDate = new Date(parseInt(timestamp) * 1000);
        const today = new Date();
        return submissionDate.getDate() === today.getDate() &&
            submissionDate.getMonth() === today.getMonth() &&
            submissionDate.getFullYear() === today.getFullYear();
    };

    if (error && !submission) return null;

    if (loading) {
        return (
            <div className="w-full mt-8">
                <Skeleton className="w-full h-32 rounded-xl" />
            </div>
        );
    }

    if (!submission || !problem) return null;

    const solvedToday = isSolvedToday(submission.timestamp);

    return (
        <Fadeup delay={0.2}>
            <div className="w-full mt-6 p-4 rounded-2xl border-2 border-border bg-secondary/5 backdrop-blur-sm shadow-[inset_4px_4px_2px_rgba(255,255,255,0.1),0_0_20px_-5px_rgba(34,197,94,0.35)] group">

                <div className="flex flex-col">
                    <h3 className="text-xs font-medium text-mutedText uppercase tracking-wider flex items-center gap-2 mb-1">
                        <Image src="/assets/stack/lc-logo-colored.webp" alt="lc" width={20} height={20} className="rounded-full" />
                        Latest LeetCode Solution
                    </h3>
                    <div className="flex gap-2 items-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className={`w-2 h-2 rounded-full shrink-0 ${solvedToday ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-500"}`} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{solvedToday ? "Solved today" : "Solved previously"}</p>
                            </TooltipContent>
                        </Tooltip>

                        <Link
                            href={`https://leetcode.com/problems/${submission.titleSlug}/`}
                            target="_blank"
                            className="flex-1 truncate text-lg font-semibold text-primaryText flex items-center gap-2"
                        >
                            {submission.title}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <div className={`px-2 py-0.5 h-fit rounded-full text-xs font-medium border
                            ${problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'}`}
                        >
                            {problem.difficulty}
                        </div>
                    </div>

                    {problem.topicTags && problem.topicTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {problem.topicTags.map((tag) => (
                                <span
                                    key={tag.slug}
                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-gray-400 border border-white/5"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* <div className=" mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-mutedText flex items-center gap-1">
                                <Code2 className="w-3 h-3" /> Language
                            </span>
                            <span className="text-sm font-medium text-gray-300 capitalize">
                                {submission.lang}
                            </span>
                        </div>
                        {problem.acRate && <div className="flex flex-col">
                            <span className="text-xs text-mutedText flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Acceptance
                            </span>
                            <span className="text-sm font-medium text-gray-300">
                                {problem.acRate?.toFixed(1)}%
                            </span>
                        </div>}
                        <div className="flex flex-col md:col-span-2">
                            <span className="text-xs text-mutedText flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Solved
                            </span>
                            <span className="text-sm font-medium text-gray-300">
                                {new Date(parseInt(submission.timestamp) * 1000).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div> */}
                </div>
            </div>
        </Fadeup>
    );
};

export default HeroLeetCode;
