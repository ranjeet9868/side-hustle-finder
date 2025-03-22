const jwt = require("jsonwebtoken"),
  SECRET_KEY = "my_super_secret_key";
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, SECRET_KEY, (err, decoded) =>
    err
      ? res.status(401).json({ error: "Invalid token" })
      : ((req.userId = decoded.userId), next())
  );
};
