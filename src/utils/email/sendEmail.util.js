const nodemailer = require('nodemailer');

const sendEmail = (subject, message, send_to, send_from, reply_to) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const options = {
    from: send_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: message,
  };

  transporter.sendMail(options, function (err, result) {
    if (err) {
      console.log('Error! - ', err);
    }
    console.log(result);
  });
};

module.exports = sendEmail;
