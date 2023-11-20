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

app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: parseInt(process.env.COOKIE_MAX_AGE),
        domain: process.env.COOKIE_DOMAIN,
        path: process.env.COOKIE_PATH,
        httpOnly: process.env.COOKIE_HTTP_ONLY.toLowerCase() === 'true',
        secure: process.env.COOKIE_SECURE.toLowerCase() === 'true',
        sameSite: process.env.COOKIE_SAME_SITE
    }
}));

function startServer() {
    app.use(express.urlencoded({ extended: true })); 
    app.set('view engine', 'handlebars')
    app.set('views', path.join(__dirname, "../App/views/"))
    app.engine('handlebars', engine())
    app.use('/', appRouter)
    // app.use(bodyparser.urlencoded({extended: true}));
    
    app.listen(port, ()=> {
        console.log(`Exemple app listen on http://localhost:${port}/`)
    })

    // Route protégée
    // Route accessible seulement par les utilisateurs avec le rôle spécifier
    // router.get('/admin-only', isAuthenticated, hasPermission('admin'), (req, res) => {
    //     res.send("Bienvenue sur la page d'administration.");
    // });

}

module.exports = { startServer };