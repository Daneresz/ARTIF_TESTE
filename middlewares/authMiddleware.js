export function verificarArtistaLogado(req, res, next) {
    if (!req.session.artistaId) {
        return res.redirect('/artista/login')
    }
    next()
}

export function adicionarDadosArtistaGlobal(req, res, next) {
    if (req.session.artistaId) {
        res.locals.artistaLogado = true
        res.locals.artistaNome = req.session.artista
        res.locals.artistaId = req.session.artistaId
    } else {
        res.locals.artistaLogado = false
    }
    next()
}
