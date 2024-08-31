const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);
      res.json({
        _id: user._id,
        email: user.email,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { currentPassword, newPassword } = req.body;

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    // You might want to delete user's bills here as well
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSmtpSettings = async (req, res) => {
  try {
    const { host, port, secure, user, pass } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        smtpSettings: {
          host,
          port,
          secure,
          auth: { user, pass },
        },
      },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.testSmtpSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.smtpSettings) {
      return res.status(400).json({ message: 'SMTP settings not configured' });
    }

    const smtpSettings = {
      ...user.smtpSettings,
      auth: {
        user: user.smtpSettings.auth.user,
        pass: user.smtpSettings.auth.pass // This will be automatically decrypted
      }
    };

    const testResult = await sendEmail(
      smtpSettings,
      user.email,
      'Test Email from DueIt',
      'This is a test email to verify your SMTP settings.'
    );

    if (testResult) {
      res.json({ message: 'Test email sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send test email' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};