import React from 'react';
import style from './Navbar.module.css';
import logo from '../../assets/cuvette-logo.svg'

const Navbar = () => {
    return (
        <>
            <div className={style.Navbar}>
                <div className={style.Logo}>
                    <img src={logo} alt="Logo.png" />
                </div>
                <div className={style.right_navbar}>
                    <div className={style.profile_name}>
                        <span>Good morning, Kumar</span>
                        <p>Tue, jan 25</p>
                    </div>
                    <div className={style.Nav_Acton}>
                        <button className={style.create_button}>+ Create new</button>
                        <div className={style.search}>

                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" 
                        placeholder='Search by remarks'
                        className={style.Nav_search}
                         />
                        </div>
                    <div className={style.profile_circle}>ku</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar