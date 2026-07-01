import React from 'react';

const CostBreakdown = ({ costs, formatCurrency, listing }) => {
    if (!listing || costs.nights === 0) return null;

    return (
        <div className="space-y-3 mt-4">
            <div className="flex justify-between text-gray-600">
                <span>
                    {formatCurrency(listing.price)} x {costs.nights} night{costs.nights > 1 ? 's' : ''}
                </span>
                <span>{formatCurrency(costs.subtotal)}</span>
            </div>
            
            {costs.weeklyDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                    <span>Weekly discount ({listing.weeklyDiscount}%)</span>
                    <span>-{formatCurrency(costs.weeklyDiscount)}</span>
                </div>
            )}
            
            {costs.cleaningFee > 0 && (
                <div className="flex justify-between text-gray-600">
                    <span>Cleaning fee</span>
                    <span>{formatCurrency(costs.cleaningFee)}</span>
                </div>
            )}
            
            {costs.serviceFee > 0 && (
                <div className="flex justify-between text-gray-600">
                    <span>Service fee</span>
                    <span>{formatCurrency(costs.serviceFee)}</span>
                </div>
            )}
            
            {costs.occupancyTaxes > 0 && (
                <div className="flex justify-between text-gray-600">
                    <span>Occupancy taxes & fees</span>
                    <span>{formatCurrency(costs.occupancyTaxes)}</span>
                </div>
            )}
            
            <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(costs.total)}</span>
                </div>
            </div>
        </div>
    );
};

export default CostBreakdown;