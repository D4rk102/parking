const express = require('express');
const newLocal = '../controllers/LoginController';
const LoginController = require(newLocal);

const router = express.Router();

router.get('/login', LoginController.login);
router.post('/login', LoginController.auth);
router.get('/register', LoginController.register);
router.post('/register', LoginController.storeUser);
router.get('/logout', LoginController.logout);

module.exports = router;