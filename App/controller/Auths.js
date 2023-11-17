const compare = require("../utils/compare")
const library = require("../library/db-library")
class Auths {
    regist(req, res){
        creatDb();
        const mdp = compare(res.mdp, res.mdpConfirm)
        if (!mdp) {
            res.send("Les mots de passe ne sont pas identiques")
        }
        else{
            const userData = {
                username: req.body.username, 
                password: mdp,
                email: req.body.email,
            }

            library.createUser(userData, (err, data) => {
                if(err) {
                    console.log("Erreur lors de la création de l'utilisateur", err);
                    res.status(500).send("Erreur serveur");
                } else {
                    console.log("Utilisateur créé avec succès");
                    res.status(200).send("Utilisateur créé");
                }
            }) 
        
        }
    }
}


module.exports = Authsuths;