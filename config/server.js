const express = require("express")
const appRouter = require('./routes/routes')

const app = express()
const port = 8000

function startServer() {
    app.set('view engine', 'html')
    app.engine('html', require('ejs').renderFile)
    app.use('/app', appRouter)
    app.listen(port, ()=> {
        console.log(`Exemple app listen on http://localhost:${port}/`)
    })
}

module.exports = { startServer };