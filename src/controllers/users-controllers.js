const bcrypt = require('bcrypt');
const { User, UserDAO } = require('../models/user');
// const { dbcon } = require('../config/connection-db');
// const session = require('express-session');
// const { use } = require('bcrypt/promises');

class UsersController {
    async cadastrar(req, res) {

        const userBody = req.body;
        const senha = bcrypt.hashSync(userBody.senha, 10); 
        const user = new User (null, userBody.nome, userBody.email, senha, userBody.nascimento);

        await UserDAO.cadastrar(user);
        
        const usuarioEcontrado = await UserDAO.logar(user);
        
        req.session.user = usuarioEcontrado.rows[0];

        return res.redirect('/');
    }

    async login(req, res) {

        const userBody = req.body;
        const user = new User (null, null, userBody.email, userBody.senha, null);

        const usuarioEcontrado = await UserDAO.logar(user);

        if (usuarioEcontrado.rows[0] == undefined) return res.send('User nao encontrado');

        const confereSenha = await UserDAO.verificaSenha(user);

        if (confereSenha) {
            req.session.user = usuarioEcontrado.rows[0];
            return res.redirect('/');
        } else {
            return res.send('Senha nao confere...');
        }
    }

    async perfil(req, res) {
        return res.render('perfil', {user : req.session.user});
    }

    async logout(req, res) {
        req.session.destroy();

        return res.redirect('/');
    }

    async removerGrupo(req, res) {
        const userBody = req.body;
        console.log(userBody);

        await UserDAO.removerGrupo(userBody);

        return res.redirect('/');
    }

}

module.exports = UsersController;
