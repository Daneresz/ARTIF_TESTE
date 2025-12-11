import Post from '../models/post.js';
import { registrarDeletado } from '../utils/trashHelper.js';
import Musica from '../models/musica.js'
import Arte from '../models/arte.js'
import fs from 'fs/promises'

export default class AdminPostController {
    constructor(caminhoBase = 'admin/posts/') {
        this.caminhoBase = caminhoBase

        this._getFile = (req, fieldName) => {
            if (!req.files) return null
            if (req.files[fieldName]) return req.files[fieldName][0]
            if (Array.isArray(req.files)) {
                return req.files.find(f => f.fieldname === fieldName) || null
            }
            return null
        }

        this.openAdd = async (req, res) => {
            try {
                const artistas = await Musica.find().sort({ artista: 1 })
                const artes = await Arte.find().sort({ titulo: 1 })
                console.log('Artistas encontrados:', artistas.length)
                console.log('Artes encontradas:', artes.length)
                res.render(this.caminhoBase + 'add', { Artistas: artistas || [], Artes: artes || [] })
            } catch (err) {
                console.error('Erro ao buscar artistas e artes:', err.message)
                try {
                    res.render(this.caminhoBase + 'add', { Artistas: [], Artes: [] })
                } catch (renderErr) {
                    console.error('Erro ao renderizar:', renderErr.message)
                    res.status(500).send('Erro ao carregar página: ' + renderErr.message)
                }
            }
        }

        this.add = async (req, res) => {
            try {
                const imagemFile = this._getFile(req, 'imagem')
                const imagemPath = imagemFile ? '/uploads/' + imagemFile.filename : ''

                if (!req.body.titulo || !req.body.titulo.trim()) {
                    return res.status(400).send('Título é obrigatório')
                }
                if (!req.body.artista || !req.body.artista.trim()) {
                    return res.status(400).send('Artista é obrigatório')
                }

                let artes = []
                if (req.body.artes) {
                    artes = Array.isArray(req.body.artes) ? req.body.artes : [req.body.artes]
                }

                const novoPost = {
                    titulo: req.body.titulo.trim(),
                    artista: req.body.artista.trim(),
                    artes: artes,
                    descricao: req.body.descricao?.trim() || '',
                    imagem: imagemPath,
                    explorer: artes.length === 0
                }

                console.log('Criando post:', novoPost)
                await Post.create(novoPost)
                res.redirect('/' + this.caminhoBase + 'add')
            } catch (err) {
                console.error('Erro ao adicionar post:', err.message)
                res.status(500).send('Erro ao adicionar post: ' + err.message)
            }
        }

        this.list = async (req, res) => {
            try {
                const busca = req.query.busca || ''
                let filtro = {}
                if (busca) {
                    const regex = { $regex: busca, $options: 'i' }
                    filtro = {
                        $or: [
                            { titulo: regex },
                            { artista: regex }
                        ]
                    }
                }
                const resultado = await Post.find(filtro).sort({ createdAt: -1 })
                res.render(this.caminhoBase + 'lst', { Posts: resultado, busca })
            } catch (err) {
                console.error('Erro ao listar posts:', err.message)
                res.status(500).send('Erro ao listar posts')
            }
        }

        this.openEdt = async (req, res) => {
            try {
                const id = req.params.id
                const post = await Post.findById(id)
                const artistas = await Musica.find().sort({ artista: 1 })
                const artes = await Arte.find().sort({ titulo: 1 })
                if (!post) {
                    return res.status(404).send('Post não encontrado')
                }
                console.log('Artes encontradas para edição:', artes.length)
                res.render(this.caminhoBase + 'edt', { Post: post, Artistas: artistas || [], Artes: artes || [] })
            } catch (err) {
                console.error('Erro ao abrir edição:', err.message)
                try {
                    res.render(this.caminhoBase + 'edt', { Post: {}, Artistas: [], Artes: [] })
                } catch (renderErr) {
                    console.error('Erro ao renderizar edição:', renderErr.message)
                    res.status(500).send('Erro ao abrir edição: ' + renderErr.message)
                }
            }
        }

        this.edt = async (req, res) => {
            try {
                const id = req.params.id
                const imagemFile = this._getFile(req, 'imagem')

                if (!req.body.titulo || !req.body.titulo.trim()) {
                    return res.status(400).send('Título é obrigatório')
                }
                if (!req.body.artista || !req.body.artista.trim()) {
                    return res.status(400).send('Artista é obrigatório')
                }

                let artes = []
                if (req.body.artes) {
                    artes = Array.isArray(req.body.artes) ? req.body.artes : [req.body.artes]
                }

                const update = {
                    titulo: req.body.titulo.trim(),
                    artista: req.body.artista.trim(),
                    artes: artes,
                    descricao: req.body.descricao?.trim() || '',
                    explorer: artes.length === 0
                }

                if (imagemFile) update.imagem = '/uploads/' + imagemFile.filename

                await Post.findByIdAndUpdate(id, update)
                res.redirect('/' + this.caminhoBase + 'lst')
            } catch (err) {
                console.error('Erro ao editar post:', err.message)
                res.status(500).send('Erro ao editar post: ' + err.message)
            }
        }

        this.del = async (req, res) => {
            try {
                const post = await Post.findById(req.params.id);
                if (post) {
                    await registrarDeletado('post', post._id, post.toObject());
                }
                await Post.findByIdAndDelete(req.params.id)
                res.redirect('/' + this.caminhoBase + 'lst')
            } catch (err) {
                console.error('Erro ao deletar post:', err.message)
                res.status(500).send('Erro ao deletar post')
            }
        }
    }
}
