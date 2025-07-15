const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("AUTH HEADER:", authHeader);
    console.log("TOKEN:", token);

    if (!token) {
        console.log("NO TOKEN");
        return res.status(401).json({ error: true, message: "No token provided" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("TOKEN VERIFY ERROR:", err.message);
            return res.status(403).json({ error: true, message: "Invalid token" });
        }

        console.log("DECODED USER:", user);
        req.user = user; // 🔑 Set decoded token directly
        next();
    });
}

module.exports = { authenticateToken };
