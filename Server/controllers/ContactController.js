const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // admin email from .env
        pass: process.env.EMAIL_PASS
    }
});

exports.sendContactMessage = async (req, res) => {
    const { full_name, email, message } = req.body;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email, // <--- add this!
            subject: `Contact form from ${full_name}`,
            text: `Message from: ${full_name}\nEmail: ${email}\n\nMessage: ${message}`,
        });
        res.status(200).json({ message: "Message sent" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
};