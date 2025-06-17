const validator = require('validator');

module.exports = function validateRegister(req, res, next) {
    const { full_name, email, password } = req.body;

    if (!validator.isLength(full_name || '', { min: 2 })) {
        return res.status(400).json({ error: "Full name must be at least 2 characters." });
    }

    if (!validator.isEmail(email || '')) {
        return res.status(400).json({ error: "Invalid email address." });
    }

    if (!validator.isStrongPassword(password || '', {
        minLength: 8,
        maxLength: 20,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        return res.status(400).json({
            error:
                "Password must be 8-20 characters, include uppercase, lowercase, a number, and a special character."
        });
    }

    next();
};