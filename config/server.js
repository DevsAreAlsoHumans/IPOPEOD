const express = require("express")
const path = require("path")
const appRouter = require('./routes/routes')

const app = express()
const port = 8000

function startServer() {
    app.set('view engine', 'html')
    app.set('views', path.join(__dirname, "/../App/views"))
    app.engine('html', require('ejs').renderFile)
    app.use('/app', appRouter)
    app.listen(port, ()=> {
        console.log(`Exemple app listen on http://localhost:${port}/`)
    })
}

module.exports = { startServer };