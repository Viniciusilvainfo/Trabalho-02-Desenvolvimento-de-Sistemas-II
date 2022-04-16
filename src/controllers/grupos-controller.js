// const { nanoid } = require('nanoid');
const { dbcon } = require('../config/connection-db');
const { Grupo, GrupoDAO } = require('../models/grupo');

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
        const result = await dbcon.query('SELECT * FROM grupo');
        return res.render('listagem', { user: req.session.user, grupos: result.rows });
    }

    async detalhar(req, res) {
        const { id } = req.params;
        const grupo = await GrupoDAO.buscaPeloId(id);
        console.log(req.session.user);
        console.log(grupo);
        var tipo = undefined;
        if(req.session.user != undefined) {
            
            // ve se o usuario faz parte do grupo
            const result = await GrupoDAO.verificaGrupo(grupo, req.session.user);

            console.log(result.rows[0]);
            
            if(result.rows[0] != undefined) {
                tipo = result.rows[0];
                //retorna as mensagens do grupo
                const mensagens = await GrupoDAO.mostrarMensagens(grupo); 

                if(mensagens != undefined) {
                    console.log(mensagens + 'D');
                }else {
                    tipo = undefined;
                }
                return res.render('detalhar', { grupo: grupo, user: req.session.user, mensagens:mensagens, tipo: tipo});
            }
            
        }

        return res.render('detalhar', { grupo: grupo, user: req.session.user, mensagens:undefined, tipo:tipo });
    }

    async enviarMensagem(req, res) {
        const grupoBody = req.body;
        await GrupoDAO.dataAtual();
        console.log(grupoBody);
        // await GrupoDAO.cadastrarMensagem(grupoBody, data);
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