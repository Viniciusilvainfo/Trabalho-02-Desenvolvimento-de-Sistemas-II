const { Router } = require('express');
const UsersController = require('../controllers/users-controllers');

const routes = Router();

const usersController = new UsersController();

routes.post('/cadastrar', usersController.cadastrar);

routes.post('/login', usersController.login);

module.exports = routes;