const bcrypt = require('bcrypt');
const { dbcon } = require('../config/connection-db');
const { User, UserDAO } = require('../models/user');
const session = require('express-session');

class UsersController {
    async cadastrar(req, res) {

        const userBody = req.body;
        const senha = bcrypt.hashSync(userBody.senha, 10); 

        const user = new User (null, userBody.nome, userBody.email, senha, userBody.nascimento);

        await UserDAO.cadastrar(user);

        const sql = 'SELECT id, nome, email FROM usuario where email like $1';
        const values = [userBody.email]; 
        const result = await dbcon.query(sql, values);
        
        req.session.user = result.rows;

        return res.redirect('/');
    }

    async login(req, res) {
        const userBody = req.body;
        
        // ACHAR COM O EMAIL CERTO
        // const { email, senha } = req.body;

        const sql = 'SELECT nome, email, senha FROM usuario where email like $1';
        const values = [userBody.email]; 
        const usuarioEcontrado = await dbcon.query(sql, values);

        if (usuarioEcontrado.rows[0] == undefined) return res.send('User nao encontrado');

        // VERIFICAR A SENHA
        const confere = bcrypt.compareSync(userBody.senha, usuarioEcontrado.rows[0].senha);
        if (confere) {
            req.session.user = usuarioEcontrado.rows;

        return res.redirect('/');
        } else {
            return res.send('Senha nao confere...');
        }
        
    }

    async logout(req, res) {
        req.session.destroy();

        return res.redirect('/');
    }
}

module.exports = UsersController;
