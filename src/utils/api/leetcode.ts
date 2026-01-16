
export interface LeetCodeSubmission {
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
}

export interface LeetCodeProblem {
    questionTitle: string;
    titleSlug: string;
    difficulty: string;
    topicTags: { name: string; slug: string }[];
    acRate: number;
}

export const fetchLeetCodeData = async (username: string) => {
    try {
        // Fetch recent submission
        const subRes = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/submission?limit=1`);

        if (!subRes.ok) {
            console.warn(`LeetCode submission fetch failed: ${subRes.status} ${subRes.statusText}`);
            return null;
        }

        const subData = await subRes.json().catch(() => null);

        if (subData?.submission?.length > 0) {
            const lastSub = subData.submission[0];

            // Fetch problem details
            const probRes = await fetch(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${lastSub.titleSlug}`);

            if (!probRes.ok) {
                console.warn(`LeetCode problem fetch failed: ${probRes.status} ${probRes.statusText}`);
                return null;
            }

            const probData = await probRes.json().catch(() => null);

            if (probData) {
                return {
                    submission: lastSub as LeetCodeSubmission,
                    problem: probData as LeetCodeProblem
                };
            }
        }
        return null;
    } catch (err) {
        console.error("Failed to fetch LeetCode data", err);
        return null;
    }
};
