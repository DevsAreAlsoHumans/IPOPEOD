const compare = require("../utils/compare")
const setTime = require("../utils/setTime")
const library = require("../library/db-library")
class Auths {
    regist(req, res){
        library.createDb();
        const { username, mdp, mdpConfirm, email } = req.body;
    
        if (!username || !mdp || !mdpConfirm || !email) {
            return res.status(400).send("Tous les champs sont requis.");
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send("Format d'email invalide.");
        }
    
        if (mdp.length < 6) {
            return res.status(400).send("Le mot de passe doit contenir au moins 6 caractères.");
        }
    
        // Comparer les mots de passe
        const mdpIdentiques = compare.compare(mdp, mdpConfirm);
        if (!mdpIdentiques) {
            return res.status(400).send("Les mots de passe ne sont pas identiques.");
        }
    
        const userData = {
            username, 
            password: mdp,
            email
        };
    
        library.createUser(userData, (err, data) => {
            if (err) {
                console.log("Erreur lors de la création de l'utilisateur", err);
                return res.status(500).send("Erreur serveur");
            } else {
                res.render("connection");
            }
        });
    }
    


    connect(req, res){
        const { username, email, mdp } = req.body;
    
        if (!(username || email) || !mdp) {
            return res.status(400).send("Le nom d'utilisateur, l'email et le mot de passe sont requis.");
        }
    
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).send("Format d'email invalide.");
            }
        }
    
        if (mdp.length === 0) {
            return res.status(400).send("Le mot de passe ne peut pas être vide.");
        }
    
        const login = { username, email };
        const password = mdp;
    
        library.login(login, password, req, (err, result) => {
            if (err) {
                console.log("Erreur lors de la connexion", err);
                if(res.status(500))
                {
                    const echec = "Adresse mail ou mot de passe incorrect";
                    res.render("connection", {echec})
                    return
                }
            } else {
                const user = result.username;
                res.render("home", { user });
            }
        });
    }
    


    logout(req, res){
        library.logout(req, (err, result) => {
            if(err) {
                res.status(500).send("Problème lors de la déconnexion "+err);
            } else {
                res.render("home");
            }
        })
    }


}


module.exports = Auths;