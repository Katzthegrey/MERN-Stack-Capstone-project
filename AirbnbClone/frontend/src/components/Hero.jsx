import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Hero = () => {
    return (
        <div className='relative rounded-2xl overflow-hidden my-6'>
            <img className='w-full h-[400px] object-cover' src={assets.hero_img} alt="Hero" />
            <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
                <div className='text-center text-white'>
                    <h1 className='text-4xl md:text-5xl font-semibold mb-4'>Not sure where to go? Perfect.</h1>
                    <Link
                        to='/locations'
                        className='inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:shadow-lg transition'
                    >
                        I'm flexible
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Hero;
