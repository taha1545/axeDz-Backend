const { Resend } = require('resend');

const resend = new Resend("re_DLh8FADz_DZtC2NuutieUSq8jLQTNAXFp");

const sendMail = async ({ from, to, subject, html, text, cc, bcc }) => {
    try {
        return await resend.emails.send({
            from,
            to,
            subject,
            html,
            text,
            cc,
            bcc,
        });
    } catch (error) {
        console.error('Error sending email with Resend:', error);
        throw error;
    }
};

module.exports = { sendMail };