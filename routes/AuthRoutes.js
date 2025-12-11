import { Router } from 'express'
import AuthController from '../controllers/AuthController.js'

const router = Router()

// Rotas públicas
router.post('/registro', (req, res) => AuthController.registro(req, res))
router.post('/login', (req, res) => AuthController.login(req, res))
router.post('/logout', (req, res) => AuthController.logout(req, res))

// Rotas autenticadas
router.get('/perfil', (req, res) => AuthController.obterPerfil(req, res))
router.put('/perfil', (req, res) => AuthController.atualizarPerfil(req, res))

export default router
