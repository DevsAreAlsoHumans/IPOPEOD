// Controlleur pour afficher les pages 

class WelcomeController {

    index(req, res) { 
        res.render('home', {title:"Hello"})
    }

    register(req, res) {
        res.render('register', {title:"Inscription"})
    }

    connection(req, res) {
        res.render('connection', {title:"Connection"})
    }
}

module.exports = WelcomeController;