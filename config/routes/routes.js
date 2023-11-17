const express = require('express');
const router = express.Router();


//Les controlleurs
const WelcomeController = require('../../App/controller/WelcomeController');
const welcomeController = new WelcomeController();

//cette route permet de pointer vers la méthode index du controller welcomeController
router.get('/', (req, res) => welcomeController.index(req, res));

module.exports = router