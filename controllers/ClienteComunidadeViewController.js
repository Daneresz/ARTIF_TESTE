import Comunidade from '../models/comunidade.js'
import Post from '../models/post.js'
import Musica from '../models/musica.js'
import fs from 'fs/promises'
import { registrarDeletado } from '../utils/trashHelper.js'

export default class ClienteComunidadeViewController {
    constructor(caminhoBase = 'cliente/comunidades/') {
        this.caminhoBase = caminhoBase

        this._getFile = (req, fieldName) => {
            if (!req.files) return null
            if (req.files[fieldName]) return req.files[fieldName][0]
            if (Array.isArray(req.files)) {
                return req.files.find(f => f.fieldname === fieldName) || null
            }
            return null
        }

        this.ver = async (req, res) => {
            try {
                const comunidadeId = req.params.id
                const comunidade = await Comunidade.findById(comunidadeId)
                
                if (!comunidade) {
                    return res.status(404).send('Comunidade não encontrada')
                }

                // Buscar posts dessa comunidade
                const posts = await Post.find({ comunidade: comunidadeId }).sort({ createdAt: -1 })
                
                // Debug: log dos posts
                console.log('Posts encontrados:', posts.length)
                posts.forEach(p => {
                    console.log(`Post ID: ${p._id}, Artista: "${p.artista}", ArtistaDeletado: ${p.artistaDeletado}`)
                })
                
                // Buscar apenas as contas que são membros da comunidade
                const nomesMembros = comunidade.membros.map(m => m.artista);
                const contas = await Musica.find({ artista: { $in: nomesMembros } }).sort({ artista: 1 })

                res.render(this.caminhoBase + 'ver', { 
                    comunidade, 
                    posts: posts || [],
                    contas: contas || [],
                    comunidadeId
                })
            } catch (err) {
                console.error('Erro ao visualizar comunidade:', err)
                res.status(500).send('Erro ao visualizar comunidade: ' + err.message)
            }
        }

        this.adicionarPost = async (req, res) => {
            try {
                const comunidadeId = req.params.id
                const comunidade = await Comunidade.findById(comunidadeId)
                
                if (!comunidade) {
                    return res.status(404).send('Comunidade não encontrada')
                }

                if (!req.body.descricao || !req.body.descricao.trim()) {
                    return res.status(400).send('A mensagem do post é obrigatória')
                }
                if (!req.body.artista || !req.body.artista.trim()) {
                    return res.status(400).send('Artista é obrigatório')
                }

                // Com upload.any() global, procurar arquivo em req.files
                let imagemPath = ''
                if (req.files && req.files.length > 0) {
                    const imagemFile = req.files.find(f => f.fieldname === 'imagem')
                    if (imagemFile) {
                        imagemPath = '/uploads/' + imagemFile.filename
                    }
                }

                const novoPost = {
                    titulo: 'Post da Comunidade', // Título automático
                    artista: req.body.artista.trim(),
                    artes: [comunidade.arte], // A arte da comunidade
                    descricao: req.body.descricao?.trim() || '',
                    imagem: imagemPath,
                    comunidade: comunidadeId,
                    explorer: false // Posts de comunidade não são exploradores
                }

                await Post.create(novoPost)
                res.redirect('/cliente/comunidades/ver/' + comunidadeId)
            } catch (err) {
                console.error('Erro ao adicionar post à comunidade:', err.message)
                res.status(500).send('Erro ao adicionar post: ' + err.message)
            }
        }

        this.deletarPost = async (req, res) => {
            try {
                const postId = req.params.postId
                const comunidadeId = req.params.comunidadeId
                
                const post = await Post.findById(postId)
                if (!post) {
                    return res.status(404).send('Post não encontrado')
                }

                await registrarDeletado('post', post._id, post.toObject())
                await Post.findByIdAndDelete(postId)
                res.redirect('/cliente/comunidades/ver/' + comunidadeId)
            } catch (err) {
                console.error('Erro ao deletar post:', err)
                res.status(500).send('Erro ao deletar post')
            }
        }
    }
}
