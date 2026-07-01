import { useState, useEffect } from 'react';
import useGeolocation from './useGeolocation';

const useNearbyAccommodations = (accommodations, radius = 50, limit = 10) => {
    const { location, isLoading: isLoadingLocation, permissionDenied, retry } = useGeolocation();
    const [nearby, setNearby] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // Filter accommodations by distance
    const filterNearby = (userLat, userLng) => {
        if (!accommodations || accommodations.length === 0) {
            setNearby([]);
            return;
        }

        setIsLoading(true);

        try {
            const filtered = accommodations
                .filter(acc => {
                    const coords = acc.locationDetails?.coordinates;
                    if (!coords || !coords.lat || !coords.lng) return false;
                    
                    const distance = calculateDistance(
                        userLat, 
                        userLng, 
                        coords.lat, 
                        coords.lng
                    );
                    
                    // Optionally attach distance to the accommodation object
                    acc._distance = Math.round(distance * 10) / 10; // 1 decimal place
                    
                    return distance <= radius;
                })
                .sort((a, b) => (a._distance || 999) - (b._distance || 999))
                .slice(0, limit);

            setNearby(filtered);
            setError(null);
        } catch (err) {
            setError(err.message);
            setNearby([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Effect to filter when location or accommodations change
    useEffect(() => {
        if (location) {
            filterNearby(location.lat, location.lng);
        } else if (!isLoadingLocation && !permissionDenied) {
            // No location and not loading - clear nearby
            setNearby([]);
        }
    }, [location, accommodations, radius, limit]);

    // Effect to handle location changes
    useEffect(() => {
        if (location) {
            filterNearby(location.lat, location.lng);
        }
    }, [location]);

    return {
        nearby,
        isLoading: isLoading || isLoadingLocation,
        permissionDenied,
        error,
        retry,
        location
    };
};

export default useNearbyAccommodations;