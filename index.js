const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const { email, subject, text } = JSON.parse(event.body);

  // Basic validation
  if (!email || !subject || !text) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email, subject, and text fields are required." }),
    };
  }

  // Email format validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid email format." }),
    };
  }

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: "email-smtp.eu-north-1.amazonaws.com",
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Define the email message
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: subject,
    text: text,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
