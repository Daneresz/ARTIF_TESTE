import conexao from '../config/conexao.js'

const Musica = conexao.Schema({
    artista: { type: String, required: true },
    artes: [{
        type: String,
        required: true
    }],
    arte: { type: String },
    idade: { type: Number, required: true },
    perfil: { type: String },
    youtube: { type: String },
    explorer: { type: Boolean, default: false }
}, { timestamps: false })

export default conexao.model('Musica', Musica)
