const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.AUTHORIZATION;
  if (!authHeader)
    return res.status(401).json({ error: "UNAUTHORIZED USER 1" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "UNAUTHORIZED USER 2" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "UNAUTHORIZED USER  3" });

    req.userInfo = {
      id: decoded.id,
      admin: decoded.admin,
    };

    next();
  });
};

module.exports = verifyJWT;
