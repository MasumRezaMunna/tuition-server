const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message:
          err.name === "TokenExpiredError"
            ? "token expired"
            : "invalid token"
      });
    }
    req.decoded = decoded;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  const user = await User.findOne({ email: req.decoded.email });

  if (!user) {
    return res.status(401).send({ message: "user not found" });
  }

  if (user.role !== "admin") {
    return res.status(403).send({ message: "forbidden access" });
  }

  next();
};

const verifyRole = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findOne({ email: req.decoded.email });
    if (!user || !roles.includes(user.role)) {
      return res.status(403).send({ message: "forbidden access" });
    }
    next();
  };
};

module.exports = { verifyToken, verifyAdmin, verifyRole };
