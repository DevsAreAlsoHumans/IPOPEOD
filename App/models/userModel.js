const connection = require("../../config/database")
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

    // Récupère ou vérifie un utilisateur par email ou username
    getUserByEmailOrUsername: (login, callback) => {
        const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
        connection.query(query, [login.username, login.email], callback); 
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
    },

    savePasswordResetToken: (email, token, token_expiration, callback) => {
        const query = 'UPDATE users SET token = ?, token_exp = ? WHERE email = ?';
        connection.query(query, [token, token_expiration, email], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results);
        });
    },

    verifyToken: (token, callback) => {
        const query = 'SELECT * FROM users WHERE token = ?';
        connection.query(query, [token], (err, results) => {
            if (err) {
                return callback(err, null);
            }
    
            if (results.length === 0) {
                return callback('Token invalide', null);
            }
    
            const user = results[0];
            const expiration = user.token_exp;
    
            if (new Date() > expiration) {
                return callback('Token expiré', null);
            }
    
            callback(null, true);
        });
    },
    

    resetPassword: (hashedPassword, token, callback) => {
        // Mettre à jour le mot de passe
        const updatePasswordQuery = 'UPDATE users SET password = ? WHERE token = ?';
        connection.query(updatePasswordQuery, [hashedPassword, token], (err, updateResults) => {
            if (err) {
                return callback(err);
            }
    
            // Vérifiez si la mise à jour a affecté des lignes
            if (updateResults.affectedRows === 0) {
                return callback('Token invalide ou expiré');
            }
    
            // Supprimer le token
            const removeTokenQuery = 'UPDATE users SET token = NULL WHERE token = ?';
            connection.query(removeTokenQuery, [token], (err, removeTokenResults) => {
                if (err) {
                    return callback(err);
                }
                callback(null, removeTokenResults);
            });
        });
    }
    
    


};

module.exports = {userModel, connection};
