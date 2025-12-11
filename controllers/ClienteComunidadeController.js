import Comunidade from '../models/comunidade.js';
import Solicitacao from '../models/solicitacao.js';
import Arte from '../models/arte.js';

class ClienteComunidadeController {
    async openAdd(req, res) {
        try {
            const Artes = await Arte.find();
            res.render('cliente/comunidades/add', { Artes, erro: null, sucesso: null });
        } catch (erro) {
            res.render('cliente/comunidades/add', { Artes: [], erro: 'Erro ao carregar artes', sucesso: null });
        }
    }

    async add(req, res) {
        try {
            const { nome, descricao, arte } = req.body;
            const imagem = req.file ? `/uploads/${req.file.filename}` : null;

            if (!nome || !descricao || !arte) {
                const Artes = await Arte.find();
                return res.render('cliente/comunidades/add', { 
                    Artes, 
                    erro: 'Por favor, preencha todos os campos obrigatórios',
                    sucesso: null 
                });
            }

            await Solicitacao.create({
                tipo: 'comunidade',
                nome,
                descricao,
                arte,
                imagem,
                status: 'pendente'
            });

            const Artes = await Arte.find();
            res.render('cliente/comunidades/add', { 
                Artes, 
                erro: null,
                sucesso: 'Solicitação enviada! Aguarde aprovação do admin.'
            });
        } catch (erro) {
            console.log(erro);
            const Artes = await Arte.find();
            res.render('cliente/comunidades/add', { 
                Artes, 
                erro: 'Erro ao criar solicitação',
                sucesso: null 
            });
        }
    }

    async list(req, res) {
        try {
            const { busca } = req.query;
            let Comunidades;

            if (busca) {
                Comunidades = await Comunidade.find({
                    $or: [
                        { nome: { $regex: busca, $options: 'i' } },
                        { arte: { $regex: busca, $options: 'i' } }
                    ]
                });
            } else {
                Comunidades = await Comunidade.find();
            }

            res.render('cliente/comunidades/lst', { Comunidades, busca: busca || '' });
        } catch (erro) {
            console.log(erro);
            res.render('cliente/comunidades/lst', { Comunidades: [], busca: '' });
        }
    }
}

export default new ClienteComunidadeController();
