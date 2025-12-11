import express from 'express';
const router = express.Router();
import AdminComunidadeController from '../controllers/AdminComunidadeController.js';
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

router.get('/admin/comunidades/add', AdminComunidadeController.openAdd);
router.post('/admin/comunidades/add', AdminComunidadeController.add);
router.get('/admin/comunidades/lst', AdminComunidadeController.list);
router.get('/admin/comunidades/membros/:id', AdminComunidadeController.visualizarMembros);
router.get('/admin/comunidades/posts/:id', AdminComunidadeController.posts);
router.get('/admin/comunidades/posts/:id/del/:postId', AdminComunidadeController.deletarPostDaPagina);
router.get('/admin/comunidades/ver/:id', AdminComunidadeController.ver);
router.get('/admin/comunidades/ver/:id/post/:postId/del', AdminComunidadeController.deletarPostDaPagina);
router.get('/admin/comunidades/edt/:id', AdminComunidadeController.openEdt);
router.post('/admin/comunidades/edt/:id', AdminComunidadeController.edt);
router.post('/admin/comunidades/:id/post', AdminComunidadeController.criarPostAdm);
router.get('/admin/comunidades/edt/:id/post/:postId/del', AdminComunidadeController.deletarPost);
router.get('/admin/comunidades/del/:id', AdminComunidadeController.del);

export default router;
