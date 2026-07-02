import { useMemo } from 'react';

const EXPERIENCE_KEYWORDS = ['holiday', 'lodge', 'villa', 'vacation'];

const useExperiencesFilter = (accommodations) => {
    const experiences = useMemo(() => {
        if (!accommodations || accommodations.length === 0) return [];

        return accommodations.filter((acc) => {
            const title = acc.title?.toLowerCase() || '';
            const description = acc.description?.toLowerCase() || '';
            const type = acc.type?.toLowerCase() || '';
            
            return EXPERIENCE_KEYWORDS.some((keyword) => {
                const lowerKeyword = keyword.toLowerCase();
                return (
                    title.includes(lowerKeyword) ||
                    description.includes(lowerKeyword) ||
                    type.includes(lowerKeyword)
                );
            });
        });
    }, [accommodations]);

    const keywordCounts = useMemo(() => {
        const counts = {};
        EXPERIENCE_KEYWORDS.forEach((keyword) => {
            const lowerKeyword = keyword.toLowerCase();
            counts[keyword] = experiences.filter((acc) => {
                const title = acc.title?.toLowerCase() || '';
                const description = acc.description?.toLowerCase() || '';
                const type = acc.type?.toLowerCase() || '';
                return (
                    title.includes(lowerKeyword) ||
                    description.includes(lowerKeyword) ||
                    type.includes(lowerKeyword)
                );
            }).length;
        });
        return counts;
    }, [experiences]);

    return { experiences, keywordCounts };
};

export default useExperiencesFilter;