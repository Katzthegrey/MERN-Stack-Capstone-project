import mongoose from "mongoose";

const accommodationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    locationDetails: {
    city: { type: String, default: '' },  
    province: { type: String, default: '' },
    country: { type: String, default: '' },
    coordinates: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
        }
    },
    description: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    guests: { type: Number, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    amenities: { type: Array, required: true },
    images: { type: Array, required: true },
    weeklyDiscount: { type: Number, default: 0 },
    cleaningFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    occupancyTaxes: { type: Number, default: 0 },
    host: { type: String, default: '' },
    host_id: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    isGuestFavorite: { type: Boolean, default: false },
    date: { type: Number, required: true },
});

// geospatial index for location queries
accommodationSchema.index({ 'locationDetails.coordinates': '2dsphere' });
accommodationSchema.index({ 'locationDetails.city': 1 });
accommodationSchema.index({ price: 1 });
accommodationSchema.index({ rating: -1 });

const Accommodation = mongoose.models.accommodation || mongoose.model("accommodation", accommodationSchema);

export default Accommodation;