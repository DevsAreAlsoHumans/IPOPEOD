// Controlleur pour afficher les pages 

class HomeController {

    index(req, res) { 
        res.render('home', {title:"Hello"})
    }
}

module.exports = HomeController;