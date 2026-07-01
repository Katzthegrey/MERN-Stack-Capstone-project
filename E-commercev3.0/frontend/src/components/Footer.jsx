import React from 'react';

const Footer = () => {
    const footerColumns = [
        {
            title: 'Support',
            links: ['Help Center', 'AirCover', 'Anti-discrimination', 'Disability support'],
        },
        {
            title: 'Hosting',
            links: ['Airbnb your home', 'AirCover for Hosts', 'Hosting resources', 'Community forum'],
        },
        {
            title: 'Airbnb',
            links: ['Newsroom', 'New features', 'Careers', 'Investors'],
        },
        {
            title: 'Legal',
            links: ['Terms', 'Privacy', 'Sitemap', 'Company details'],
        },
    ];

    return (
        <div className='mt-20'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8 my-10 text-sm border-t pt-10'>
                {footerColumns.map((col) => (
                    <div key={col.title}>
                        <p className='font-semibold mb-4'>{col.title}</p>
                        <ul className='flex flex-col gap-2 text-gray-600'>
                            {col.links.map((link) => (
                                <li key={link} className='hover:underline cursor-pointer'>{link}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className='border-t py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-4'>
                <p>© 2025 Airbnb Clone. All rights reserved.</p>
                <div className='flex gap-4'>
                    <span className='cursor-pointer hover:underline'> English (ZA)</span>
                    <span className='cursor-pointer'>Facebook</span>
                    <span className='cursor-pointer'>Twitter</span>
                    <span className='cursor-pointer'>Instagram</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
