import React, { useState, useEffect } from 'react';
import '../static/userprofile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [college, setCollege] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user profile when component mounts
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/profile/${localStorage.getItem('userId')}`);
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setBranch(data.branch);
        setCollege(data.college);
      } else {
        setError('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch user profile');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/users/profile/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, branch, college }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        // Refresh the profile after update
        fetchProfile();
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update profile');
    }
  };

  return (
    <div className="profile">
      <h2 className="profile-title">User Profile</h2>
      {error && <p className="profile-error" style={{ color: 'red' }}>{error}</p>}
      <form className="profile-form" onSubmit={handleUpdateProfile}>
        <div>
          <label>Email:</label>
          <input 
            type="text" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="profile-input"
          />
        </div>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="profile-input"
          />
        </div>
        <div>
          <label>Branch:</label>
          <input 
            type="text" 
            value={branch} 
            onChange={(e) => setBranch(e.target.value)} 
            className="profile-input"
          />
        </div>
        <div>
          <label>College:</label>
          <input 
            type="text" 
            value={college} 
            onChange={(e) => setCollege(e.target.value)} 
            className="profile-input"
          />
        </div>
        <div className="profile-button">
          <button type="submit">Update Profile</button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;