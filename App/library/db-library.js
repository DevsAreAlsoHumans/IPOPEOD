const {userModel, connection} = require('../models/userModel');
const bcrypt = require('bcrypt');


    function createDb() {
        const dbName = process.env.DB_NAME;

        // Connexion à MySQL sans spécifier la base de données
        connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la base de données:', err);
                return;
            }
            console.log(`Base de données '${dbName}' créée ou déjà existante.`);

            // Changer pour utiliser la base de données créée
            connection.changeUser({ database: dbName }, (err) => {
                if (err) {
                    console.error('Erreur lors du changement de la base de données:', err);
                    return;
                }

                // Créer la table utilisateurs
                const createTableQuery = `
                    CREATE TABLE IF NOT EXISTS users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(255) NOT NULL UNIQUE,
                        email VARCHAR(255) NOT NULL UNIQUE,
                        password VARCHAR(255) NOT NULL,
                        role ENUM('user', 'admin', 'editor') DEFAULT 'user',
                        token VARCHAR(255),
                        blocked BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `;
                
                connection.query(createTableQuery, (err) => {
                    if (err) {
                        console.error('Erreur lors de la création de la table `users`:', err);
                        return;
                    }
                    console.log('Table `users` créée ou déjà existante.');
                });
            });
        });
    }

    
    /**
     * 
     * @param {Object} userData  
     * @param {Function} callback 
     */
    function createUser (userData, callback){
        bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
            if (err) {
                callback(err, null);
                return;
            }
            userModel.insertUser(userData.username, userData.email, hashedPassword, callback);
        });
    }


    /**
     * 
     * @param {Object} userData  
     * @param {Function} callback 
     */
    function updateUserMdp(userData, callback) {
        userModel.getUserByEmailOrUsername(userData.email, (err, results) => {
            if (err || results.length === 0) {
                callback(err || new Error('No user found or user is blocked'), null);
                return;
            }

            bcrypt.hash(userData.newPass, 10, (err, hashedPassword) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                userModel.updateUserPassword(userData.email, hashedPassword, callback);
            });
        });
    }


    /**
     * 
     * @param {String} login 
     * @param {String} password 
     * @param {Function} callback 
     */
    function login (login, password, callback){
        userModel.getUserByEmailOrUsername(login, (err, results) => {
            if (err || results.length === 0) {
                callback(err || new Error('Aucun utilisateur trouvé'), null);
                return;
            }

            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    callback(err || new Error('Mot de pass non identique'), null);
                    return;
                }
                // Création de la session
                req.session.user = { id: user.id, username: user.username, email: user.email };
                callback(null, user);
            });
        });
    }


    /**
     * 
     * @param {Object} req 
     * @param {Function} callback 
     */
    function logout(req, callback) {
        req.session.destroy((err) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, 'Déconnexion réussie');
        });
    }

    /**
     * 
     * @param {String} email 
     * @param {Function} callback 
     */
    function blockUser(email, callback){
        userModel.blockUser(email, (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, 'Utilisateur bloquer');
        });
    }


    /**
     * 
     * @param {String} email 
     * @param {Function} callback 
     */
    function unblockUser (email, callback){
        userModel.unblockUser(email, (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, 'Utilisateur débloquer');
        });
    }



    /**
     * 
     * @param {String} email 
     * @param {Function} callback 
     */
    function deleteUser(email, callback){
        userModel.deleteUser(email, (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, 'Utilisateur supprimer');
        });
    }



    /**
     * 
     * @param {Function} callback 
     */
    function getAllUsers(callback){
        userModel.getAllUsers((err, users) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, users);
        });
    }


module.exports = {
    createDb,
    createUser,
    login,
    logout,
    blockUser,
    updateUserMdp,
    unblockUser,
    deleteUser,
    getAllUsers
}
