import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import EditProfileAdmin from './adminprofile';
import AdminContactMessages from './admincontact';
import AdminResetPassword from './adminresetpassword';
import Admin from './admin';
import '../static/page.css';

export default function Page() {
  const id = "example"; // Define id or retrieve it from somewhere

  return (
    <>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Use Link component for navigation */}
        <Link to="profile/admin">Profile</Link>
        <Link to="contact/admin">Contact Messages</Link>
        <Link to="resetpassword/admin">Admin Reset Password</Link>
        <Link to="admin">User Management</Link>
        {/* Add more buttons for additional pages */}
      </div>

      {/* Main content */}
      <div className="content">
        {/* Nested routes */}
        <Routes>
          {/* Default route for profile page */}
          <Route path="" element={<EditProfileAdmin adminId={id} />} />
          <Route path="profile/admin" element={<EditProfileAdmin adminId={id} />} />
          <Route path="contact/admin" element={<AdminContactMessages />} />
          <Route path="resetpassword/admin" element={<AdminResetPassword />} />
          <Route path="admin" element={<Admin />} />
        </Routes>
      </div>
    </>
  );
}
