import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const AirbnbContext = createContext();

const AirbnbContextProvider = (props) => {
    const currency = 'R';
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [accommodations, setAccommodations] = useState([]);
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const getAccommodationsData = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/accommodations`);
            if (response.data.success) {
                setAccommodations(response.data.accommodations);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

  const createReservation = async (reservationData) => {
    try {
        console.log('Sending reservation data:', reservationData); // Debug log
        
        const response = await axios.post(`${backendURL}/api/reservations`, reservationData, {
            headers: { token }
        });
        
        console.log('Reservation response:', response.data); // Debug log
        
        if (response.data.success) {
            toast.success('Reservation created successfully!');
            return { success: true, data: response.data };
        } else {
            toast.error(response.data.message);
            return { success: false, error: response.data.message };
        }
    } catch (error) {
        console.log('Reservation error:', error.response?.data); // Debug log
        console.log(error);
        toast.error(error.response?.data?.message || error.message);
        return { success: false, error: error.response?.data?.message || error.message };
    }
};

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        setToken('');
        setUsername('');
        setEmail('');
        navigate('/');
    };

    useEffect(() => {
        getAccommodationsData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
        }
        if (!username && localStorage.getItem('username')) {
            setUsername(localStorage.getItem('username'));
        }
        if (!email && localStorage.getItem('email')) {
            setEmail(localStorage.getItem('email'));
        }
    }, []);

    const value = {
        accommodations,
        currency,
        search, setSearch,
        locationFilter, setLocationFilter,
        showSearch, setShowSearch,
        navigate, backendURL,
        setToken, token,
        username, setUsername,
        email, setEmail,
        logout,
        getAccommodationsData,
        createReservation,
    };

    return (
        <AirbnbContext.Provider value={value}>
            {props.children}
        </AirbnbContext.Provider>
    );
};

export default AirbnbContextProvider;
