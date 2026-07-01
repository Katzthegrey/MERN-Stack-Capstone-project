import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { backendURL, currency } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewListings = ({ token }) => {
    const [listings, setListings] = useState([]);

    const fetchListings = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/accommodations`);
            if (response.data.success) {
                setListings(response.data.accommodations);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const deleteListing = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;

        try {
            const response = await axios.delete(`${backendURL}/api/accommodations/${id}`, {
                headers: { token },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                await fetchListings();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    return (
        <>
            <h2 className='text-xl font-semibold mb-4'>All Listings</h2>
            <div className='flex flex-col gap-2'>
                <div className='hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-medium'>
                    <span>Image</span>
                    <span>Title</span>
                    <span>Location</span>
                    <span>Price</span>
                    <span className='text-center'>Actions</span>
                </div>

                {listings.length === 0 && (
                    <p className='text-gray-500 py-8 text-center'>No listings found. Create your first listing.</p>
                )}

                {listings.map((item) => (
                    <div
                        className='grid grid-cols-[1fr_2fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center gap-2 py-2 px-3 border text-sm'
                        key={item._id}
                    >
                        <img className='w-16 h-12 object-cover rounded' src={item.images?.[0]} alt={item.title} />
                        <p className='font-medium'>{item.title}</p>
                        <p className='hidden md:block'>{item.location}</p>
                        <p className='hidden md:block'>{currency}{item.price}/night</p>
                        <div className='flex gap-3 justify-end md:justify-center'>
                            <Link
                                to={`/update/${item._id}`}
                                className='text-blue-600 hover:underline text-sm'
                            >
                                Update
                            </Link>
                            <button
                                onClick={() => deleteListing(item._id)}
                                className='text-red-600 hover:underline text-sm'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ViewListings;
