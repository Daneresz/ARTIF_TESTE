import Musica from '../models/musica.js'
import Arte from '../models/arte.js'
import Post from '../models/post.js'
import fs from 'fs/promises'
import { registrarDeletado } from '../utils/trashHelper.js'

export default class MusicController {
    constructor(caminhoBase = 'artista/') {
        this.caminhoBase = caminhoBase

        // helper para obter arquivo enviado, funciona com upload.fields() (obj) e upload.any() (array)
        this._getFile = (req, fieldName) => {
            if (!req.files) return null
            // multer with fields() produces object: req.files[fieldName] = [file]
            if (req.files[fieldName]) return req.files[fieldName][0]
            // multer any() produces array
            if (Array.isArray(req.files)) {
                return req.files.find(f => f.fieldname === fieldName) || null
            }
            return null
        }

        this.publicList = async (req, res) => {
            try {
                const busca = req.query.busca || ''
                let filtro = {}
                if (busca) {
                    const regex = { $regex: busca, $options: 'i' }
                    const or = [ { arte: regex }, { artista: regex } ]
                    // se a busca for numérica, também compare com idade (Number)
                    if (/^\d+$/.test(busca)) {
                        or.push({ idade: Number(busca) })
                    }
                    filtro = { $or: or }
                }
                const resultado = await Musica.find(filtro).sort({ createdAt: -1 })
                res.render(this.caminhoBase + 'public', { Musicas: resultado, busca })
            } catch (err) {
                console.error('Erro ao listar artistas:', err)
                res.status(500).send('Erro ao listar artistas')
            }
        }

        this.openAdd = async (req, res) => {
            try {
                const artes = await Arte.find().sort({ titulo: 1 })
                console.log('Artes encontradas:', artes.length)
                res.render(this.caminhoBase + 'add', { Artes: artes || [] })
            } catch (err) {
                console.error('Erro ao buscar artes:', err.message)
                try {
                    res.render(this.caminhoBase + 'add', { Artes: [] })
                } catch (renderErr) {
                    console.error('Erro ao renderizar:', renderErr.message)
                    res.status(500).send('Erro ao carregar página: ' + renderErr.message)
                }
            }
        }

        this.add = async (req, res) => {
            try {
                const imagemFile = this._getFile(req, 'perfil')
                const imagemPath = imagemFile ? '/uploads/' + imagemFile.filename : '/img/user-placeholder.svg'

                // Validação básica
                if (!req.body.artista || !req.body.artista.trim()) {
                    return res.status(400).send('Nome do artista é obrigatório')
                }
                if (!req.body.artes || (Array.isArray(req.body.artes) ? req.body.artes.length === 0 : !req.body.artes)) {
                    return res.status(400).send('Selecione pelo menos uma arte')
                }
                if (!req.body.idade || req.body.idade === '') {
                    return res.status(400).send('Idade é obrigatória')
                }

                const artes = Array.isArray(req.body.artes) ? req.body.artes : [req.body.artes]

                await Musica.create({
                    artista: req.body.artista.trim(),
                    artes: artes,
                    arte: artes[0],
                    idade: Number(req.body.idade),
                    perfil: imagemPath,
                })
                res.redirect('/' + this.caminhoBase + 'add')
            } catch (err) {
                console.error('Erro ao adicionar artista:', err)
                res.status(500).send('Erro ao adicionar artista: ' + err.message)
            }
        }

        this.list = async (req, res) => {
            try {
                const busca = req.query.busca || ''
                let filtro = {}
                if (busca) {
                    const regex = { $regex: busca, $options: 'i' }
                    const or = [ { arte: regex }, { artista: regex } ]
                    if (/^\d+$/.test(busca)) {
                        or.push({ idade: Number(busca) })
                    }
                    filtro = { $or: or }
                }
                const resultado = await Musica.find(filtro).sort({ createdAt: -1 })
                res.render(this.caminhoBase + 'lst', { Musicas: resultado, busca })
            } catch (err) {
                console.error('Erro ao listar artistas:', err)
                res.status(500).send('Erro ao listar artistas')
            }
        }

        this.openEdt = async (req, res) => {
            try {
                const id = req.params.id
                const musica = await Musica.findById(id)
                const artes = await Arte.find().sort({ titulo: 1 })
                if (!musica) {
                    return res.status(404).send('Artista não encontrado')
                }
                console.log('Artes encontradas para edição:', artes.length)
                res.render(this.caminhoBase + 'edt', { Musica: musica, Artes: artes || [] })
            } catch (err) {
                console.error('Erro ao abrir edição:', err.message)
                try {
                    res.render(this.caminhoBase + 'edt', { Musica: {}, Artes: [] })
                } catch (renderErr) {
                    console.error('Erro ao renderizar edição:', renderErr.message)
                    res.status(500).send('Erro ao abrir edição: ' + renderErr.message)
                }
            }
        }

        this.edt = async (req, res) => {
            try {
                const id = req.params.id
                const imagemFile = this._getFile(req, 'perfil')
                
                // Validação básica
                if (!req.body.artista || !req.body.artista.trim()) {
                    return res.status(400).send('Nome do artista é obrigatório')
                }
                if (!req.body.artes || (Array.isArray(req.body.artes) ? req.body.artes.length === 0 : !req.body.artes)) {
                    return res.status(400).send('Selecione pelo menos uma arte')
                }
                if (!req.body.idade || req.body.idade === '') {
                    return res.status(400).send('Idade é obrigatória')
                }

                const artes = Array.isArray(req.body.artes) ? req.body.artes : [req.body.artes]

                const update = {
                    artista: req.body.artista.trim(),
                    artes: artes,
                    arte: artes[0],
                    idade: Number(req.body.idade),
                }
                if (imagemFile) update.perfil = '/uploads/' + imagemFile.filename

                await Musica.findByIdAndUpdate(id, update)
                res.redirect('/' + this.caminhoBase + 'lst')
            } catch (err) {
                console.error('Erro ao editar artista:', err)
                res.status(500).send('Erro ao editar artista: ' + err.message)
            }
        }

        this.del = async (req, res) => {
            try {
                const musica = await Musica.findById(req.params.id)
                if (musica) {
                    console.log(`Deletando artista: ${musica.artista}`)
                    await registrarDeletado('musica', musica._id, musica.toObject())
                    // Marcar posts do artista como tendo autor deletado
                    const result = await Post.updateMany(
                        { artista: musica.artista },
                        { artistaDeletado: true }
                    )
                    console.log(`Posts marcados como deletados:`, result)
                }
                await Musica.findByIdAndDelete(req.params.id)
                res.redirect('/' + this.caminhoBase + 'lst')
            } catch (err) {
                console.error('Erro ao deletar artista:', err)
                res.status(500).send('Erro ao deletar artista')
            }
        }
    }
}
