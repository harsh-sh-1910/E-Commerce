const allowedOrigins = require("../config/allowedOrigin");
const corsOptions = {
  origin: (origin, cb) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      console.log(origin, "success");
      cb(null, true);
    } else {
      console.log(origin, "error");
      cb(new Error("not allowed by cors"));
    }
  },
  credentials: true,
};
module.exports = corsOptions;
