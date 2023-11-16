const mysql = require('mysql');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connexion à Mysql
const connection = mysql.createConnection({
    database: process.env.DB_NAME, 
    host: process.env.DB_HOST_NAME,     
    user: process.env.DB_USER,     
    password: process.env.DB_PASSWORD 
});

/**
 * Function to create Database and user Table
 */
function createDb() {
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connecté à MySQL!');
        
        // Créer une nouvelle base de données
        connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err, result) => {
            if (err) throw err;
            console.log('Base de données créée ou déjà existante');
        });
        
        // Créer une table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            token VARCHAR(255),
            blocked BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        connection.query(createTableQuery, (err, result) => {
            if (err) {
                console.error('Erreur lors de la création de la table `Users`:', err);
            } else {
                console.log('Table `Users` créée ou déjà existante');
            }
        });
    });
}

/**
 * @param {object} userData 
 * @param {function} callback
 */
function createUser(userData, callback) {  
    bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Erreur lors du hachage du mot de passe:', err);
            callback(err, null);
            return;
        }
        
        const query = `INSERT INTO users (username, email, password, blocked) VALUES (?, ?, ?, ?)`;

        connection.query(query, [userData.username, userData.email, hashedPassword, 0], (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'insertion du nouvel utilisateur:', err);
                callback(err, null);
            } else {
                callback(null, true);
            }
        });
    });
}

/**
 * @param {object} userData
 * @param {function} callback
 */
function updateUserMdp(userData, callback) {
    connection.query('SELECT * FROM users WHERE email = ? AND blocked = 0', [userData.email], (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'utilisateur:', err);
            callback(err, null);
            return;
        }

        if (results.length === 0) {
            console.log('L\'utilisateur est bloqué ou n\'existe pas.');
            callback(null, false);
            return;
        }

        bcrypt.hash(userData.newPass, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Erreur lors du hachage du mot de passe:', err);
                callback(err, null);
                return;
            }

            connection.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, userData.email], (err, result) => {
                if (err) {
                    console.error('Erreur lors de la mise à jour du mot de passe:', err);
                    callback(err, null);
                } else {
                    callback(null, true);
                }
            });
        });
    });
}

/**
 * @param {string} email
 * @param {function} callback
 */
function getUserByEmail(email, callback) {
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', err);
            callback(err, null);
            return;
        }

        if (results.length === 0) {
            console.log('Aucun utilisateur trouvé avec cet email:', email);
            callback(null, null);
            return;
        }

        callback(null, results[0]);
    });
}


/**
 * Fonction de connexion pour les utilisateurs
 * @param {string} login - Le nom d'utilisateur ou l'email de l'utilisateur
 * @param {string} password - Le mot de passe fourni par l'utilisateur
 * @param {function} callback - Une fonction de rappel pour gérer la réponse
 */
function login(login, password, callback) {
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
  
    connection.query(query, [login, login], (err, results) => {
      if (err) {
        console.error('Erreur lors de la recherche de l\'utilisateur:', err);
        callback(err, null);
        return;
      }
  
      if (results.length === 0) {
        console.log('Aucun utilisateur trouvé avec ce nom d\'utilisateur ou email:', login);
        callback(null, false);
        return;
      }
  
      const user = results[0];
  
      // Comparer le mot de passe fourni avec le mot de passe haché stocké
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Erreur lors de la comparaison des mots de passe:', err);
          callback(err, null);
          return;
        }
  
        if (!isMatch) {
          console.log('Mot de passe incorrect pour:', login);
          callback(null, false);
        } else {
          console.log('Connexion réussie');
          callback(null, true, user);
        }
      });
    });
  }

module.exports = { createDb, createUser, updateUserMdp, getUserByEmail, login }
