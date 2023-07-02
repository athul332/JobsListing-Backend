const UnauthenticatedError = require("../errors/unauthenticated");
const jwt = require("jsonwebtoken");
const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("pppppppppppppppp");
    throw new UnauthenticatedError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const { userId, name } = decoded;
    req.user = { userId: userId, name: name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};

const loginMiddleware = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new CustomAPIError("please provide email or password", 404);
  }
  return next();
};

module.exports = { loginMiddleware, authenticationMiddleware };
