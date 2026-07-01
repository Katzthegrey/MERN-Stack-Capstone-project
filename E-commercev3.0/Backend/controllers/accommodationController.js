import { v2 as cloudinary } from "cloudinary";
import Accommodation from "../models/Accommodation.js";

/**
 * Create a new accommodation listing.
 * POST /api/accommodations
 */
const createAccommodation = async (req, res) => {
    try {
        const {
            title, location, description, bedrooms, bathrooms, guests,
            type, price, amenities, weeklyDiscount, cleaningFee,
            serviceFee, occupancyTaxes, host,
            city, province, country, lat, lng
        } = req.body;

        // Handle image uploads
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];
        const image5 = req.files?.image5?.[0];

        const images = [image1, image2, image3, image4, image5].filter(Boolean);

        // Upload images to Cloudinary
        const imageUrls = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        // Build location details
        const locationDetails = {
            city: city || '',
            province: province || '',
            country: country || '',
            coordinates: {
                lat: parseFloat(lat) || 0,
                lng: parseFloat(lng) || 0
            }
        };

        const accommodationData = {
            title,
            location: location || `${city}, ${province}`.trim(),
            locationDetails,
            description,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            guests: Number(guests),
            type,
            price: Number(price),
            amenities: typeof amenities === 'string' ? JSON.parse(amenities) : amenities,
            images: imageUrls,
            weeklyDiscount: Number(weeklyDiscount) || 0,
            cleaningFee: Number(cleaningFee) || 0,
            serviceFee: Number(serviceFee) || 0,
            occupancyTaxes: Number(occupancyTaxes) || 0,
            host: host || '',
            host_id: req.userId || '',
            isGuestFavorite: false,
            date: Date.now(),
        };

        const accommodation = new Accommodation(accommodationData);
        await accommodation.save();

        res.status(201).json({ 
            success: true, 
            message: "Listing created successfully",
            accommodation
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get all accommodation listings with filters.
 * GET /api/accommodations
 */
const getAccommodations = async (req, res) => {
    try {
        const { 
            city, province, country,
            location,
            guests, 
            minPrice, 
            maxPrice, 
            type,
            isGuestFavorite,
            sortBy = 'rating'
        } = req.query;

        // Build filter object
        const filter = {};

        //  Location filters (using structured locationDetails)
        if (city) {
            filter['locationDetails.city'] = { $regex: city, $options: 'i' };
        }
        if (province) {
            filter['locationDetails.province'] = { $regex: province, $options: 'i' };
        }
        if (country) {
            filter['locationDetails.country'] = { $regex: country, $options: 'i' };
        }

        //  General location search (if no specific field provided)
        if (location && !city && !province && !country) {
            filter.$or = [
                { location: { $regex: location, $options: 'i' } },
                { title: { $regex: location, $options: 'i' } }
            ];
        }

        //  Guest capacity filter
        if (guests) {
            filter.guests = { $gte: parseInt(guests) };
        }

        //  Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseInt(minPrice);
            if (maxPrice) filter.price.$lte = parseInt(maxPrice);
        }

        //  Type filter
        if (type) {
            filter.type = type;
        }

        //  Guest favorite filter
        if (isGuestFavorite !== undefined) {
            filter.isGuestFavorite = isGuestFavorite === 'true';
        }

        //  Sort options
        let sortOptions = {};
        switch (sortBy) {
            case 'price-low':
                sortOptions = { price: 1 };
                break;
            case 'price-high':
                sortOptions = { price: -1 };
                break;
            case 'newest':
                sortOptions = { date: -1 };
                break;
            case 'rating':
            default:
                sortOptions = { rating: -1 };
                break;
        }

        const accommodations = await Accommodation.find(filter)
            .sort(sortOptions);

        res.json({ 
            success: true, 
            count: accommodations.length,
            accommodations
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get nearby accommodations based on coordinates.
 * GET /api/accommodations/nearby
 */
const getNearbyAccommodations = async (req, res) => {
    try {
        const { lat, lng, radius = 50, limit = 10 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ 
                success: false, 
                message: "Latitude and longitude are required" 
            });
        }

        // ✅ Using MongoDB's geospatial query
        const accommodations = await Accommodation.find({
            'locationDetails.coordinates': {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius) * 1000 
                }
            }
        }).limit(parseInt(limit));

        res.json({
            success: true,
            count: accommodations.length,
            accommodations
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get a single accommodation by ID.
 * GET /api/accommodations/:id
 */
const getAccommodationById = async (req, res) => {
    try {
        const accommodation = await Accommodation.findById(req.params.id);
        if (!accommodation) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }
        res.json({ success: true, accommodation });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update an accommodation listing.
 * PUT /api/accommodations/:id
 */
const updateAccommodation = async (req, res) => {
    try {
        const {
            title, location, description, bedrooms, bathrooms, guests,
            type, price, amenities, weeklyDiscount, cleaningFee,
            serviceFee, occupancyTaxes, host, isGuestFavorite,
            city, province, country, lat, lng
        } = req.body;

        const accommodation = await Accommodation.findById(req.params.id);
        if (!accommodation) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        // Build update data
        const updateData = {};

        if (title) updateData.title = title;
        if (location) updateData.location = location;
        if (description) updateData.description = description;
        if (bedrooms) updateData.bedrooms = Number(bedrooms);
        if (bathrooms) updateData.bathrooms = Number(bathrooms);
        if (guests) updateData.guests = Number(guests);
        if (type) updateData.type = type;
        if (price) updateData.price = Number(price);
        if (amenities) {
            updateData.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        }
        if (weeklyDiscount !== undefined) updateData.weeklyDiscount = Number(weeklyDiscount);
        if (cleaningFee !== undefined) updateData.cleaningFee = Number(cleaningFee);
        if (serviceFee !== undefined) updateData.serviceFee = Number(serviceFee);
        if (occupancyTaxes !== undefined) updateData.occupancyTaxes = Number(occupancyTaxes);
        if (host) updateData.host = host;
        if (isGuestFavorite !== undefined) {
            updateData.isGuestFavorite = isGuestFavorite === 'true';
        }

        // Update location details if provided
        if (city || province || country || lat || lng) {
            updateData.locationDetails = {
                city: city || accommodation.locationDetails?.city || '',
                province: province || accommodation.locationDetails?.province || '',
                country: country || accommodation.locationDetails?.country || '',
                coordinates: {
                    lat: parseFloat(lat) || accommodation.locationDetails?.coordinates?.lat || 0,
                    lng: parseFloat(lng) || accommodation.locationDetails?.coordinates?.lng || 0
                }
            };
            if (!location && city && province) {
                updateData.location = `${city}, ${province}`.trim();
            }
        }

        // Handle new images if uploaded
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];
        const image5 = req.files?.image5?.[0];

        const newImages = [image1, image2, image3, image4, image5].filter(Boolean);
        if (newImages.length > 0) {
            const imageUrls = await Promise.all(
                newImages.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
            updateData.images = imageUrls;
        }

        const updated = await Accommodation.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({ 
            success: true, 
            message: "Listing updated successfully",
            accommodation: updated 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete an accommodation listing.
 * DELETE /api/accommodations/:id
 */
const deleteAccommodation = async (req, res) => {
    try {
        const accommodation = await Accommodation.findById(req.params.id);
        if (!accommodation) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        await Accommodation.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Listing deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Toggle guest favorite status.
 * PATCH /api/accommodations/:id/favorite
 */
const toggleGuestFavorite = async (req, res) => {
    try {
        const accommodation = await Accommodation.findById(req.params.id);
        if (!accommodation) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        accommodation.isGuestFavorite = !accommodation.isGuestFavorite;
        await accommodation.save();

        res.json({ 
            success: true, 
            message: `Guest favorite ${accommodation.isGuestFavorite ? 'enabled' : 'disabled'}`,
            isGuestFavorite: accommodation.isGuestFavorite
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { 
    createAccommodation, 
    getAccommodations, 
    getNearbyAccommodations,
    getAccommodationById,
    updateAccommodation,
    deleteAccommodation,
    toggleGuestFavorite
};