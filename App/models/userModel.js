const mysql = require('mysql');
require('dotenv').config();

// Connexion à MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST_NAME,     
    user: process.env.DB_USER,     
    password: process.env.DB_PASSWORD 
});

const userModel = {
    
    // Insère un nouvel utilisateur dans la base de données
    insertUser: (username, email, hashedPassword, callback) => {
        const query = `INSERT INTO users (username, email, password, blocked) VALUES (?, ?, ?, ?)`;
        connection.query(query, [username, email, hashedPassword, 0], callback);
    },

    // Met à jour le mot de passe d'un utilisateur
    updateUserPassword: (email, hashedPassword, callback) => {
        const query = 'UPDATE users SET password = ? WHERE email = ? AND blocked = 0';
        connection.query(query, [hashedPassword, email], callback);
    },

    // Récupère un utilisateur par email ou username
    getUserByEmailOrUsername: (login, callback) => {
        const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
        connection.query(query, [login, login], callback);
    },

     // Bloquer un utilisateur
     blockUser: (email, callback) => {
        const query = 'UPDATE users SET blocked = 1 WHERE email = ?';
        connection.query(query, [email], callback);
    },

    // Débloquer un utilisateur
    unblockUser: (email, callback) => {
        const query = 'UPDATE users SET blocked = 0 WHERE email = ?';
        connection.query(query, [email], callback);
    },

    // Supprimer un utilisateur
    deleteUser: (email, callback) => {
        const query = 'DELETE FROM users WHERE email = ?';
        connection.query(query, [email], callback);
    },

    // Récupérer tous les utilisateurs
    getAllUsers: (callback) => {
        const query = 'SELECT * FROM users';
        connection.query(query, callback);
    }
};

module.exports = {userModel, connection};
