const { Router } = require('express');

const { GruposController } = require('../controllers/grupos-controller');

const routes = Router();

const gruposController = new GruposController();

routes.get('/cadastrar', gruposController.mostraCadastro);

routes.get('/deletar/:id', gruposController.deletar);

routes.get('/', gruposController.listar);

routes.get('/:id', gruposController.detalhar);

routes.post('/:id/enviarMensagem', gruposController.enviarMensagem);

routes.post('/:id/adicionarUsuario', gruposController.adicionarUsuario);

// mesmo que /grupos
routes.post('/', gruposController.cadastrar);

routes.get('/alterar/:id', gruposController.mostraAlterar);
routes.post('/alterar/:id', gruposController.alterar);

module.exports = routes;