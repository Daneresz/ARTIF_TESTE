import express from 'express';
const router = express.Router();
import AdminSolicitacaoController from '../controllers/AdminSolicitacaoController.js';

router.get('/admin/solicitacoes/lst', AdminSolicitacaoController.list);
router.get('/admin/solicitacoes/aceitar/:id', AdminSolicitacaoController.aceitar);
router.get('/admin/solicitacoes/rejeitar/:id', AdminSolicitacaoController.openRejeitar);
router.post('/admin/solicitacoes/rejeitar/:id', AdminSolicitacaoController.rejeitar);
router.get('/admin/solicitacoes/visualizar/:id', AdminSolicitacaoController.openVisualizar);

export default router;
