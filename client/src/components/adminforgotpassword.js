import React, { useState } from 'react';
import '../static/adminforgotpassword.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/forgot-password/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setMessage(data.status);
      } else {
        setError(data.status);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to send password reset link');
    }
  };

  return (
    <div className="aforget-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="aforgot-password-form">
      <div className="input">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        </div>
        <div className="button">
        <button type="submit">Send Reset Link</button>
        </div>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ForgetPassword;