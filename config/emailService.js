const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '../sendmail',
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_USE_SSL.toLowerCase() === 'true', // true pour le port 465, false pour les autres ports
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        // Nécessaire uniquement si le serveur nécessite une connexion TLS sécurisée
        rejectUnauthorized: process.env.EMAIL_USE_TLS.toLowerCase() === 'true'
    }
});



module.exports = transporter