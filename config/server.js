const express = require("express")
const path = require("path")
const bodyparser = require('body-parser')
const { engine } = require("express-handlebars")
const session = require('express-session');
const appRouter = require('./routes/routes')
const router = express.Router();
const app = express()
const port = 8000


// Middleware d'authentification
const {isAuthenticated, hasPermission } = require('../App/middleware/auths_middleware'); 


function startServer() {
    app.set('view engine', 'handlebars')
    app.set('views', path.join(__dirname, "../App/views/"))
    app.engine('handlebars', engine())
    app.use('/', appRouter)
    app.use(bodyparser.urlencoded({extended: true}));
    app.listen(port, ()=> {
        console.log(`Exemple app listen on http://localhost:${port}/`)
    })

    // app.use(session({
    //     secret: process.env.SESSION_SECRET, 
    //     resave: false,
    //     saveUninitialized: true,
    // }));
    // Route protégée
    // Route accessible seulement par les utilisateurs avec le rôle spécifier
    // router.get('/admin-only', isAuthenticated, hasPermission('admin'), (req, res) => {
    //     res.send("Bienvenue sur la page d'administration.");
    // });

}

module.exports = { startServer };