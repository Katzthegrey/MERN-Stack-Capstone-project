import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AirbnbContext } from '../context/AirbnbContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import DatePicker from '../components/DatePicker';
import CostBreakdown from '../components/CostBreakdown';
import useCostCalculator from '../hooks/useCostCalculator';

const LocationDetails = () => {
    const { accommodationId } = useParams();
    const { accommodations, currency, backendURL, token, navigate, createReservation, username, email } = useContext(AirbnbContext);
    const [listing, setListing] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [isReserving, setIsReserving] = useState(false);

    const {
        checkIn,
        setCheckIn,
        checkOut,
        setCheckOut,
        guests,
        setGuests,
        costs,
        getMinDate,
        getMinCheckOut,
        formatCurrency,
        dateError,
        isReservationValid
    } = useCostCalculator(listing, currency);

    useEffect(() => {
        const fetchListing = async () => {
            const localMatch = accommodations.find(item => item._id === accommodationId);
            if (localMatch) {
                setListing(localMatch);
                setMainImage(localMatch.images?.[0]);
                return;
            }

            try {
                const response = await axios.get(`${backendURL}/api/accommodations/${accommodationId}`);
                if (response.data.success) {
                    setListing(response.data.accommodation);
                    setMainImage(response.data.accommodation.images?.[0]);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message || error.message);
            }
        };

        fetchListing();
    }, [accommodationId, accommodations, backendURL]);

    const handleReserve = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        
        if (!isReservationValid) {
            if (!checkIn) {
                toast.warning('Please select a check-in date');
            } else if (!checkOut) {
                toast.warning('Please select a check-out date');
            } else if (dateError) {
                toast.warning(dateError);
            }
            return;
        }

        setIsReserving(true);
        
        const userEmail = email || localStorage.getItem('email');
        
        if (!userEmail) {
            toast.error('User email not found. Please log in again.');
            setIsReserving(false);
            return;
        }
        
        const reservationData = {
            listingId: listing._id,
            checkIn,
            checkOut,
            guests,
            totalPrice: costs.total,
            guestName: username,
            guestEmail: userEmail,
            guestPhone: ''
        };

        console.log('Reservation data to send:', reservationData);
        console.log('Token:', token);
        console.log('Username:', username);
        console.log('Email:', userEmail);

        const result = await createReservation(reservationData);
        
        setIsReserving(false);
        
        if (result.success) {
            navigate('/bookings');
        }
    };

    if (!listing) {
        return <div className='py-20 text-center text-gray-500'>Loading accommodation details...</div>;
    }

    return (
        <div className='pt-8'>
            <h1 className='text-2xl font-semibold'>{listing.type} in {listing.location}</h1>
            <p className='text-gray-600 mt-1'>
                {listing.rating > 0 && <>★ {listing.rating} · {listing.reviews} reviews · </>}
                {listing.location}
            </p>

            {/* Image Gallery */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-6 rounded-xl overflow-hidden'>
                <img className='w-full h-80 md:h-[400px] object-cover' src={mainImage || listing.images?.[0]} alt={listing.title} />
                <div className='grid grid-cols-2 gap-2'>
                    {listing.images?.slice(1, 5).map((img, index) => (
                        <img
                            key={index}
                            onClick={() => setMainImage(img)}
                            className='w-full h-[195px] object-cover cursor-pointer hover:opacity-90'
                            src={img}
                            alt=""
                        />
                    ))}
                </div>
            </div>

            {/* Two column layout */}
            <div className='flex flex-col lg:flex-row gap-10 mt-10'>
                {/* Left: accommodation details */}
                <div className='flex-1'>
                    <h2 className='text-xl font-semibold'>{listing.title}</h2>
                    <p className='text-gray-600 mt-1'>
                        {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms
                    </p>
                    <hr className='my-6' />

                    <div>
                        <h3 className='font-semibold mb-2'>About this place</h3>
                        <p className='text-gray-600 leading-relaxed'>{listing.description}</p>
                    </div>

                    <hr className='my-6' />

                    <div>
                        <h3 className='font-semibold mb-3'>What this place offers</h3>
                        <div className='grid grid-cols-2 gap-3'>
                            {listing.amenities?.map((amenity, index) => (
                                <p key={index} className='text-gray-600 capitalize'>✓ {amenity}</p>
                            ))}
                        </div>
                    </div>

                    <hr className='my-6' />

                    <div className='text-gray-500 text-sm'>
                        <p className='font-semibold text-gray-800 mb-2'>House Rules, Health & Safety, Cancellation Policy</p>
                        <p>Check-in after 3:00 PM · Checkout before 11:00 AM · No smoking · No parties</p>
                    </div>
                </div>

                {/* Right: cost calculator */}
                <div className='lg:w-96 border rounded-xl p-6 shadow-lg h-fit sticky top-8'>
                    <p className='text-2xl font-semibold'>
                        {currency}{listing.price} <span className='text-base font-normal text-gray-600'>night</span>
                    </p>

                    <div className="mt-4">
                        <DatePicker
                            checkIn={checkIn}
                            setCheckIn={setCheckIn}
                            checkOut={checkOut}
                            setCheckOut={setCheckOut}
                            guests={guests}
                            setGuests={setGuests}
                            getMinDate={getMinDate}
                            getMinCheckOut={getMinCheckOut}
                            maxGuests={listing.guests}
                            dateError={dateError}
                        />
                    </div>

                    <CostBreakdown 
                        costs={costs} 
                        formatCurrency={formatCurrency} 
                        listing={listing} 
                    />

                    {costs.nights > 0 && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            {costs.nights} night{costs.nights > 1 ? 's' : ''} · {guests} guest{guests > 1 ? 's' : ''}
                        </p>
                    )}

                    <button
                        onClick={handleReserve}
                        disabled={isReserving}
                        className='w-full mt-4 bg-[#FF385C] text-white py-3 rounded-lg font-semibold hover:bg-[#e0314f] transition disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isReserving ? 'Reserving...' : token ? 'Reserve' : 'Log in to Reserve'}
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-3 text-center">
                        You won't be charged yet
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LocationDetails;