const cron = require('node-cron');
const Bill = require('../models/billModel');
const nodemailer = require('nodemailer');

// Configure nodemailer (you'll need to set up an email service)
const transporter = nodemailer.createTransport({
  // Configure your email service here
});

const sendReminder = async (bill) => {
  const mailOptions = {
    from: 'your-email@example.com',
    to: bill.user.email,
    subject: `Reminder: ${bill.name} due soon`,
    text: `Your bill ${bill.name} for $${bill.amount} is due on ${bill.dueDate.toDateString()}.`,
  };

  await transporter.sendMail(mailOptions);
};

const checkReminders = async () => {
  const today = new Date();
  const bills = await Bill.find({
    reminderDate: { $lte: today },
    isPaid: false,
  }).populate('user', 'email');

  for (const bill of bills) {
    await sendReminder(bill);
    bill.reminderDate = new Date(bill.dueDate.getTime() - 24 * 60 * 60 * 1000); // Set next reminder to 1 day before due date
    await bill.save();
  }
};

const startReminderSystem = () => {
  cron.schedule('0 9 * * *', checkReminders); // Run every day at 9 AM
};

module.exports = { startReminderSystem };