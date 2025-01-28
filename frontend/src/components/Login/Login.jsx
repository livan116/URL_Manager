import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import style from "../Register/Register.module.css";
import logo from "../../assets/cuvette-logo.svg";

const Login = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // handling the form input
  const handleLoginForm = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  // handling the form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("register");
 

    // sending the Registerform data to the backend
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        loginForm
      );
      
      if (response.status === 200) {
        setLoginForm({
          email: "",
          password: "",
    
        });
        toast.success("User Logged In successfully");
        localStorage.setItem("token",response.data.token)
        navigate("/home");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.error(error.response.data);
      toast.error(error.response.data.msg);
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

            <form
              onSubmit={handleLoginSubmit}
              className={style.registerForm}
            >
             
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email id"
                value={loginForm.email}
                onChange={handleLoginForm}
              />{" "}
              <br />
              
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginForm}
              />{" "}
              <br />
             
              <button type="submit">Login</button>
            </form>

            <div className={style.already_have_account}>
              <p>
                Don't have an account? <Link to={"/"}>Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
