// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../static/home.css';

const Home = () => {
  return (
    <div className="wrapper">
      <h1>Welcome to the Home Page</h1>
      <div className="input-box">
        <Link to="/admin/login">Admin Login</Link>
      </div>
      <div className="input-box">
        <Link to="/user/login">User Login</Link>
      </div>
    </div>
  );
};

export default Home;
