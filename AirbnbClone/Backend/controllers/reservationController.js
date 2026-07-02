import Reservation from "../models/Reservation.js";
import Accommodation from "../models/Accommodation.js";

/**
 * Create a new reservation.
 * POST /api/reservations
 */
const createReservation = async (req, res) => {
    try {
        const {
            listingId,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            guestName,
            guestEmail,
            guestPhone
        } = req.body;

        // Validation
        if (!listingId || !checkIn || !checkOut || !guests || !totalPrice || !guestName || !guestEmail) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        // Verify accommodation exists
        const accommodation = await Accommodation.findById(listingId);
        if (!accommodation) {
            return res.status(404).json({
                success: false,
                message: "Accommodation not found"
            });
        }

        // Check if dates are valid
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (checkInDate >= checkOutDate) {
            return res.status(400).json({
                success: false,
                message: "Check-in date must be before check-out date"
            });
        }

        if (checkInDate < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Check-in date cannot be in the past"
            });
        }

        // Check if guest count exceeds accommodation capacity
        if (guests > accommodation.guests) {
            return res.status(400).json({
                success: false,
                message: `Maximum guests allowed is ${accommodation.guests}`
            });
        }

        const reservationData = {
            listingId,
            guestId: req.userId,
            hostId: accommodation.host_id || '',
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: Number(guests),
            totalPrice: Number(totalPrice),
            guestName,
            guestEmail,
            guestPhone: guestPhone || '',
            status: 'confirmed',
            accommodationTitle: accommodation.title,
            accommodationLocation: accommodation.location,
            accommodationImage: accommodation.images?.[0] || ''
        };

        const reservation = new Reservation(reservationData);
        await reservation.save();

        res.status(201).json({
            success: true,
            message: "Reservation created successfully",
            reservation
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get reservations by host.
 * GET /api/reservations/host
 */
const getReservationsByHost = async (req, res) => {
    try {
        const reservations = await Reservation.find({ hostId: req.userId })
            .populate('listingId', 'title location images price')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reservations.length,
            reservations
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get reservations by user (guest).
 * GET /api/reservations/user
 */
const getReservationsByUser = async (req, res) => {
    try {
        const reservations = await Reservation.find({ guestId: req.userId })
            .populate('listingId', 'title location images price')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reservations.length,
            reservations
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get a single reservation by ID.
 * GET /api/reservations/:id
 */
const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('listingId', 'title location images price host host_id')
            .populate('guestId', 'username email');

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        // Check if user is authorized (guest or host)
        if (reservation.guestId._id.toString() !== req.userId && 
            reservation.hostId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this reservation"
            });
        }

        res.json({
            success: true,
            reservation
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update reservation status.
 * PATCH /api/reservations/:id/status
 */
const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        // Only host can update status
        if (reservation.hostId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "Only the host can update reservation status"
            });
        }

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be: pending, confirmed, completed, or cancelled"
            });
        }

        reservation.status = status;
        await reservation.save();

        res.json({
            success: true,
            message: `Reservation ${status} successfully`,
            reservation
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete a reservation.
 * DELETE /api/reservations/:id
 */
const deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        // Check if user is authorized (guest or host)
        if (reservation.guestId.toString() !== req.userId && 
            reservation.hostId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this reservation"
            });
        }

        await Reservation.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Reservation deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Complete a reservation (guest checkout).
 * PATCH /api/reservations/:id/complete
 */
const completeReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        if (reservation.guestId.toString() !== req.userId &&
            reservation.hostId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        if (reservation.status !== 'confirmed') {
            return res.status(400).json({
                success: false,
                message: `Cannot complete a ${reservation.status} reservation`
            });
        }

        reservation.status = 'completed';
        await reservation.save();

        res.json({
            success: true,
            message: "Reservation completed successfully",
            reservation
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Cancel a reservation.
 * PATCH /api/reservations/:id/cancel
 */
const cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        if (reservation.guestId.toString() !== req.userId && 
            reservation.hostId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        if (reservation.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel a completed reservation"
            });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        res.json({
            success: true,
            message: "Reservation cancelled successfully",
            reservation
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get all reservations (for admin).
 * GET /api/reservations/all
 */
const getAllReservations = async (req, res) => {
    try {
        const { status } = req.query;
        
        let query = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        
        // If user is host, only show their listings' reservations
        // If user is admin (or we want to show all), don't filter by hostId
        if (req.user.role === 'host') {
            query.hostId = req.userId;
        }
        

        const reservations = await Reservation.find(query)
            .populate('listingId', 'title location images price')
            .populate('guestId', 'username email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reservations.length,
            reservations
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
export {
    createReservation,
    getReservationsByHost,
    getReservationsByUser,
    getReservationById,
    updateReservationStatus,
    deleteReservation,
    completeReservation,
    cancelReservation,
    getAllReservations
};