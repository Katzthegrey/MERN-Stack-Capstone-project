import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { backendURL } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

const AMENITY_OPTIONS = ['wifi', 'kitchen', 'free parking', 'washer', 'dryer', 'air conditioning', 'heating', 'tv', 'pool', 'hot tub'];

const UpdateListing = ({ token }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([null, null, null, null, null]);
    const [form, setForm] = useState({
        title: '',
        location: '',
        description: '',
        bedrooms: '',
        bathrooms: '',
        guests: '',
        type: 'Entire apartment',
        price: '',
        amenities: [],
        weeklyDiscount: '',
        cleaningFee: '',
        serviceFee: '',
        occupancyTaxes: '',
        city: '',
        province: '',
        country: 'South Africa',
        lat: '',
        lng: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch listing data on load
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await axios.get(`${backendURL}/api/accommodations/${id}`);
                if (response.data.success) {
                    const data = response.data.accommodation;
                    setForm({
                        title: data.title || '',
                        location: data.location || '',
                        description: data.description || '',
                        bedrooms: data.bedrooms || '',
                        bathrooms: data.bathrooms || '',
                        guests: data.guests || '',
                        type: data.type || 'Entire apartment',
                        price: data.price || '',
                        amenities: data.amenities || [],
                        weeklyDiscount: data.weeklyDiscount || '',
                        cleaningFee: data.cleaningFee || '',
                        serviceFee: data.serviceFee || '',
                        occupancyTaxes: data.occupancyTaxes || '',
                        city: data.locationDetails?.city || '',
                        province: data.locationDetails?.province || '',
                        country: data.locationDetails?.country || 'South Africa',
                        lat: data.locationDetails?.coordinates?.lat || '',
                        lng: data.locationDetails?.coordinates?.lng || ''
                    });
                } else {
                    toast.error('Failed to load listing');
                    navigate('/list');
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message || 'Error loading listing');
                navigate('/list');
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id, navigate]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const toggleAmenity = (amenity) => {
        setForm(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    const handleImageChange = (index, file) => {
        const updated = [...images];
        updated[index] = file;
        setImages(updated);
    };

    const validate = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = 'Title is required';
        if (!form.location.trim() && !form.city) newErrors.location = 'Location is required';
        if (!form.description.trim()) newErrors.description = 'Description is required';
        if (!form.bedrooms || form.bedrooms < 1) newErrors.bedrooms = 'At least 1 bedroom required';
        if (!form.bathrooms || form.bathrooms < 1) newErrors.bathrooms = 'At least 1 bathroom required';
        if (!form.guests || form.guests < 1) newErrors.guests = 'At least 1 guest required';
        if (!form.price || form.price <= 0) newErrors.price = 'Valid price is required';
        if (!form.city) newErrors.city = 'City is required';
        if (!form.province) newErrors.province = 'Province is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            
            // Add all form fields
            Object.entries(form).forEach(([key, value]) => {
                if (key === 'amenities') {
                    formData.append(key, JSON.stringify(value));
                } else if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, value);
                }
            });

            // Add images that are being uploaded
            images.forEach((img, i) => {
                if (img) formData.append(`image${i + 1}`, img);
            });

            const response = await axios.put(`${backendURL}/api/accommodations/${id}`, formData, {
                headers: { 
                    token,
                    'Content-Type': 'multipart/form-data'
                },
            });

            if (response.data.success) {
                toast.success('Listing updated successfully!');
                navigate('/list');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Error updating listing');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center h-64'>
                <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF385C]'></div>
                <span className='ml-3 text-gray-500'>Loading listing...</span>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 max-w-2xl'>
            <div className='flex items-center gap-4 w-full'>
                <h2 className='text-xl font-semibold'>Update Listing</h2>
                <button
                    type="button"
                    onClick={() => navigate('/list')}
                    className='text-sm text-gray-500 hover:text-gray-700'
                >
                    ← Back to listings
                </button>
            </div>

            {/* Image Upload */}
            <div className='w-full'>
                <p className='mb-2 font-medium'>Upload Images (leave empty to keep current)</p>
                <div className='flex gap-2 flex-wrap'>
                    {images.map((img, index) => (
                        <label key={index} htmlFor={`image${index}`}>
                            <img
                                className='w-20 h-20 object-cover rounded border'
                                src={img ? URL.createObjectURL(img) : '/upload-area.png'}
                                alt=""
                            />
                            <input
                                onChange={(e) => handleImageChange(index, e.target.files[0])}
                                type="file"
                                id={`image${index}`}
                                accept="image/*"
                                hidden
                            />
                        </label>
                    ))}
                </div>
                <p className='text-xs text-gray-400 mt-1'>Current images will be kept if you don't upload new ones</p>
            </div>

            {/* Basic Info */}
            <div className='w-full'>
                <p className='mb-2 font-medium'>Title</p>
                <input
                    onChange={(e) => handleChange('title', e.target.value)}
                    value={form.title}
                    className='w-full px-3 py-2 border rounded'
                    type="text"
                />
                {errors.title && <p className='text-red-500 text-xs mt-1'>{errors.title}</p>}
            </div>

            <div className='w-full'>
                <p className='mb-2 font-medium'>Location</p>
                <input
                    onChange={(e) => handleChange('location', e.target.value)}
                    value={form.location}
                    className='w-full px-3 py-2 border rounded'
                    type="text"
                    placeholder="e.g., Cape Town, Western Cape"
                />
                {errors.location && <p className='text-red-500 text-xs mt-1'>{errors.location}</p>}
            </div>

            {/* City, Province, Country */}
            <div className='flex flex-wrap gap-4 w-full'>
                <div className='flex-1 min-w-[120px]'>
                    <p className='mb-2 font-medium'>City *</p>
                    <input
                        onChange={(e) => handleChange('city', e.target.value)}
                        value={form.city}
                        className='w-full px-3 py-2 border rounded'
                        placeholder="Cape Town"
                    />
                    {errors.city && <p className='text-red-500 text-xs mt-1'>{errors.city}</p>}
                </div>
                <div className='flex-1 min-w-[120px]'>
                    <p className='mb-2 font-medium'>Province *</p>
                    <input
                        onChange={(e) => handleChange('province', e.target.value)}
                        value={form.province}
                        className='w-full px-3 py-2 border rounded'
                        placeholder="Western Cape"
                    />
                    {errors.province && <p className='text-red-500 text-xs mt-1'>{errors.province}</p>}
                </div>
                <div className='flex-1 min-w-[120px]'>
                    <p className='mb-2 font-medium'>Country *</p>
                    <input
                        onChange={(e) => handleChange('country', e.target.value)}
                        value={form.country}
                        className='w-full px-3 py-2 border rounded'
                        placeholder="South Africa"
                    />
                    {errors.country && <p className='text-red-500 text-xs mt-1'>{errors.country}</p>}
                </div>
            </div>

            {/* Description */}
            <div className='w-full'>
                <p className='mb-2 font-medium'>Description</p>
                <textarea
                    onChange={(e) => handleChange('description', e.target.value)}
                    value={form.description}
                    className='w-full px-3 py-2 border rounded'
                    rows={4}
                />
                {errors.description && <p className='text-red-500 text-xs mt-1'>{errors.description}</p>}
            </div>

            {/* Bedrooms, Bathrooms, Guests, Price */}
            <div className='flex flex-wrap gap-4 w-full'>
                {[
                    { field: 'bedrooms', label: 'Bedrooms' },
                    { field: 'bathrooms', label: 'Bathrooms' },
                    { field: 'guests', label: 'Guests' },
                    { field: 'price', label: 'Price per Night (ZAR)' },
                ].map(({ field, label }) => (
                    <div key={field}>
                        <p className='mb-2 font-medium'>{label}</p>
                        <input
                            onChange={(e) => handleChange(field, e.target.value)}
                            value={form[field]}
                            className='w-32 px-3 py-2 border rounded'
                            type="number"
                            min="0"
                        />
                        {errors[field] && <p className='text-red-500 text-xs mt-1'>{errors[field]}</p>}
                    </div>
                ))}
            </div>

            {/* Type */}
            <div>
                <p className='mb-2 font-medium'>Accommodation Type</p>
                <select
                    onChange={(e) => handleChange('type', e.target.value)}
                    value={form.type}
                    className='px-3 py-2 border rounded'
                >
                    <option value="Entire apartment">Entire apartment</option>
                    <option value="Private room">Private room</option>
                    <option value="Shared room">Shared room</option>
                    <option value="Entire house">Entire house</option>
                    <option value="Villa">Villa</option>
                    <option value="Cabin">Cabin</option>
                </select>
            </div>

            {/* Fees */}
            <div className='flex flex-wrap gap-4 w-full'>
                {[
                    { field: 'weeklyDiscount', label: 'Weekly Discount (%)' },
                    { field: 'cleaningFee', label: 'Cleaning Fee (ZAR)' },
                    { field: 'serviceFee', label: 'Service Fee (ZAR)' },
                    { field: 'occupancyTaxes', label: 'Occupancy Taxes (ZAR)' },
                ].map(({ field, label }) => (
                    <div key={field}>
                        <p className='mb-2 font-medium'>{label}</p>
                        <input
                            onChange={(e) => handleChange(field, e.target.value)}
                            value={form[field]}
                            className='w-32 px-3 py-2 border rounded'
                            type="number"
                            min="0"
                        />
                    </div>
                ))}
            </div>

            {/* Amenities */}
            <div className='w-full'>
                <p className='mb-2 font-medium'>Amenities</p>
                <div className='flex flex-wrap gap-2'>
                    {AMENITY_OPTIONS.map(amenity => (
                        <button
                            key={amenity}
                            type="button"
                            onClick={() => toggleAmenity(amenity)}
                            className={`px-3 py-1 rounded-full text-sm border ${
                                form.amenities.includes(amenity)
                                    ? 'bg-[#FF385C] text-white border-[#FF385C]'
                                    : 'bg-gray-100 text-gray-700 border-gray-300'
                            }`}
                        >
                            {amenity}
                        </button>
                    ))}
                </div>
            </div>

            {/* Submit */}
            <div className='flex gap-4 w-full'>
                <button 
                    type='submit' 
                    className='px-8 py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#e0314f] disabled:opacity-50'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Updating...' : 'Update Listing'}
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/list')}
                    className='px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default UpdateListing;