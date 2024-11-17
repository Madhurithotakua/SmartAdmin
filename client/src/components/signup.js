import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../static/signup.css';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // State variable to track success

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/signup/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          isApproved: false,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong');
    }
  };

  return (
    <div className="user-signup-container">
      <h2>User Signup Page</h2>
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
        <div className="input-wrapper">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Thanks! You have successfully signed up.</p>}
        <div className='button'>
          <button type="submit">Signup</button>
        </div>
      </form>
      <div className="links-wrapper">
        <p>Already have an account? <Link to="/user/login">Login</Link></p>
      </div>
    </div>
  );
};

export default UserSignup;
