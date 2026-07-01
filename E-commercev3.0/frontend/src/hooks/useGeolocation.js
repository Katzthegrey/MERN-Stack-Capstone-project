import { useState, useEffect } from 'react';

const useGeolocation = (options = {}) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
        ...options
    };

    useEffect(() => {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            setIsSupported(false);
            setError('Geolocation is not supported by your browser');
            setIsLoading(false);
            setPermissionDenied(true);
            return;
        }

        // Get user's location
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    heading: position.coords.heading,
                    speed: position.coords.speed,
                    timestamp: position.timestamp
                });
                setIsLoading(false);
                setPermissionDenied(false);
                setError(null);
            },
            // Error callback
            (error) => {
                console.warn('Geolocation error:', error.message);
                
                // Handle different error types
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        setPermissionDenied(true);
                        setError('Location access denied. Please enable location services in your browser settings.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setError('Location information is unavailable.');
                        break;
                    case error.TIMEOUT:
                        setError('The request to get your location timed out.');
                        break;
                    default:
                        setError('An unknown error occurred while getting your location.');
                }
                
                setIsLoading(false);
                setLocation(null);
            },
            defaultOptions
        );
    }, []); 

    // Function to manually retry getting location
    const retry = () => {
        setIsLoading(true);
        setError(null);
        setPermissionDenied(false);
        
        if (!navigator.geolocation) {
            setIsSupported(false);
            setError('Geolocation is not supported by your browser');
            setIsLoading(false);
            setPermissionDenied(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
                setIsLoading(false);
                setPermissionDenied(false);
                setError(null);
            },
            (error) => {
                setPermissionDenied(true);
                setError(error.message);
                setIsLoading(false);
            },
            defaultOptions
        );
    };

    return { 
        location, 
        error, 
        isLoading, 
        permissionDenied, 
        isSupported,
        retry 
    };
};

export default useGeolocation;