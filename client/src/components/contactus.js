// ContactForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../static/contactus.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/contact', formData);
      alert('Message sent successfully');
      setFormData({
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className='contact'>
  <h2>Contact Us</h2>
  <form onSubmit={handleSubmit}>
    <div classname='subject'>
      <label>Subject:</label>
      <input type="text" name="subject" value={formData.subject} onChange={handleChange} />
    </div>
    <div>
      <label>Message:</label>
      <textarea name="message" value={formData.message} onChange={handleChange} />
    </div>
    <div className='button'>
      <button type="submit">Submit</button>
    </div>
  </form>
</div>

  );
};

export default ContactForm;