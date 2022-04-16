const { dbcon } = require("../config/connection-db");
const bcrypt = require('bcrypt');

class User {
    constructor(id, nome, email, senha, nascimento) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.nascimento = nascimento;
    }
}

class UserDAO {

    static async cadastrar(user) {

        const sql = 'INSERT INTO public.usuario (nome, email, senha, nascimento) VALUES ($1, $2, $3, $4);';
        const values = [user.nome, user.email, user.senha, user.nascimento];

        try {
            await dbcon.query(sql, values);
        }catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR NO BANCO');
            console.log({ error });
        }
    }

    static async logar(user) {
        const sql = 'SELECT id, nome, email FROM usuario where email like $1';
        const values = [user.email]; 
        const usuarioEcontrado = await dbcon.query(sql, values);
        return usuarioEcontrado;
    }

    static async verificaSenha(user) {
        const sql = 'SELECT senha FROM usuario where email like $1';
        const values = [user.email];

        const usuarioEcontrado = await dbcon.query(sql, values);

        const confereSenha = bcrypt.compareSync(user.senha, usuarioEcontrado.rows[0].senha);

        return confereSenha;
    }
}

module.exports = {
    User,
    UserDAO
};