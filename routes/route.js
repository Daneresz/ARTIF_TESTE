import express from 'express';
const router = express.Router();
import controller from '../controllers/controller.js'
const controle = new controller();

import MusicRoutes from './MusicRoutes.js'
import ArteRoutes from './ArteRoutes.js'
import PostRoutes from './PostRoutes.js'
import AdminRoutes from './AdminRoutes.js'
import ClienteRoutes from './ClienteRoutes.js'
import AdminComunidadeRoutes from './AdminComunidadeRoutes.js'
import ClienteComunidadeRoutes from './ClienteComunidadeRoutes.js'
import AdminSolicitacaoRoutes from './AdminSolicitacaoRoutes.js'
import AdminTrashRoutes from './AdminTrashRoutes.js'

router.get('/', controle.home)
router.get('/admin', controle.admin)
router.get('/cliente', controle.cliente)
router.get('/teste', controle.teste)
router.post('/formulario', controle.formulario)

router.use(MusicRoutes)
router.use(ArteRoutes)
router.use(PostRoutes)
router.use(AdminComunidadeRoutes)
router.use(AdminRoutes)
router.use(ClienteRoutes)
router.use(ClienteComunidadeRoutes)
router.use(AdminSolicitacaoRoutes)
router.use(AdminTrashRoutes)

export default router