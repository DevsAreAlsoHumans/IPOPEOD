// Controlleur pour afficher les pages 

class WelcomeController {

    index(req, res) {
        res.render('home', {title:"hello"})
    }

    connection(req, res) {
        res.render('connection', {title:"connection page"})
    }

    register(req, res) {
        res.render('register', {title: "register page"})
    }

}

module.exports = WelcomeController;