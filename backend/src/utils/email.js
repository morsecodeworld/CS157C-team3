const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // email options MAILTRAP
  const emailOptions = {
    from: `Cineflix support<support@example.com>`,
    to: option.email,
    subject: option.subject,
    text: option.text,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
