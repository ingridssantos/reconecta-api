
const express = require('express');
const router = express.Router();

const pool = require('../config/database');

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
                    status, data_cadastro AS "dataCadastro"
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
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Cesta básica
 *               descricao:
 *                 type: string
 *                 example: Cesta básica com alimentos não perecíveis.
 *               categoria:
 *                 type: string
 *                 example: Alimentos
 *               localizacao:
 *                 type: string
 *                 example: Niterói - RJ
 *     responses:
 *       201:
 *         description: Doação cadastrada com sucesso.
 *       400:
 *         description: Campos obrigatórios não preenchidos ou inválidos.
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
            dados.localizacao
        ];

        if (campos.some(campo =>
            typeof campo !== 'string' || !campo.trim()
        )) {
            return res.status(400).json({
                erro: 'Preencha todos os campos obrigatórios corretamente.'
            });
        }

        const [titulo, descricao, categoria, localizacao] =
            campos.map(campo => campo.trim());

        const resultado = await pool.query(
            `INSERT INTO doacoes
             (titulo, descricao, categoria, localizacao)
             VALUES ($1, $2, $3, $4)
             RETURNING id, titulo, descricao, categoria, localizacao,
                       status, data_cadastro AS "dataCadastro"`,
            [titulo, descricao, categoria, localizacao]
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da doação
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
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               categoria:
 *                 type: string
 *               localizacao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doação atualizada com sucesso.
 *       400:
 *         description: ID ou campos obrigatórios inválidos.
 *       404:
 *         description: Doação não encontrada.
 *       500:
 *         description: Erro ao atualizar doação.
 */

// Editar uma doação
router.put('/:id', async (req, res) => {
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
            dados.localizacao
        ];

        if (campos.some(campo =>
            typeof campo !== 'string' || !campo.trim()
        )) {
            return res.status(400).json({
                erro: 'Preencha todos os campos obrigatórios corretamente.'
            });
        }

        const [titulo, descricao, categoria, localizacao] =
            campos.map(campo => campo.trim());

        const resultado = await pool.query(
            `UPDATE doacoes
             SET titulo = $1,
                 descricao = $2,
                 categoria = $3,
                 localizacao = $4
             WHERE id = $5
             RETURNING id, titulo, descricao, categoria, localizacao,
                       status, data_cadastro AS "dataCadastro"`,
            [titulo, descricao, categoria, localizacao, id]
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da doação
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
router.delete('/:id', async (req, res) => {
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
