const fs = require("fs");

const express = require("express");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
require("dotenv").config();

const validateApiKey = require("./middlewares/validateApiKey");
const rateLimit = require("./middlewares/rateLimit");

const app = express();
app.use(express.json());

const { HOST, EMAIL, PASSWORD, PORT } = process.env;

const SMTP_Client = nodemailer.createTransport({
  host: HOST,
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

app.post("/smtp-email", validateApiKey, rateLimit, async (req, res) => {
  const {
    to,
    subject = "New Message",
    type = "enquiry", //FIXME: Defaulting to enquiry.html for now, need a better default template
    user,
    item,
    email: emailId,
    phone,
    sender,
  } = req.body;

  if (!to)
    return res
      .status(400)
      .json({ message: "Recipient email ('to') is required." });

  try {
    const templateFile = fs.readFileSync(
      `./src/templates/${type}.html`,
      "utf8"
    );
    const template = handlebars.compile(templateFile);
    const htmlToSend = template({ user, item, email: emailId, phone, sender });

    const email = await SMTP_Client.sendMail({
      from: EMAIL,
      to,
      subject,
      html: htmlToSend,
    });
    res.json({ message: "Email sent", messageId: email.messageId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Email server is running on port ${PORT}`));
