import React from 'react'
import Navbar from '../Navbar/Navbar'
import { useNavigate, Outlet } from 'react-router-dom'

import style from "./Home.module.css"

const Home = () => {
    const navigate = useNavigate();
    
    return (
        <div className={style.MainPage}>
            <Navbar />

            <div className={style.sidebar_parent}>
                {/* Sidebar */}
                <div className={style.sideBar}>
                    <div className={style.dashboard}>

                        <p onClick={() => navigate('dashboard')}>Dashboard</p>
                    </div>
                    <div className={style.link}>
                        <i className="fa-solid fa-link"></i>
                        <p onClick={() => navigate('links')}>Links</p>
                    </div>
                    <div className={style.analytics}>
                        <i className="fa-solid fa-arrow-trend-up"></i>
                        <p onClick={() => navigate('analytics')}>Analytics</p>
                    </div>

                    <div className={style.setting} >
                        <i className="fa-solid fa-gear"></i>
                        <p onClick={()=>navigate('settings')}>Settings</p>
                    </div>
                </div>



                {/* Main Content */}
                <div className={style.outlet}>
                    <Outlet />
                </div>
            </div>
        </div>
  )
}

export default Home