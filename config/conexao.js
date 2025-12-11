import mongoose from "mongoose";

const url = process.env.MONGODB_URI || "mongodb+srv://daneres:7826@astroif.hckw9hb.mongodb.net/";

console.log('Conectando ao MongoDB...');

let conexao;

try {
    conexao = await mongoose.connect(url, {
        connectTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    });
    console.log('✓ Conectado ao MongoDB com sucesso');
} catch (err) {
    console.error('✗ Erro ao conectar ao MongoDB:', err.message);
    // Re-throw para ser tratado no app
    throw err;
}

export default conexao;

