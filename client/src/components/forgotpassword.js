import React, { useState } from 'react';
import '../static/forgetpassword.css'; // Importing CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/forgot-password', {
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
    <div className="forgot-password-container"> {/* Added class name */}
      <h2 >Forgot Password</h2> {/* Added class name */}
      <form onSubmit={handleSubmit} className="forgot-password-form"> {/* Added class name */}
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
        <button type="submit" className="forgot-password-button">Send Reset Link</button> </div>{/* Added class name */}
      </form>
      {message && <p style={{ color: 'green' }} className="forgot-password-message">{message}</p>} {/* Added class name */}
      {error && <p style={{ color: 'red' }} className="forgot-password-error">{error}</p>} {/* Added class name */}
    </div>
  );
};

export default ForgotPassword;
