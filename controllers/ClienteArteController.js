import Arte from '../models/arte.js'
import Solicitacao from '../models/solicitacao.js'
import fs from 'fs/promises'

export default class ClienteArteController {
    constructor(caminhoBase = 'cliente/artes/') {
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

                const novaSolicitacao = {
                    tipo: 'arte',
                    nome: req.body.titulo.trim(),
                    descricao: req.body.descricao?.trim() || '',
                    imagem: imagemPath,
                    status: 'pendente'
                }

                console.log('Criando solicitação de arte:', novaSolicitacao)
                await Solicitacao.create(novaSolicitacao)
                res.render(this.caminhoBase + 'add', { sucesso: 'Solicitação enviada! Aguarde aprovação do admin.' })
            } catch (err) {
                console.error('Erro ao solicitaradição de arte:', err.message)
                res.status(500).send('Erro ao solicitar arte: ' + err.message)
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
    }
}
