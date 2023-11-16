const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('home', {title:"Accueil"})
})

router.get('/register', (req, res) => {
	res.render('register', {title:"Inscription"})
})

router.get('/connection', (req, res) => {
    res.render('connection', {title: "Connection Page"})
})

module.exports = router