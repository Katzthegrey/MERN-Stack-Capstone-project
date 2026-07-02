import React, { useContext, useEffect, useState } from 'react';
import { AirbnbContext } from '../context/AirbnbContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const StarRating = ({ rating, onRate }) => {
    const [hover, setHover] = useState(0);
    
    return (
        <div className='flex gap-1'>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => onRate(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className={`text-2xl transition ${
                        star <= (hover || rating) ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                >
                    <i className={`${star <= (hover || rating) ? 'fas' : 'far'} fa-star`}></i>
                </button>
            ))}
        </div>
    );
};

const Reservations = () => {
    const { backendURL, token, currency, navigate } = useContext(AirbnbContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [ratingModal, setRatingModal] = useState(null);
    const [ratingValue, setRatingValue] = useState(0);
    const [reviewText, setReviewText] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [token]);

    const fetchBookings = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/reservations/user`, {
                headers: { token }
            });
            if (response.data.success) {
                setBookings(response.data.reservations);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (bookingId) => {
        if (!window.confirm('Confirm checkout? This completes your stay.')) return;
        
        setProcessingId(bookingId);
        try {
            const response = await axios.patch(
                `${backendURL}/api/reservations/${bookingId}/complete`,
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success('Checkout complete! Would you like to rate your stay?');
                fetchBookings();
                setRatingModal(bookingId);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleRate = async () => {
        if (ratingValue === 0) {
            toast.warning('Please select a rating');
            return;
        }
        
        setProcessingId(ratingModal);
        try {
            const response = await axios.patch(
                `${backendURL}/api/reservations/${ratingModal}/rate`,
                { rating: ratingValue, review: reviewText },
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success('Thank you for your rating!');
                setRatingModal(null);
                setRatingValue(0);
                setReviewText('');
                fetchBookings();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        
        setProcessingId(bookingId);
        try {
            const response = await axios.patch(
                `${backendURL}/api/reservations/${bookingId}/cancel`,
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success('Booking cancelled.');
                fetchBookings();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setProcessingId(null);
        }
    };

    if (!token) return null;
    if (loading) return <div className='py-20 text-center text-gray-500'>Loading your bookings...</div>;

    return (
        <div className='pt-8 max-w-4xl mx-auto px-4'>
            <h1 className='text-2xl font-semibold mb-6'>Your Bookings</h1>
            
            {/* Rating Modal */}
            {ratingModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-xl p-6 max-w-md w-full mx-4'>
                        <h3 className='text-lg font-semibold mb-4'>Rate your stay</h3>
                        <div className='flex justify-center mb-4'>
                            <StarRating rating={ratingValue} onRate={setRatingValue} />
                        </div>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder='Tell us about your experience...'
                            className='w-full border rounded-lg p-3 text-sm mb-4 h-24 resize-none'
                        />
                        <div className='flex gap-3'>
                            <button
                                onClick={handleRate}
                                disabled={processingId === ratingModal}
                                className='flex-1 bg-[#FF385C] text-white py-2 rounded-lg font-medium hover:bg-[#e0314f] disabled:opacity-50'
                            >
                                {processingId === ratingModal ? 'Submitting...' : 'Submit Rating'}
                            </button>
                            <button
                                onClick={() => { setRatingModal(null); setRatingValue(0); setReviewText(''); }}
                                className='flex-1 border py-2 rounded-lg font-medium hover:bg-gray-50'
                            >
                                Skip
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {bookings.length === 0 ? (
                <div className='text-center py-20'>
                    <p className='text-gray-500 text-lg mb-4'>No bookings yet</p>
                    <button onClick={() => navigate('/')} className='text-[#FF385C] font-semibold hover:underline'>
                        Start exploring
                    </button>
                </div>
            ) : (
                <div className='space-y-4'>
                    {bookings.map((booking) => (
                        <div key={booking._id} className='border rounded-xl p-4 hover:shadow-md transition'>
                            <div className='flex gap-4'>
                                <img 
                                    src={booking.accommodationImage || '/placeholder.jpg'} 
                                    alt={booking.accommodationTitle}
                                    className='w-32 h-32 object-cover rounded-lg flex-shrink-0'
                                />
                                <div className='flex-1'>
                                    <div className='flex items-start justify-between'>
                                        <div>
                                            <h3 className='font-semibold text-lg'>{booking.accommodationTitle}</h3>
                                            <p className='text-gray-600 text-sm'>{booking.accommodationLocation}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    
                                    <div className='mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600'>
                                        <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                                        <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                                        <p>Guests: {booking.guests}</p>
                                        <p className='font-semibold text-gray-900'>{currency}{booking.totalPrice}</p>
                                    </div>

                                    {booking.rating > 0 && (
                                        <div className='mt-2'>
                                            <div className='flex gap-0.5 text-yellow-500'>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <i key={star} className={`${star <= booking.rating ? 'fas' : 'far'} fa-star text-sm`}></i>
                                                ))}
                                            </div>
                                            {booking.review && <p className='text-gray-500 text-xs mt-1'>"{booking.review}"</p>}
                                        </div>
                                    )}

                                    {booking.status === 'confirmed' && (
                                        <div className='flex gap-2 mt-3'>
                                            <button
                                                onClick={() => handleComplete(booking._id)}
                                                disabled={processingId === booking._id}
                                                className='px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50'
                                            >
                                                {processingId === booking._id ? 'Processing...' : 'Checkout'}
                                            </button>
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                disabled={processingId === booking._id}
                                                className='px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 disabled:opacity-50'
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                    
                                    {booking.status === 'completed' && !booking.rating && (
                                        <button
                                            onClick={() => setRatingModal(booking._id)}
                                            className='mt-3 px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition'
                                        >
                                            <i className="fas fa-star mr-1"></i> Rate this stay
                                        </button>
                                    )}
                                    
                                    {booking.status === 'completed' && booking.rating > 0 && (
                                        <p className='mt-3 text-sm text-green-600'>
                                            <i className="fas fa-check-circle mr-1"></i> Stay completed & rated
                                        </p>
                                    )}
                                    {booking.status === 'cancelled' && (
                                        <p className='mt-3 text-sm text-red-600'>
                                            <i className="fas fa-times-circle mr-1"></i> Cancelled
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reservations;