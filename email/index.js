const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: { api_key: process.env.SENDGRID_API_KEY },
  })
);

const verifyEmailTemplate = (userToken, email, name) => ({
  to: email,
  from: "company.social.network.org@gmail.com",
  subject: "Verify your email",
  html: `Thanks you ${name} for signing up
         please click on the link to verify your account
      <a href=http://localhost:3000/conformation/${userToken}>click here</a>`,
});

const forgotPasswordTemplate = (userToken, email) => ({
  to: email,
  from: "company.social.network.org@gmail.com",
  subject: "Account Password Reset",
  html: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process\n'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      <a href=http://localhost:3000/reset_password/${userToken}>click here</a>`,
});

const accountPasswordChanged = (email) => ({
  to: email,
  from: "company.social.network.org@gmail.com",
  subject: "account Password changed",
  html: ` <p>This is a confirmation that the password for your account  ${email}has just been changed.\n</a>`,
});

module.exports.sendConformationMail = async (token, email, name) => {
  await transporter.sendMail(verifyEmailTemplate(token, email, name));
};

module.exports.sendForgotPasswordMail = async (userToken, email) => {
  await transporter.sendMail(forgotPasswordTemplate(userToken, email));
};

module.exports.sendAccountPsdChangedMail = async (email) => {
  await transporter.sendMail(accountPasswordChanged(email));
};
