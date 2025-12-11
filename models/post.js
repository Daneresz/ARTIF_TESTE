import mongoose from "mongoose"

const PostSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, 'Título é obrigatório']
        },
        descricao: {
            type: String,
            default: ''
        },
        artista: {
            type: String,
            required: [true, 'Artista é obrigatório']
        },
        artistaDeletado: {
            type: Boolean,
            default: false
        },
        artes: [{
            type: String,
            required: true
        }],
        imagem: {
            type: String,
            default: ''
        },
        explorer: {
            type: Boolean,
            default: false
        },
        comunidade: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comunidade',
            default: null
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

const Post = mongoose.model("Post", PostSchema)
export default Post
