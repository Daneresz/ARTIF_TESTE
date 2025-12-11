import express from 'express';
const router = express.Router();
import ClienteComunidadeController from '../controllers/ClienteComunidadeController.js';
import ClienteComunidadeMembroController from '../controllers/ClienteComunidadeMembroController.js';
import ClienteComunidadeViewController from '../controllers/ClienteComunidadeViewController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const clienteCommunityViewController = new ClienteComunidadeViewController();

router.get('/cliente/comunidades/add', ClienteComunidadeController.openAdd);
router.post('/cliente/comunidades/add', ClienteComunidadeController.add);
router.get('/cliente/comunidades/lst', ClienteComunidadeController.list);
router.get('/cliente/comunidades/ver/:id', clienteCommunityViewController.ver);
router.post('/cliente/comunidades/ver/:id/post', clienteCommunityViewController.adicionarPost);
router.get('/cliente/comunidades/ver/:comunidadeId/post/:postId/del', clienteCommunityViewController.deletarPost);
router.get('/cliente/comunidades/entrar/:id', ClienteComunidadeMembroController.entrar);
router.post('/cliente/comunidades/entrar/:id', ClienteComunidadeMembroController.adicionarMembro);
router.post('/cliente/comunidades/sair/:id', ClienteComunidadeMembroController.sairComunidade);

export default router;
