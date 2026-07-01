import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { backendURL } from '../App';

const Login = ({ setToken, setUsername }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!password.trim()) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await axios.post(`${backendURL}/api/users/login`, { email, password });

            if (response.data.success) {
                if (response.data.role !== 'host') {
                    toast.error('Host access required for admin dashboard');
                    return;
                }
                setToken(response.data.token);
                setUsername(response.data.username);
                localStorage.setItem('username', response.data.username);
                toast.success('Login successful');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full'>
                <h1 className='text-2xl font-bold mb-4'>Admin Login</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                            type="email"
                            placeholder='your@email.com'
                        />
                        {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                    </div>

                    <div className='mb-3'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                            type="password"
                            placeholder='Enter your password'
                        />
                        {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password}</p>}
                    </div>

                    <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-[#FF385C] hover:bg-[#e0314f]' type='submit'>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
