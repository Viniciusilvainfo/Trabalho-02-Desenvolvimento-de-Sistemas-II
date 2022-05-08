const bcrypt = require('bcrypt');
const { User, UserDAO } = require('../models/user');
const { Grupo, GrupoDAO } = require('../models/grupo');
// const { dbcon } = require('../config/connection-db');
// const session = require('express-session');
// const { use } = require('bcrypt/promises');

class UsersController {
    async cadastrar(req, res) {

        const userBody = req.body;
        const senha = bcrypt.hashSync(userBody.senha, 10); 
        const user = new User (null, userBody.nome, userBody.email, senha, userBody.nascimento);

        const usuarioEncontrado = await UserDAO.logar(user);
        if(usuarioEncontrado.rows.length > 0) {
            return res.send('Esse email já foi cadastrado no sistema <br><br> <a href="/user/cadastro.html">Voltar</a>');
        }else {
            await UserDAO.cadastrar(user);
            const usuarioEcontrado = await UserDAO.logar(user);
            req.session.user = usuarioEcontrado.rows[0];
            return res.redirect('/');
        }

    }

    async login(req, res) {

        const userBody = req.body;
        const user = new User (null, null, userBody.email, userBody.senha, null);

        const usuarioEcontrado = await UserDAO.logar(user);

        if (usuarioEcontrado.rows[0] == undefined) return res.send('User nao encontrado <br><br> <a href="/user/login.html">Voltar</a>');

        const confereSenha = await UserDAO.verificaSenha(user);

        if (confereSenha) {
            req.session.user = usuarioEcontrado.rows[0];
            return res.redirect('/');
        } else {
            return res.send('Senha nao confere <br><br> <a href="/user/login.html">Voltar</a>');
        }
    }

    async meusgrupos(req, res) {

        let meusgrupos = await UserDAO.meusGrupos(req.session.user.id);
        if(meusgrupos.rows.length > 0 ) {
            return res.render('meusgrupos', {user : req.session.user, meusgrupos: meusgrupos.rows});
        }else {
            return res.render('meusgrupos', {user : req.session.user, meusgrupos: undefined});
        }
    }

    async logout(req, res) {
        req.session.destroy();

        return res.redirect('/');
    }

    async removerGrupo(req, res) {
        const userBody = req.body;

        await UserDAO.removerGrupo(userBody);

        return res.redirect('/grupos/'+userBody.grupo);
    }

}

module.exports = UsersController;
