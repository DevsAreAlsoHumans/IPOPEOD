const express = require("express")
const path = require("path")
const { engine } = require("express-handlebars")
const appRouter = require('./routes')
const app = express()
const port = 8000

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startServer() {
    app.set('view engine', 'handlebars')
    app.set('views', path.join(__dirname, "../App/views/"))
    app.engine('handlebars', engine())
    app.use('/', appRouter)
    console.log("Creating server...")
    await sleep(2000)
    console.log("Starting server...")
    await sleep(3500)
    console.log("Your server is live !")
    await sleep(1000)
    app.listen(port, ()=> {
        console.log(`Exemple app listening on http://localhost:${port}/`)
    })
}

module.exports = { startServer };