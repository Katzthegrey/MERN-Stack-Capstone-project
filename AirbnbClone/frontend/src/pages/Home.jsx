import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AirbnbContext } from '../context/AirbnbContext';
import Hero from '../components/Hero';
import LocationInspiration from '../components/LocationInspiration';

const Home = () => {
    const { navigate } = useContext(AirbnbContext);
    const [activeTab, setActiveTab] = useState('Destinations');

    const TABS = ['Destinations', 'Beach', 'Mountains', 'Countryside', 'Amazing pools', 'Islands', 'Cabins'];

    const destinations = [
        { 
            name: 'Cape Town', 
            province: 'Western Cape',
            distance: '1,400 km away', 
            image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=300&fit=crop'
        },
        { 
            name: 'Durban', 
            province: 'KwaZulu-Natal',
            distance: '560 km away', 
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDF3NCr4_D6pGBlZgLv1KRwdaaP40EVk9hXMJrW0B5ag&s=10'
        },
        { 
            name: 'Johannesburg', 
            province: 'Gauteng',
            distance: '50 km away', 
            image: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=400&h=300&fit=crop'
        },
        { 
            name: 'Kruger Park', 
            province: 'Mpumalanga',
            distance: '400 km away', 
            image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&h=300&fit=crop'
        },
        { 
            name: 'Drakensberg', 
            province: 'KwaZulu-Natal',
            distance: '300 km away', 
            image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop'
        },
        { 
            name: 'Garden Route', 
            province: 'Western Cape',
            distance: '1,000 km away', 
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcshLYTzJVkWVjR8IYd_oUmPRhPFt629SH8KL-zP8b8w&s'
        },
        { 
            name: 'Sun City', 
            province: 'North-West',
            distance: '180 km away', 
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop'
        },
        { 
            name: 'Clarens', 
            province: 'Free State',
            distance: '300 km away', 
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
        },
    ];

    // Filter destinations by active tab
    const filteredDestinations = activeTab === 'Destinations' 
        ? destinations 
        : destinations.filter(d => {
            if (activeTab === 'Beach') return ['Cape Town', 'Durban'].includes(d.name);
            if (activeTab === 'Mountains') return ['Drakensberg', 'Clarens'].includes(d.name);
            if (activeTab === 'Countryside') return ['Garden Route', 'Kruger Park'].includes(d.name);
            if (activeTab === 'Amazing pools') return ['Sun City', 'Durban'].includes(d.name);
            if (activeTab === 'Islands') return ['Cape Town'].includes(d.name);
            if (activeTab === 'Cabins') return ['Drakensberg', 'Clarens', 'Garden Route'].includes(d.name);
            return false;
        });

    return (
        <div>
            <Hero />
            
            {/* Location Inspiration (existing) */}
            <LocationInspiration />

            {/* Discover Airbnb Experiences */}
            <div className='py-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50'>
                <h2 className='text-2xl font-semibold mb-6'>Discover Airbnb Experiences</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div 
                        onClick={() => navigate('/experiences')}
                        className='relative rounded-xl overflow-hidden h-80 cursor-pointer group'
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                            alt="Things to do"
                            className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300'
                        />
                        <div className='absolute inset-0 bg-gradient-to-b from-black/20 to-black/60'></div>
                        <div className='absolute bottom-0 left-0 p-6 text-white'>
                            <h3 className='text-2xl font-semibold mb-2'>Things to do on your trip</h3>
                            <button className='bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition'>
                                Experiences
                            </button>
                        </div>
                    </div>
                   
                </div>
            </div>

            {/* Shop Airbnb Section */}
            <div className='py-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
                    <div>
                        <h2 className='text-3xl font-semibold mb-2'>Shop Airbnb</h2>
                        <h3 className='text-3xl font-semibold mb-4'>gift cards</h3>
                        <button className='bg-gray-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition'>
                            Learn more
                        </button>
                    </div>
                    <div className='bg-gradient-to-br from-rose-400 to-pink-600 rounded-xl h-64 flex items-center justify-center'>
                        <span className='text-8xl'>🎁</span>
                    </div>
                </div>
            </div>

            {/* Inspiration for Future Getaways */}
            <div className='py-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
                <h2 className='text-2xl font-semibold mb-6'>Inspiration for your next trip</h2>
                
                {/* Tabs */}
                <div className='flex gap-4 mb-8 border-b overflow-x-auto scrollbar-hide'>
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                                activeTab === tab 
                                    ? 'border-gray-900 text-gray-900' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Destinations Grid */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
                    {filteredDestinations.map((dest) => (
                        <Link
                            key={dest.name}
                            to={`/locations/${encodeURIComponent(dest.province)}`}
                            className='group'
                        >
                            <div className='rounded-xl h-40 overflow-hidden mb-2 group-hover:shadow-lg transition'>
                                <img 
                                    src={dest.image} 
                                    alt={dest.name}
                                    className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                                />
                            </div>
                            <p className='font-medium text-sm'>{dest.name}</p>
                            <p className='text-sm text-gray-500'>{dest.distance}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;