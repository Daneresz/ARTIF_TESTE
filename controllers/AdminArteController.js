import Arte from '../models/arte.js';
import { registrarDeletado } from '../utils/trashHelper.js';
import fs from 'fs/promises'

export default class AdminArteController {
    constructor(caminhoBase = 'admin/artes/') {
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
            res.render(this.caminhoBase + 'add')
        }

        this.add = async (req, res) => {
            try {
                const imagemFile = this._getFile(req, 'imagem')
                const imagemPath = imagemFile ? '/uploads/' + imagemFile.filename : ''

                if (!req.body.titulo || !req.body.titulo.trim()) {
                    return res.status(400).send('Título é obrigatório')
                }

                const novaArte = {
                    titulo: req.body.titulo.trim(),
                    tipo: 'arte',
                    artista: '',
                    descricao: req.body.descricao?.trim() || '',
                    imagem: imagemPath
                }

                console.log('Criando arte:', novaArte)
                await Arte.create(novaArte)
                res.redirect('/' + this.caminhoBase + 'add')
            } catch (err) {
                console.error('Erro ao adicionar arte:', err.message)
                res.status(500).send('Erro ao adicionar arte: ' + err.message)
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
                            { titulo: regex }
                        ]
                    }
                }
                const resultado = await Arte.find(filtro).sort({ createdAt: -1 })
                res.render(this.caminhoBase + 'lst', { Artes: resultado, busca })
            } catch (err) {
                console.error('Erro ao listar artes:', err)
                res.status(500).send('Erro ao listar artes')
            }
        }

        this.openEdt = async (req, res) => {
            try {
                const id = req.params.id
                const arte = await Arte.findById(id)
                if (!arte) {
                    return res.status(404).send('Arte não encontrada')
                }
                res.render(this.caminhoBase + 'edt', { Arte: arte })
            } catch (err) {
                console.error('Erro ao abrir edição:', err)
                res.status(500).send('Erro ao abrir edição')
            }
        }

        this.edt = async (req, res) => {
            try {
                const id = req.params.id
                const imagemFile = this._getFile(req, 'imagem')

                if (!req.body.titulo || !req.body.titulo.trim()) {
                    return res.status(400).send('Título é obrigatório')
                }

                const update = {
                    titulo: req.body.titulo.trim(),
                    tipo: 'arte',
                    artista: '',
                    descricao: req.body.descricao?.trim() || ''
                }

                if (imagemFile) update.imagem = '/uploads/' + imagemFile.filename

                await Arte.findByIdAndUpdate(id, update)
                res.redirect('/' + this.caminhoBase + 'lst')
            } catch (err) {
                console.error('Erro ao editar arte:', err)
                res.status(500).send('Erro ao editar arte: ' + err.message)
            }
        }

        this.del = async (req, res) => {
            try {
                await Arte.findByIdAndDelete(req.params.id)
                res.redirect('/' + this.caminhoBase + 'lst')
            } catch (err) {
                console.error('Erro ao deletar arte:', err)
                res.status(500).send('Erro ao deletar arte')
            }
        }
    }
}
