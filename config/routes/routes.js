const express = require('express');
const router = express.Router();


//Les controlleurs
const WelcomeController = require('../../App/controller/WelcomeController');
const welcomeController = new WelcomeController();

const AuthController = require('../../App/controller/Auths')
const authController = new AuthController();

//cette route permet de pointer vers la méthode index du controller welcomeController
router.get('/', (req, res) => welcomeController.index(req, res));


router.post('/register', (req, res) => authController.regist(req, res))
router.get('/register', (req, res) => welcomeController.register(req, res));


router.post('/connection', (req, res) => authController.connect(req, res));
router.get('/connection', (req, res) => welcomeController.connection(req, res));


router.get('/logout', (req, res) => authController.logout(req, res));

router.post('/lostpass', (req, res) => authController.lostPass(req, res));
router.get('/lostpass', (req, res) => welcomeController.lostPass(req, res));


router.post('/reset_password', (req, res) => authController.reset_password(req, res));
router.get('/reset_password', (req, res) => welcomeController.reset_password(req, res));



module.exports = router