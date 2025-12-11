import DeletedItem from '../models/deletedItem.js'
import Musica from '../models/musica.js'
import Arte from '../models/arte.js'
import Comunidade from '../models/comunidade.js'
import Post from '../models/post.js'

export default class AdminTrashController {
    async list(req, res) {
        try {
            const deletedItems = await DeletedItem.find().sort({ deletadoEm: -1 })
            
            // Agrupar por tipo
            const groupedItems = {
                musica: [],
                arte: [],
                comunidade: [],
                post: []
            }
            
            deletedItems.forEach(item => {
                if (groupedItems[item.tipo]) {
                    groupedItems[item.tipo].push(item)
                }
            })
            
            res.render('admin/lixeira/lst', { items: groupedItems, deletedItems })
        } catch (err) {
            console.error('Erro ao listar itens deletados:', err)
            res.status(500).send('Erro ao listar itens deletados')
        }
    }

    async restaurar(req, res) {
        try {
            const { id } = req.params
            const deletedItem = await DeletedItem.findById(id)
            
            if (!deletedItem) {
                return res.status(404).send('Item não encontrado na lixeira')
            }

            // Restaurar baseado no tipo
            switch (deletedItem.tipo) {
                case 'musica':
                    await Musica.create(deletedItem.dados)
                    break
                case 'arte':
                    await Arte.create(deletedItem.dados)
                    break
                case 'comunidade':
                    await Comunidade.create(deletedItem.dados)
                    break
                case 'post':
                    await Post.create(deletedItem.dados)
                    break
            }

            // Remover da lixeira
            await DeletedItem.findByIdAndDelete(id)
            
            res.redirect('/admin/lixeira/lst')
        } catch (err) {
            console.error('Erro ao restaurar item:', err)
            res.status(500).send('Erro ao restaurar item: ' + err.message)
        }
    }

    async deletarPermanente(req, res) {
        try {
            const { id } = req.params
            await DeletedItem.findByIdAndDelete(id)
            res.redirect('/admin/lixeira/lst')
        } catch (err) {
            console.error('Erro ao deletar permanentemente:', err)
            res.status(500).send('Erro ao deletar item')
        }
    }

    async esvaziarLixeira(req, res) {
        try {
            await DeletedItem.deleteMany({})
            res.redirect('/admin/lixeira/lst')
        } catch (err) {
            console.error('Erro ao esvaziar lixeira:', err)
            res.status(500).send('Erro ao esvaziar lixeira')
        }
    }
}
