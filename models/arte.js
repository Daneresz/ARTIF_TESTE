import mongoose from "mongoose"

const ArteSchema = new mongoose.Schema(
    {
        titulo: { 
            type: String, 
            required: [true, 'Título é obrigatório'] 
        },
        descricao: { 
            type: String,
            default: ''
        },
        tipo: { 
            type: String, 
            default: 'arte'
        },
        artista: { 
            type: String, 
            default: ''
        },
        imagem: { 
            type: String,
            default: ''
        },
        dataCriacao: { 
            type: Date, 
            default: Date.now 
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        }
    },
    { 
        timestamps: false 
    }
)

const Arte = mongoose.model("Arte", ArteSchema)
export default Arte
