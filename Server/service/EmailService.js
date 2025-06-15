const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.send = async (to, subject, text, replyTo = null) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    if (replyTo) {
        mailOptions.replyTo = replyTo;
    }

    await transporter.sendMail(mailOptions);
};

exports.sendCalendarInvite = async (to, subject, description, startTime) => {
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
DTSTART:${formatDate(startTime)}
SUMMARY:${escapeText(subject)}
DESCRIPTION:${escapeText(description)}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT10M
DESCRIPTION:Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR
`.trim();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: description,
        icalEvent: {
            filename: 'invite.ics',
            method: 'request',
            content: icsContent,
        },
    };

    await transporter.sendMail(mailOptions);
};

// 🧰 פונקציה עזר: תאריך לפורמט iCal
function formatDate(date) {
    const d = new Date(date);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

// 🧰 פונקציה עזר: מנקה תווים מיוחדים
function escapeText(text) {
    return (text || '').replace(/(\r\n|\n|\r)/gm, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}