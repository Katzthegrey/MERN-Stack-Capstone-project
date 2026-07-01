import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import CreateListing from './Pages/CreateListing';
import ViewListings from './Pages/ViewListings';
import Reservations from './Pages/Reservations';
import UpdateListing from './Pages/UpdateListing';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendURL = import.meta.env.VITE_BACKEND_URL;
export const currency = '$';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('username');
        }
    }, [username]);

    return (
        <div className='bg-gray-50 min-h-screen'>
            <ToastContainer />
            {token === '' ? (
                <Login setToken={setToken} setUsername={setUsername} />
            ) : (
                <>
                    <Navbar setToken={setToken} username={username} />
                    <div className='flex w-full'>
                        <Sidebar />
                        <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                            <Routes>
                                <Route path='/create' element={<CreateListing token={token} />} />
                                <Route path='/list' element={<ViewListings token={token} />} />
                                <Route path='/reservations' element={<Reservations token={token} />} />
                                <Route path='/update/:id' element={<UpdateListing token={token} />} />
                                <Route path='*' element={<Navigate to="/list" replace />} />
                            </Routes>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
