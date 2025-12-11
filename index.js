import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import fs from 'fs';
import session from 'express-session';
import { adicionarDadosArtistaGlobal } from './middlewares/authMiddleware.js';
import routes from './routes/route.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// Configurar session
app.use(session({
    secret: process.env.SESSION_SECRET || 'sua-chave-secreta-super-segura-123',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Caminho correto das views e public
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar multer para salvar em memória (compatível com Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Middleware customizado para converter arquivo em memória para disco
const diskUploadMiddleware = (req, res, next) => {
    if (req.files && req.files.length > 0) {
        // Em produção (Vercel), usar /tmp; em dev, usar public/uploads
        const uploadDir = process.env.NODE_ENV === 'production' 
            ? '/tmp/uploads' 
            : join(__dirname, 'public/uploads');
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        req.files = req.files.map(file => {
            const filename = Date.now() + '-' + file.originalname;
            const filepath = join(uploadDir, filename);
            fs.writeFileSync(filepath, file.buffer);
            // Retornar objeto compatível com os controllers
            return {
                fieldname: file.fieldname,
                originalname: file.originalname,
                filename: filename,
                path: filepath,
                mimetype: file.mimetype,
                size: file.size
            };
        });
    }
    next();
};

// Servir arquivos estáticos
app.use(express.static(join(__dirname, '/public')));
app.set('views', join(__dirname, '/views'));

// Middleware de upload em todas as rotas POST
app.use(upload.any());
app.use(diskUploadMiddleware);

// Middleware de autenticação global
app.use(adicionarDadosArtistaGlobal);

// Rotas
app.use(routes);

// Inicia servidor localmente
const PORT = process.env.PORT || 1111;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;