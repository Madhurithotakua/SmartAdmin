import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import AdminLogin from './components/adminlogin';
import UserLogin from './components/signin';
import AdminSignup from './components/adminsignup';
import UserSignup from './components/signup';
import Admin from './components/admin';
import ForgotPassword  from './components/adminforgotpassword';
import ForgetPassword  from './components/usersforgotpassword';
import UserResetPassword from './components/userresetpassword';
import AdminResetPassword from './components/adminresetpassword';
import AdminContactMessages from './components/admincontact';
import AdminProfile from './components/adminprofile';
import UserProfile from './components/userprofile';
import ContactForm from './components/contactus';
import Page from './components/page';
import Userpage from './components/userpage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/forgot-password/admin" element={<ForgotPassword />} />
          <Route path="/forgot-password/user" element={<ForgetPassword />} />
          <Route path="/resetpassword/user" element={<UserResetPassword />} />
          <Route path="/resetpassword/admin" element={<AdminResetPassword />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contact/admin" element={<AdminContactMessages />} /> 
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/profile/user" element={<UserProfile />} />
          <Route path="/contact/user" element={<ContactForm />} />

          {/* Nested routing for the Page component */}
          <Route path="/page/*" element={<Page />} />
          {/* Nested routing for the Userpage component */}
          <Route path="/page/user/*" element={<Userpage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;