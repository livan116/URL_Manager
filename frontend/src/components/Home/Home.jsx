import React from 'react'
import Navbar from '../Navbar/Navbar'
import { useNavigate, Outlet } from 'react-router-dom'

import style from "./Home.module.css"

const Home = () => {
    const navigate = useNavigate();
  return (
    <div>
        <Navbar/>
        <div className={style.sidebar_parent}>
              
                <div className={style.sideBar}>
                    <div className={style.dashboard}>
                        <p onClick={() => navigate('dashboard')}>Dashboard</p>
                    </div>
                    <div className={style.link}>
                        <p onClick={() => navigate('links')}>Links</p>
                    </div>
                    <div className={style.analytics}>
                        <p onClick={() => navigate('analytics')}>Analytics</p>
                    </div>
                </div>

             
                <div className={style.outlet}>
                    <Outlet />
                </div>
            </div>
    </div>
  )
}

export default Home