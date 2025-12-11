import Solicitacao from '../models/solicitacao.js';
import Comunidade from '../models/comunidade.js';
import Arte from '../models/arte.js';

class AdminSolicitacaoController {
    async list(req, res) {
        try {
            const { tipo, status } = req.query;
            let query = {};

            if (tipo) query.tipo = tipo;
            if (status) query.status = status;

            const Solicitacoes = await Solicitacao.find(query).sort({ createdAt: -1 });
            res.render('admin/solicitacoes/lst', { Solicitacoes, filtroTipo: tipo || '', filtroStatus: status || '' });
        } catch (erro) {
            console.log(erro);
            res.render('admin/solicitacoes/lst', { Solicitacoes: [], filtroTipo: '', filtroStatus: '' });
        }
    }

    async aceitar(req, res) {
        try {
            const { id } = req.params;
            const solicitacao = await Solicitacao.findById(id);

            if (!solicitacao) {
                return res.status(404).send('Solicitação não encontrada');
            }

            if (solicitacao.tipo === 'arte') {
                await Arte.create({
                    titulo: solicitacao.nome,
                    descricao: solicitacao.descricao,
                    imagem: solicitacao.imagem
                });
            } else if (solicitacao.tipo === 'comunidade') {
                await Comunidade.create({
                    nome: solicitacao.nome,
                    descricao: solicitacao.descricao,
                    arte: solicitacao.arte,
                    imagem: solicitacao.imagem
                });
            }

            await Solicitacao.findByIdAndUpdate(id, { status: 'aceita' });
            res.redirect('/admin/solicitacoes/lst');
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao aceitar solicitação');
        }
    }

    async rejeitar(req, res) {
        try {
            const { id } = req.params;
            const { motivo } = req.body;

            const solicitacao = await Solicitacao.findById(id);
            if (!solicitacao) {
                return res.status(404).send('Solicitação não encontrada');
            }

            await Solicitacao.findByIdAndUpdate(id, { 
                status: 'rejeitada',
                motivoRejeicao: motivo || 'Sem motivo especificado'
            });

            res.redirect('/admin/solicitacoes/lst');
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao rejeitar solicitação');
        }
    }

    async openRejeitar(req, res) {
        try {
            const { id } = req.params;
            const solicitacao = await Solicitacao.findById(id);

            if (!solicitacao) {
                return res.status(404).send('Solicitação não encontrada');
            }

            res.render('admin/solicitacoes/rejeitar', { solicitacao });
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao abrir formulário de rejeição');
        }
    }

    async openVisualizar(req, res) {
        try {
            const { id } = req.params;
            const solicitacao = await Solicitacao.findById(id);

            if (!solicitacao) {
                return res.status(404).send('Solicitação não encontrada');
            }

            res.render('admin/solicitacoes/visualizar', { solicitacao });
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao visualizar solicitação');
        }
    }
}

export default new AdminSolicitacaoController();
