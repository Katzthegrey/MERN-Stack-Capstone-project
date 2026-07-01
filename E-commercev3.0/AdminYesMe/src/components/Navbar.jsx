import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Navbar = ({ setToken, username }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('username');
    };

    return (
        <div className='flex items-center py-3 px-[4%] justify-between border-b'>
            <Link to="/list">
                <img className='w-[max(10%,80px)]' src={assets.logo} alt="Airbnb" />
            </Link>

            <div className='flex items-center gap-4'>
                <span className='text-sm text-gray-700 hidden sm:block'>
                    Hello, <strong>{username}</strong>
                </span>

                <div className='relative'>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className='flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:shadow-md transition text-sm'
                    >
                        ☰
                    </button>

                    {dropdownOpen && (
                        <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
                            <Link
                                to="/reservations"
                                onClick={() => setDropdownOpen(false)}
                                className='block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50'
                            >
                                View Reservations
                            </Link>
                            <button
                                onClick={handleLogout}
                                className='block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t'
                            >
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
