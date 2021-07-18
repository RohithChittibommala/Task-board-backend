const nodemailer = require("nodemailer");

async function sendMail({ from, to, subject, html }) {
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
      pass: process.env.SMTP_PASSWORD,
      user: process.env.SMTP_MAIL_USER,
    },
  });

  const info = await transporter.sendMail({
    from: `TaskBoard <${from}>`,
    to,
    from,
    subject,
    html,
  });
}

module.exports = sendMail;
