import conexao from '../config/conexao.js'
import Musica from '../models/musica.js'

async function migrate() {
  try {
    console.log('Iniciando migração de campos: imagem->perfil, nome->arte, genero->idade')
    const cursor = Musica.find({}).cursor()
    let count = 0
    for await (const doc of cursor) {
      const update = {}
      let changed = false
      if (doc.imagem !== undefined) { update.perfil = doc.imagem; changed = true }
      if (doc.nome !== undefined) { update.arte = doc.nome; changed = true }
      if (doc.genero !== undefined) { update.idade = doc.genero; changed = true }
      if (changed) {
        await Musica.updateOne({ _id: doc._id }, { $set: update, $unset: { imagem: '', nome: '', genero: '' } })
        count++
      }
    }
    console.log(`Migração concluída: ${count} documentos atualizados.`)
    process.exit(0)
  } catch (err) {
    console.error('Erro na migração:', err)
    process.exit(1)
  }
}

migrate()
