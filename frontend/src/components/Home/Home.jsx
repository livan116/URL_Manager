import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import style from "./Home.module.css";

const Home = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState('dashboard');

    const handleNavigation = (route) => {
        setActiveItem(route);
        navigate(route);
    };

    return (
        <div className={style.MainPage}>
            <Navbar />
            
            <div className={style.sidebar_parent}>
                {/* Sidebar */}
                <div className={style.sideBar}>
                    <div 
                        className={style.dashboard}
                        onClick={() => handleNavigation('dashboard')}
                        style={{
                            backgroundColor: activeItem === 'dashboard' ? '#F3F7FD' : 'transparent'
                        }}
                    >
                        <i className="fa-solid fa-house"></i>
                        <p>Dashboard</p>
                    </div>

                    <div 
                        className={style.link}
                        onClick={() => handleNavigation('links')}
                        style={{
                            backgroundColor: activeItem === 'links' ? '#F3F7FD' : 'transparent'
                        }}
                    >
                        <i className="fa-solid fa-link"></i>
                        <p>Links</p>
                    </div>

                    <div 
                        className={style.analytics}
                        onClick={() => handleNavigation('analytics')}
                        style={{
                            backgroundColor: activeItem === 'analytics' ? '#F3F7FD' : 'transparent'
                        }}
                    >
                        <i className="fa-solid fa-arrow-trend-up"></i>
                        <p>Analytics</p>
                    </div>

                    <div 
                        className={style.setting}
                        onClick={() => handleNavigation('settings')}
                        style={{
                            backgroundColor: activeItem === 'settings' ? '#F3F7FD' : 'transparent'
                        }}
                    >
                        <i className="fa-solid fa-gear"></i>
                        <p>Settings</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className={style.outlet}>
                    <Outlet />
                </div>
            </div>
            
        </div>
    );
};

export default Home;