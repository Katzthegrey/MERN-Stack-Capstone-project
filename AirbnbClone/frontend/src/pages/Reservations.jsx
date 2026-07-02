import React, { useContext, useEffect, useState } from 'react';
import { AirbnbContext } from '../context/AirbnbContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Reservations = () => {
    const { backendURL, token, currency, navigate } = useContext(AirbnbContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

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
                toast.success('Checkout complete! Thank you for your stay.');
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
            
            {bookings.length === 0 ? (
                <div className='text-center py-20'>
                    <p className='text-gray-500 text-lg mb-4'>No bookings yet</p>
                    <button 
                        onClick={() => navigate('/')}
                        className='text-[#FF385C] font-semibold hover:underline'
                    >
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
                                    
                                    {booking.status === 'completed' && (
                                        <p className='mt-3 text-sm text-green-600'>✓ Stay completed</p>
                                    )}
                                    {booking.status === 'cancelled' && (
                                        <p className='mt-3 text-sm text-red-600'>✗ Cancelled</p>
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