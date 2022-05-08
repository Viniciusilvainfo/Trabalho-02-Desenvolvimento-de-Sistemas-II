const res = require("express/lib/response");
const { dbcon } = require("../config/connection-db");

class Grupo {
    constructor(id, nome, adm) {
        this.id = id;
        this.nome = nome;
        this.adm = adm;
    }
}

// DAO = DATA ACCESS OBJECT
class GrupoDAO {

    static async buscaPeloId(id) {
        // const sql = 'SELECT * FROM grupo where id = $1';
        const sql = 'SELECT count(*) as qtde, grupo.nome, grupo.id, grupo.adm FROM grupo JOIN grupo_usuario ON grupo.id = grupo_usuario.grupo WHERE grupo.id = $1 GROUP BY grupo.id';
        const result = await dbcon.query(sql, [id]);
        const grupo = result.rows[0];
        return grupo;
    }

    static async cadastrar(grupo) {
        const sql = 'INSERT INTO public.grupo (nome,adm) VALUES ($1, $2)  returning *;';
        const values = [grupo.nome, grupo.adm];

        try {
            const result = await dbcon.query(sql, values);
            const grupocriado = result.rows[0];
            this.adicionaGrupo(grupo.adm, grupocriado.id, 'adm');
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
        }
    }

    static async adicionaGrupo(user, grupo, tipo) {
        const sql = 'INSERT INTO public.grupo_usuario (usuario, grupo, tipo) VALUES ($1, $2, $3);';
        const values = [user, grupo, tipo];

        try {
            const result = await dbcon.query(sql, values);
            return result;
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
        }
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

    static async verificaGrupo(grupo, user) {
        const sql = 'SELECT tipo FROM grupo_usuario where usuario = $1 and grupo = $2';
        const values = [user.id, grupo.id];
        const result = await dbcon.query(sql, values);
        // const grupo = result.rows[0];
        return result;
    }

    static async dataAtual() {
        let d = new Date();
        let mes = d.getMonth()+1;
        const dataAtual = d.getFullYear() + '-'+mes+'-'+d.getDate()+ ' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        // console.log(dataAtual);
        return dataAtual;
    }

    static async mostrarMensagens(grupo, offset) {
        const sql = 'SELECT mensagem.dataenvio, mensagem.grupo, mensagem.texto, usuario.nome FROM mensagem join usuario on usuario.id = mensagem.usuario where grupo = $1 order by dataEnvio desc limit 10 offset $2;';
        // const sql = 'SELECT * FROM mensagem where grupo = $1 order by dataEnvio';
        const values = [grupo.id, offset];
        const mensagens = await dbcon.query(sql, values);
        return mensagens.rows;
    }

    static async cadastrarMensagem(dados, data) {
        const sql = 'INSERT INTO mensagem (usuario, dataEnvio, texto, grupo) values ($1, $2, $3, $4)';
        const values = [dados.usuario, data, dados.mensagem, dados.grupo];
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
        }
    }

    static async adicionarUsuario(dados) {
        const sql = 'INSERT INTO mensagem (usuario, dataEnvio, texto, grupo) values ($1, $2, $3, $4)';
        const values = [dados.usuario, data, dados.mensagem, dados.grupo];
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
        }
    }
}

module.exports = {
    Grupo,
    GrupoDAO
};