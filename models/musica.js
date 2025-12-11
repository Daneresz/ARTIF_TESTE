import conexao from '../config/conexao.js'

const Musica = conexao.Schema({
    artista: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    senha: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    artes: [{
        type: String
    }],
    arte: { type: String },
    perfil: { type: String },
    youtube: { type: String },
    explorer: { type: Boolean, default: true },
    ativo: { type: Boolean, default: true },
    criadoEm: { type: Date, default: Date.now },
    atualizadoEm: { type: Date, default: Date.now }
}, { timestamps: false })

export default conexao.model('Musica', Musica)
