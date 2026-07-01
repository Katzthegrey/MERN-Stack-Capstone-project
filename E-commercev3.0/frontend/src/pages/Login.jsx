import React, { useContext } from 'react';
import { AirbnbContext } from '../context/AirbnbContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
    const [currentState, setCurrentState] = React.useState('Login');
    const { token, setToken, setUsername, setEmail, navigate, backendURL } = useContext(AirbnbContext);

    const [form, setForm] = React.useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = React.useState({});

    const validate = () => {
        const newErrors = {};
        if (currentState === 'Sign Up' && !form.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!form.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (form.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        try {
            const endpoint = currentState === 'Sign Up' ? '/api/users/register' : '/api/users/login';
            const payload = currentState === 'Sign Up'
                ? { username: form.username, email: form.email, password: form.password }
                : { email: form.email, password: form.password };

            const response = await axios.post(`${backendURL}${endpoint}`, payload);

            if (response.data.success) {
                setToken(response.data.token);
                setUsername(response.data.username);
                setEmail(response.data.email);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('email', response.data.email);
                toast.success('Login successful');
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    React.useEffect(() => {
        if (token) navigate('/');
    }, [token]);

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='text-3xl font-semibold'>{currentState}</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>

            {currentState === 'Sign Up' && (
                <div className='w-full'>
                    <input
                        onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value }))}
                        value={form.username}
                        type="text"
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        placeholder='Username'
                    />
                    {errors.username && <p className='text-red-500 text-xs mt-1'>{errors.username}</p>}
                </div>
            )}

            <div className='w-full'>
                <input
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    value={form.email}
                    type="email"
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                    placeholder='Email'
                />
                {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
            </div>

            <div className='w-full'>
                <input
                    onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                    value={form.password}
                    type="password"
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                    placeholder='Password'
                />
                {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password}</p>}
            </div>

            <div className='w-full flex justify-between text-sm'>
                {currentState === 'Login'
                    ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-[#FF385C]'>Create Account</p>
                    : <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-[#FF385C]'>Login Here</p>
                }
            </div>

            <button className='bg-[#FF385C] text-white font-medium px-8 py-3 mt-4 rounded-lg w-full hover:bg-[#e0314f]'>
                {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
            </button>
        </form>
    );
};

export default Login;