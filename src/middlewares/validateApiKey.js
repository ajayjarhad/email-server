require("dotenv").config();

const validateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  //For now, new key can be generated by running ` node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" ` and store the generated key in .env file, name it API_KEY
  //FIXME: Need to introduce a DB on later stages to store API keys and also a way to provision them.
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "Invalid or missing API key" });
  }
  next();
};

module.exports = validateApiKey;
