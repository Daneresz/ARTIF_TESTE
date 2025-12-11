import Musica from '../models/musica.js'
import bcrypt from 'bcryptjs'

export default class AuthController {
    static async registro(req, res) {
        try {
            const { artista, email, senha, dataNascimento, artes } = req.body

            // Validar campos obrigatórios
            if (!artista || !email || !senha || !dataNascimento) {
                return res.status(400).json({ erro: 'Nome de artista, email, senha e data de nascimento são obrigatórios' })
            }

            // Validar email único
            const emailExistente = await Musica.findOne({ email: email.toLowerCase() })
            if (emailExistente) {
                return res.status(400).json({ erro: 'Email já cadastrado' })
            }

            // Hash da senha
            const saltRounds = 10
            const senhaHash = await bcrypt.hash(senha, saltRounds)

            // Preparar artes (se vazio, fica "Apenas Explorando")
            const artesArray = artes && artes.length > 0 ? artes : []

            // Criar novo artista
            const novoArtista = new Musica({
                artista,
                email: email.toLowerCase(),
                senha: senhaHash,
                dataNascimento: new Date(dataNascimento),
                artes: artesArray,
                explorer: artesArray.length === 0,
                ativo: true
            })

            await novoArtista.save()

            // Criar sessão
            req.session.artistaId = novoArtista._id.toString()
            req.session.artista = novoArtista.artista

            res.status(201).json({
                sucesso: true,
                mensagem: 'Artista registrado com sucesso!',
                artistaId: novoArtista._id
            })
        } catch (erro) {
            console.error('Erro no registro:', erro)
            res.status(500).json({ erro: 'Erro ao registrar artista' })
        }
    }

    static async login(req, res) {
        try {
            const { email, senha } = req.body

            // Validar campos obrigatórios
            if (!email || !senha) {
                return res.status(400).json({ erro: 'Email e senha são obrigatórios' })
            }

            // Buscar artista
            const artista = await Musica.findOne({ email: email.toLowerCase() })
            if (!artista) {
                return res.status(401).json({ erro: 'Email ou senha inválidos' })
            }

            // Validar senha
            const senhaValida = await bcrypt.compare(senha, artista.senha)
            if (!senhaValida) {
                return res.status(401).json({ erro: 'Email ou senha inválidos' })
            }

            // Criar sessão
            req.session.artistaId = artista._id.toString()
            req.session.artista = artista.artista

            res.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso!',
                artistaId: artista._id
            })
        } catch (erro) {
            console.error('Erro no login:', erro)
            res.status(500).json({ erro: 'Erro ao fazer login' })
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy((erro) => {
                if (erro) {
                    return res.status(500).json({ erro: 'Erro ao fazer logout' })
                }
                res.status(200).json({ sucesso: true, mensagem: 'Logout realizado com sucesso!' })
            })
        } catch (erro) {
            console.error('Erro no logout:', erro)
            res.status(500).json({ erro: 'Erro ao fazer logout' })
        }
    }

    static async obterPerfil(req, res) {
        try {
            const artistaId = req.session.artistaId
            if (!artistaId) {
                return res.status(401).json({ erro: 'Não autenticado' })
            }

            const artista = await Musica.findById(artistaId).select('-senha')
            if (!artista) {
                return res.status(404).json({ erro: 'Artista não encontrado' })
            }

            res.status(200).json({ sucesso: true, artista })
        } catch (erro) {
            console.error('Erro ao obter perfil:', erro)
            res.status(500).json({ erro: 'Erro ao obter perfil' })
        }
    }

    static async atualizarPerfil(req, res) {
        try {
            const artistaId = req.session.artistaId
            if (!artistaId) {
                return res.status(401).json({ erro: 'Não autenticado' })
            }

            const { email, senhaAtual, novaSenha, dataNascimento, perfil } = req.body

            const artista = await Musica.findById(artistaId)
            if (!artista) {
                return res.status(404).json({ erro: 'Artista não encontrado' })
            }

            // Se quer alterar email, validar se já existe
            if (email && email !== artista.email) {
                const emailExistente = await Musica.findOne({ email: email.toLowerCase() })
                if (emailExistente) {
                    return res.status(400).json({ erro: 'Email já cadastrado' })
                }
                artista.email = email.toLowerCase()
            }

            // Se quer alterar senha, validar senha atual
            if (novaSenha) {
                if (!senhaAtual) {
                    return res.status(400).json({ erro: 'Senha atual é obrigatória para alterar senha' })
                }

                const senhaValida = await bcrypt.compare(senhaAtual, artista.senha)
                if (!senhaValida) {
                    return res.status(401).json({ erro: 'Senha atual inválida' })
                }

                const saltRounds = 10
                artista.senha = await bcrypt.hash(novaSenha, saltRounds)
            }

            if (dataNascimento) {
                artista.dataNascimento = new Date(dataNascimento)
            }

            if (perfil) {
                artista.perfil = perfil
            }

            artista.atualizadoEm = new Date()
            await artista.save()

            res.status(200).json({
                sucesso: true,
                mensagem: 'Perfil atualizado com sucesso!',
                artista: artista
            })
        } catch (erro) {
            console.error('Erro ao atualizar perfil:', erro)
            res.status(500).json({ erro: 'Erro ao atualizar perfil' })
        }
    }
}
