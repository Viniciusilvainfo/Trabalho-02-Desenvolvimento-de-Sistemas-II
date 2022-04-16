const { dbcon } = require("../config/connection-db");

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
}

module.exports = {
    User,
    UserDAO
};