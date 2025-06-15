const emailService = require('./service/EmailService');

exports.sendContactMessage = async (req, res) => {
    const { full_name, email, message } = req.body;

    try {
        await emailService.send(
            process.env.EMAIL_USER, 
            `Contact form from ${full_name}`,
            `Message from: ${full_name}\nEmail: ${email}\n\nMessage: ${message}`,
            email
        );
        res.status(200).json({ message: "Message sent" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
};
