const { dbcon } = require("../config/connection-db");

// postgres://mguhwyxzuehniz:513393b8847a572e661667b54ca6560f9da2239d6d569004b671a0580229af8f@ec2-52-54-212-232.compute-1.amazonaws.com:5432/dfoselo3bnj81h
class Filme {
    constructor(id, nome, genero, sinopse, lancamento) {
        this.id = id;
        this.nome = nome;
        this.genero = genero;
        this.sinopse = sinopse;
        this.lancamento = lancamento;
    }
}

// DAO = DATA ACCESS OBJECT
class FilmeDAO {

    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM filmes where id = $1';
        const result = await dbcon.query(sql, [id]);
        const filme = result.rows[0];
        // const filme = new Filme() -> mundo ideal <3
        return filme;
    }

    static async atualiza(filme) {
        const sql = `UPDATE filmes
            SET nome = $2, 
                sinopse = $3,
                genero = $4,
                data_lancamento = $5
            WHERE id = $1;`;
        const values = [filme.id, filme.nome, filme.sinopse, filme.genero, filme.lancamento];
        
        try {
            await dbcon.query(sql, values);
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    static async cadastrar(filme) {
          
        const sql = 'INSERT INTO public.filmes (nome,genero,sinopse,data_lancamento) VALUES ($1, $2, $3, $4);';
        const values = [filme.nome, filme.genero, filme.sinopse, filme.lancamento];
        
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
        }
    }
}

module.exports = {
    Filme,
    FilmeDAO
};