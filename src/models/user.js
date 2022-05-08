const { dbcon } = require("../config/connection-db");
const bcrypt = require('bcrypt');
const { GruposController } = require("../controllers/grupos-controller");

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

    static async meusGrupos(user) {
        const sql = 'SELECT * FROM usuario join grupo_usuario on usuario.id = grupo_usuario.usuario join grupo on grupo.id = grupo_usuario.grupo where usuario.id = $1';
        const values = [user];

        const grupos = await dbcon.query(sql, values);
        return grupos;
    }

    static async listarUsuarios(grupo) {
        const sql = 'SELECT usuario.id, usuario.nome, grupo_usuario.tipo FROM grupo join grupo_usuario on grupo.id = grupo_usuario.grupo join usuario on usuario.id = grupo_usuario.usuario where grupo.id = $1 order by 3, 2;';
        const values = [grupo.id];
        // console.log('esse é o grupo '+ grupo.id);

        const usuarios = await dbcon.query(sql, values);

        return usuarios.rows;
    }

    static async removerGrupo(dados) {
        const sql = 'delete from grupo_usuario where grupo = $1 and usuario = $2';
        const values = [dados.grupo, dados.usuario];

        try {
            await dbcon.query(sql, values);
        }catch (error) {
            console.log('NAO FOI POSSIVEL DELETER DO BANCO');
            console.log({ error });
        }
    }
}

module.exports = {
    User,
    UserDAO
};