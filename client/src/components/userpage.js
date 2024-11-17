import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import EditProfileUser from './userprofile';
import ContactUser from './contactus';
import ResetPasswordUser from './userresetpassword';
import '../static/userpage.css';

export default function Userpage() {
    return (
        <>
            {/* Sidebar */}
            <div className="sidebar">
                {/* Use Link component for navigation */}
                <Link to="/page/user/profile">Edit Profile</Link>
                <Link to="/page/user/contact">Contact Us</Link>
                <Link to="/page/user/resetpassword">Reset Password</Link>
                {/* Add more buttons for additional pages */}
            </div>

            {/* Main content */}
            <div className="content">
                {/* Nested routes */}
                <Routes>
                    <Route path="" element={<EditProfileUser />} />
                    <Route path="profile" element={<EditProfileUser />} />
                    <Route path="contact" element={<ContactUser />} />
                    <Route path="resetpassword" element={<ResetPasswordUser />} />
                </Routes>
            </div>
        </>
    );
}
