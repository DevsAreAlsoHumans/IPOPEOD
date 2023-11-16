const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('home', {title:"Accueil"})
})

router.get('/register', (req, res) => {
	res.render('register', {title:"Inscription"})
})

module.exports = router