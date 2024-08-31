const nodemailer = require('nodemailer');

async function sendEmail(smtpSettings, to, subject, text) {
  const transporter = nodemailer.createTransport(smtpSettings);

  const mailOptions = {
    from: smtpSettings.auth.user,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

module.exports = { sendEmail };