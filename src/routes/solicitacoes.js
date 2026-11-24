
const express = require('express');
const router = express.Router();

const pool = require('../config/database');
const autenticarAdmin = require('../middlewares/auth');

/**
 * @swagger
 * /api/solicitacoes:
 *   get:
 *     summary: Lista todas as solicitações
 *     tags: [Solicitações]
 *     responses:
 *       200:
 *         description: Lista de solicitações retornada com sucesso.
 *       500:
 *         description: Erro ao buscar solicitações.
 */

// Listar todas as solicitações
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT id, titulo, descricao, categoria, localizacao,
                    status, prioridade, data_cadastro AS "dataCadastro"
             FROM solicitacoes
             ORDER BY id`
        );

        res.status(200).json(resultado.rows);

    } catch (erro) {
        console.error('Erro ao listar solicitações:', erro.message);
        res.status(500).json({
            erro: 'Erro ao buscar solicitações.'
        });
    }
});


/**
 * @swagger
 * /api/solicitacoes:
 *   post:
 *     summary: Cadastra uma nova solicitação
 *     tags: [Solicitações]
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
 *                 example: Preciso de roupas infantis
 *               descricao:
 *                 type: string
 *                 example: Procuro roupas infantis em bom estado.
 *               categoria:
 *                 type: string
 *                 example: Vestuário
 *               localizacao:
 *                 type: string
 *                 example: São Gonçalo - RJ
 *     responses:
 *       201:
 *         description: Solicitação cadastrada com sucesso.
 *       400:
 *         description: Campos obrigatórios não preenchidos ou inválidos.
 *       500:
 *         description: Erro ao cadastrar solicitação.
 */

// Cadastrar uma nova solicitação
router.post('/', async (req, res) => {
    try {
        const dados = req.body || {};
        const prioridade = dados.prioridade || 'moderada';
        const prioridadesPermitidas = ['urgente', 'moderada', 'continua'];

        if (!prioridadesPermitidas.includes(prioridade)) {
            return res.status(400).json({
                erro: 'Prioridade inválida. Utilize urgente, moderada ou continua.'
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
            `INSERT INTO solicitacoes
             (titulo, descricao, categoria, localizacao, prioridade)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, titulo, descricao, categoria, localizacao,
                       status, prioridade, data_cadastro AS "dataCadastro"`,
            [titulo, descricao, categoria, localizacao, prioridade]
        );

        res.status(201).json({
            mensagem: 'Solicitação cadastrada com sucesso!',
            solicitacao: resultado.rows[0]
        });

    } catch (erro) {
        console.error('Erro ao cadastrar solicitação:', erro.message);
        res.status(500).json({
            erro: 'Erro ao cadastrar solicitação.'
        });
    }
});


/**
 * @swagger
 * /api/solicitacoes/{id}:
 *   put:
 *     summary: Atualiza uma solicitação
 *     tags: [Solicitações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da solicitação
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
 *                 example: Preciso de roupas infantis e calçados
 *               descricao:
 *                 type: string
 *                 example: Procuro roupas infantis e calçados em bom estado.
 *               categoria:
 *                 type: string
 *                 example: Vestuário
 *               localizacao:
 *                 type: string
 *                 example: São Gonçalo - RJ
 *               prioridade:
 *                 type: string
 *                 enum: [urgente, moderada, continua]
 *                 example: moderada
 *     responses:
 *       200:
 *         description: Solicitação atualizada com sucesso.
 *       400:
 *         description: ID ou campos obrigatórios inválidos.
 *       404:
 *         description: Solicitação não encontrada.
 *       500:
 *         description: Erro ao atualizar solicitação.
 */

// Editar uma solicitação
router.put('/:id', autenticarAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const dados = req.body || {};

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: 'Informe um ID válido.'
            });
        }

        const prioridade = req.body.prioridade || 'moderada';
        const prioridadesPermitidas = ['urgente', 'moderada', 'continua'];

        if (!prioridadesPermitidas.includes(prioridade)) {
            return res.status(400).json({
                erro: 'Prioridade inválida. Utilize urgente, moderada ou continua.'
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
            `UPDATE solicitacoes
            SET titulo = $1,
                descricao = $2,
                categoria = $3,
                localizacao = $4,
                prioridade = $5
            WHERE id = $6
             RETURNING id, titulo, descricao, categoria, localizacao,
                       status, prioridade, data_cadastro AS "dataCadastro"`,
            [titulo, descricao, categoria, localizacao, prioridade, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Solicitação não encontrada.'
            });
        }

        res.status(200).json({
            mensagem: 'Solicitação atualizada com sucesso!',
            solicitacao: resultado.rows[0]
        });

    } catch (erro) {
        console.error('Erro ao atualizar solicitação:', erro.message);
        res.status(500).json({
            erro: 'Erro ao atualizar solicitação.'
        });
    }
});



/**
 * @swagger
 * /api/solicitacoes/{id}:
 *   delete:
 *     summary: Exclui uma solicitação
 *     tags: [Solicitações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da solicitação
 *     responses:
 *       200:
 *         description: Solicitação excluída com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Solicitação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

// Excluir uma solicitação
router.delete('/:id', autenticarAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: 'Informe um ID válido.'
            });
        }

        const resultado = await pool.query(
            'DELETE FROM solicitacoes WHERE id = $1 RETURNING id',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Solicitação não encontrada.'
            });
        }

        res.status(200).json({
            mensagem: 'Solicitação excluída com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao excluir solicitação:', erro.message);
        res.status(500).json({
            erro: 'Erro ao excluir solicitação.'
        });
    }
});

module.exports = router;

