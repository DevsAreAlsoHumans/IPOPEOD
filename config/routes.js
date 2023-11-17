const express = require('express');
const router = express.Router();


//Les controlleurs
const HomeController = require('../App/controller/HomeController');
const homeController = new HomeController();

//cette route permet de pointer vers la méthode index du controller welcomeController
router.get('/', (req, res) => homeController.index(req, res));

module.exports = router