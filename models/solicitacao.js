import mongoose from 'mongoose';

const solicitacaoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ['arte', 'comunidade'],
        required: true
    },
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
        default: null
    },
    imagem: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pendente', 'aceita', 'rejeitada'],
        default: 'pendente'
    },
    motivoRejeicao: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Solicitacao', solicitacaoSchema);
