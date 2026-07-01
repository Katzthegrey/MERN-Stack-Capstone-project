import React, { useContext } from 'react';
import { AirbnbContext } from '../context/AirbnbContext';
import { Link } from 'react-router-dom';

const AccommodationCard = ({ id, images, title, price, location, type, rating, reviews }) => {
    const { currency } = useContext(AirbnbContext);

    return (
        <Link className='text-gray-700 cursor-pointer' to={`/accommodation/${id}`}>
            <div className='overflow-hidden rounded-xl'>
                <img
                    className='w-full aspect-square object-cover hover:scale-105 transition ease-in-out'
                    src={images?.[0]}
                    alt={title}
                />
            </div>
            <div className='pt-3'>
                <p className='text-sm text-gray-500'>{location} · {type}</p>
                <p className='font-medium pt-1'>{title}</p>
                {rating > 0 && (
                    <p className='text-sm pt-1'>
                        ★ {rating} ({reviews} reviews)
                    </p>
                )}
                <p className='text-sm font-medium pt-1'>
                    <span className='font-semibold'>{currency}{price}</span> night
                </p>
            </div>
        </Link>
    );
};

export default AccommodationCard;
