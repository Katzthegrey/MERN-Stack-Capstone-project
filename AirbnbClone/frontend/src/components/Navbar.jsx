import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AirbnbContext } from '../context/AirbnbContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hamburgerDropdownOpen, setHamburgerDropdownOpen] = useState(false);
    const [hotelDropdownOpen, setHotelDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('places');

    // Search state
    const [selectedProvince, setSelectedProvince] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [provinceDropdownOpen, setProvinceDropdownOpen] = useState(false);
    const [checkInDropdownOpen, setCheckInDropdownOpen] = useState(false);
    const [checkOutDropdownOpen, setCheckOutDropdownOpen] = useState(false);
    const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);

    const { accommodations, setShowSearch, navigate, token, username, logout, locationFilter, setLocationFilter } = useContext(AirbnbContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const location = useLocation();
    const routerNavigate = useNavigate();
    
    const isDark = theme === 'dark';

    // Admin panel URL
    const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

    // Refs for click-outside detection
    const dropdownRef = useRef(null);
    const hamburgerRef = useRef(null);
    const hotelDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const provinceRef = useRef(null);
    const checkInRef = useRef(null);
    const checkOutRef = useRef(null);
    const guestsRef = useRef(null);
    const searchBarRef = useRef(null);

    const PROVINCES = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Mpumalanga', 'Limpopo', 'North-West', 'Free State', 'Northern Cape'];

    // Get first letter of username for avatar
    const getInitial = () => {
        if (username) {
            return username.charAt(0).toUpperCase();
        }
        return null;
    };

    // Get today's date for min attribute
    const getToday = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get min checkout date
    const getMinCheckOut = () => {
        if (!checkIn) return getToday();
        const nextDay = new Date(checkIn);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay.toISOString().split('T')[0];
    };

    // Check if all search fields are filled
    const isSearchReady = selectedProvince && checkIn && checkOut && guests > 0;

    // Handle search
    const handleSearch = () => {
        if (!isSearchReady) return;
        
        // Close all dropdowns
        setProvinceDropdownOpen(false);
        setCheckInDropdownOpen(false);
        setCheckOutDropdownOpen(false);
        setGuestsDropdownOpen(false);
        
        // Navigate to locations with search params
        routerNavigate(`/locations/${encodeURIComponent(selectedProvince)}?guests=${guests}&checkIn=${checkIn}&checkOut=${checkOut}`);
    };

    // Update active tab based on current path
    useEffect(() => {
        if (location.pathname.includes('/experiences')) {
            setActiveTab('experiences');
        } else if (location.pathname.includes('/online-experiences')) {
            setActiveTab('online');
        } else {
            setActiveTab('places');
        }
    }, [location.pathname]);

    // Click outside handler for all dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (hamburgerRef.current && !hamburgerRef.current.contains(event.target)) {
                setHamburgerDropdownOpen(false);
            }
            if (hotelDropdownRef.current && !hotelDropdownRef.current.contains(event.target)) {
                setHotelDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setVisible(false);
            }
            if (provinceRef.current && !provinceRef.current.contains(event.target)) {
                setProvinceDropdownOpen(false);
            }
            if (checkInRef.current && !checkInRef.current.contains(event.target)) {
                setCheckInDropdownOpen(false);
            }
            if (checkOutRef.current && !checkOutRef.current.contains(event.target)) {
                setCheckOutDropdownOpen(false);
            }
            if (guestsRef.current && !guestsRef.current.contains(event.target)) {
                setGuestsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close dropdowns on Escape key press
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setDropdownOpen(false);
                setHamburgerDropdownOpen(false);
                setHotelDropdownOpen(false);
                setVisible(false);
                setProvinceDropdownOpen(false);
                setCheckInDropdownOpen(false);
                setCheckOutDropdownOpen(false);
                setGuestsDropdownOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    // Prevent scroll when mobile menu is open
    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [visible]);

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 flex flex-col py-3 font-medium border-b transition-colors duration-300 ${
            isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}>
            <div className='flex items-center justify-between px-4'>
                {/* Logo */}
                <Link to={'/'}>
                    <img src={assets.logo} className='w-28 md:w-32' alt="Airbnb" />
                </Link>

                {/* Navigation Links */}
                <div className='hidden md:flex items-center gap-6'>
                    <Link 
                        to={'/'} 
                        onClick={() => setActiveTab('places')}
                        className={`relative text-sm font-medium pb-1 transition ${
                            activeTab === 'places' 
                                ? isDark ? 'text-white' : 'text-gray-900'
                                : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Places to stay
                        {activeTab === 'places' && (
                            <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF385C] rounded-full'></span>
                        )}
                    </Link>
                    <Link 
                        to={'/experiences'} 
                        onClick={() => setActiveTab('experiences')}
                        className={`relative text-sm font-medium pb-1 transition ${
                            activeTab === 'experiences' 
                                ? isDark ? 'text-white' : 'text-gray-900'
                                : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Experiences
                        {activeTab === 'experiences' && (
                            <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF385C] rounded-full'></span>
                        )}
                    </Link>
                </div>

                {/* Right section */}
                <div className='flex items-center gap-3'>
                    <a 
                        href={`${ADMIN_URL}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hidden sm:block text-sm px-3 py-1.5 rounded-full transition ${
                            isDark ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100'
                        }`}
                    >
                        Become a host
                    </a>

                    {/* Hamburger Dropdown */}
                    <div className='relative' ref={hamburgerRef}>
                        <button
                            onClick={() => setHamburgerDropdownOpen(!hamburgerDropdownOpen)}
                            className={`flex items-center justify-center w-9 h-9 rounded-full border transition ${
                                isDark 
                                    ? 'border-gray-600 hover:bg-gray-800' 
                                    : 'border-gray-300 hover:bg-gray-100'
                            }`}
                            aria-label="Menu"
                        >
                            <i className={`fas fa-bars text-sm ${isDark ? 'text-white' : 'text-gray-700'}`}></i>
                        </button>

                        {hamburgerDropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-56 border rounded-lg shadow-lg z-20 ${
                                isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'
                            }`}>
                                <button
                                    onClick={() => { toggleTheme(); setHamburgerDropdownOpen(false); }}
                                    className={`block w-full text-left px-4 py-3 text-sm transition rounded-t-lg ${
                                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} mr-3 w-5`}></i>
                                    {isDark ? 'Light Mode' : 'Dark Mode'}
                                </button>
                                
                                <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <Link to="/" onClick={() => setHamburgerDropdownOpen(false)}
                                        className={`block w-full text-left px-4 py-3 text-sm transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                        <i className="fas fa-home mr-3 w-5"></i>Home
                                    </Link>
                                    <Link to="/locations" onClick={() => setHamburgerDropdownOpen(false)}
                                        className={`block w-full text-left px-4 py-3 text-sm transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                        <i className="fas fa-map-marker-alt mr-3 w-5"></i>Locations
                                    </Link>
                                    <a href={`${ADMIN_URL}`} target="_blank" rel="noopener noreferrer" onClick={() => setHamburgerDropdownOpen(false)}
                                        className={`block w-full text-left px-4 py-3 text-sm transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                        <i className="fas fa-home mr-3 w-5"></i>Become a host
                                    </a>
                                    {token && (
                                        <Link to="/reservations" onClick={() => setHamburgerDropdownOpen(false)}
                                            className={`block w-full text-left px-4 py-3 text-sm transition border-t ${isDark ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-200'}`}>
                                            <i className="fas fa-calendar-check mr-3 w-5"></i>Reservations
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className='relative' ref={dropdownRef}>
                        <button
                            onClick={() => token ? setDropdownOpen(!dropdownOpen) : navigate('/login')}
                            className={`flex items-center gap-2 border rounded-full px-2 py-1.5 hover:shadow-md transition ${
                                isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300'
                            }`}
                        >
                            <i className={`fas fa-bars text-xs ${isDark ? 'text-white' : 'text-gray-700'}`}></i>
                            
                            {/* User Avatar - shows initial when logged in, icon when not */}
                            {token && username ? (
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                                    isDark ? 'bg-gray-600 text-white' : 'bg-gray-800 text-white'
                                }`}>
                                    {getInitial()}
                                </div>
                            ) : (
                                <img className='w-7 h-7' src={assets.profile_icon} alt="Profile" />
                            )}
                        </button>

                        {token && dropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-48 border rounded-lg shadow-lg z-20 ${
                                isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'
                            }`}>
                                {username && (
                                    <p className={`px-4 py-2 text-sm font-medium border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                        Hello, {username}
                                    </p>
                                )}
                                <button onClick={() => { navigate('/reservations'); setDropdownOpen(false); }}
                                    className={`block w-full text-left px-4 py-3 text-sm transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                    <i className="fas fa-calendar-check mr-3 w-5"></i>View Reservations
                                </button>
                                <button onClick={() => { logout(); setDropdownOpen(false); }}
                                    className={`block w-full text-left px-4 py-3 text-sm transition border-t ${isDark ? 'hover:bg-gray-700 border-gray-700 text-red-400' : 'hover:bg-gray-50 border-gray-200 text-red-600'}`}>
                                    <i className="fas fa-sign-out-alt mr-3 w-5"></i>Logout
                                </button>
                            </div>
                        )}
                    </div>

                    <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer md:hidden' alt="" />
                </div>
            </div>

            {/* SEARCH FILTER BAR */}
            <div className='flex items-center justify-center mt-2' ref={searchBarRef}>
                <div className={`flex items-center border rounded-full shadow-sm hover:shadow-md transition ${
                    isDark ? 'border-gray-600' : 'border-gray-300'
                }`}>
                    
                    {/* Where - Province Dropdown */}
                    <div className='relative' ref={provinceRef}>
                        <button
                            onClick={() => {
                                setProvinceDropdownOpen(!provinceDropdownOpen);
                                setCheckInDropdownOpen(false);
                                setCheckOutDropdownOpen(false);
                                setGuestsDropdownOpen(false);
                            }}
                            className={`flex flex-col items-start px-4 py-2 rounded-l-full min-w-[120px] transition ${
                                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                            }`}
                        >
                            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Where</span>
                            <span className={`text-sm ${selectedProvince ? (isDark ? 'text-white font-medium' : 'text-gray-900 font-medium') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
                                {selectedProvince || 'Select province'}
                            </span>
                        </button>
                        
                        {provinceDropdownOpen && (
                            <div className={`absolute top-full left-0 mt-2 w-56 border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto ${
                                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                                <div className='p-2'>
                                    <button 
                                        onClick={() => { setSelectedProvince(''); setProvinceDropdownOpen(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm rounded-md transition mb-1 ${
                                            !selectedProvince ? (isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900') 
                                            : (isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50')
                                        }`}
                                    >
                                        Anywhere
                                    </button>
                                    {PROVINCES.map((province) => (
                                        <button 
                                            key={province}
                                            onClick={() => { setSelectedProvince(province); setProvinceDropdownOpen(false); }}
                                            className={`block w-full text-left px-4 py-2 text-sm rounded-md transition ${
                                                selectedProvince === province 
                                                    ? (isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900')
                                                    : (isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50')
                                            }`}
                                        >
                                            📍 {province}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`w-px h-6 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

                    {/* Check-in */}
                    <div className='relative' ref={checkInRef}>
                        <button
                            onClick={() => {
                                setCheckInDropdownOpen(!checkInDropdownOpen);
                                setProvinceDropdownOpen(false);
                                setCheckOutDropdownOpen(false);
                                setGuestsDropdownOpen(false);
                            }}
                            className={`flex flex-col items-start px-4 py-2 min-w-[110px] transition ${
                                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                            }`}
                        >
                            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Check in</span>
                            <span className={`text-sm ${checkIn ? (isDark ? 'text-white font-medium' : 'text-gray-900 font-medium') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
                                {checkIn || 'Add dates'}
                            </span>
                        </button>
                        
                        {checkInDropdownOpen && (
                            <div className={`absolute top-full left-0 mt-2 border rounded-lg shadow-lg z-20 p-3 ${
                                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                                <input
                                    type="date"
                                    value={checkIn}
                                    min={getToday()}
                                    onChange={(e) => {
                                        setCheckIn(e.target.value);
                                        setCheckInDropdownOpen(false);
                                        if (checkOut && new Date(checkOut) <= new Date(e.target.value)) {
                                            setCheckOut('');
                                        }
                                    }}
                                    className={`border rounded-lg px-3 py-2 text-sm w-full ${
                                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                    }`}
                                />
                            </div>
                        )}
                    </div>

                    <div className={`w-px h-6 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

                    {/* Check-out */}
                    <div className='relative' ref={checkOutRef}>
                        <button
                            onClick={() => {
                                setCheckOutDropdownOpen(!checkOutDropdownOpen);
                                setProvinceDropdownOpen(false);
                                setCheckInDropdownOpen(false);
                                setGuestsDropdownOpen(false);
                            }}
                            className={`flex flex-col items-start px-4 py-2 min-w-[110px] transition ${
                                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                            }`}
                        >
                            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Check out</span>
                            <span className={`text-sm ${checkOut ? (isDark ? 'text-white font-medium' : 'text-gray-900 font-medium') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
                                {checkOut || 'Add dates'}
                            </span>
                        </button>
                        
                        {checkOutDropdownOpen && (
                            <div className={`absolute top-full left-0 mt-2 border rounded-lg shadow-lg z-20 p-3 ${
                                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                                <input
                                    type="date"
                                    value={checkOut}
                                    min={getMinCheckOut()}
                                    disabled={!checkIn}
                                    onChange={(e) => {
                                        setCheckOut(e.target.value);
                                        setCheckOutDropdownOpen(false);
                                    }}
                                    className={`border rounded-lg px-3 py-2 text-sm w-full disabled:opacity-50 ${
                                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                    }`}
                                />
                            </div>
                        )}
                    </div>

                    <div className={`w-px h-6 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

                    {/* Guests + Search */}
                    <div className='relative flex items-center' ref={guestsRef}>
                        <button
                            onClick={() => {
                                setGuestsDropdownOpen(!guestsDropdownOpen);
                                setProvinceDropdownOpen(false);
                                setCheckInDropdownOpen(false);
                                setCheckOutDropdownOpen(false);
                            }}
                            className={`flex flex-col items-start px-4 py-2 min-w-[100px] transition ${
                                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                            }`}
                        >
                            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Who</span>
                            <span className={`text-sm ${guests > 1 ? (isDark ? 'text-white font-medium' : 'text-gray-900 font-medium') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
                                {guests > 1 ? `${guests} guests` : 'Add guests'}
                            </span>
                        </button>
                        
                        <button
                            onClick={handleSearch}
                            disabled={!isSearchReady}
                            className={`p-2 rounded-full mr-1 transition ${
                                isSearchReady 
                                    ? 'bg-[#FF385C] text-white hover:bg-[#e0314f]' 
                                    : (isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed')
                            }`}
                        >
                            <i className="fas fa-search text-sm"></i>
                        </button>
                        
                        {guestsDropdownOpen && (
                            <div className={`absolute top-full right-0 mt-2 border rounded-lg shadow-lg z-20 p-3 w-56 ${
                                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                                <div className='flex items-center justify-between'>
                                    <button
                                        onClick={() => setGuests(Math.max(1, guests - 1))}
                                        className={`w-8 h-8 rounded-full border flex items-center justify-center text-lg transition ${
                                            isDark ? 'border-gray-600 hover:bg-gray-700 text-white' : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        −
                                    </button>
                                    <span className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {guests}
                                    </span>
                                    <button
                                        onClick={() => setGuests(Math.min(16, guests + 1))}
                                        className={`w-8 h-8 rounded-full border flex items-center justify-center text-lg transition ${
                                            isDark ? 'border-gray-600 hover:bg-gray-700 text-white' : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => setGuestsDropdownOpen(false)}
                                    className={`w-full mt-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                        isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div 
                ref={mobileMenuRef}
                className={`fixed top-0 right-0 h-full w-full max-w-sm overflow-hidden transition-transform duration-300 z-40 ${
                    visible ? 'translate-x-0' : 'translate-x-full'
                } ${isDark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-600'}`}
            >
                <div className='flex flex-col h-full overflow-y-auto'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-4 cursor-pointer border-b'>
                        <i className={`fas fa-arrow-left ${isDark ? 'text-gray-400' : 'text-gray-600'}`}></i>
                        <p>Back</p>
                    </div>
                    
                    <button onClick={() => { toggleTheme(); setVisible(false); }} 
                        className={`py-3 pl-6 border-b text-left flex items-center gap-3 ${isDark ? 'border-gray-700' : ''}`}>
                        <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    
                    <Link onClick={() => setVisible(false)} className={`py-3 pl-6 border-b ${isDark ? 'border-gray-700' : ''}`} to='/'>
                        <i className="fas fa-home mr-3"></i>Home
                    </Link>
                    <Link onClick={() => setVisible(false)} className={`py-3 pl-6 border-b ${isDark ? 'border-gray-700' : ''}`} to='/locations'>
                        <i className="fas fa-map-marker-alt mr-3"></i>Locations
                    </Link>
                    
                    <a href={`${ADMIN_URL}`} target="_blank" rel="noopener noreferrer" onClick={() => setVisible(false)} 
                        className={`py-3 pl-6 border-b flex items-center gap-3 ${isDark ? 'border-gray-700' : ''}`}>
                        <i className="fas fa-home mr-3"></i>Become a host
                    </a>
                    
                    {token && (
                        <>
                            <Link onClick={() => setVisible(false)} className={`py-3 pl-6 border-b ${isDark ? 'border-gray-700' : ''}`} to='/reservations'>
                                <i className="fas fa-calendar-check mr-3"></i>Reservations
                            </Link>
                            <button onClick={() => { logout(); setVisible(false); }} className={`py-3 pl-6 border-b text-left ${isDark ? 'border-gray-700' : ''}`}>
                                <i className="fas fa-sign-out-alt mr-3"></i>Logout
                            </button>
                        </>
                    )}
                </div>
            </div>

            {visible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setVisible(false)} />
            )}
        </div>
    );
};

export default Navbar;