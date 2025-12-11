import mongoose from 'mongoose';

const comunidadeSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    arte: {
        type: String,
        required: true
    },
    imagem: {
        type: String,
        default: null
    },
    membros: [{
        artista: String,
        perfil: String,
        dataMembro: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Comunidade', comunidadeSchema);
