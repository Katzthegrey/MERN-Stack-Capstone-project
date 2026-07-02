import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AirbnbContext } from '../context/AirbnbContext';

const Location = () => {
    const { locationName } = useParams();
    const { accommodations, locationFilter, search } = useContext(AirbnbContext);
    const [filteredListings, setFilteredListings] = useState([]);

    useEffect(() => {
        let listings = accommodations.slice();

        const activeLocation = locationName
            ? decodeURIComponent(locationName)
            : locationFilter;

        if (activeLocation) {
            listings = listings.filter(item =>
                item.location.toLowerCase().includes(activeLocation.toLowerCase())
            );
        }

        if (search) {
            listings = listings.filter(item =>
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.location.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredListings(listings);
    }, [accommodations, locationName, locationFilter, search]);

    const displayLocation = locationName
        ? decodeURIComponent(locationName)
        : locationFilter || 'All Locations';

    return (
        <div className='pt-8'>
            <h1 className='text-2xl font-semibold mb-1'>
                {filteredListings.length} accommodations in {displayLocation}
            </h1>
            <p className='text-gray-500 text-sm mb-8'>Find the perfect place to stay</p>

            {filteredListings.length === 0 ? (
                <p className='text-gray-500 text-center py-16'>No accommodations found for this location.</p>
            ) : (
                <div className='flex flex-col gap-6'>
                    {filteredListings.map((item) => (
                        <Link
                            key={item._id}
                            to={`/accommodation/${item._id}`}
                            className='flex flex-col sm:flex-row gap-4 border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer'
                        >
                            <img
                                className='w-full sm:w-72 h-48 sm:h-auto object-cover'
                                src={item.images?.[0]}
                                alt={item.title}
                            />
                            <div className='p-4 flex flex-col justify-center'>
                                <p className='text-sm text-gray-500'>{item.type} in {item.location}</p>
                                <h2 className='text-lg font-semibold mt-1'>{item.title}</h2>
                                <p className='text-sm text-gray-600 mt-2'>
                                    {item.amenities?.slice(0, 3).join(' · ')}
                                </p>
                                {item.rating > 0 && (
                                    <p className='text-sm mt-2'>
                                        ★ {item.rating} · {item.reviews} reviews
                                    </p>
                                )}
                                <p className='text-lg font-semibold mt-3'>
                                    ${item.price} <span className='text-sm font-normal text-gray-600'>night</span>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Location;
