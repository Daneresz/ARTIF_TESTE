import Comunidade from '../models/comunidade.js';
import Arte from '../models/arte.js';
import Post from '../models/post.js';
import { registrarDeletado } from '../utils/trashHelper.js';

class AdminComunidadeController {
    async openAdd(req, res) {
        try {
            const Artes = await Arte.find();
            res.render('admin/comunidades/add', { Artes, erro: null });
        } catch (erro) {
            res.render('admin/comunidades/add', { Artes: [], erro: 'Erro ao carregar artes' });
        }
    }

    async add(req, res) {
        try {
            const { nome, descricao, arte } = req.body;
            const imagem = req.file ? `/uploads/${req.file.filename}` : null;

            if (!nome || !descricao || !arte) {
                const Artes = await Arte.find();
                return res.render('admin/comunidades/add', { 
                    Artes, 
                    erro: 'Por favor, preencha todos os campos obrigatórios' 
                });
            }

            await Comunidade.create({
                nome,
                descricao,
                arte,
                imagem
            });

            res.redirect('/admin/comunidades/lst');
        } catch (erro) {
            console.log(erro);
            res.render('admin/comunidades/add', { 
                Artes: [], 
                erro: 'Erro ao criar comunidade' 
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

            res.render('admin/comunidades/lst', { Comunidades, busca: busca || '' });
        } catch (erro) {
            console.log(erro);
            res.render('admin/comunidades/lst', { Comunidades: [], busca: '' });
        }
    }

    async openEdt(req, res) {
        try {
            const { id } = req.params;
            const comunidade = await Comunidade.findById(id);
            const Artes = await Arte.find();
            const posts = await Post.find({ comunidade: id }).sort({ createdAt: -1 });
            
            console.log('Buscando posts para comunidade:', id);
            console.log('Posts encontrados:', posts);

            if (!comunidade) {
                return res.status(404).send('Comunidade não encontrada');
            }

            res.render('admin/comunidades/edt', { Comunidade: comunidade, Artes, posts: posts || [], erro: null });
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao carregar comunidade');
        }
    }

    async edt(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, arte } = req.body;
            const imagem = req.file ? `/uploads/${req.file.filename}` : undefined;

            if (!nome || !descricao || !arte) {
                const comunidade = await Comunidade.findById(id);
                const Artes = await Arte.find();
                return res.render('admin/comunidades/edt', { 
                    Comunidade: comunidade, 
                    Artes, 
                    erro: 'Por favor, preencha todos os campos obrigatórios' 
                });
            }

            const updateData = { nome, descricao, arte };
            if (imagem) updateData.imagem = imagem;

            await Comunidade.findByIdAndUpdate(id, updateData);
            res.redirect('/admin/comunidades/lst');
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao atualizar comunidade');
        }
    }

    async del(req, res) {
        try {
            const { id } = req.params;
            const comunidade = await Comunidade.findById(id);
            if (comunidade) {
                await registrarDeletado('comunidade', comunidade._id, comunidade.toObject());
            }
            await Comunidade.findByIdAndDelete(id);
            res.redirect('/admin/comunidades/lst');
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao deletar comunidade');
        }
    }

    async visualizarMembros(req, res) {
        try {
            const { id } = req.params;
            const comunidade = await Comunidade.findById(id);

            if (!comunidade) {
                return res.status(404).send('Comunidade não encontrada');
            }

            res.render('admin/comunidades/membros', { comunidade });
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao carregar membros');
        }
    }

    async deletarPost(req, res) {
        try {
            const { id, postId } = req.params;
            const post = await Post.findById(postId);
            
            if (!post) {
                return res.status(404).send('Post não encontrado');
            }

            await registrarDeletado('post', post._id, post.toObject());
            await Post.findByIdAndDelete(postId);
            res.redirect('/admin/comunidades/edt/' + id);
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao deletar post');
        }
    }

    async posts(req, res) {
        try {
            const { id } = req.params;
            const comunidade = await Comunidade.findById(id);
            
            if (!comunidade) {
                return res.status(404).send('Comunidade não encontrada');
            }
            
            const posts = await Post.find({ comunidade: id }).sort({ createdAt: -1 });
            
            console.log('Buscando posts para comunidade:', id);
            console.log('Posts encontrados:', posts);

            res.render('admin/comunidades/posts', { comunidade, posts: posts || [] });
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao carregar posts');
        }
    }

    async deletarPostDaPagina(req, res) {
        try {
            const { id, postId } = req.params;
            const post = await Post.findById(postId);
            
            if (!post) {
                return res.status(404).send('Post não encontrado');
            }

            await registrarDeletado('post', post._id, post.toObject());
            await Post.findByIdAndDelete(postId);
            
            // Detectar de onde veio a requisição para redirecionar corretamente
            const referer = req.get('referer') || '';
            if (referer.includes('/admin/comunidades/ver/')) {
                res.redirect('/admin/comunidades/ver/' + id);
            } else {
                res.redirect('/admin/comunidades/posts/' + id);
            }
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao deletar post');
        }
    }

    async criarPostAdm(req, res) {
        try {
            const { id } = req.params;
            const { descricao } = req.body;
            
            const comunidade = await Comunidade.findById(id);
            if (!comunidade) {
                return res.status(404).send('Comunidade não encontrada');
            }

            // Com upload.any() global, procurar arquivo em req.files
            let imagem = '';
            if (req.files && req.files.length > 0) {
                const imagemFile = req.files.find(f => f.fieldname === 'imagem')
                if (imagemFile) {
                    imagem = `/uploads/${imagemFile.filename}`
                }
            }

            await Post.create({
                titulo: 'Post do Administrador',
                descricao,
                artista: 'ADM',
                artes: [],
                imagem,
                comunidade: id,
                explorer: false,
                artistaDeletado: false
            });

            res.redirect('/admin/comunidades/posts/' + id);
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao criar post');
        }
    }

    async ver(req, res) {
        try {
            const { id } = req.params;
            const comunidade = await Comunidade.findById(id);
            if (!comunidade) {
                return res.status(404).send('Comunidade não encontrada');
            }

            const posts = await Post.find({ comunidade: id }).sort({ createdAt: -1 });
            
            res.render('admin/comunidades/ver', { 
                comunidade, 
                posts,
                comunidadeId: id
            });
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Erro ao carregar comunidade');
        }
    }
}

export default new AdminComunidadeController();
