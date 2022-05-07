const { dbcon } = require('../config/connection-db');
const { Grupo, GrupoDAO } = require('../models/grupo');
const { User, UserDAO } = require('../models/user');

class GruposController {

    async mostraCadastro(req, res) {
        return res.render('cadastrarGrupo', {user : req.session.user});
    }

    async cadastrar(req, res) {

        const grupoBody = req.body;

        const grupo = new Grupo(null, grupoBody.nome, grupoBody.adm);
        await GrupoDAO.cadastrar(grupo);
        return res.redirect('/');
    }

    async mostraAlterar(req, res) {
        // const { id } = req.params;
        // const filme = await FilmeDAO.buscaPeloId(id);
        // res.render('alterar-filme', { filme: filme })
    }

    async alterar(req, res) {
        // const { id } = req.params;
        // const { nome, genero, sinopse, lancamento} = req.body;
        // const grupo = new Grupo(id, nome, genero, sinopse, lancamento);
        
        // const resultado = await FilmeDAO.atualiza(filme);
        // res.send("Chamei o alterar do controller e fui pro banco... resultado " + resultado);
    }

    async listar(req, res) {

        let { page } = req.query;
        console.log({ page });

        page = page || 1;
        const limit = 5;
        const offset = limit * (page - 1);
        const sql = 'SELECT count(*) as qtde, grupo.nome, grupo.id, grupo.adm FROM grupo JOIN grupo_usuario ON grupo.id = grupo_usuario.grupo GROUP BY grupo.id order by 3 limit 5 offset $1';
        const values = [offset];
        const result = await dbcon.query(sql, values);
        let qtdeGrupos = await dbcon.query('SELECT count(*) from grupo');
        qtdeGrupos = qtdeGrupos.rows[0].count;
        return res.render('listagem', { user: req.session.user, grupos: result.rows, page, qtdeGrupos });
    }

    async detalhar(req, res) {
        const { id } = req.params;
        const grupo = await GrupoDAO.buscaPeloId(id);
        var tipo = undefined;

        if(req.session.user != undefined) {
            
            // ve se o usuario faz parte do grupo
            const result = await GrupoDAO.verificaGrupo(grupo, req.session.user);

            if(result.rows[0] != undefined) {
                tipo = result.rows[0];
                let { page } = req.query;
                console.log({ page });

                page = page || 1;
                const limit = 10;
                const offset = limit * (page - 1);
                //retorna as mensagens do grupo
                const mensagens = await GrupoDAO.mostrarMensagens(grupo, offset); 
                const sql = 'SELECT count(*) from mensagem where grupo = $1';
                const values = [grupo.id];
                var qtdeMensagens = await dbcon.query(sql, values);
                // console.log(qtdeMensagens);
                qtdeMensagens = qtdeMensagens.rows[0].count;
                const usuarios = await UserDAO.listarUsuarios(grupo); 
                if(mensagens == undefined) {
                    tipo = undefined;
                }

                if(usuarios == undefined) {
                    usuarios = undefined;
                }
                return res.render('detalhar', { grupo: grupo, user: req.session.user, mensagens:mensagens, tipo: tipo, usuarios:usuarios, qtdeMensagens:qtdeMensagens, page: page});
            }

        }

        return res.render('detalhar', { grupo: grupo, user: req.session.user, mensagens:undefined, tipo:tipo, usuarios:undefined });
    }

    async enviarMensagem(req, res) {
        const grupoBody = req.body;
        const dataAtual = await GrupoDAO.dataAtual();
        await GrupoDAO.cadastrarMensagem(grupoBody, dataAtual);

        return res.redirect('/grupos/'+grupoBody.grupo);
    }

    async adicionarUsuario(req, res) {
        const grupoBody = req.body;
        const user = new User (null, null, grupoBody.usuarioadd, null, null);

        const usuarioEncontrado = await UserDAO.logar(user);
        // console.log(usuarioEncontrado.rows[0]);
        if(usuarioEncontrado.rows[0] == undefined) return res.send('User nao encontrado');
        await GrupoDAO.adicionaGrupo(usuarioEncontrado.rows[0].id, grupoBody.grupo, grupoBody.tipo);
        return res.redirect('/');
    }

    async deletar(req, res) {
        // const { id } = req.params;
        // BUSCAR O FILME E REMOVER DO VETOR
        // const filmeIdx = filmes.findIndex(f => f.id == id);
        // filmes.splice(filmeIdx, 1);

        // FILTRAR O VETOR DE FILMES BASEADO NO ID != DO ID DA REMOÇÃO
        // filmes = filmes.filter(f => f.id != id);
        
        // BANCO - SQL COM DELETE WHERE

        // return res.redirect('/filmes')
    }

}

module.exports = { GruposController }