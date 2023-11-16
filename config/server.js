const express = require("express")
const path = require("path")
const { engine } = require("express-handlebars")
const appRouter = require('./routes/routes')

const app = express()
const port = 8000

function startServer() {
    app.set('view engine', 'handlebars')
    app.set('views', path.join(__dirname, "../App/views"))
    app.engine('handlebars', engine())
    app.use('/App', appRouter)
    app.listen(port, ()=> {
        console.log(`Exemple app listen on http://localhost:${port}/`)
    })
}

module.exports = { startServer };