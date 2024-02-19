const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const handlebars = require("handlebars");
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const body =
    typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  const { to, subject, type, user, item, email: emailId, phone, sender } = body;

  if (!to) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Recipient email ('to') is required." }),
    };
  }

  // Ensure these env vars are added to your Lambda function's enviornment variables in configuration.

  const { HOST, EMAIL, PASSWORD, BUCKET_NAME } = process.env;

  const SMTP_Client = nodemailer.createTransport({
    host: HOST,
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });
  try {
    // Retrieve the email template from S3
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: `${type}.html`,
    };
    // Also ensure you grant permission to access s3 buckets to Lambda's IAM role. include this in statements array

    /*   
    {
        "Effect": "Allow",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::your-bucket-name/*"
      }
    */

    const templateObject = await s3.getObject(s3Params).promise();
    const templateContent = templateObject.Body.toString("utf-8");
    console.log(templateObject, "THE TEMPLATE CONTENT");
    const template = handlebars.compile(templateContent);
    const htmlToSend = template({ user, item, email: emailId, phone, sender });

    const emailResponse = await SMTP_Client.sendMail({
      from: EMAIL,
      to,
      subject,
      html: htmlToSend,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email sent",
        messageId: emailResponse.messageId,
      }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
