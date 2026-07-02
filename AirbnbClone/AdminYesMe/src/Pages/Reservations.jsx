import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Reservations = ({ token }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [processingId, setProcessingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        if (token) {
            fetchReservations();
        }
    }, [token]);

    const fetchReservations = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/reservations/all`, {
                headers: { token }
            });
            if (response.data.success) {
                setReservations(response.data.reservations);
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

    const handleCancel = async (reservationId) => {
        if (!window.confirm('Cancel this reservation?')) return;
        
        setProcessingId(reservationId);
        try {
            const response = await axios.patch(
                `${backendURL}/api/reservations/${reservationId}/cancel`,
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success('Reservation cancelled');
                fetchReservations();
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

    const handleStatusUpdate = async (reservationId, newStatus) => {
        setProcessingId(reservationId);
        try {
            const response = await axios.patch(
                `${backendURL}/api/reservations/${reservationId}/status`,
                { status: newStatus },
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success(`Reservation ${newStatus}`);
                fetchReservations();
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

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) return <div className='p-8 text-center text-gray-500'>Loading...</div>;

    const filteredReservations = filter === 'all'
        ? reservations
        : reservations.filter(r => r.status === filter);

    const stats = [
        { label: 'All', count: reservations.length },
        { label: 'Confirmed', count: reservations.filter(r => r.status === 'confirmed').length },
        { label: 'Completed', count: reservations.filter(r => r.status === 'completed').length },
        { label: 'Cancelled', count: reservations.filter(r => r.status === 'cancelled').length },
    ];

    // Calculate average rating
    const avgRating = reservations.filter(r => r.rating > 0).length > 0
        ? (reservations.filter(r => r.rating > 0).reduce((sum, r) => sum + r.rating, 0) / reservations.filter(r => r.rating > 0).length).toFixed(1)
        : 0;

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-semibold mb-6'>Reservations</h1>
            
            {/* Stats */}
            <div className='grid grid-cols-4 gap-4 mb-6'>
                {stats.map((stat) => (
                    <div key={stat.label} className='bg-gray-100 rounded-xl p-4'>
                        <p className='text-sm text-gray-600'>{stat.label}</p>
                        <p className='text-2xl font-semibold'>{stat.count}</p>
                    </div>
                ))}
            </div>

            {/* Rating Summary */}
            {avgRating > 0 && (
                <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3'>
                    <div className='flex gap-0.5 text-yellow-500 text-lg'>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i key={star} className={`${star <= Math.round(avgRating) ? 'fas' : 'far'} fa-star`}></i>
                        ))}
                    </div>
                    <div>
                        <p className='font-semibold'>{avgRating} average rating</p>
                        <p className='text-sm text-gray-600'>
                            {reservations.filter(r => r.rating > 0).length} rated stays
                        </p>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className='flex gap-2 mb-6'>
                {['all', 'confirmed', 'completed', 'cancelled'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                            filter === f ? 'bg-[#FF385C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>
            
            {filteredReservations.length === 0 ? (
                <p className='text-center py-12 text-gray-500'>No reservations found</p>
            ) : (
                <div className='bg-white rounded-xl border overflow-hidden'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b bg-gray-50'>
                                <th className='text-left p-4 text-sm text-gray-600'>Guest</th>
                                <th className='text-left p-4 text-sm text-gray-600'>Accommodation</th>
                                <th className='text-left p-4 text-sm text-gray-600'>Check-in</th>
                                <th className='text-left p-4 text-sm text-gray-600'>Check-out</th>
                                <th className='text-left p-4 text-sm text-gray-600'>Guests</th>
                                <th className='text-left p-4 text-sm text-gray-600'>Total</th>
                                <th className='text-left p-4 text-sm text-gray-600'>Status</th>
                                <th className='text-left p-4 text-sm text-gray-600'>Rating</th>
                                <th className='text-left p-4 text-sm text-gray-600'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map((r) => (
                                <React.Fragment key={r._id}>
                                    <tr className={`border-b hover:bg-gray-50 transition ${expandedId === r._id ? 'bg-gray-50' : ''}`}>
                                        <td className='p-4'>
                                            <p className='font-medium text-sm'>{r.guestName}</p>
                                            <p className='text-xs text-gray-500'>{r.guestEmail}</p>
                                        </td>
                                        <td className='p-4'>
                                            <p className='text-sm font-medium'>{r.accommodationTitle}</p>
                                            <p className='text-xs text-gray-500'>{r.accommodationLocation}</p>
                                        </td>
                                        <td className='p-4 text-sm'>{new Date(r.checkIn).toLocaleDateString()}</td>
                                        <td className='p-4 text-sm'>{new Date(r.checkOut).toLocaleDateString()}</td>
                                        <td className='p-4 text-sm'>{r.guests}</td>
                                        <td className='p-4 text-sm font-medium'>R{r.totalPrice}</td>
                                        <td className='p-4'>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                r.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                r.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className='p-4'>
                                            {r.rating > 0 ? (
                                                <div className='flex gap-0.5 text-yellow-500'>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <i key={star} className={`${star <= r.rating ? 'fas' : 'far'} fa-star text-xs`}></i>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className='text-xs text-gray-400'>—</span>
                                            )}
                                        </td>
                                        <td className='p-4'>
                                            <div className='flex gap-2 items-center'>
                                                {r.status === 'confirmed' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(r._id, 'completed')}
                                                            disabled={processingId === r._id}
                                                            className='px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50'
                                                        >
                                                            Complete
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(r._id)}
                                                            disabled={processingId === r._id}
                                                            className='px-3 py-1 border border-red-300 text-red-600 text-xs rounded hover:bg-red-50 disabled:opacity-50'
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {r.status === 'completed' && (
                                                    <span className='text-xs text-green-600 font-medium'>
                                                        <i className="fas fa-check-circle mr-1"></i> Done
                                                    </span>
                                                )}
                                                {r.status === 'cancelled' && (
                                                    <span className='text-xs text-red-600 font-medium'>
                                                        <i className="fas fa-times-circle mr-1"></i> Cancelled
                                                    </span>
                                                )}
                                                {(r.rating > 0 || r.review) && (
                                                    <button
                                                        onClick={() => toggleExpand(r._id)}
                                                        className='px-2 py-1 text-xs text-gray-500 hover:text-gray-700 border rounded hover:bg-gray-100'
                                                    >
                                                        <i className={`fas fa-chevron-${expandedId === r._id ? 'up' : 'down'} mr-1`}></i>
                                                        Details
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    {/* Expandable Detail Row */}
                                    {expandedId === r._id && (r.rating > 0 || r.review) && (
                                        <tr key={`${r._id}-detail`}>
                                            <td colSpan={9} className='p-4 bg-gray-50 border-b'>
                                                <div className='flex gap-6'>
                                                    {r.rating > 0 && (
                                                        <div>
                                                            <p className='text-xs text-gray-500 mb-1'>Guest Rating</p>
                                                            <div className='flex gap-0.5 text-yellow-500 text-lg mb-1'>
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <i key={star} className={`${star <= r.rating ? 'fas' : 'far'} fa-star`}></i>
                                                                ))}
                                                            </div>
                                                            <p className='text-sm font-medium'>{r.rating}/5</p>
                                                        </div>
                                                    )}
                                                    {r.review && (
                                                        <div className='flex-1'>
                                                            <p className='text-xs text-gray-500 mb-1'>Guest Review</p>
                                                            <p className='text-sm text-gray-700 italic'>"{r.review}"</p>
                                                        </div>
                                                    )}
                                                    {r.ratedAt && (
                                                        <div>
                                                            <p className='text-xs text-gray-500 mb-1'>Rated On</p>
                                                            <p className='text-sm text-gray-700'>
                                                                {new Date(r.ratedAt).toLocaleDateString('en-ZA', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reservations;