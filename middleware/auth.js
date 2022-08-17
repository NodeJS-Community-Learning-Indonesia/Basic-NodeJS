const wrapper = require("../utils/responses");
const jwt = require("jsonwebtoken");

const isAuthenticate = (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[1];
        jwt.verify(bearerToken, process.env.SECRET_KEY, (err, data) => {
            if (err) {
                return wrapper.error(
                    res,
                    null,
                    "Not Authorized (No Token)",
                    401
                );
            }
            req.user = data;
            next();
        });
        // req.token = bearerToken;
    } else {
        return wrapper.error(res, null, "Not Authorized (No Token)", 401);
    }
};

module.exports = {
    isAuthenticate,
};
