import mongoose from "mongoose"

const DeletedItemSchema = new mongoose.Schema(
    {
        tipo: {
            type: String,
            enum: ['musica', 'arte', 'comunidade', 'post'],
            required: true
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        dados: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        deletadoEm: {
            type: Date,
            default: Date.now
        },
        deletadoPor: {
            type: String,
            default: 'sistema'
        }
    },
    {
        timestamps: false
    }
)

const DeletedItem = mongoose.model("DeletedItem", DeletedItemSchema)
export default DeletedItem
