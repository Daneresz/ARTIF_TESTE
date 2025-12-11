import express from 'express'
const router = express.Router()
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

const upload = multer({ storage })

import ClienteMusicController from '../controllers/ClienteMusicController.js'
import ClienteArteController from '../controllers/ClienteArteController.js'
import ClientePostController from '../controllers/ClientePostController.js'

const musicControl = new ClienteMusicController()
const arteControl = new ClienteArteController()
const postControl = new ClientePostController()

// ARTISTA ROUTES
router.get('/cliente/artista/add', musicControl.openAdd)
router.post('/cliente/artista/add', musicControl.add)
router.get('/cliente/artista/lst', musicControl.list)

// ARTES ROUTES
router.get('/cliente/artes/add', arteControl.openAdd)
router.post('/cliente/artes/add', arteControl.add)
router.get('/cliente/artes/lst', arteControl.list)

// POSTS ROUTES
router.get('/cliente/posts/add', postControl.openAdd)
router.post('/cliente/posts/add', postControl.add)
router.get('/cliente/posts/lst', postControl.list)

export default router
