// Controlleur pour afficher les pages 

class WelcomeController {

    index(req, res) {
        res.render('home', {title:"hello"})
    }

}

module.exports = WelcomeController;