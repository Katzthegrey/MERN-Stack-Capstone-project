import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accommodation',
        required: true
    },
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    guestName: {
        type: String,
        required: true
    },
    guestEmail: {
        type: String,
        required: true
    },
    guestPhone: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'confirmed'
    },
    accommodationTitle: {
        type: String,
        required: true
    },
    accommodationLocation: {
        type: String,
        required: true
    },
    accommodationImage: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
       review: { type: String, default: '' },
     ratedAt: { type: Date }
}, { timestamps: true });

// Indexes for faster queries
reservationSchema.index({ guestId: 1 });
reservationSchema.index({ hostId: 1 });
reservationSchema.index({ listingId: 1 });
reservationSchema.index({ status: 1 });

const Reservation = mongoose.models.reservation || mongoose.model('reservation', reservationSchema);

export default Reservation;