import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AirbnbContext } from '../context/AirbnbContext';
import Title from '../components/Title';
import AccommodationCard from '../components/AccommodationCard';
import useNearbyAccommodations from '../hooks/useNearbyAccomodations';

const LocationInspiration = () => {
    const { accommodations } = useContext(AirbnbContext);
    const [featured, setFeatured] = useState([]);
    const [locationGroups, setLocationGroups] = useState({});

    // Use the nearby hook
    const { 
        nearby, 
        isLoading: isLoadingNearby, 
        permissionDenied, 
        retry,
        location 
    } = useNearbyAccommodations(accommodations, 50, 10);

    const scrollRefs = useRef({});

    const LOCATIONS = ['Johannesburg', 'Pretoria', 'North-West', 'Limpopo', 'KwaZulu-Natal', 'Eastern Cape', 'Western Cape', 'Gauteng', 'Mpumalanga', 'Free State'];

    // Group accommodations by location
    useEffect(() => {
        if (accommodations.length > 0) {
            setFeatured(accommodations.slice(0, 10));

            const grouped = {};
            LOCATIONS.forEach(loc => {
                const filtered = accommodations.filter(
                    acc => acc.location?.includes(loc) || acc.locationDetails?.city === loc
                );
                if (filtered.length > 0) {
                    grouped[loc] = filtered;
                }
            });
            setLocationGroups(grouped);
        }
    }, [accommodations]);

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

    const SectionRow = ({ title, items, sectionKey, seeAllLink, showGuestFavorite }) => {
        if (!items || items.length === 0) return null;

        const displayItems = showGuestFavorite 
            ? items.filter(item => item.isGuestFavorite)
            : items;

        if (displayItems.length === 0) return null;

        return (
            <div className='mb-10'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold text-gray-800'>
                        {title}
                        <span className='ml-2 text-sm font-normal text-gray-500'>
                            ({displayItems.length} {displayItems.length === 1 ? 'listing' : 'listings'})
                        </span>
                    </h2>
                    {seeAllLink && (
                        <Link to={seeAllLink} className='text-sm text-[#FF385C] hover:underline font-medium'>
                            Show all →
                        </Link>
                    )}
                </div>

                <div className='relative group'>
                    {displayItems.length > 7 && (
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
                        {displayItems.map((item) => (
                            <div 
                                key={item._id} 
                                className='min-w-[200px] max-w-[200px] flex-shrink-0'
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

                    {displayItems.length > 7 && (
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
                <Title text1={'INSPIRATION FOR YOUR'} text2={'NEXT TRIP'} />
            </div>

            {/* Location Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12'>
                {LOCATIONS.map((loc) => (
                    <Link
                        key={loc}
                        to={`/locations/${encodeURIComponent(loc)}`}
                        className='relative rounded-xl overflow-hidden aspect-square group cursor-pointer'
                    >
                        <div className='w-full h-full bg-gradient-to-br from-[#FF385C]/20 to-[#FF385C]/5 flex items-center justify-center transition-transform group-hover:scale-105'>
                            <span className='text-lg font-semibold text-gray-700 group-hover:text-[#FF385C] transition-colors'>
                                {loc}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Featured Section */}
            <SectionRow
                title=" Featured homes"
                items={featured}
                sectionKey="featured"
                seeAllLink="/locations"
            />

            {/* Location-Based Sections */}
            {Object.entries(locationGroups).map(([location, items]) => (
                <SectionRow
                    key={location}
                    title={` Homes in ${location}`}
                    items={items}
                    sectionKey={location}
                    seeAllLink={`/locations/${encodeURIComponent(location)}`}
                />
            ))}

            {/* Guest Favorites Section */}
            <SectionRow
                title=" Guest favorites"
                items={accommodations}
                sectionKey="favorites"
                seeAllLink="/locations?favorites=true"
                showGuestFavorite={true}
            />

            {/*  Nearby Section with proper fallback */}
            {!permissionDenied && nearby.length > 0 && (
                <SectionRow
                    title=" Available near you this weekend"
                    items={nearby}
                    sectionKey="nearby"
                    seeAllLink="/locations/nearby"
                />
            )}

            {/*  Nearby loading state */}
            {!permissionDenied && isLoadingNearby && (
                <div className='mb-10'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-4'>📍 Available near you this weekend</h2>
                    <div className='flex justify-center items-center h-40 bg-gray-50 rounded-xl'>
                        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF385C]'></div>
                        <span className='ml-3 text-gray-500'>Detecting your location...</span>
                    </div>
                </div>
            )}

            {/*  Permission denied fallback  */}
            {permissionDenied && (
                <div className='mb-10'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-4'>📍 Available near you this weekend</h2>
                    <div className='bg-gray-50 rounded-xl p-6 text-center text-gray-500'>
                        <p className="mb-2">Enable location services to see nearby stays</p>
                        <button 
                            onClick={retry}
                            className='text-[#FF385C] hover:underline text-sm font-medium'
                        >
                            Try again
                        </button>
                    </div>
                </div>
            )}

            {/* No nearby found  */}
            {!permissionDenied && !isLoadingNearby && nearby.length === 0 && location && (
                <div className='mb-10'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-4'> Available near you this weekend</h2>
                    <div className='bg-gray-50 rounded-xl p-6 text-center text-gray-500'>
                        <p>No stays found near your location. Try expanding your search!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationInspiration;