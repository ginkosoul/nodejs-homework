const nodemailer = require("nodemailer");
// require("dotenv").config();

const { GMAIL_PASSWORD } = process.env;

const nodemailerConfig = {
  service: "gmail",
  auth: {
    user: "ginkosoul@gmail.com",
    pass: GMAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "ginkosoul@gmail.com" };
  await await transport.sendMail(email);
  return true;
};
// const email = {
//   to: "misipa7279@tiuas.com",
//   subject: "Test email",
//   html: "<p><strong>Test email</strong> from localhost:3000</p>",
// };

// sendEmail(email);

module.exports = sendEmail;
