// Controlleur pour afficher les pages 
class WelcomeController {

    index(req, res) { 
        res.render('home', {title:"Hello", connected: req.session != null })
    }

    register(req, res) {
        res.render('register', {title:"Inscription", connected: req.session != null})
    }

    connection(req, res) {
        res.render('connection', {title:"Connection", connected: req.session != null})
    }
}

module.exports = WelcomeController;