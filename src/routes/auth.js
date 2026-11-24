
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../config/database');
const autenticarAdmin = require('../middlewares/auth');


/* =================================
   LOGIN DO ADMINISTRADOR
================================= */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza o login do administrador
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@reconecta.com
 *               senha:
 *                 type: string
 *                 example: MinhaSenha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *       401:
 *         description: E-mail ou senha inválidos.
 */

router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: 'Informe o e-mail e a senha.'
            });
        }

        const resultado = await pool.query(
            `SELECT id, nome, email, senha
             FROM administradores
             WHERE LOWER(email) = LOWER($1)`,
            [email.trim()]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha inválidos.'
            });
        }

        const admin = resultado.rows[0];

        const senhaValida = await bcrypt.compare(
            senha,
            admin.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha inválidos.'
            });
        }

        const segredo = process.env.JWT_SECRET;

        if (!segredo) {
            throw new Error('JWT_SECRET não configurado.');
        }

        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                tipo: 'admin'
            },
            segredo,
            {
                expiresIn: '2h'
            }
        );

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso.',
            token,
            administrador: {
                id: admin.id,
                nome: admin.nome,
                email: admin.email
            }
        });

    } catch (erro) {
        console.error('Erro no login:', erro);

        return res.status(500).json({
            mensagem: 'Erro interno ao realizar login.'
        });
    }
});


/* =================================
   VERIFICAR ADMINISTRADOR LOGADO
================================= */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Verifica a autenticação do administrador
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Administrador autenticado.
 *       401:
 *         description: Token inválido ou ausente.
 */

router.get('/me', autenticarAdmin, (req, res) => {
    return res.status(200).json({
        mensagem: 'Administrador autenticado.',
        administrador: req.admin
    });
});


module.exports = router;
