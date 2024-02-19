const requestTimes = {};
//FIXME: Not really scalable, find a better way to do this.
const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const limit = 10; // Max requests
  const windowInMs = 5 * 60 * 1000; // Converted 5 minutes in milliseconds

  if (!requestTimes[ip]) {
    requestTimes[ip] = [];
  }

  const currentTime = Date.now();

  // Remove old timestamp that are outside current window
  requestTimes[ip] = requestTimes[ip].filter(
    (timestamp) => currentTime - timestamp < windowInMs
  );

  if (requestTimes[ip].length >= limit) {
    res.status(429).send("Too many requests, please try again later");
  } else {
    requestTimes[ip].push(currentTime);
    next();
  }
};

module.exports = rateLimit;
