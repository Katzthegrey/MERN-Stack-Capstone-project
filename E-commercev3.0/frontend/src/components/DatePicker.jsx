import React from 'react';

const DatePicker = ({ 
    checkIn, 
    setCheckIn, 
    checkOut, 
    setCheckOut, 
    guests, 
    setGuests,
    getMinDate,
    getMinCheckOut,
    maxGuests = 1,
    dateError
}) => {
    return (
        <div className="border rounded-lg overflow-hidden">
            {/* Check-in */}
            <div className="grid grid-cols-2 border-b">
                <div className="p-3 border-r relative">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        CHECK-IN
                    </label>
                    <input
                        type="date"
                        value={checkIn || ''}
                        min={getMinDate()}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-sm text-gray-700 focus:outline-none cursor-pointer"
                    />
                </div>
                
                {/* Check-out */}
                <div className="p-3 relative">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        CHECKOUT
                    </label>
                    <input
                        type="date"
                        value={checkOut || ''}
                        min={getMinCheckOut()}
                        disabled={!checkIn}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-sm text-gray-700 focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                    />
                </div>
            </div>
            
            {/* Guests */}
            <div className="p-3 border-b">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                    GUESTS
                </label>
                <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-sm text-gray-700 focus:outline-none cursor-pointer"
                >
                    {[...Array(maxGuests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1} guest{i > 0 ? 's' : ''}
                        </option>
                    ))}
                </select>
            </div>

            {/* Error message */}
            {dateError && (
                <div className="p-3 bg-red-50 border-t border-red-100">
                    <p className="text-xs text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {dateError}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DatePicker;