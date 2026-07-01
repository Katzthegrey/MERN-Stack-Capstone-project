import { useState, useMemo, useCallback } from 'react';

const useCostCalculator = (listing, currency = 'R') => {
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [guests, setGuests] = useState(1);
    const [dateError, setDateError] = useState('');

    // Get today's date at midnight for comparison
    const getToday = useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }, []);

    // Format date for input min/max
    const formatDateForInput = useCallback((date) => {
        return date.toISOString().split('T')[0];
    }, []);

    // Get minimum date (today)
    const getMinDate = useCallback(() => {
        return formatDateForInput(getToday());
    }, [getToday, formatDateForInput]);

    // Get minimum checkout date (day after checkin or today if no checkin)
    const getMinCheckOut = useCallback(() => {
        if (!checkIn) return getMinDate();
        
        const checkInDate = new Date(checkIn + 'T00:00:00');
        const nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        // If next day is in the past, return today
        const today = getToday();
        return formatDateForInput(nextDay > today ? nextDay : today);
    }, [checkIn, getMinDate, getToday, formatDateForInput]);

    // Validate check-in date
    const validateCheckIn = useCallback((date) => {
        if (!date) return true; // Empty is ok (user hasn't selected yet)
        
        const selectedDate = new Date(date + 'T00:00:00');
        const today = getToday();
        
        if (selectedDate < today) {
            setDateError('Check-in date cannot be in the past');
            return false;
        }
        
        setDateError('');
        return true;
    }, [getToday]);

    // Validate check-out date
    const validateCheckOut = useCallback((date) => {
        if (!date) return true; // Empty is ok
        if (!checkIn) {
            setDateError('Please select a check-in date first');
            return false;
        }
        
        const checkOutDate = new Date(date + 'T00:00:00');
        const checkInDate = new Date(checkIn + 'T00:00:00');
        const today = getToday();
        
        if (checkOutDate < today) {
            setDateError('Check-out date cannot be in the past');
            return false;
        }
        
        if (checkOutDate <= checkInDate) {
            setDateError('Check-out must be after check-in date');
            return false;
        }
        
        setDateError('');
        return true;
    }, [checkIn, getToday]);

    // Safe setter for check-in
    const handleSetCheckIn = useCallback((date) => {
        if (validateCheckIn(date)) {
            setCheckIn(date);
            // Reset checkout if it's now invalid
            if (checkOut) {
                const checkOutDate = new Date(checkOut + 'T00:00:00');
                const checkInDate = new Date(date + 'T00:00:00');
                if (checkOutDate <= checkInDate) {
                    setCheckOut(null);
                }
            }
        }
    }, [validateCheckIn, checkOut]);

    // Safe setter for check-out
    const handleSetCheckOut = useCallback((date) => {
        if (validateCheckOut(date)) {
            setCheckOut(date);
        }
    }, [validateCheckOut]);

    // Calculate number of nights
    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 0;
        const checkInDate = new Date(checkIn + 'T00:00:00');
        const checkOutDate = new Date(checkOut + 'T00:00:00');
        const diffTime = Math.abs(checkOutDate - checkInDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, [checkIn, checkOut]);

    // Calculate costs
    const costs = useMemo(() => {
        if (!listing || nights === 0) {
            return {
                subtotal: 0,
                cleaningFee: 0,
                serviceFee: 0,
                weeklyDiscount: 0,
                occupancyTaxes: 0,
                total: 0,
                nights: 0
            };
        }

        const subtotal = listing.price * nights;
        
        // Weekly discount 
        const weeklyDiscount = nights >= 7 
            ? Math.round(subtotal * (listing.weeklyDiscount / 100)) 
            : 0;
        
        // Service fee 
        const serviceFee = listing.serviceFee || Math.round(subtotal * 0.12);
        
        // Cleaning fee 
        const cleaningFee = listing.cleaningFee || 0;
        
        // Occupancy taxes 
        const occupancyTaxes = listing.occupancyTaxes || Math.round(subtotal * 0.05);
        
        const total = subtotal - weeklyDiscount + serviceFee + cleaningFee + occupancyTaxes;

        return {
            subtotal,
            cleaningFee,
            serviceFee,
            weeklyDiscount,
            occupancyTaxes,
            total,
            nights
        };
    }, [listing, nights]);

    // Format currency
    const formatCurrency = (amount) => {
        return `${currency}${amount.toLocaleString()}`;
    };

    // Reset dates
    const resetDates = () => {
        setCheckIn(null);
        setCheckOut(null);
        setGuests(1);
        setDateError('');
    };

    // Check if dates are valid for reservation
    const isReservationValid = useMemo(() => {
        return checkIn && checkOut && nights > 0 && !dateError;
    }, [checkIn, checkOut, nights, dateError]);

    return {
        checkIn,
        setCheckIn: handleSetCheckIn,
        checkOut,
        setCheckOut: handleSetCheckOut,
        guests,
        setGuests,
        costs,
        nights,
        getMinDate,
        getMinCheckOut,
        formatCurrency,
        resetDates,
        dateError,
        isReservationValid
    };
};

export default useCostCalculator;