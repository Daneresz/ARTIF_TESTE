import express from 'express'
const router = express.Router()
import MusicController from '../controllers/MusicController.js'
const controle = new MusicController()

import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Criar diretório de uploads se não existir (apenas em ambiente local)
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
if (process.env.NODE_ENV !== 'production') {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Em Vercel (produção), usar /tmp (efêmero)
        const dest = process.env.NODE_ENV === 'production' 
            ? '/tmp/uploads' 
            : path.join(process.cwd(), 'public', 'uploads')
        
        if (!fs.existsSync(dest) && process.env.NODE_ENV === 'production') {
            fs.mkdirSync(dest, { recursive: true })
        }
        cb(null, dest)
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + file.originalname
        cb(null, unique)
    }
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

const caminhobase = 'artista/'

// Public list and search
router.get('/' + caminhobase, controle.publicList)

// Admin
router.get('/' + caminhobase + 'add', controle.openAdd)
router.post('/' + caminhobase + 'add', controle.add)
router.get('/' + caminhobase + 'lst', controle.list)
router.get('/' + caminhobase + 'edt/:id', controle.openEdt)
router.post('/' + caminhobase + 'edt/:id', controle.edt)
router.get('/' + caminhobase + 'del/:id', controle.del)

export default router
