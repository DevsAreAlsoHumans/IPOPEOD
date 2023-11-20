const compare = require("../utils/compare")
const setTime = require("../utils/setTime")
const library = require("../library/db-library");
const { userModel } = require("../models/userModel");
class Auths {
    regist(req, res){
        library.createDb();
        const { username, mdp, mdpConfirm, email } = req.body;
    
        if (!username || !mdp || !mdpConfirm || !email) {
            const echec = "Tous les champs sont requis.";
            res.render("register", {echec});
            return
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const echec = "Format d'email invalide.";
            res.render("register", {echec});
            return
        }
    
        if (mdp.length < 6) {
            const echec = "Le mot de passe doit contenir au moins 6 caractères.";
            res.render("register", {echec});
            return
        }
    
        // Comparer les mots de passe
        const mdpIdentiques = compare.compare(mdp, mdpConfirm);
        if (!mdpIdentiques) {
            const echec = "Les mots de passe ne sont pas identiques.";
            res.render("register", {echec});
            return
        }
    
        const userData = {
            username, 
            password: mdp,
            email
        };
    
        library.createUser(userData, (err, data) => {
            if (err) {
                const echec = "Erreur lors de la création de l'utilisateur "+err;
                res.render("register", {echec});
                return
            } else {
                res.render("connection");
            }
        });
    }
    


    connect(req, res){
        const { username, email, mdp } = req.body;

        if (!(username || email) || !mdp) {
            const echec = "Le nom d'utilisateur, l'email et le mot de passe sont requis.";
            res.render("connection", {echec});
            return
        }
    
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) 
            {
                const echec = "Format d'email invalide.";
                res.render("connection", {echec});
                return
            }
        }
    
        if (mdp.length === 0) 
        {
            const echec = "Le mot de passe ne peut pas être vide.";
            res.render("connection", {echec});
            return
        }
    
        const login = { username, email };
        const password = mdp;
    
        library.login(login, password, req, (err, result) => {
            if (err) {
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
        library.logout(req, res, (err, result) => {
            if(err) {
                res.status(500).send("Problème lors de la déconnexion "+err);
            } else {
                res.redirect("/");
            }
        })
    }

    lostPass(req, res){
        const email = req.body.email;
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const echec = "Format d'email invalide.";
                return res.render("lostpass", {echec});
            }
        }


        library.forgotPassword(email, (err, result)=>{
            if(err) {
                console.log(err);
                const msg = "Vous recevrez un mail à l'adresse spécifier si votre compte existe";
                res.render("lostPass", {msg})
            } else {
                library.sendPasswordResetEmail(email, result, (err, response) => {
                    if (err) {
                        console.log(err);
                        const echecmsg = "Une erreur est survenue. Impossible d'envoyer le mail";
                        res.render("lostPass", {echecmsg})
                    }
                    else{
                        console.log(response);
                        const msg = "Vous recevrez un mail à l'adresse spécifier si votre compte existe";
                        res.render("lostPass", {msg} )  
                    }
                })
                  
            }
        })
    }


    reset_password(req, res){
        const { mdp, mdpConfirm, token } = req.body;
    
        if (!mdp || !mdpConfirm) {
            const echec = "Tous les champs sont requis.";
            res.render("reset_password", {echec, token});
            return
        }
    
        if (mdp.length < 6) {
            const echec = "Le mot de passe doit contenir au moins 6 caractères.";
            res.render("reset_password", {echec, token});
            return
        }
    
        // Comparer les mots de passe
        const mdpIdentiques = compare.compare(mdp, mdpConfirm);
        if (!mdpIdentiques) {
            const echec = "Les mots de passe ne sont pas identiques.";
            res.render("reset_password", {echec, token});
            return
        }

        library.verifyToken(token, (err) => {
            if (err) {
                const echec = err;
                res.render("reset_password", {echec});
            } else {
                library.razMdp(mdp, token, (err) =>{
                    if (err) {
                        const echec = err;
                        res.render("reset_password", {echec});
                    }
                    const msg = "Mot de passe changé avec succès";
                    res.render("connection", {msg});
                })
            }
        })
        
    }



module.exports = Auths;