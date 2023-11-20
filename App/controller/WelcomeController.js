// Controlleur pour afficher les pages 
class WelcomeController {

    index(req, res) { 
        res.render('home', {title:"Hello", connected: req.session.user !== undefined})
    }

    register(req, res) {
        res.render('register', {title:"Inscription", connected: req.session.user !== undefined})
    }

    connection(req, res) {
        res.render('connection', {title:"Connection", connected: req.session.user !== undefined})
    }

    lostPass(req, res) {
        res.render('lostPass', {title:"Mot de passe perdue", connected: req.session.user !== undefined })
    }

    reset_password(req, res) {
        const {token} = req.query;
        res.render('reset_password', {title:"Réinitialisation de mot de passe", connected: req.session.user !== undefined, token })
    }
}

module.exports = WelcomeController;