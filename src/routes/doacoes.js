
const express = require('express');
const router = express.Router();

const pool = require('../config/database');
const autenticarAdmin = require('../middlewares/auth');

/**
 * @swagger
 * /api/doacoes:
 *   get:
 *     summary: Lista todas as doações
 *     tags: [Doações]
 *     responses:
 *       200:
 *         description: Lista de doações retornada com sucesso.
 *       500:
 *         description: Erro ao buscar doações.
 */

// Listar todas as doações
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT id, titulo, descricao, categoria, localizacao,
                    nome_contato AS "nomeContato",
                    whatsapp, status,
                    data_cadastro AS "dataCadastro"
             FROM doacoes
             ORDER BY id`
        );

        res.status(200).json(resultado.rows);

    } catch (erro) {
        console.error('Erro ao listar doações:', erro.message);
        res.status(500).json({
            erro: 'Erro ao buscar doações.'
        });
    }
});


/**
 * @swagger
 * /api/doacoes:
 *   post:
 *     summary: Cadastra uma nova doação
 *     tags: [Doações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - categoria
 *               - localizacao
 *               - nomeContato
 *               - whatsapp
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               categoria:
 *                 type: string
 *               localizacao:
 *                 type: string
 *               nomeContato:
 *                 type: string
 *               whatsapp:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doação cadastrada com sucesso.
 *       400:
 *         description: Campos obrigatórios inválidos.
 *       500:
 *         description: Erro ao cadastrar doação.
 */

// Cadastrar uma nova doação
router.post('/', async (req, res) => {
    try {
        const dados = req.body || {};

        const campos = [
            dados.titulo,
            dados.descricao,
            dados.categoria,
            dados.localizacao,
            dados.nomeContato,
            dados.whatsapp
        ];

        if (campos.some(campo =>
            typeof campo !== 'string' || !campo.trim()
        )) {
            return res.status(400).json({
                erro: 'Preencha todos os campos obrigatórios corretamente.'
            });
        }

        const [
            titulo,
            descricao,
            categoria,
            localizacao,
            nomeContato,
            whatsapp
        ] = campos.map(campo => campo.trim());

        const resultado = await pool.query(
            `INSERT INTO doacoes
             (titulo, descricao, categoria, localizacao,
              nome_contato, whatsapp)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, titulo, descricao, categoria, localizacao,
                       nome_contato AS "nomeContato", whatsapp,
                       status, data_cadastro AS "dataCadastro"`,
            [
                titulo,
                descricao,
                categoria,
                localizacao,
                nomeContato,
                whatsapp
            ]
        );

        res.status(201).json({
            mensagem: 'Doação cadastrada com sucesso!',
            doacao: resultado.rows[0]
        });

    } catch (erro) {
        console.error('Erro ao cadastrar doação:', erro.message);
        res.status(500).json({
            erro: 'Erro ao cadastrar doação.'
        });
    }
});


/**
 * @swagger
 * /api/doacoes/{id}:
 *   put:
 *     summary: Atualiza uma doação
 *     tags: [Doações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - categoria
 *               - localizacao
 *               - nomeContato
 *               - whatsapp
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               categoria:
 *                 type: string
 *               localizacao:
 *                 type: string
 *               nomeContato:
 *                 type: string
 *               whatsapp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doação atualizada com sucesso.
 *       400:
 *         description: ID ou campos inválidos.
 *       404:
 *         description: Doação não encontrada.
 *       500:
 *         description: Erro ao atualizar doação.
 */

// Editar uma doação
router.put('/:id', autenticarAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const dados = req.body || {};

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: 'Informe um ID válido.'
            });
        }

        const campos = [
            dados.titulo,
            dados.descricao,
            dados.categoria,
            dados.localizacao,
            dados.nomeContato,
            dados.whatsapp
        ];

        if (campos.some(campo =>
            typeof campo !== 'string' || !campo.trim()
        )) {
            return res.status(400).json({
                erro: 'Preencha todos os campos obrigatórios corretamente.'
            });
        }

        const [
            titulo,
            descricao,
            categoria,
            localizacao,
            nomeContato,
            whatsapp
        ] = campos.map(campo => campo.trim());

        const resultado = await pool.query(
            `UPDATE doacoes
             SET titulo = $1,
                 descricao = $2,
                 categoria = $3,
                 localizacao = $4,
                 nome_contato = $5,
                 whatsapp = $6
             WHERE id = $7
             RETURNING id, titulo, descricao, categoria, localizacao,
                       nome_contato AS "nomeContato", whatsapp,
                       status, data_cadastro AS "dataCadastro"`,
            [
                titulo,
                descricao,
                categoria,
                localizacao,
                nomeContato,
                whatsapp,
                id
            ]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Doação não encontrada.'
            });
        }

        res.status(200).json({
            mensagem: 'Doação atualizada com sucesso!',
            doacao: resultado.rows[0]
        });

    } catch (erro) {
        console.error('Erro ao atualizar doação:', erro.message);
        res.status(500).json({
            erro: 'Erro ao atualizar doação.'
        });
    }
});


/**
 * @swagger
 * /api/doacoes/{id}:
 *   delete:
 *     summary: Exclui uma doação
 *     tags: [Doações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doação excluída com sucesso.
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Doação não encontrada.
 *       500:
 *         description: Erro ao excluir doação.
 */

// Excluir uma doação
router.delete('/:id', autenticarAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: 'Informe um ID válido.'
            });
        }

        const resultado = await pool.query(
            'DELETE FROM doacoes WHERE id = $1 RETURNING id',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Doação não encontrada.'
            });
        }

        res.status(200).json({
            mensagem: 'Doação excluída com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao excluir doação:', erro.message);
        res.status(500).json({
            erro: 'Erro ao excluir doação.'
        });
    }
});

module.exports = router;
