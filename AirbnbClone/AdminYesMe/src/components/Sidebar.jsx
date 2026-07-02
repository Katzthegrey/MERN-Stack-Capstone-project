import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
    return (
        <div className='w-[18%] min-h-screen border-r-2'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
                <NavLink
                    className={({ isActive }) =>
                        `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${isActive ? 'bg-gray-100' : ''}`
                    }
                    to="/create"
                >
                    <img className='w-5 h-5' src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>Create Listing</p>
                </NavLink>

                <NavLink
                    className={({ isActive }) =>
                        `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${isActive ? 'bg-gray-100' : ''}`
                    }
                    to="/list"
                >
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>View Listings</p>
                </NavLink>

                <NavLink
                    className={({ isActive }) =>
                        `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${isActive ? 'bg-gray-100' : ''}`
                    }
                    to="/reservations"
                >
                    <i className="fas fa-calendar-check w-5 h-5 flex items-center justify-center text-gray-600"></i>
                    <p className='hidden md:block'>Reservations</p>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;