import React, { useState, useEffect } from 'react';
import '../static/admin.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch users');
    }
  };

  const handleApprove = async (userId) => {
    try {
      await fetch(`http://localhost:5000/users/${userId}/approve`, {
        method: 'PUT',
      });
      fetchUsers(); // Refresh the user list after approval
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to approve user');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await fetch(`http://localhost:5000/users/${userId}/delete`, {
        method: 'DELETE',
      });
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to delete user');
    }
  };

  return (
    <div className="admin-container">
      <h2>User Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.email} - {user.approved ? 'Approved' : 'Not Approved'}
            <button className='delete-btn' onClick={() => handleDelete(user._id)}>Delete</button>
            {!user.approved && (
              <button className='approve-btn' onClick={() => handleApprove(user._id)}>Approve</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
