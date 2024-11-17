// AdminContactMessages.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../static/admincontact.css';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/contact');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/contact/${id}`);
      alert('Message deleted successfully');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again later.');
    }
  };

  return (
    <div className="contact1">
      <h2>Contact Messages</h2>
      <ul>
        {messages.map(message => (
          <li key={message._id}>
            <strong>Subject:</strong> {message.subject}<br />
            <strong>Message:</strong> {message.message}<br />
            <div className='button'><button onClick={() => handleDelete(message._id)}>Delete</button></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminContactMessages;