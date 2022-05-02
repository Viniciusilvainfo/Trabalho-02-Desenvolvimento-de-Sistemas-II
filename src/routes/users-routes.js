const { Router } = require('express');
const UsersController = require('../controllers/users-controllers');

const routes = Router();

const usersController = new UsersController();

routes.post('/cadastrar', usersController.cadastrar);

routes.post('/login', usersController.login);

routes.get('/perfil', usersController.perfil);

routes.get('/logout', usersController.logout);

routes.post('/removerGrupo', usersController.removerGrupo);

module.exports = routes;