const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const JWT_SECRET = process.env.JWT_SECRET || "docto_jwt_super_secret_key_2026";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        message: "No authentication token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { clinic: true },
    });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "User session is invalid or user no longer exists",
      });
    }

    req.user = user;
    req.clinicId = user.clinic_id;
    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Token is invalid or has expired",
    });
  }
};

module.exports = {
  authMiddleware,
  JWT_SECRET,
};
