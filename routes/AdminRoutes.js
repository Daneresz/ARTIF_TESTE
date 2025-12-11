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

import AdminMusicController from '../controllers/AdminMusicController.js'
import AdminArteController from '../controllers/AdminArteController.js'
import AdminPostController from '../controllers/AdminPostController.js'

const musicControl = new AdminMusicController()
const arteControl = new AdminArteController()
const postControl = new AdminPostController()

// ARTISTA ROUTES
router.get('/admin/artista/add', musicControl.openAdd)
router.post('/admin/artista/add', musicControl.add)
router.get('/admin/artista/lst', musicControl.list)
router.get('/admin/artista/edt/:id', musicControl.openEdt)
router.post('/admin/artista/edt/:id', musicControl.edt)
router.get('/admin/artista/del/:id', musicControl.del)

// ARTES ROUTES
router.get('/admin/artes/add', arteControl.openAdd)
router.post('/admin/artes/add', arteControl.add)
router.get('/admin/artes/lst', arteControl.list)
router.get('/admin/artes/edt/:id', arteControl.openEdt)
router.post('/admin/artes/edt/:id', arteControl.edt)
router.get('/admin/artes/del/:id', arteControl.del)

// POSTS ROUTES
router.get('/admin/posts/add', postControl.openAdd)
router.post('/admin/posts/add', postControl.add)
router.get('/admin/posts/lst', postControl.list)
router.get('/admin/posts/edt/:id', postControl.openEdt)
router.post('/admin/posts/edt/:id', postControl.edt)
router.get('/admin/posts/del/:id', postControl.del)

export default router
