import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import routes from '../routes/route.js';
import fs from 'fs';
import { createServer } from 'http';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// Caminho correto das views e public
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar multer para salvar em memória
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Middleware customizado para converter arquivo em memória para disco
const diskUploadMiddleware = (req, res, next) => {
    if (req.files && req.files.length > 0) {
        const uploadDir = '/tmp/uploads';
        
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

// Middleware de upload
app.use(upload.any());
app.use(diskUploadMiddleware);

// Servir uploads do /tmp
app.use('/uploads', express.static('/tmp/uploads', { 
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'public, max-age=3600');
    }
}));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rotas
app.use(routes);

app.listen(3001);

// Exporta o handler compatível com Vercel
export default app;