import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Reservations = ({ token }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [processingId, setProcessingId] = useState(null);

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

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-semibold mb-6'>Reservations</h1>
            
            <div className='grid grid-cols-4 gap-4 mb-6'>
                {stats.map((stat) => (
                    <div key={stat.label} className='bg-gray-100 rounded-xl p-4'>
                        <p className='text-sm text-gray-600'>{stat.label}</p>
                        <p className='text-2xl font-semibold'>{stat.count}</p>
                    </div>
                ))}
            </div>

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
                                <th className='text-left p-4 text-sm text-gray-600'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map((r) => (
                                <tr key={r._id} className='border-b hover:bg-gray-50'>
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
                                        {r.status === 'confirmed' && (
                                            <div className='flex gap-2'>
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
                                            </div>
                                        )}
                                        {r.status === 'completed' && <span className='text-xs text-green-600'>✓ Done</span>}
                                        {r.status === 'cancelled' && <span className='text-xs text-red-600'>✗ Cancelled</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reservations;