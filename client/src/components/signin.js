import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../static/signin.css'; 

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      } else {
        localStorage.setItem('userId', data.userId);
        setSuccess('You are logging in...'); // Set success message
        setError('');
        setTimeout(() => {
          window.location.href = '/page/user'; // Redirect after a delay
        }, 2000); // 2000 milliseconds (2 seconds) delay
      }
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  return (
    <div className="user-login-container">
      <h2>User Login Page</h2>
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
        <p className="signup-text">Don't have an account? <Link to="/user/signup">Sign up</Link></p>
        <p className="forgot-password-text">Forgot Password? <Link to="/forgot-password/user">Forgot Password</Link></p>
      </div>
    </div>
  );
};

export default UserLogin;
