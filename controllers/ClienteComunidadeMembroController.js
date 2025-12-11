import Comunidade from '../models/comunidade.js';
import Musica from '../models/musica.js';

class ClienteComunidadeMembroController {
    async entrar(req, res) {
        try {
            const { id } = req.params;
            const comunidade = await Comunidade.findById(id);

            if (!comunidade) {
                return res.status(404).send('Comunidade não encontrada');
            }

            // Buscar perfis do cliente
            const perfis = await Musica.find();
            res.render('cliente/comunidades/entrar', { comunidade, perfis, erro: null });
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao acessar comunidade');
        }
    }

    async adicionarMembro(req, res) {
        try {
            const { id } = req.params;
            const { perfil } = req.body;

            if (!perfil) {
                return res.status(400).send('Perfil é obrigatório');
            }

            const comunidade = await Comunidade.findById(id);
            if (!comunidade) {
                return res.status(404).send('Comunidade não encontrada');
            }

            const perfilObj = await Musica.findById(perfil);
            if (!perfilObj) {
                return res.status(404).send('Perfil não encontrado');
            }

            // Verificar se já é membro
            const jaEMembro = comunidade.membros.some(m => m.perfil === perfil);
            if (jaEMembro) {
                const perfis = await Musica.find();
                return res.render('cliente/comunidades/entrar', { 
                    comunidade, 
                    perfis, 
                    erro: 'Você já é membro desta comunidade com este perfil' 
                });
            }

            // Adicionar membro
            comunidade.membros.push({
                artista: perfilObj.artista,
                perfil: perfil
            });

            await comunidade.save();
            res.redirect('/cliente/comunidades/lst');
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao entrar na comunidade');
        }
    }

    async sairComunidade(req, res) {
        try {
            const { id } = req.params;
            const { perfil } = req.body;

            const comunidade = await Comunidade.findById(id);
            if (!comunidade) {
                return res.status(404).send('Comunidade não encontrada');
            }

            comunidade.membros = comunidade.membros.filter(m => m.perfil !== perfil);
            await comunidade.save();

            res.redirect('/cliente/comunidades/lst');
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao sair da comunidade');
        }
    }
}

export default new ClienteComunidadeMembroController();
