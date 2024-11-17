import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../static/adminlogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        localStorage.setItem('adminId', data.adminId);
        setSuccess('You are logging in...'); // Set success message
        setError('');
        setTimeout(() => {
          window.location.href = '/page'; // Redirect after a delay
        }, 2000); // 2000 milliseconds (2 seconds) delay
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-wrapper">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div className="button">
          <button type="submit">Login</button>
        </div>
      </form>
      <div className="links-wrapper">
        <p>Don't have an account? <Link to="/admin/signup">Sign up</Link></p>
        <p>Forgot Password? <Link to="/forgot-password/admin">Forgot Password</Link></p>
      </div>
    </div>
  );
};

export default AdminLogin;
