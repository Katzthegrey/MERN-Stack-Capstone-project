import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify';

const AMENITY_OPTIONS = ['wifi', 'kitchen', 'free parking', 'washer', 'dryer', 'air conditioning', 'heating', 'tv', 'pool', 'hot tub'];

const CreateListing = ({ token }) => {
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
    });
    const [errors, setErrors] = useState({});

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
        if (!form.location.trim()) newErrors.location = 'Location is required';
        if (!form.description.trim()) newErrors.description = 'Description is required';
        if (!form.bedrooms || form.bedrooms < 1) newErrors.bedrooms = 'At least 1 bedroom required';
        if (!form.bathrooms || form.bathrooms < 1) newErrors.bathrooms = 'At least 1 bathroom required';
        if (!form.guests || form.guests < 1) newErrors.guests = 'At least 1 guest required';
        if (!form.price || form.price <= 0) newErrors.price = 'Valid price is required';
        if (!images[0]) newErrors.images = 'At least one image is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (key === 'amenities') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            images.forEach((img, i) => {
                if (img) formData.append(`image${i + 1}`, img);
            });

            const response = await axios.post(`${backendURL}/api/accommodations`, formData, {
                headers: { token },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setForm({
                    title: '', location: '', description: '', bedrooms: '', bathrooms: '',
                    guests: '', type: 'Entire apartment', price: '', amenities: [],
                    weeklyDiscount: '', cleaningFee: '', serviceFee: '', occupancyTaxes: '',
                });
                setImages([null, null, null, null, null]);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 max-w-2xl'>
            <h2 className='text-xl font-semibold'>Create New Listing</h2>

            <div className='w-full'>
                <p className='mb-2 font-medium'>Upload Images</p>
                <div className='flex gap-2 flex-wrap'>
                    {images.map((img, index) => (
                        <label key={index} htmlFor={`image${index}`}>
                            <img
                                className='w-20 h-20 object-cover rounded border'
                                src={img ? URL.createObjectURL(img) : assets.upload_area}
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
                {errors.images && <p className='text-red-500 text-xs mt-1'>{errors.images}</p>}
            </div>

            {[
                { field: 'title', label: 'Title', type: 'text' },
                { field: 'location', label: 'Location', type: 'text' },
            ].map(({ field, label, type }) => (
                <div key={field} className='w-full'>
                    <p className='mb-2 font-medium'>{label}</p>
                    <input
                        onChange={(e) => handleChange(field, e.target.value)}
                        value={form[field]}
                        className='w-full px-3 py-2 border rounded'
                        type={type}
                    />
                    {errors[field] && <p className='text-red-500 text-xs mt-1'>{errors[field]}</p>}
                </div>
            ))}

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

            <div className='flex flex-wrap gap-4 w-full'>
                {[
                    { field: 'bedrooms', label: 'Bedrooms' },
                    { field: 'bathrooms', label: 'Bathrooms' },
                    { field: 'guests', label: 'Guests' },
                    { field: 'price', label: 'Price per Night' },
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
                </select>
            </div>

            <div className='flex flex-wrap gap-4 w-full'>
                {[
                    { field: 'weeklyDiscount', label: 'Weekly Discount (%)' },
                    { field: 'cleaningFee', label: 'Cleaning Fee' },
                    { field: 'serviceFee', label: 'Service Fee' },
                    { field: 'occupancyTaxes', label: 'Occupancy Taxes' },
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

            <button type='submit' className='px-8 py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#e0314f]'>
                Create Listing
            </button>
        </form>
    );
};

export default CreateListing;
