import DeletedItem from '../models/deletedItem.js'

export async function registrarDeletado(tipo, itemId, dados, deletadoPor = 'sistema') {
    try {
        await DeletedItem.create({
            tipo,
            itemId,
            dados,
            deletadoPor
        })
    } catch (err) {
        console.error('Erro ao registrar item deletado:', err)
    }
}

export default registrarDeletado
