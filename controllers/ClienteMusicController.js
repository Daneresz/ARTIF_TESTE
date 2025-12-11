import Musica from '../models/musica.js'
import Arte from '../models/arte.js'
import fs from 'fs/promises'

export default class ClienteMusicController {
    constructor(caminhoBase = 'cliente/artista/') {
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

                if (!req.body.artista || !req.body.artista.trim()) {
                    return res.status(400).send('Nome do artista é obrigatório')
                }
                if (!req.body.idade || req.body.idade === '') {
                    return res.status(400).send('Idade é obrigatória')
                }

                let artes = []
                if (req.body.artes) {
                    artes = Array.isArray(req.body.artes) ? req.body.artes : [req.body.artes]
                }

                await Musica.create({
                    artista: req.body.artista.trim(),
                    artes: artes,
                    arte: artes.length > 0 ? artes[0] : 'Apenas Explorando',
                    idade: Number(req.body.idade),
                    perfil: imagemPath,
                    explorer: artes.length === 0,
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
    }
}
