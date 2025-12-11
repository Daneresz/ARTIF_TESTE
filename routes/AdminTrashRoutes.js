import express from 'express'
const router = express.Router()
import AdminTrashController from '../controllers/AdminTrashController.js'

const controller = new AdminTrashController()

router.get('/admin/lixeira/lst', controller.list.bind(controller))
router.get('/admin/lixeira/restaurar/:id', controller.restaurar.bind(controller))
router.get('/admin/lixeira/deletar/:id', controller.deletarPermanente.bind(controller))
router.get('/admin/lixeira/esvaziar', controller.esvaziarLixeira.bind(controller))

export default router
