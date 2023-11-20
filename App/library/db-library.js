const {userModel, connection} = require('../models/userModel');
const transporter = require('../../config/emailService');
const bcrypt = require('bcrypt');
const crypto = require('crypto');



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
                        token_exp DATETIME,  
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
                callback(err || new Error('Cet utilisateur n\'existe pas ou est bloqué'), null);
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
     * @param {Object} login 
     * @param {String} password 
     * @param {Function} callback 
     */
    function login (login, password, req, callback){
        userModel.getUserByEmailOrUsername(login, (err, results) => {
            if (err || results.length === 0) {
                callback(err, null);
                return;
            }

            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    callback(err, null);
                    return;
                } else{
                    // Création de la session
                    req.session.user = { id: user.id, username: user.username, email: user.email };
                    callback(null, user);
                }
                
            });
        });
    }


    /**
     * 
     * @param {Object} req 
     * @param {Function} callback 
     */
    function logout(req, res, callback) {
        req.session.destroy((err) => {
            if (err) {
                callback(err, null);
                return;
            }
            res.clearCookie('connect.sid');
            callback(null, null);
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


    /**
     * 
     * @param {String} email 
     * @param {Function} callback 
     */
    function forgotPassword(email, callback){
        userModel.getUserByEmailOrUsername({email: email}, (err, result) => {
            if (err) {
                callback("Erreur lors de la vérification de l'utilisateur", null)
                return
            }
    
            if (result.length === 0) {
                callback("Aucun utilisateur trouvé", null)
                return
            }

            const token = crypto.randomBytes(20).toString('hex');
            const token_expiration = new Date(); // Date et heure actuelles
            token_expiration.setHours(token_expiration.getHours() + 1); // Ajoute 1 heure à la date a laquelle le token est générer
            userModel.savePasswordResetToken(email, token, token_expiration, (err, result) => {
                if (err) {
                    console.log("Erreur lors de la sauvegarde du token", err);
                    return res.status(500).send("Erreur serveur lors de la sauvegarde du token");
                }else{
                    callback(err, token);
                }
            })            
        })
    }


    /**
     * 
     * @param {String} token 
     * @param {Function} callback 
     */
    function verifyToken(token, callback) {
        userModel.verifyToken(token, (err) => {
            if(err){
                return callback(err)
            }
            callback(null)
        })
    }


    /**
     * 
     * @param {String} email 
     * @param {String} token 
     * @param {Function} callback 
     */
    function sendPasswordResetEmail(email, token, callback) {
        const mailOptions = {
            from: process.env.EMAIL_FROM, 
            to: email, 
            subject: 'Réinitialisation de votre mot de passe',
            text: `Pour réinitialiser votre mot de passe, cliquez sur ce lien: ${process.env.FRONTEND_URL}/reset_password/?token=${token}`
        };
    
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, 'Email envoyé: ' + info.response)
            }
        });
    }


    function razMdp(mdp, token, callback){
        bcrypt.hash(mdp, 10, (err, hashedPassword) => {
            if (err) {
                
                return callback(err);
            }
            userModel.resetPassword(hashedPassword, token, callback)
        })
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
    getAllUsers,
    forgotPassword,
    verifyToken,
    sendPasswordResetEmail,
    razMdp,
}
