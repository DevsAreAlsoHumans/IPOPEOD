const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données MySQL:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

module.exports = connection;
