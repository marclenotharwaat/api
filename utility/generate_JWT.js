const JWT = require('jsonwebtoken');

module.exports = async (payload) => {
    return await JWT.sign(payload,
        "45ab3f5eb14a437e865deb3648a1e31aa2688e30f39c9e7fca3bc0a0d69835f8",
        { expiresIn: "1m" });

}