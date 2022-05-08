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
    }

    async alterar(req, res) {
    }

    async listar(req, res) {

        let { page } = req.query;

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

            const result = await GrupoDAO.verificaGrupo(grupo, req.session.user);

            if(result.rows[0] != undefined) {
                tipo = result.rows[0];
                let { page } = req.query;

                page = page || 1;
                const limit = 10;
                const offset = limit * (page - 1);
                const mensagens = await GrupoDAO.mostrarMensagens(grupo, offset); 
                const sql = 'SELECT count(*) from mensagem where grupo = $1';
                const values = [grupo.id];
                var qtdeMensagens = await dbcon.query(sql, values);
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

        return res.render('detalhar', { grupo: grupo, user: req.session.user, mensagens:undefined, tipo:tipo, usuarios:undefined, qtdeMensagens:undefined, page:undefined });
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
        if(usuarioEncontrado.rows[0] == undefined) return res.send('User nao encontrado <br><br> <a href="/grupos/'+grupoBody.grupo+'">Voltar</a>');
        console.log(grupoBody.tipo);
        if(grupoBody.tipo != undefined) {
            await GrupoDAO.adicionaGrupo(usuarioEncontrado.rows[0].id, grupoBody.grupo, grupoBody.tipo);
        } else {
            return res.send('Informe um tipo para o usuário <br><br> <a href="/grupos/'+grupoBody.grupo+'">Voltar</a>');
        }
        return res.redirect('/grupos/'+grupoBody.grupo);
    }

    async deletar(req, res) {
    }

}

module.exports = { GruposController }