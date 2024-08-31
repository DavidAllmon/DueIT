const cron = require('node-cron');
const Bill = require('../models/billModel');
const User = require('../models/userModel');
const { sendEmail } = require('./emailService');

const checkReminders = async () => {
  const today = new Date();
  const bills = await Bill.find({
    reminderDate: { $lte: today },
    isPaid: false,
  }).populate('user', 'email smtpSettings');

  for (const bill of bills) {
    if (bill.user.smtpSettings) {
      const smtpSettings = {
        ...bill.user.smtpSettings,
        auth: {
          user: bill.user.smtpSettings.auth.user,
          pass: bill.user.smtpSettings.auth.pass // This will be automatically decrypted
        }
      };

      await sendEmail(
        smtpSettings,
        bill.user.email,
        `Reminder: ${bill.name} due soon`,
        `Your bill ${bill.name} for $${bill.amount} is due on ${bill.dueDate.toDateString()}.`
      );
    }
    bill.reminderDate = new Date(bill.dueDate.getTime() - 24 * 60 * 60 * 1000); // Set next reminder to 1 day before due date
    await bill.save();
  }
};

const startReminderSystem = () => {
  cron.schedule('0 9 * * *', checkReminders); // Run every day at 9 AM
};

module.exports = { startReminderSystem };