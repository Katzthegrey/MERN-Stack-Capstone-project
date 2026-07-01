import React, { useContext, useRef, useState } from 'react';
import { AirbnbContext } from '../context/AirbnbContext';
import Title from '../components/Title';
import AccommodationCard from '../components/AccommodationCard';
import useExperiencesFilter from '../hooks/useExperiencesFilter';

const Experiences = () => {
    const { accommodations } = useContext(AirbnbContext);
    const { experiences, keywordCounts } = useExperiencesFilter(accommodations);
    const [activeKeyword, setActiveKeyword] = useState('all');
    const scrollRefs = useRef({});

    const KEYWORDS = ['holiday', 'lodge', 'villa', 'vacation'];

    // Filter by active keyword
    const filteredExperiences = activeKeyword === 'all' 
        ? experiences 
        : experiences.filter((acc) => {
            const title = acc.title?.toLowerCase() || '';
            const description = acc.description?.toLowerCase() || '';
            const type = acc.type?.toLowerCase() || '';
            const lowerKeyword = activeKeyword.toLowerCase();
            return (
                title.includes(lowerKeyword) ||
                description.includes(lowerKeyword) ||
                type.includes(lowerKeyword)
            );
        });

    // Scroll functions
    const scrollLeft = (key) => {
        const container = scrollRefs.current[key];
        if (container) {
            container.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const scrollRight = (key) => {
        const container = scrollRefs.current[key];
        if (container) {
            container.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    const SectionRow = ({ title, items, sectionKey }) => {
        if (!items || items.length === 0) return null;

        return (
            <div className='mb-10'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
                    <span className='text-sm text-gray-500'>
                        {items.length} {items.length === 1 ? 'experience' : 'experiences'}
                    </span>
                </div>

                <div className='relative group'>
                    {items.length > 4 && (
                        <button
                            onClick={() => scrollLeft(sectionKey)}
                            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                            aria-label="Scroll left"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    <div
                        ref={(el) => (scrollRefs.current[sectionKey] = el)}
                        className='flex overflow-x-auto gap-4 pb-4 scrollbar-hide'
                        style={{ 
                            scrollbarWidth: 'none', 
                            msOverflowStyle: 'none'
                        }}
                    >
                        {items.map((item) => (
                            <div 
                                key={item._id} 
                                className='min-w-[220px] max-w-[220px] flex-shrink-0'
                            >
                                <AccommodationCard
                                    id={item._id}
                                    images={item.images}
                                    title={item.title}
                                    price={item.price}
                                    location={item.location}
                                    type={item.type}
                                    rating={item.rating}
                                    reviews={item.reviews}
                                    isGuestFavorite={item.isGuestFavorite}
                                />
                            </div>
                        ))}
                    </div>

                    {items.length > 4 && (
                        <button
                            onClick={() => scrollRight(sectionKey)}
                            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                            aria-label="Scroll right"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className='my-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
            {/* Hero Section */}
            <div className='text-center py-8'>
                <Title text1={'UNIQUE'} text2={'EXPERIENCES'} />
                <p className='text-gray-500 mt-2 max-w-2xl mx-auto'>
                    Discover holiday villas, mountain lodges, and vacation homes for your next adventure
                </p>
            </div>

            {/* Keyword Filter Buttons */}
            <div className='flex flex-wrap justify-center gap-3 mb-10'>
                <button
                    onClick={() => setActiveKeyword('all')}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                        activeKeyword === 'all'
                            ? 'bg-[#FF385C] text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    All Experiences
                    <span className='ml-2 text-xs opacity-75'>({experiences.length})</span>
                </button>
                {KEYWORDS.map((keyword) => (
                    <button
                        key={keyword}
                        onClick={() => setActiveKeyword(keyword)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium capitalize transition ${
                            activeKeyword === keyword
                                ? 'bg-[#FF385C] text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {keyword}s
                        <span className='ml-2 text-xs opacity-75'>({keywordCounts[keyword] || 0})</span>
                    </button>
                ))}
            </div>

            {/* Filtered Results */}
            {filteredExperiences.length === 0 ? (
                <div className='text-center py-20'>
                    <p className='text-gray-500 text-lg mb-2'>
                        {activeKeyword === 'all' 
                            ? 'No experiences found. Add some holiday, lodge, villa, or vacation listings!'
                            : `No ${activeKeyword} experiences found.`
                        }
                    </p>
                    <p className='text-gray-400 text-sm'>
                        Try selecting a different filter or check back later.
                    </p>
                </div>
            ) : (
                <>
                    {/* All Experiences Grid */}
                    {activeKeyword === 'all' && (
                        <SectionRow
                            title=" All Experiences"
                            items={filteredExperiences}
                            sectionKey="all-experiences"
                        />
                    )}

                    {/* Keyword-specific sections when "all" is selected */}
                    {activeKeyword === 'all' && KEYWORDS.map((keyword) => {
                        const keywordItems = experiences.filter((acc) => {
                            const title = acc.title?.toLowerCase() || '';
                            const description = acc.description?.toLowerCase() || '';
                            const type = acc.type?.toLowerCase() || '';
                            const lowerKeyword = keyword.toLowerCase();
                            return (
                                title.includes(lowerKeyword) ||
                                description.includes(lowerKeyword) ||
                                type.includes(lowerKeyword)
                            );
                        });

                        if (keywordItems.length === 0) return null;

                        return (
                            <SectionRow
                                key={keyword}
                                title={` ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Stays`}
                                items={keywordItems}
                                sectionKey={keyword}
                            />
                        );
                    })}

                    {/* Single keyword view */}
                    {activeKeyword !== 'all' && (
                        <SectionRow
                            title={`${activeKeyword.charAt(0).toUpperCase() + activeKeyword.slice(1)} Experiences`}
                            items={filteredExperiences}
                            sectionKey="filtered"
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Experiences;