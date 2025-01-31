import React, { useEffect, useState } from 'react';
import style from './Settings.module.css';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const [showDeleteModel, setShowDeleteModel] = useState(false)
    const [settingForm, setSettingForm] = useState({
        name: '',
        email: '',
        mobile: '',
    })

    // handle setting form
    const handleSettingForm = (e) => {
        const { name, value } = e.target;
        setSettingForm({ ...settingForm, [name]: value })
    }

    useEffect(() => {
        fetchUser();
    }, [])
    // fetching the user data from the dackend
    const fetchUser = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/user/getUser`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                console.log(response)
            const userData = response.data.user;
            setSettingForm({
                name: userData.name,
                email: userData.email,
                mobile: userData.mobile,
            })

        } catch (error) {
            console.log("Failed to fetch user data", error)
        }
    };

    // submitting the setting form
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const updateUser = {};
        if (settingForm.name) updateUser.name = settingForm.name
        if (settingForm.email) updateUser.email = settingForm.email
        if (settingForm.mobile) updateUser.mobile = settingForm.mobile

        try {
            const response = await axios.put(`${apiUrl}/api/user/update-user`,
                updateUser,
                {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                })

            toast.success("Profile updated successfully!", {
                position: "top-right",
            });

            // If email is updated, logout user
            if (updateUser.email) {
                logout();
            }
        } catch (error) {
            console.log(error)
        }
    }

    // logout function
    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login')
    };

    // delete the user
    const deleteUser = async () => {
        try {
            const response = await axios.delete(`${apiUrl}/api/user/delete-user`,
                {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                },
            )
            if (response.data) {
                toast.success("user account deleted successfully")
                localStorage.removeItem("token");
                navigate('/')
            }
        } catch (error) {
            console.log("error in deleting user account", error);
            toast.error("error in deleting user account")
        }
    };

    const resetForm = () => {
        setShowDeleteModel(false)
    }
    return (
        <>
            <div className={style.setting_container}>
                <div className={style.setting_form}>
                    <form onSubmit={handleFormSubmit} >
                        <div className={style.formGroup}>
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name"
                                placeholder='kumar'
                                value={settingForm.name}
                                onChange={handleSettingForm}
                            />
                        </div>

                        <div className={style.formGroup}>
                            <label htmlFor="name">Email id</label>
                            <input type="email" name="email"
                                placeholder='kumar@gmail.com'
                                value={settingForm.email}
                                onChange={handleSettingForm}
                            />
                        </div>

                        <div className={style.formGroup}>
                            <label htmlFor="name">Mobile no.</label>
                            <input type="number" name="mobile"
                                placeholder='1234567890'
                                value={settingForm.mobile}
                                onChange={handleSettingForm}
                            />
                        </div>

                        <div className={style.setting_Btns}>
                            <div>
                                <button className={style.Save_Btn} type='submit'>Save Changes</button>
                            </div>

                        </div>
                    </form>
                    <div onClick={() => setShowDeleteModel(true)} className={style.DelAccount_Btn}>
                        <button className={style.delete_Btn}>Delete Account</button>
                    </div>
                </div>


                {showDeleteModel && (
                    <div className={style.overlay}>
                    <div className={style.delete_model}>
                        <span onClick={resetForm}>x</span>
                        <div className={style.delete_content}>
                            <p> Are you sure, you want to remove it ? </p>
                            <div className={style.deleteModel_Btns}>
                                <button className={style.noBtn} onClick={resetForm}>NO</button>
                                <button className={style.yesBtn} onClick={deleteUser}>YES</button>
                            </div>

                        </div>
                    </div>
                    </div>
                )}
            </div>

        </>
    )
}

export default Settings