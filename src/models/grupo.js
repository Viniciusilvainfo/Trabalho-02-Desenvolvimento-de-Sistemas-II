const { dbcon } = require("../config/connection-db");

class Grupo {
    constructor(id, nome, email, senha, nascimento) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.nascimento = nascimento;
    }
}

// DAO = DATA ACCESS OBJECT
class GrupoDAO {

    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM grupo where id = $1';
        const result = await dbcon.query(sql, [id]);
        const grupo = result.rows[0];
        // const filme = new Filme() -> mundo ideal <3
        return grupo;
    }

    static async atualiza(grupo) {
        // const sql = `UPDATE filmes
        //     SET nome = $2, 
        //         sinopse = $3,
        //         genero = $4,
        //         data_lancamento = $5
        //     WHERE id = $1;`;
        // const values = [filme.id, filme.nome, filme.sinopse, filme.genero, filme.lancamento];
        
        // try {
        //     await dbcon.query(sql, values);
        //     return true;
        // } catch (error) {
        //     console.log({ error });
        //     return false;
        // }
    }

    static async cadastrar(grupo) {

        // const sql = 'INSERT INTO public.filmes (nome,genero,sinopse,data_lancamento) VALUES ($1, $2, $3, $4);';
        // const values = [filme.nome, filme.genero, filme.sinopse, filme.lancamento];
        
        // try {
        //     await dbcon.query(sql, values);
        // } catch (error) {
        //     console.log('NAO FOI POSSIVEL INSERIR');
        //     console.log({ error });
        // }
    }
}

module.exports = {
    Grupo,
    GrupoDAO
};