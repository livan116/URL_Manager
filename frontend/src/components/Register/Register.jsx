import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import style from './Register.module.css';
import logo from '../../assets/cuvette-logo.svg';


const Register = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
  
    const navigate = useNavigate();
    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmpassword: '',
    })

    // handling the form input
    const handleRegisterForm = (e) => {
        const { name, value } = e.target
        setRegisterForm({ ...registerForm, [name]: value })
    }

    // handling the form submission
    const handleRegisterSubmit = async (e) => {
        e.preventDefault()
        console.log("register")
        // checking if the password and confirm password match
        if (registerForm.password !== registerForm.confirmpassword) {
            toast.error('Passwords do not match')
        }

        // sending the Registerform data to the backend
        try {
            const response = await axios.post(`${apiUrl}/api/user/register`, registerForm);
       
            if (response.status === 200) {

                setRegisterForm({
                    name: '',
                    email: '',
                    mobile: '',
                    password: '',
                    confirmpassword: '',

                });
                toast.success('User Registrated successfully')
                navigate('/login')
            }
            else {
                toast.error('Registration failed')
            }

        } catch (error) {
            console.error(error.response.data)
            toast.error(error.response.data.msg)

        }

    };

    return (
        <>
            <div className={style.registerMain_container}>
                <div className={style.registerLeft_container}>
                    <div className={style.logo}>
                        <img src={logo} alt="logo.png" />
                    </div>
                </div>
                <div className={style.registerRight_container}>
                    <div className={style.buttons}>
                        <button className={style.signUpBtn}>SignUp</button>
                        <button className={style.loginBtn}>Login</button>
                    </div>
                    <div className={style.registerForm_contant}>
                        <div className={style.join_us}>
                            <p>Join us Today!</p>
                        </div>
                        
                            <form onSubmit={handleRegisterSubmit}  className={style.registerForm}>
                                <input type="text"
                                    name='name'
                                    id="name"
                                    placeholder='Name'
                                    value={registerForm.name}
                                    onChange={handleRegisterForm}

                                /> <br />

                                <input type="email"
                                    name='email'
                                    id="email"
                                    placeholder='Email id'
                                    value={registerForm.email}
                                    onChange={handleRegisterForm}

                                /> <br />

                                <input type="number"
                                    name='mobile'
                                    id="mobile"
                                    placeholder='Mobile no.'
                                    value={registerForm.mobile}
                                    onChange={handleRegisterForm}

                                /> <br />

                                <input type="password"
                                    name='password'
                                    id="password"
                                    placeholder='Password'
                                    value={registerForm.password}
                                    onChange={handleRegisterForm}

                                /> <br />

                                <input type="password"
                                    name='confirmpassword'
                                    id="confirmpassword"
                                    placeholder='Confirm Password'
                                    value={registerForm.confirmpassword}
                                    onChange={handleRegisterForm}
                                /> <br />

                                <button type="submit">Register</button>
                            </form>
                    
                        <div className={style.already_have_account}>
                            <p>Already have an account? <Link to={'/login'}>Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;
