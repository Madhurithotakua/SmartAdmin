// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
// Secret key for JWT
const JWT_SECRET = 'AE78461C8CBE7548D159E295AC649DF00A528B12EE80CCCFB44B9FA1C5FD08E6';

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/signup_login_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define Admin schema
const adminSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    name: String,
    branch: String,
    college: String
});

// Define User schema
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    name: String,
    branch: String,
    college: String,
    approved: { type: Boolean, default: false } // New field to track approval status
});

// Define a schema for contact messages
const contactSchema = new mongoose.Schema({
  subject: String,
  message: String
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const ContactMessage = mongoose.model('ContactMessage', contactSchema);

// Route to fetch all users
app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
});

// User Signup endpoint
app.post('/signup/user', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user with approval status set to false
        const newUser = new User({
            email,
            password: hashedPassword,
            approved: false // Set the initial approval status to false
        });
        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: 'User account created. Awaiting admin approval.' });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User Login endpoint
app.post('/login/user', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the user's account is approved
        if (!user.approved) {
            return res.status(401).json({ message: 'Account not approved yet. Please wait for admin approval.' });
        }
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Generate JWT token
        const token = jwt.sign({ email: user.email, role: 'user' }, 'user_secretkey');
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin Signup endpoint
app.post('/signup/admin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Admin already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new admin
        const newAdmin = new Admin({
            email,
            password: hashedPassword
        });
        // Save the admin to the database
        await newAdmin.save();
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error('Error signing up admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User Login endpoint
app.post('/login/user', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ email: user.email, role: 'user' }, 'user_secretkey');

        res.status(200).json({ token, userId: user._id});
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin Login endpoint
app.post('/login/admin', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Generate JWT token
        const token = jwt.sign({ email: admin.email, role: 'admin' }, 'admin_secretkey');
        res.status(200).json({ token, adminId: admin._id});
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Password Reset endpoint for Users
app.post('/resetpassword/user', async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Compare current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid current password' });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update user's password
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting user password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Password Reset endpoint for Admins
app.post('/resetpassword/admin', async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        // Compare current password
        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid current password' });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update admin's password
        admin.password = hashedPassword;
        await admin.save();
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting admin password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Route to fetch all users
app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to handle approval of a user by their ID
app.put('/users/:id/approve', async (req, res) => {
    const { id } = req.params;
    try {
      // Find the user by their ID and update their approval status
      await User.findByIdAndUpdate(id, { approved: true });
      res.json({ message: 'User approved successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to approve user' });
    }
});

// Route to delete a user by their ID
app.delete('/users/:id/delete', async (req, res) => {
    const { id } = req.params;
    try {
        // Find the user by their ID and delete them
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user' });
    }
});

// Route to update user profile
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, branch, college } = req.body;
    try {
        // Find the user by their ID and update their profile
        await User.findByIdAndUpdate(id, { name, branch, college });
        res.json({ message: 'User profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user profile' });
    }
});

// Route to update admin profile
app.put('/admins/:id', async (req, res) => {
    const { id } = req.params;
    const { name, branch, college } = req.body;
    try {
        // Find the admin by their ID and update their profile
        await Admin.findByIdAndUpdate(id, { name, branch, college });
        res.json({ message: 'Admin profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update admin profile' });
    }
});


// Route for forgot password functionality
app.post("/forgot-password/admin", async (req, res) => {
    const { email } = req.body;
    try {
      const oldUser = await Admin.findOne({ email });
      if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
      }
      const secret = JWT_SECRET + oldUser.password;
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
        expiresIn: "5m",
      });
      const link = `http://localhost:5000/reset-password/admin/${oldUser._id}/${token}`;
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ankamreddiprudhvi@gmail.com",
          pass: "rnzu bbvi ugnm jxrv",
        },
      });
  
      var mailOptions = {
        from: "ankamreddiprudhvi@gmail.com",
        to: email, // Sending email to the user who requested password reset
        subject: "Password Reset",
        text: link,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: 'Failed to send reset email' });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).json({ message: 'Reset email sent successfully' });
        }
      });
      console.log(link);
    } catch (error) {
      console.error('Error sending reset email:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Route for handling reset password page
  app.get("/reset-password/admin/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const oldUser = await Admin.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      res.render("index", { email: verify.email, status: "Not Verified" });
    } catch (error) {
      console.log(error);
      res.send("Not Verified");
    }
  });
  
  // Route for handling password reset form submission
  app.post("/reset-password/admin/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    const oldUser = await Admin.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
  
      res.render("index", { email: verify.email, status: "verified" });
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
  })

// Route for forgot password functionality
app.post("/forgot-password/users", async (req, res) => {
    const { email } = req.body;
    try {
      const oldUser = await User.findOne({ email });
      if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
      }
      const secret = JWT_SECRET + oldUser.password;
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
        expiresIn: "5m",
      });
      const link = `http://localhost:5000/reset-password/users/${oldUser._id}/${token}`;
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ankamreddiprudhvi@gmail.com",
          pass: "rnzu bbvi ugnm jxrv",
        },
      });
  
      var mailOptions = {
        from: "ankamreddiprudhvi@gmail.com",
        to: email, // Sending email to the user who requested password reset
        subject: "Password Reset",
        text: link,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: 'Failed to send reset email' });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).json({ message: 'Reset email sent successfully' });
        }
      });
      console.log(link);
    } catch (error) {
      console.error('Error sending reset email:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Route for handling reset password page
  app.get("/reset-password/users/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      res.render("index", { email: verify.email, status: "Not Verified" });
    } catch (error) {
      console.log(error);
      res.send("Not Verified");
    }
  });
  
  // Route for handling password reset form submission
  app.post("/reset-password/users/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
  
      res.render("index", { email: verify.email, status: "verified" });
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
  });

// Route to handle submission of contact messages
app.post('/contact', async (req, res) => {
  try {
    const { subject, message } = req.body;
    // Create a new contact message
    const newMessage = new ContactMessage({
      subject,
      message
    });
    // Save the message to the database
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch all contact messages for the admin
app.get('/contact', async (req, res) => {
  try {
    // Fetch all contact messages from the database
    const messages = await ContactMessage.find();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a contact message by its ID
app.delete('/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Find the message by its ID and delete it
    await ContactMessage.findByIdAndDelete(id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});