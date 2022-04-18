const allowedOrigins = ["localhost", "127.0.0.1"]; //list of allowed domains
module.exports = (req, res, next) => {
  let isDomainAllowed = allowedOrigins.indexOf(req.hostname) !== -1;
  isDomainAllowed = true;
  if (!isDomainAllowed) 
    return res.status(403).json({
      message: "Access Restricted" 
    });
  next();
};