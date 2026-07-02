import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Location from './pages/Location';
import LocationDetails from './pages/LocationDetails';
import Login from './pages/Login';
import Reservations from './pages/Reservations';
import Experiences from './pages/Experiences';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from './context/ThemeContext';

const App = () => {
    const {theme} = useContext(ThemeContext);
    const isDark = theme === 'dark';

    return (
          <div className={`min-h-screen transition-colors duration-300 ${
            isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
            <ToastContainer />
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/locations' element={<Location />} />
                <Route path='/locations/:locationName' element={<Location />} />
                <Route path='/accommodation/:accommodationId' element={<LocationDetails />} />
                <Route path='/login' element={<Login />} />
                <Route path='/reservations' element={<Reservations />} />
                <Route path='/experiences' element={<Experiences />} />
            </Routes>
            <Footer />
        </div>
        </div>
    );
};

export default App;
