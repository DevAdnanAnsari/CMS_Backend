const { resObject } = require("../helper/responseStructure");

const jwt = require("jsonwebtoken");

// Middleware to verify the JWT token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    jwt.verify(token, "secret_key", (err, user) => {
      if (err) {
        res.status(401).send(resObject(401, "Invalid token"));
      } else {
        // Add "email" field to the payload based on the decoded token
        req.payload = user;
        next();
      }
    });
  } else {
    res.status(401).send(resObject(401, "Token is not valid"));
  }
}

module.exports = {
  verifyToken,
};
