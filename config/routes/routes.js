const express = require('express');
const router = express.Router();


//Les controlleurs
const WelcomeController = require('../../App/controller/WelcomeController');
const welcomeController = new WelcomeController();

const AuthController = require('../../App/controller/Auths')
const authController = new AuthController();

//cette route permet de pointer vers la méthode index du controller welcomeController
router.get('/', (req, res) => welcomeController.index(req, res));


router.get('/register', (req, res) => welcomeController.register(req, res));
router.post('/register', (req, res) => authController.register(req, res))

router.get('/connection', (req, res) => welcomeController.connection(req, res));




module.exports = router