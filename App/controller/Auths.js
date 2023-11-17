const compare = require("../utils/compare")
const setTime = require("../utils/setTime")
const library = require("../library/db-library")
class Auths {
    regist(req, res){
        library.createDb();
        const mdp = compare.compare(req.body.mdp, req.body.mdpConfirm);
        if (mdp === false) {
            res.send("Les mots de passe ne sont pas identiques")
        }
        else{
            const userData = {
                username: req.body.username, 
                password: req.body.mdp,
                email: req.body.email,
            }

            library.createUser(userData, (err, data) => {
                if(err) {
                    console.log("Erreur lors de la création de l'utilisateur", err);
                    res.status(500).send("Erreur serveur");
                } else {
                    res.render("connection");
                }
            }) 
        
        }
    }


    connect(req, res){

        console.log("Je suis bien là")
        // const email = req.body.email;
        // const password = req.body.mdp;

        // library.login(email, password, (err, result) =>{
        //     if(err) {
        //         res.status(500).send("Connexion impossible");
        //     } else {
        //         res.render(".");
        //     }
        // })
    
    }




}


module.exports = Auths;